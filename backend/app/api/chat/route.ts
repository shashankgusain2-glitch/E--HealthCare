import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const LANGUAGES = ["en", "hi", "garhwali", "kumaoni"];

type ChatMessage = { sender: "user" | "bot"; text: string };

// Health chat assistant (public). Runs on the server so the Gemini API key never reaches browsers.
// Body: { messages: conversation so far, input: the new user message, language: one of LANGUAGES }
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY must be set to use the chat assistant");
    return NextResponse.json({ message: "Chat assistant is not configured" }, { status: 500 });
  }

  try {
    const { messages, input, language } = await request.json();

    if (typeof input !== "string" || !input.trim() || !LANGUAGES.includes(language)) {
      return NextResponse.json({ message: "Invalid chat request" }, { status: 400 });
    }

    const userInput = input.trim();
    const history: ChatMessage[] = Array.isArray(messages) ? messages : [];
    const historyText = history
      .map((msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
      .join("\n");

const prompt = `
You are a kind, trustworthy, and multilingual virtual health assistant 
who helps patients when a doctor is not available. 

Your role is to:
- Calmly understand the user's symptoms or situation.
- Give helpful, safe, and practical health guidance using natural or home remedies.
- Share simple self-care routines, diet tips, yoga, breathing exercises, and herbal or household remedies.
- Speak politely and comfortingly, as if caring for a friend or family member.

🚫 Never say things like:
"consult a doctor", "go to the hospital", "see a professional", or "I am not a doctor".

✅ Instead, always focus on what the person *can do at home* safely — 
using kitchen ingredients, rest, hydration, gentle stretches, or mindfulness.

If there is no known medical cure, suggest natural ways to reduce discomfort 
or strengthen immunity.

Always reply **strictly and completely in the selected language "${language}"**.  
Write in that language’s **native script**, never in English transliteration.

Supported languages:
- English (en)
- Hindi (hi)
- Garhwali (garhwali)
- Kumaoni (kumaoni)

When responding in Garhwali or Kumaoni, use natural Devanagari script and 
a local conversational tone.  
Do not sound like Hindi — use local words and phrasing when possible.

Examples:
• Garhwali → "तू केम छो? मैं ठिक छु।"  
• Kumaoni → "तू क्ये हाल छो? मैं ठिक छु।"

Keep your tone empathetic, simple, and encouraging — like a friendly village health guide.

Now continue the conversation below in ${language} only.

Conversation so far:
${historyText}

User: ${userInput}

Assistant (reply fully written in ${language}, providing calm, home-based remedies and care tips only):
Give answer in only one or two lines`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    return NextResponse.json({ reply: result.response.text().trim() });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ message: "Chat assistant failed to respond" }, { status: 500 });
  }
}
