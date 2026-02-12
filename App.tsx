import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import ChatView from './components/ChatView';
import QuranView from './components/QuranView';
import HadithView from './components/HadithView';
import AuthModal from './components/AuthModal';
import TermsModal from './components/TermsModal';
import { Message, ViewType, UserProfile, LLMProvider } from './types';
import { getGeminiResponse } from './services/gemini';
import { getGroqResponse } from './services/groq';
import { getOpenRouterResponse } from './services/openrouter';

const LOCAL_STORAGE_USER_KEY = 'yaqeen_user_v1';
const LOCAL_STORAGE_CHATS_KEY = 'yaqeen_chats_v1';
const SESSION_STORAGE_AUTH_KEY = 'yaqeen_session_auth_v1';
const LOCAL_STORAGE_GREETED_KEY = 'yaqeen_greeted_v1';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [quranUrl, setQuranUrl] = useState('https://quran.com');
  const [hadithUrl, setHadithUrl] = useState('https://sunnah.com');
  const [provider, setProvider] = useState<LLMProvider>('groq'); // default = Groq

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const sessionAuth = sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (sessionAuth === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsAuthModalOpen(true);
      }
    } else {
      setIsAuthModalOpen(true);
    }

    const storedChats = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
    if (storedChats) {
      setMessages(JSON.parse(storedChats));
    }
  }, []);

  const handleAuthComplete = (profile: UserProfile, isNewSignup: boolean) => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
    sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY, 'true');
    setUser(profile);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);

    // Salam Greeting - ONLY after first signup
    if (isNewSignup) {
      const greeting: Message = {
        id: 'signup-greeting-' + Date.now(),
        role: 'assistant',
        content: `As-salamu alaykum ${profile.name}, welcome to Yaqeen AI – your anchor in Islamic certainty. How can I help you today?`,
        timestamp: Date.now(),
      };

      const updatedMessages = [greeting, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(updatedMessages));
      localStorage.setItem(LOCAL_STORAGE_GREETED_KEY, 'true');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_AUTH_KEY);
    setIsLoggedIn(false);
    setIsAuthModalOpen(true);
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = newMessages.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      let result;

      if (provider === 'groq') {
        try {
          // 1) Groq with its own internal model fallbacks
          result = await getGroqResponse(content, history, user);
        } catch (groqErr: any) {
          console.warn('All Groq models failed, trying OpenRouter...', groqErr?.message);
          try {
            // 2) OpenRouter as meta-fallback
            result = await getOpenRouterResponse(content, history, user);
          } catch (orErr: any) {
            console.warn('OpenRouter failed, falling back to Gemini...', orErr?.message);
            // 3) Gemini as last resort
            result = await getGeminiResponse(content, history, user);
          }
        }
      } else if (provider === 'openrouter') {
        result = await getOpenRouterResponse(content, history, user);
      } else {
        // provider === 'gemini'
        result = await getGeminiResponse(content, history, user);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
        webLinks: result.webLinks,
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(finalMessages));
    } catch (err: any) {
      console.error(err);

      let errorText =
        'Something went wrong while processing this request. Please try again in a few moments, in shaa’ Allah.';

      if (err.message === 'QUOTA_EXCEEDED') {
        errorText =
          'Yaqeen AI is currently experiencing high load and cannot answer right now. Please try again in a little while, in shaa’ Allah.';
      } else if (
        err.name === 'TypeError' ||
        err.message?.toLowerCase().includes('fetch') ||
        err.message?.toLowerCase().includes('network') ||
        err.message?.toLowerCase().includes('connect')
      ) {
        errorText =
          'I’m having trouble connecting at the moment. Please check your internet connection or try again shortly, in shaa’ Allah.';
      }

      const errorMsg: Message = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: errorText,
        timestamp: Date.now(),
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceClick = (type: 'quran' | 'hadith', ref: string) => {
    if (type === 'quran') {
      const parts = ref.split(':');
      const surah = parts[0];
      const verse = parts[1];
      setQuranUrl(`https://quran.com/${surah}${verse ? `/${verse}` : ''}`);
      setActiveView('quran');
    } else {
      const normalizedRef = ref.toLowerCase();
      const partsMatch = ref.match(/\d+:\d+/);
      const bookRef = partsMatch ? partsMatch[0] : '';
      const [bookNum, hadithNum] = bookRef.split(':');

      if (normalizedRef.includes('bukhari')) {
        if (bookRef) {
          setHadithUrl(`https://sunnah.com/bukhari/${bookNum}/${hadithNum}`);
        } else {
          setHadithUrl('https://sunnah.com/bukhari');
        }
      } else if (normalizedRef.includes('muslim')) {
        if (bookRef) {
          setHadithUrl(`httpsunnah.com/muslim/${bookNum}/${hadithNum}`);
        } else {
          setHadithUrl('https://sunnah.com/muslim');
        }
      } else {
        setHadithUrl('https://sunnah.com');
      }
      setActiveView('hadith');
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onReferenceClick={handleReferenceClick}
            userName={user?.name || ''}
          />
        );
      case 'quran':
        return <QuranView url={quranUrl} />;
      case 'hadith':
        return <HadithView url={hadithUrl} />;
      default:
        return null;
    }
  };

  return (
    <AppShell
      activeView={activeView}
      setActiveView={setActiveView}
      user={user}
      onLogout={handleLogout}
      onOpenTerms={() => setIsTermsOpen(true)}
      // later you can pass provider + setProvider into AppShell/Header
    >
      {isLoggedIn && renderView()}
      {isAuthModalOpen && (
        <AuthModal
          onAuthComplete={handleAuthComplete}
          existingUser={user}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
      )}
      {isTermsOpen && <TermsModal onClose={() => setIsTermsOpen(false)} />}
    </AppShell>
  );
};

export default App;
