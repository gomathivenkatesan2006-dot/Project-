
import React from 'react';
import { NAVIGATION } from '../constants';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full sticky top-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AEGIS AI</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Network Defense</p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className={`${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">System Secure</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase">
            Uptime: 142h 12m<br />
            Packets: 42.1M
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
