// src/services/sambanova.ts
import { UserProfile, LLMResponse } from "../types";

// Primary: Llama 3.1 405B
const SAMBANOVA_MODELS = [
  "sambanova/Meta-Llama-3.1-405B-Instruct",          // main 405B model [web:439][web:445]
  "meta-llama/llama-3.1-405b-instruct:free",        // common free alias used by some clients [web:447]
  "sambanova/Meta-Llama-3.1-70B-Instruct",          // strong fallback if 405B not available [web:438][web:440]
];

const getSystemInstruction = (user: UserProfile | null) => {
  const userName = user?.name || "Seeker";

  return `You are Yaqeen AI, a concise, helpful Islamic assistant for ${userName}.
- Use standard English characters (Quran, Hadith).
- Answer clearly and respectfully.
- If you are unsure about a ruling or the matter is very serious, say so and advise asking a qualified scholar locally.
- Do not mention SambaNova, Llama, or any technical model names; just say you are Yaqeen AI if asked.`;
};

export const getSambaNovaResponse = async (
  prompt: string,
  history: any[],
  user: UserProfile | null
): Promise<LLMResponse> => {
  const apiKey = import.meta.env.VITE_SAMBANOVA_API_KEY;
  if (!apiKey) throw new Error("SambaNova API key not configured");

  const baseUrl = "https://api.sambanova.ai/v1/chat/completions";

  const messages = [
    { role: "system", content: getSystemInstruction(user) },
    ...history.slice(-6).map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.parts?.[0]?.text || "",
    })),
    { role: "user", content: prompt },
  ];

  let lastError: any = null;

  for (const model of SAMBANOVA_MODELS) {
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`SambaNova ${model} error:`, res.status, text);

        // If this model is unavailable or not allowed, try the next
        if (res.status === 404 || res.status === 400 || res.status === 402) {
          lastError = new Error(`SAMBANOVA_MODEL_${res.status}`);
          continue;
        }

        lastError = new Error(`SAMBANOVA_ERROR_${res.status}`);
        continue;
      }

      const data = await res.json();
      return {
        text:
          data.choices?.[0]?.message?.content ||
          "I encountered an error while generating the answer.",
        webLinks: [],
      };
    } catch (err: any) {
      console.error("SambaNova fetch failed for model", model, err?.message);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("SambaNova models are currently unavailable");
};
