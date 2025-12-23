
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrafficStats, ThreatLevel } from '../types';
import { ShieldAlert, Activity, Globe, Zap } from 'lucide-react';

interface DashboardProps {
  stats: TrafficStats[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const currentStats = stats[stats.length - 1] || { packets: 0, threats: 0 };
  
  const threatDistribution = [
    { name: 'Critical', value: 4, color: '#f43f5e' },
    { name: 'High', value: 12, color: '#f97316' },
    { name: 'Medium', value: 25, color: '#fbbf24' },
    { name: 'Low', value: 85, color: '#10b981' },
  ];

  const metrics = [
    { label: 'Throughput', value: `${currentStats.packets} pkt/s`, icon: <Activity className="text-indigo-400" />, trend: '+12%' },
    { label: 'Blocked Threats', value: '1,284', icon: <ShieldAlert className="text-rose-400" />, trend: '+5%' },
    { label: 'Active Nodes', value: '124', icon: <Globe className="text-emerald-400" />, trend: 'Stable' },
    { label: 'Latency', value: '14ms', icon: <Zap className="text-amber-400" />, trend: '-2ms' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-white mb-1">Network Overview</h2>
        <p className="text-slate-400 text-sm">Real-time heuristics and traffic monitoring systems.</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800 rounded-lg">{metric.icon}</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                metric.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-white">Network Traffic Flow</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-indigo-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Packets
              </span>
              <span className="flex items-center gap-1.5 text-xs text-rose-400">
                <div className="w-2 h-2 rounded-full bg-rose-500" /> Anomalies
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats}>
                <defs>
                  <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#475569' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="packets" stroke="#6366f1" fillOpacity={1} fill="url(#colorPackets)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-8">Threat Vectors</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  width={60}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             {threatDistribution.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-xs">
                 <span className="text-slate-400">{item.name}</span>
                 <span className="text-white font-mono">{item.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
