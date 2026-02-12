import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onReferenceClick: (type: 'quran' | 'hadith', ref: string) => void;
  userName: string;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onReferenceClick,
  userName,
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  /**
   * Complex formatter to handle bold, bullets, and Islamic references.
   */
   const formatMessage = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, lineIdx) => {
      const isBullet = line.trim().startsWith('- ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      const parts: React.ReactNode[] = [];
      const currentText = cleanLine;

      // Match:
      // - [Quran 4:12]
      // - [Sahih al-Bukhari 5027] / [Sahih Muslim 798]
      // - **bold**
      const combinedRegex =
        /(\[Quran\s+\d+:\d+\]|\[(?:Sahih\s+al-Bukhari|Sahih\s+Muslim)\s+\d+:\d+\]|\*\*.*?\*\*)/g;

      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = combinedRegex.exec(currentText)) !== null) {
        if (match.index > lastIndex) {
          parts.push(currentText.substring(lastIndex, match.index));
        }

        const matchText = match[0];

        if (matchText.startsWith('**') && matchText.endsWith('**')) {
          // Bold
          parts.push(
            <strong
              key={`${lineIdx}-${match.index}`}
              className="font-bold"
            >
              {matchText.slice(2, -2)}
            </strong>
          );
        } else if (matchText.startsWith('[Quran')) {
          // Quran [Quran 4:12]
          const ref = matchText.match(/\d+:\d+/)?.[0] || '';
          parts.push(
            <button
              key={`${lineIdx}-${match.index}`}
              onClick={() => onReferenceClick('quran', ref)}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline px-1 rounded transition-colors bg-emerald-50 dark:bg-emerald-900/30 text-xs sm:text-sm"
            >
              {matchText}
            </button>
          );
        } else if (matchText.startsWith('[Sahih')) {
          // Hadith [Sahih al-Bukhari 5027]
          parts.push(
            <button
              key={`${lineIdx}-${match.index}`}
              onClick={() =>
                onReferenceClick(
                  'hadith',
                  matchText.replace(/[\[\]]/g, '')
                )
              }
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline px-1 rounded transition-colors bg-emerald-50 dark:bg-emerald-900/30 text-xs sm:text-sm"
            >
              {matchText}
            </button>
          );
        }

        lastIndex = combinedRegex.lastIndex;
      }

      if (lastIndex < currentText.length) {
        parts.push(currentText.substring(lastIndex));
      }

      return (
        <div
          key={lineIdx}
          className={`${
            isBullet ? 'flex items-start gap-2 ml-4 mb-2' : 'mb-3'
          }`}
        >
          {isBullet && (
            <span className="text-emerald-500 mt-1.5 flex-shrink-0">
              •
            </span>
          )}
          <p className="flex-grow">{parts}</p>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      {/* Inner Header Panel */}
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Yaqeen AI
          </h2>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Your Anchor in Islamic Certainty
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in opacity-60">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
                <i className="fa-solid fa-book-open text-2xl text-slate-400"></i>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center">
                Ask any question about Islam to begin.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[85%] px-5 py-4 rounded-3xl shadow-sm border ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white border-emerald-500 rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  <div className="text-sm md:text-base leading-relaxed break-words">
                    {formatMessage(msg.content)}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl animate-fade-in">
                <div className="flex gap-1 items-center h-6 text-slate-800 dark:text-slate-100">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-transparent">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 rounded-[40px] blur opacity-50 group-focus-within:opacity-80 transition-opacity"></div>
          <div className="relative flex items-center bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[40px] px-6 py-3 shadow-2xl transition-all group-focus-within:border-emerald-500/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Yaqeen AI anything about Islam..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base py-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`flex-shrink-0 ml-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                !input.trim() || isLoading
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-707 hover:scale-105 active:scale-95'
              }`}
            >
              <i className="fa-solid fa-arrow-up text-base"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
