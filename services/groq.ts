import { UserProfile, LLMResponse } from "../types";

// Updated Groq models (free/fast Feb 2026)
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",     // Primary 128K ctx
  "llama-3.1-8b-instant",        // Fast 128K fallback 1
  "mixtral-8x7b-32768",          // Reliable fallback 2
  "gemma2-9b-it",                // Small/fast fallback 3
];

const fetchIslamGPTContext = async (maxLength = 8000): Promise<string> => {  // FIXED: Hard limit
  try {
    const urls = [
      "https://raw.githubusercontent.com/abdullahaamuda-code/islam_GPT/main/data/aqidah.txt",
      "https://raw.githubusercontent.com/abdullahaamuda-code/islam_GPT/main/data/fiqh.txt",
      "https://raw.githubusercontent.com/abdullahaamuda-code/islam_GPT/main/data/inheritance.txt",
      "https://raw.githubusercontent.com/abdullahaamuda-code/islam_GPT/main/data/islamic_knowldege.txt",
    ];

    let combined = "";
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        let text = await res.text();
        text = text.slice(0, 2000);  // FIXED: 2K max per file
        combined += `\n\n${text}`;
        if (combined.length > maxLength) break;  // FIXED: Total cap
      } catch {}
    }
    return combined.trim();
  } catch {
    return "";  // Graceful fail
  }
};

export const getGroqResponse = async (
  prompt: string,
  history: any[],
  user: UserProfile | null
): Promise<LLMResponse> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not configured");

  // FIXED: Smart context—skip if history long or files fail
  const islamicContext = history.length < 5 ? await fetchIslamGPTContext(8000) : "";

  const enhancedPrompt = islamicContext
    ? `${prompt}\n\nTRUSTED ISLAMIC NOTES:\n${islamicContext}\n\nUse these as primary reference.`
    : prompt;

  // FIXED: Estimate payload ~chars/4 = tokens
  const totalTokensEst = (getSystemInstruction(user).length + enhancedPrompt.length + 
    history.reduce((sum, m) => sum + (m.parts?.[0]?.text?.length || 0), 0)) / 4;
  
  if (totalTokensEst > 100000) {  // FIXED: Early reject huge payloads
    throw new Error("Payload too large—shorten history or prompt");
  }

  const messages = [
    { role: "system", content: getSystemInstruction(user) },
    ...history.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.parts?.[0]?.text || "",
    })).slice(-10),  // FIXED: Last 10 msgs only (~128K safe)
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
        const data = await res.json().catch(() => ({}));
        console.error(`Groq ${model}: ${res.status}`, data.error?.message);
        if (res.status === 413 || res.status === 400) continue;  // Skip oversized
        if (res.status === 429) continue;  // Rate limit—try next
        throw new Error(data.error?.message || `GROQ_ERROR_${res.status}`);
      }

      const data = await res.json();
      return {
        text: data.choices?.[0]?.message?.content || "I encountered an error.",
        webLinks: [],
      };
    } catch (err: any) {
      console.error("Groq fetch failed for", model, err.message);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("All Groq models failed—check key/limits");
};
