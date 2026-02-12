
import React from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
            <span className="font-arabic text-white">ي</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Yaqeen AI</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Your anchor in Islamic certainty. We provide authentic guidance grounded in the Quran and Sunnah, delivered with modern clarity.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
