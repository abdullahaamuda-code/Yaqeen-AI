import { UserProfile, LLMResponse } from "../types";
import { getSystemInstruction } from "./openrouter";  // ✅ FIX: Import this

const GROQ_MODELS = [
  "llama3-70b-8192",      // Real Groq model names
  "llama3-8b-8192",       // Real Groq model names  
  "mixtral-8x7b-32768",
  "gemma2-9b-it"
];

const fetchIslamGPTContext = async (maxLength = 4000): Promise<string> => {
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
        const text = (await res.text()).slice(0, 1000);
        combined += `\n\n${text}`;
        if (combined.length > maxLength) break;
      } catch {}
    }
    return combined.trim();
  } catch {
    return "";
  }
};

export const getGroqResponse = async (
  prompt: string,
  history: any[],
  user: UserProfile | null
): Promise<LLMResponse> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not configured");

  const islamicContext = history.length < 3 ? await fetchIslamGPTContext() : "";
  const enhancedPrompt = islamicContext 
    ? `${prompt}\n\nTRUSTED NOTES:\n${islamicContext}` 
    : prompt;

  const messages = [
    { role: "system", content: getSystemInstruction(user) },  // ✅ Now works
    ...history.slice(-6).map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.parts?.[0]?.text || "",
    })),
    { role: "user", content: enhancedPrompt },
  ];

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
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error(`Groq ${model}: ${res.status}`);
        if ([413, 429, 400].includes(res.status)) continue;
        throw new Error(`GROQ_ERROR_${res.status}`);
      }

      const data = await res.json();
      return {
        text: data.choices?.[0]?.message?.content || "Error occurred.",
        webLinks: [],
      };
    } catch (err) {
      console.error("Groq failed:", model, err);
      continue;
    }
  }
  throw new Error("All Groq models failed");
};
