import { UserProfile, LLMResponse } from "../types";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
];

const getSystemInstruction = /* same as above or reuse */ getSystemInstructionChatAnywhereStyle;

const fetchIslamGPTContext = /* same implementation as in chatanywhere.ts */;

export const getGroqResponse = async (
  prompt: string,
  history: any[],
  user: UserProfile | null
): Promise<LLMResponse> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not configured");

  const islamicContext = history.length < 3 ? await fetchIslamGPTContext() : "";
  const enhancedPrompt = islamicContext
    ? `${prompt}\n\nTRUSTED ISLAMIC NOTES:\n${islamicContext}\n\nFollow these notes if anything conflicts.`
    : prompt;

  const messages = [
    { role: "system", content: getSystemInstruction(user) },
    ...history.slice(-6).map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.parts?.[0]?.text || "",
    })),
    { role: "user", content: enhancedPrompt },
  ];

  let lastError: any = null;

  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0,
          top_p: 1,
          max_tokens: 2048,
          stream: false,
        }),
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => "");
        console.error(`Groq ${model}:`, res.status, bodyText);
        lastError = new Error(`GROQ_ERROR_${res.status}`);
        continue;
      }

      const data = await res.json();
      return {
        text: data.choices?.[0]?.message?.content || "I encountered an error.",
        webLinks: [],
      };
    } catch (err: any) {
      console.error("Groq failed:", model, err?.message);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("All Groq models failed");
};
