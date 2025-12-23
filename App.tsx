
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LiveMonitor from './components/LiveMonitor';
import Analyzer from './components/Analyzer';
import { NetworkPacket, ThreatLevel, TrafficStats } from './types';
import { MOCK_IPS, MOCK_PROTOCOLS } from './constants';
import { Bell, Search, User, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [stats, setStats] = useState<TrafficStats[]>([]);

  // Simulation Logic
  useEffect(() => {
    // Initial stats
    const initialStats = Array.from({ length: 20 }, (_, i) => ({
      timestamp: `${i}:00`,
      packets: Math.floor(Math.random() * 500) + 200,
      threats: Math.floor(Math.random() * 50)
    }));
    setStats(initialStats);

    // Packet generation interval
    const interval = setInterval(() => {
      const newPacket: NetworkPacket = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sourceIp: MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)],
        destIp: '10.0.0.128',
        protocol: MOCK_PROTOCOLS[Math.floor(Math.random() * MOCK_PROTOCOLS.length)],
        length: Math.floor(Math.random() * 1500),
        info: ['SYN/ACK', 'GET /api/v1/auth', 'UDP Source: 5321', 'TLSv1.3 Handshake', 'Standard Query 0x1'][Math.floor(Math.random() * 5)],
        threatLevel: Math.random() > 0.95 
          ? (Math.random() > 0.8 ? ThreatLevel.CRITICAL : ThreatLevel.HIGH) 
          : (Math.random() > 0.8 ? ThreatLevel.MEDIUM : ThreatLevel.LOW)
      };

      setPackets(prev => [...prev.slice(-49), newPacket]);

      setStats(prev => {
        const last = prev[prev.length - 1];
        const newEntry = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          packets: Math.floor(Math.random() * 300) + 300,
          threats: newPacket.threatLevel === ThreatLevel.HIGH || newPacket.threatLevel === ThreatLevel.CRITICAL 
            ? last.threats + 1 
            : last.threats
        };
        return [...prev.slice(-19), newEntry];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'live-monitor': return <LiveMonitor packets={packets} />;
      case 'threat-analysis': return <Analyzer />;
      case 'terminal': return (
        <div className="h-full bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-sm text-emerald-500 overflow-y-auto">
          <p className="mb-2">Aegis Security System v4.2.0 (Stable)</p>
          <p className="mb-2">Initializing kernel modules... [OK]</p>
          <p className="mb-2">Scanning network interfaces (eth0, eth1)... [OK]</p>
          <p className="mb-2">Establishing AI cognitive link (Gemini-3-Pro)... [OK]</p>
          <p className="mb-4 text-slate-500">--------------------------------------------------</p>
          <div className="flex gap-2 mb-2">
            <span className="text-white">root@aegis-defense:~$</span>
            <span className="text-slate-400">tail -f /var/log/ids/alerts.log</span>
          </div>
          {packets.filter(p => p.threatLevel !== ThreatLevel.LOW).map((p, i) => (
            <p key={i} className="mb-1">
              <span className="text-rose-500">[{p.timestamp}] ALERT:</span> {p.threatLevel} threat from {p.sourceIp} - Protocol: {p.protocol}
            </p>
          ))}
          <div className="flex gap-2 animate-pulse mt-4">
            <span className="text-white">root@aegis-defense:~$</span>
            <div className="w-2 h-4 bg-emerald-500"></div>
          </div>
        </div>
      );
      default: return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <div className="relative w-full group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search assets, logs, or threats..." 
                 className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
            </button>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-full pl-1.5 pr-3 py-1.5">
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                JD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">John Doe</p>
                <p className="text-[10px] text-slate-500 font-medium">Security Analyst</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
           <div className="max-w-7xl mx-auto h-full">
            {renderView()}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
