
import React, { useState } from 'react';
import { Message } from '../types';
import EvidenceModal from './EvidenceModal';
import ReportModal from './ReportModal';
import { submitReport } from '../services/firebase';

interface ChatMessageProps {
  message: Message;
  userEmail?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userEmail }) => {
  const isUser = message.role === 'user';
  const [showEvidence, setShowEvidence] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleReportSubmit = async (reason: string, details: string) => {
    await submitReport({
      messageId: message.id,
      userId: userEmail || 'guest',
      userEmail: userEmail || 'guest@guest.com',
      reason,
      details,
      timestamp: Date.now(),
      status: 'pending'
    });
    setShowReport(false);
    alert("Thank you. Your report has been submitted to the developer.");
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[85%] lg:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-sm
          ${isUser ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
          {isUser ? <i className="fa-solid fa-user"></i> : <i className="fa-solid fa-kaaba"></i>}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Content Bubble */}
          <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
            ${isUser 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
            
            <div className="whitespace-pre-wrap">{message.content}</div>

            {/* Grounding Web Links */}
            {message.webLinks && message.webLinks.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Verified Web Context</p>
                <div className="flex flex-wrap gap-2">
                  {message.webLinks.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener" className="text-[10px] px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:underline">
                      <i className="fa-solid fa-link mr-1"></i> {link.title || 'Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Interaction Bar */}
          <div className="flex items-center gap-4 mt-2 px-1">
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {!isUser && (
              <>
                <button 
                  onClick={() => setShowEvidence(true)}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-scroll"></i>
                  Show Evidence
                </button>
                <button 
                  onClick={() => setShowReport(true)}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-flag"></i>
                  Report
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showEvidence && (
        <EvidenceModal 
          citations={message.sources || []} 
          onClose={() => setShowEvidence(false)} 
        />
      )}

      {showReport && (
        <ReportModal 
          messageId={message.id}
          onClose={() => setShowReport(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default ChatMessage;
