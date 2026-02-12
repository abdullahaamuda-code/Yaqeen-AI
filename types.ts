export type ViewType = 'chat' | 'quran' | 'hadith';

/**
 * Interface representing a citation for Islamic proofs.
 */
export interface Citation {
  source: string;
  reference: string;
  text: string;
}

/**
 * Extended Message interface to support grounding links and evidence.
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: Citation[];
  webLinks?: { uri: string; title: string }[];
}

/**
 * Profile information for the authenticated user.
 */
export interface UserProfile {
  name: string;
  age: number;
  password?: string;
  country?: string;
  photoURL?: string;
  displayName?: string;
  bio?: string;
  masteryScore?: number;
}

export interface NavigationContext {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  quranUrl: string;
  setQuranUrl: (url: string) => void;
  hadithUrl: string;
  setHadithUrl: (url: string) => void;
}

/**
 * Interface for prayer times object returned by Aladhan API.
 */
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

/** LLM provider selection */
export type LLMProvider = 'groq' | 'openrouter' | 'gemini';

/** Normalized LLM response */
export interface LLMResponse {
  text: string;
  webLinks?: { uri: string; title: string }[];
}
