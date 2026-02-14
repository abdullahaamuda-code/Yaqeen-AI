/**
 * Yaqeen AI - Logic Router
 * Separates "Surface Questions" (Groq) from "Deep Reasoning" (SambaNova 405B)
 */

const FIQH_FINANCE_TRIGGERS = [
  "inheritance", "mirath", "mirāth", "estate", "heir", "executor",
  "zakat on", "nisab", "calculate", "shares", "portfolio", "crypto",
  "dividend", "usury", "interest", "mortgage", "financing", "waqf"
];

const THEOLOGICAL_TRAPS = [
  "reconcile", "paradox", "conflict", "contradict", "science vs", 
  "philosophy", "metaphysics", "logic", "existence of", "soul", 
  "ruh", "alien", "simulation", "future", "predict", "evolution"
];

const COMPARISON_KEYWORDS = [
  "difference between", "compare", "which is better", "opinion of",
  "hanafi vs", "shafi", "maliki", "hanbali", "madhab"
];

export const isComplexQuestion = (text: string): boolean => {
  const lower = text.toLowerCase().trim();
  const qMarkCount = (text.match(/\?/g) || []).length;
  
  // 1. HARD LIMITS (Force SambaNova)
  // If it's a "Wall of Text", it's almost always a complex scenario.
  if (lower.length > 450) return true;
  
  // If they are asking 3+ questions at once, they need high-level reasoning.
  if (qMarkCount >= 3) return true;

  // 2. MATHEMATICAL PATTERNS (Catching Mirath/Zakat math)
  // Regex looks for things like "1/8", "2:1", "33%", "total sum"
  const mathPattern = /(\d+\/\d+|\d+:\d+|\d+%)|total|sum|distributed/i;
  if (mathPattern.test(lower) && lower.length > 100) return true;

  // 3. KEYWORD ANALYSIS
  // If it's a Finance/Inheritance keyword, route to SambaNova immediately.
  if (FIQH_FINANCE_TRIGGERS.some(k => lower.includes(k))) return true;

  // 4. COMBINED SIGNALS (Avoiding false positives)
  // Philosophy/Comparison keywords only trigger if the question isn't super short.
  // We don't want to waste credits on "What is a soul?" (Groq can do that).
  // We WANT credits spent on "How do we reconcile the soul with AI?"
  const hasDeepKeyword = [...THEOLOGICAL_TRAPS, ...COMPARISON_KEYWORDS].some(k => lower.includes(k));
  
  if (lower.length > 150 && hasDeepKeyword) return true;

  // 5. DEFAULT (Route to Groq)
  return false;
};
