
import React from 'react';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-emerald-800 text-white shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-600 p-2 rounded-xl shadow-inner">
          <i className="fa-solid fa-moon text-yellow-300 text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Noor AI</h1>
          <p className="text-xs text-emerald-100/80">Islamic Knowledge Assistant</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
