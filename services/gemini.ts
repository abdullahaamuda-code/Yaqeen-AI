// src/services/gemini.ts
import { GoogleGenAI } from "@google/genai";
import { UserProfile, LLMResponse } from "../types";

// 3-model chain for Gemini
const GEMINI_MODELS = [
  "gemini-3-flash-preview", // main
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

// ==== YOU WILL EDIT THIS FUNCTION YOURSELF ====
const getSystemInstruction = (user: UserProfile | null) => {
  const userName = user?.name || "Seeker";
  const userAge = user?.age ?? 30;

  let ageTone =
    "Use warm, respectful, brotherly language. Explain clearly and calmly, like a knowledgeable older friend.";
  if (userAge < 13) {
    ageTone =
      "Explain like a kind teacher to a child. Use simple, gentle, heart-centered words and very simple analogies.";
  } else if (userAge < 19) {
    ageTone =
      "Use a relatable, cool mentor vibe. Use simple examples and explain the *why* behind the rules.";
  }

  return `You are a Yaqeen AI a helpful Islamic AI brother and mentor.

${ageTone}

[... your system rules here ...]`;
};
// ================================================

// simple in-memory toggle
let lastGeminiKeyIndex = 0;

const getNextGeminiClient = () => {
  const key1 = import.meta.env.VITE_GEMINI_API_KEY_1;
  const key2 = import.meta.env.VITE_GEMINI_API_KEY_2;

  const keys = [key1, key2].filter(Boolean);

  if (keys.length === 0) {
    const single = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    if (!single) throw new Error("Gemini API key not configured");
    return new GoogleGenAI({ apiKey: single });
  }

  // rotate index 0 -> 1 -> 0 -> 1 ...
  lastGeminiKeyIndex = (lastGeminiKeyIndex + 1) % keys.length;
  const chosenKey = keys[lastGeminiKeyIndex];

  if (!chosenKey) throw new Error("Gemini API key not configured");

  return new GoogleGenAI({ apiKey: chosenKey });
};

export const getGeminiResponse = async (
  prompt: string,
  history: any[],
  user: UserProfile | null
): Promise<LLMResponse> => {
  const ai = getNextGeminiClient();
  const systemInstruction = getSystemInstruction(user);

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: history,
        config: {
          systemInstruction,
          temperature: 0.2,
          topP: 0.5,
          maxOutputTokens: 2048,
          tools: [{ googleSearch: {} }],
        },
      });

      const text =
        (response as any).text ||
        "I apologize, but I encountered an error.";

      const webLinks =
        (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks
          ?.filter((chunk: any) => chunk.web)
          ?.map((chunk: any) => ({
            uri: chunk.web.uri,
            title: chunk.web.title,
          })) || [];

      return { text, webLinks };
    } catch (error: any) {
      console.error(`Gemini model ${model} failed:`, error);

      const errorMessage = error?.message?.toLowerCase() || "";
      const errorStatus = error?.status || "";
      const errorCode = error?.code || 0;

      if (
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("429") ||
        errorStatus === "RESOURCE_EXHAUSTED" ||
        errorCode === 429
      ) {
        lastError = new Error("QUOTA_EXCEEDED");
        continue;
      }

      lastError = error;
      continue;
    }
  }

  if (lastError?.message === "QUOTA_EXCEEDED") {
    throw new Error("QUOTA_EXCEEDED");
  }
  throw lastError || new Error("GEMINI_ERROR");
};
