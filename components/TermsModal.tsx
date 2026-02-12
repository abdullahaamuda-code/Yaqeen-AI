
import React from 'react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Disclaimer & Terms of Use</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
          <section>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">1. Educational Nature</h4>
            <p>Yaqeen AI is an educational tool designed to provide information based on the Quran and authentic Sunnah. It uses artificial intelligence to assist in navigating Islamic knowledge with modern clarity.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">2. No Binding Fatwas</h4>
            <p>The responses provided by this AI are for informational purposes only. They do not constitute binding legal rulings (fatwas), personal legal advice, medical advice, or financial advice. Islamic jurisprudence is complex and context-dependent.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">3. Scholar Consultation</h4>
            <p>For specific personal rulings, complex family matters, or serious religious inquiries, you are strongly advised to consult a qualified local scholar or an official Dar al-Ifta.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">4. User Responsibility</h4>
            <p>You remain responsible for how you interpret and act upon any information provided. While we strive for authenticity, AI can occasionally produce inaccuracies. Users should verify references with original Mushaf and Hadith collections.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">5. Data Privacy</h4>
            <p>Your profile data and chat history are stored locally on this device. We do not transmit your personal conversations to a central database. Deleting your account will permanently wipe this local data.</p>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-[32px]">
          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
