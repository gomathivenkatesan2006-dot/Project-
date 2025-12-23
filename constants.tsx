
import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  Search, 
  Settings, 
  Cpu, 
  Terminal,
  Globe,
  Bell
} from 'lucide-react';

export const NAVIGATION = [
  { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'live-monitor', name: 'Live Monitor', icon: <Activity size={20} /> },
  { id: 'threat-analysis', name: 'AI Analyzer', icon: <ShieldAlert size={20} /> },
  { id: 'terminal', name: 'Command Center', icon: <Terminal size={20} /> },
];

export const MOCK_IPS = [
  '192.168.1.5', '10.0.0.42', '172.16.0.101', 
  '45.33.22.11', '185.122.45.9', '91.102.11.4'
];

export const MOCK_PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'] as const;

export const THREAT_COLORS = {
  INFO: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  LOW: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  HIGH: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  CRITICAL: 'text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
};
