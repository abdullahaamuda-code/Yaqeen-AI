const FIQH_FINANCE_TRIGGERS = [
  "inheritance", "mirath", "mirāth", "estate", "heir", "executor",
  "zakat on", "nisab", "calculate", "shares", "portfolio", "crypto",
  "dividend", "usury", "interest", "mortgage", "financing", "waqf",
];

const THEOLOGICAL_TRAPS = [
  "reconcile", "paradox", "conflict", "contradict", "science vs",
  "philosophy", "metaphysics", "logic", "existence of", "soul",
  "ruh", "alien", "simulation", "future", "predict", "evolution",
];

const COMPARISON_KEYWORDS = [
  "difference between", "compare", "which is better", "opinion of",
  "hanafi vs", "shafi", "maliki", "hanbali", "madhab",
];

export const isComplexQuestion = (text: string): boolean => {
  const lower = text.toLowerCase().trim();
  const qMarkCount = (text.match(/\?/g) || []).length;

  // 1. HARD LIMITS (Force complex route)
  // "Wall of text" → almost always complex.
  if (lower.length > 450) return true;

  // 3+ questions at once → high-level reasoning.
  if (qMarkCount >= 3) return true;

  // 2. MATHEMATICAL PATTERNS (Catching Mirath/Zakat math)
  // Looks for "1/8", "2:1", "33%", plus total/sum/distributed in non-trivial text.
  const mathPattern = /(\d+\/\d+|\d+:\d+|\d+%)|total|sum|distributed/i;
  if (mathPattern.test(lower) && lower.length > 100) return true;

  // 3. KEYWORD ANALYSIS – Finance/Inheritance → always complex
  if (FIQH_FINANCE_TRIGGERS.some((k) => lower.includes(k))) return true;

  // 4. COMBINED SIGNALS (Avoiding false positives)
  // Deep theology/comparison only if not super short.
  const hasDeepKeyword = [...THEOLOGICAL_TRAPS, ...COMPARISON_KEYWORDS].some(
    (k) => lower.includes(k),
  );

  if (lower.length > 150 && hasDeepKeyword) return true;

  // 5. DEFAULT (Route to Groq – simple)
  return false;
};
