import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.6C16.9 3.4 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
  </svg>
);

const MetaIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 36 36" aria-hidden="true">
    <defs>
      <linearGradient id="m1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0064E1" />
        <stop offset="100%" stopColor="#00C6FF" />
      </linearGradient>
    </defs>
    <path fill="url(#m1)" d="M18 2C9.16 2 2 9.16 2 18s7.16 16 16 16 16-7.16 16-16S26.84 2 18 2zm7.4 19.7c-.7 1.1-1.7 1.7-3 1.7-1.4 0-2.6-.7-4-2.4-1.1-1.4-2.2-3.2-3.2-5-1 1.7-1.8 3-2.5 3.9-1.1 1.5-2.1 2-3.2 2-1.9 0-3.1-1.7-3.1-4.3 0-3.9 2-7.8 4.6-7.8 1.5 0 2.7.9 4.2 3.4.9-1.5 1.9-2.6 3-3.1.6-.2 1.1-.3 1.7-.3 2.4 0 4.2 2.6 4.2 6.5 0 1.9-.3 3.6-.7 4.4z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);


 const handleGoogleLogin = async () => {
    setLoading("google");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setLoading(null);
    }
  };

   
  const handleMeta = () => {
    toast.info("Meta sign-in is coming soon. Please use Google for now.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-border flex items-center justify-center mb-5">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">SafeVoyager</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Sign in to your AI travel safety assistant
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-2xl">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full h-12 rounded-xl bg-background hover:bg-muted border-border text-foreground font-medium"
          >
            <GoogleIcon />
            <span className="ml-3">{loading === "google" ? "Connecting…" : "Continue with Google"}</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleMeta}
            disabled={loading !== null}
            className="w-full h-12 rounded-xl bg-background hover:bg-muted border-border text-foreground font-medium"
          >
            <MetaIcon />
            <span className="ml-3">Continue with Meta</span>
          </Button>

          <p className="text-xs text-muted-foreground text-center pt-3">
            By continuing you agree to our Terms and acknowledge our Privacy Policy.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Trusted travel safety guidance, anywhere you go.
        </p>
      </div>
    </div>
  );
};

export default Login;
