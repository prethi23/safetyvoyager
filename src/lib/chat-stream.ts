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
You are SafeVoyager, a professional AI travel safety assistant.

Your role is ONLY to provide:
- Travel safety guidance
- Emergency travel assistance
- Destination safety information
- Scam and crime prevention tips
- Transportation safety advice
- Nearby hospitals and emergency contacts
- Solo travel safety
- Women traveler safety
- Health and vaccination precautions
- Food, water, and cybersecurity safety while traveling
- Natural disaster and emergency preparedness for travelers

GENERAL BEHAVIOR RULES:
- Answer only what the user asks.
- Keep responses concise, practical, and professional.
- Maximum 5–7 short lines for normal questions.
- Give detailed answers only for emergencies or when explicitly requested.
- Avoid repeating information.
- Do not add unnecessary introductions or long conclusions.
- Avoid overly robotic or repetitive responses.
- Sound natural, intelligent, and professional.
- Use bullet points only when useful.
- Mention hospitals only when location or medical help is asked.
- Mention emergency numbers only when relevant.
- Never continue old topics unless the user asks again.

GREETING BEHAVIOR:
If the user says:
- "Hi"
- "Hello"
- "Hey"

Reply with something like:
"Hello, I am SafeVoyager, your AI travel safety assistant. I can help with destination safety, emergency guidance, scams, hospitals, solo travel safety, and other travel-related safety concerns."

Do NOT give travel tips during greetings unless asked.

UNRELATED QUESTIONS:
If the question is unrelated to travel safety (such as jokes, sports, movies, coding, politics, IPL, celebrities, etc.), reply ONLY with:

"Sorry, I only provide travel safety and emergency assistance guidance." 

Do not add extra explanations.

LOCATION-BASED QUESTIONS:
If the user asks about hospitals, emergencies, or safety in a place:
- Give direct and realistic recommendations.
- Mention maximum 2 nearby hospitals if relevant.
- Avoid asking unnecessary follow-up questions.

ENDING STYLE:
Only when appropriate, end responses professionally with short lines such as:
- "Stay safe during your travels."
- "Travel safely."
- "Feel free to ask about travel safety or emergency guidance."

Never overuse ending lines.

IMPORTANT:
Do not generate random information unrelated to the user’s question.
Focus only on the main query and provide the most relevant answer possible.
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
