import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const startVoiceCapture = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  return (
    <div className="p-6 z-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto relative group outline-none focus:outline-none"
      >
        {/* outer glow only */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-[30px] blur opacity-15 group-focus-within:opacity-25 transition-opacity"></div>

        {/* OUTER glass shell – one subtle dark border */}
        <div className="relative flex items-end gap-3 glass p-3 rounded-[28px] border border-slate-700/60 outline-none focus:outline-none">
          {/* INNER WRAPPER – MUST have border-none to kill that white box */}
          <div className="flex items-center gap-3 flex-1 bg-slate-900/40 rounded-2xl border-none">

            <button
              type="button"
              onClick={startVoiceCapture}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                ${
                  isListening
                    ? 'bg-red-500/20 text-red-500 animate-pulse'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
            >
              <i
                className={`fa-solid ${
                  isListening ? 'fa-microphone-lines' : 'fa-microphone'
                }`}
              ></i>
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                !e.shiftKey &&
                (e.preventDefault(), handleSubmit())
              }
              placeholder="Ask Yaqeen AI anything about Islam..."
              className="flex-grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white placeholder-slate-500 resize-none py-3 px-2 text-sm md:text-base max-h-40"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all
              ${
                !input.trim() || isLoading
                  ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 active:scale-95 glow-gold'
              }`}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-arrow-up"></i>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
