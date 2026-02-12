
import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';

interface AppShellProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenTerms: () => void;
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ activeView, setActiveView, user, onLogout, onOpenTerms, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('bg-slate-50', 'text-slate-950');
      document.body.classList.add('bg-slate-950', 'text-slate-50');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.remove('bg-slate-950', 'text-slate-50');
      document.body.classList.add('bg-slate-50', 'text-slate-950');
    }
  };

  const menuItems = [
    { id: 'chat', label: 'Home (Chat)', icon: 'fa-comments' },
    { id: 'quran', label: 'Quran', icon: 'fa-book-quran' },
    { id: 'hadith', label: 'Hadith', icon: 'fa-scroll' },
  ] as const;

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-arabic text-xl shadow-md">ي</div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Yaqeen AI</h1>
            </div>
          </div>

          <nav className="flex-grow px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-arabic text-sm">ي</div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Yaqeen AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-emerald-500 transition-all"
                >
                  <i className="fa-solid fa-user"></i>
                </button>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-fade-in">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                        <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400">Age: {user.age}</p>
                      </div>
                      <button 
                        onClick={() => {
                          onLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content View */}
        <main className="flex-grow overflow-hidden relative">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-10 flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
            @2026 Yaqeen AI – Your Anchor in Islamic Certainty | Crafted by <a href="https://wa.me/2348169936326?text=Assalamu%20alaykum%2C%20I%20came%20from%20Yaqeen%20AI." target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-all">Abdullah A-A</a>
          </p>
          <button 
            onClick={onOpenTerms}
            className="text-[9px] sm:text-[10px] text-slate-400 hover:text-emerald-500 font-bold uppercase tracking-widest transition-colors hidden sm:block"
          >
            Disclaimer & Terms
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AppShell;
