// src/utils/classifyQuestion.ts

const COMPLEX_KEYWORDS = [
  "inheritance",
  "mirath",
  "mirāth",
  "estate",
  "zakat",
  "zakah",
  "nisab",
  "division",
  "shares",
  "1/8",
  "1/6",
  "1/3",
  "1/2",
  "2:1",
  "percentage",
  "distribute",
  "distribution",
  "scenario",
  "multiple cases",
  "step by step",
  "detailed explanation",
];

// Add these to catch the "Deep Thinker" questions
const LOGIC_KEYWORDS = [
  "if",
  "suppose",
  "reconcile",
  "paradox",
  "conflict",
  "science vs",
  "modern",
];

export const isComplexQuestion = (text: string): boolean => {
  const lower = text.toLowerCase().trim();
  const qMarkCount = (text.match(/\?/g) || []).length;

  // Multi-step logic or long text
  if (lower.length > 350 || qMarkCount >= 2) return true;

  // Catch the "Big Brain" philosophy/fiqh stuff and technical inheritance/zakat
  if ([...COMPLEX_KEYWORDS, ...LOGIC_KEYWORDS].some((k) => lower.includes(k))) {
    return true;
  }

  return false;
};
