
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
          M
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">MOVE</h1>
          <p className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">Mentor Cristão</p>
        </div>
      </div>
      <div className="hidden md:block text-sm text-slate-500 italic">
        "Lampada para os meus pés é tua palavra"
      </div>
    </header>
  );
};

export default Header;
