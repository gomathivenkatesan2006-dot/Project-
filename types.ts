
export enum ThreatLevel {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface NetworkPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
  length: number;
  info: string;
  threatLevel: ThreatLevel;
}

export interface AIAnalysisResult {
  threatLevel: ThreatLevel;
  classification: string;
  description: string;
  confidence: number;
  recommendation: string;
  affectedAssets: string[];
}

export interface TrafficStats {
  timestamp: string;
  packets: number;
  threats: number;
}
