
import React from 'react';
import { UserProfile } from '../types';

// Fix: Removed invalid import of 'logOut' from firebase service as it's no longer used.
// Component now receives onLogout via props to maintain statelessness.

interface SidebarProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogin, onLogout }) => {
  return (
    <div className="hidden lg:flex flex-col w-72 h-full glass border-r border-white/10 p-6">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-900/40">
           <span className="font-arabic text-white">ي</span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Yaqeen AI</h1>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">Certainty</p>
        </div>
      </div>

      {user ? (
        <div className="flex flex-col gap-6 flex-grow">
          <div className="glass-emerald p-4 rounded-2xl border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              {/* Fallback avatar if photoURL is missing */}
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-emerald-500" />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-700 flex items-center justify-center text-white">
                  <i className="fa-solid fa-user"></i>
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.displayName || user.name}</p>
                <p className="text-[10px] text-emerald-300">{user.bio || 'Knowledge Seeker'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-400 font-bold">YAQEEN SCORE</span>
                <span className="text-sm font-black text-white">{user.masteryScore || 0}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${user.masteryScore || 0}%` }}></div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all">
                <i className="fa-solid fa-house-chimney text-emerald-500"></i>
                <span className="text-sm font-medium">Dashboard</span>
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all">
                <i className="fa-solid fa-bookmark text-amber-500"></i>
                <span className="text-sm font-medium">Saved Insights</span>
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all">
                <i className="fa-solid fa-tree text-blue-500"></i>
                <span className="text-sm font-medium">Knowledge Tree</span>
             </button>
          </nav>

          <div className="mt-auto border-t border-white/10 pt-4">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-user-lock text-slate-500 text-2xl"></i>
          </div>
          <p className="text-sm text-slate-400 mb-6">Sign in to track your mastery score and save your progress.</p>
          <button onClick={onLogin} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all glow-gold">
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
