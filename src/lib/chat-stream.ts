//  export type Msg = { role: "user" | "assistant"; content: string };

// const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`;

// export async function streamChat({
//   messages,
//   onDelta,
//   onDone,
// }: {
//   messages: Msg[];
//   onDelta: (deltaText: string) => void;
//   onDone: () => void;
// }) {
//   const resp = await fetch(CHAT_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
//     },
//     body: JSON.stringify({ messages }),
//   });

//   if (!resp.ok || !resp.body) {
//     const errorData = await resp.json().catch(() => ({}));
//     throw new Error(errorData.error || "Failed to connect to chat service");
//   }

//   const reader = resp.body.getReader();
//   const decoder = new TextDecoder();
//   let textBuffer = "";
//   let streamDone = false;

//   while (!streamDone) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     textBuffer += decoder.decode(value, { stream: true });

//     let newlineIndex: number;
//     while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
//       let line = textBuffer.slice(0, newlineIndex);
//       textBuffer = textBuffer.slice(newlineIndex + 1);

//       if (line.endsWith("\r")) line = line.slice(0, -1);
//       if (line.startsWith(":") || line.trim() === "") continue;
//       if (!line.startsWith("data: ")) continue;

//       const jsonStr = line.slice(6).trim();
//       if (jsonStr === "[DONE]") { streamDone = true; break; }

//       try {
//         const parsed = JSON.parse(jsonStr);
//         const content = parsed.choices?.[0]?.delta?.content as string | undefined;
//         if (content) onDelta(content);
//       } catch {
//         textBuffer = line + "\n" + textBuffer;
//         break;
//       }
//     }
//   }

//   if (textBuffer.trim()) {
//     for (let raw of textBuffer.split("\n")) {
//       if (!raw) continue;
//       if (raw.endsWith("\r")) raw = raw.slice(0, -1);
//       if (raw.startsWith(":") || raw.trim() === "") continue;
//       if (!raw.startsWith("data: ")) continue;
//       const jsonStr = raw.slice(6).trim();
//       if (jsonStr === "[DONE]") continue;
//       try {
//         const parsed = JSON.parse(jsonStr);
//         const content = parsed.choices?.[0]?.delta?.content as string | undefined;
//         if (content) onDelta(content);
//       } catch { /* ignore */ }
//     }

//   }

//   onDone();
// } 


export type Msg = { role: "user" | "assistant"; content: string };

export async function streamChat({
messages,
onDelta,
onDone,
}: {
messages: Msg[];
onDelta: (deltaText: string) => void;
onDone: () => void;
}) {

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: "openrouter/auto",
stream: true,
messages: [
{
role: "system",
content:`
"You are SafeVoyager, a travel safety assistant. Only answer travel safety related questions. If unrelated, politely say you only handle travel safety queries.


Your purpose is ONLY to answer:

travel safety questions
emergency guidance
tourist safety tips
nearby hospitals
safe transportation advice
scams and crime prevention
travel health precautions
women solo travel safety
country or city travel safety
noo jokess!!
only safety,emergency.

IMPORTANT RULES:

answer only asked questions,
Give concise,practical and direct travel safety answers.
Mention nearby hospitals aprox nearest to location only if asked with detail with location without askiing further
mention emergency numbers, transport safety, scams, and precautions when relevant.
Refuse unrelated topics politely.
give answers correctly dont ask question again 

RESPONSE LENGTH RULES:

- Keep answers short and practical.
- Maximum 5 to 7 lines for normal questions.
- Only give detailed answers during emergencies.
- Do not repeat information.
- Do not add unnecessary introductions or conclusions.
- Avoid motivational or friendly closing sentences.
- Do not say "Let me know if you need anything else."
- Give direct answers only.
- Use bullet points only when necessary.
- Keep hospital suggestions to maximum 2 places.
- For unrelated questions, reply in ONE short sentence only.

If user asks unrelated things like:

jokes
sports
coding
movies
IPL
politics


Reply:
"I am SafeVoyager, a travel safety assistant designed to provide travel-related safety guidance and emergency assistance only."

Always keep answers professional, clear, and traveler-focused.
at end add lines like feel free to ask about travel safey/ do you need further safety instruction such lines with professional way when relevent 
`,
},
...messages,
],
}),
});

if (!resp.ok || !resp.body) {
const errorData = await resp.json().catch(() => ({}));
throw new Error(errorData.error?.message || "Failed to connect to AI service");
}

const reader = resp.body.getReader();
const decoder = new TextDecoder();
let textBuffer = "";
let streamDone = false;

while (!streamDone) {
const { done, value } = await reader.read();


if (done) break;

textBuffer += decoder.decode(value, { stream: true });

let newlineIndex: number;

while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
  let line = textBuffer.slice(0, newlineIndex);
  textBuffer = textBuffer.slice(newlineIndex + 1);

  if (line.endsWith("\r")) line = line.slice(0, -1);

  if (line.startsWith(":") || line.trim() === "") continue;
  if (!line.startsWith("data: ")) continue;

  const jsonStr = line.slice(6).trim();

  if (jsonStr === "[DONE]") {
    streamDone = true;
    break;
  }

  try {
    const parsed = JSON.parse(jsonStr);

    const content =
      parsed.choices?.[0]?.delta?.content as string | undefined;

    if (content) onDelta(content);

  } catch {
    textBuffer = line + "\n" + textBuffer;
    break;
  }
}


}

onDone();
}
