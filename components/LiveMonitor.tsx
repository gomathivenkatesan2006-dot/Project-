
import React, { useRef, useEffect } from 'react';
import { NetworkPacket, ThreatLevel } from '../types';
import { THREAT_COLORS } from '../constants';
import { Terminal, Shield, ArrowRightLeft } from 'lucide-react';

interface LiveMonitorProps {
  packets: NetworkPacket[];
}

const LiveMonitor: React.FC<LiveMonitorProps> = ({ packets }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [packets]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Live Monitor</h2>
          <p className="text-slate-400 text-sm">Streaming raw ingress/egress packets.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] text-slate-400 font-bold uppercase">Socket: Connected</span>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col font-mono">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-widest">
           <div className="flex gap-12">
             <span className="w-20">Timestamp</span>
             <span className="w-32">Source</span>
             <span className="w-12 text-center">Dir</span>
             <span className="w-32">Destination</span>
             <span className="w-16">Protocol</span>
           </div>
           <span>Threat Status</span>
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {packets.map((packet) => (
            <div 
              key={packet.id} 
              className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-900/50 transition-colors group text-[11px]"
            >
              <div className="flex gap-12 items-center text-slate-400">
                <span className="w-20 font-mono text-slate-500">{packet.timestamp}</span>
                <span className="w-32 font-mono text-indigo-300 truncate">{packet.sourceIp}</span>
                <span className="w-12 text-center flex justify-center">
                   <ArrowRightLeft size={12} className="text-slate-700" />
                </span>
                <span className="w-32 font-mono text-indigo-300 truncate">{packet.destIp}</span>
                <span className="w-16">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    packet.protocol === 'HTTPS' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {packet.protocol}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                 <span className="text-slate-500 group-hover:text-slate-300 transition-colors hidden lg:block">
                   {packet.info}
                 </span>
                 <div className={`px-2 py-0.5 rounded-md border font-bold text-[9px] min-w-[65px] text-center ${THREAT_COLORS[packet.threatLevel]}`}>
                    {packet.threatLevel}
                 </div>
              </div>
            </div>
          ))}
          {packets.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
               <Terminal size={48} className="mb-4" />
               <p className="text-sm">Initializing packet capture interface...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;
