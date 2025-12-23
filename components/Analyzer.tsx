
import React, { useState } from 'react';
import { analyzeLogEntry } from '../services/geminiService';
import { AIAnalysisResult, ThreatLevel } from '../types';
import { THREAT_COLORS } from '../constants';
import { ShieldAlert, Search, Loader2, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const Analyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeLogEntry(input);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Check your API key or network connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForThreat = (level: ThreatLevel) => {
    switch(level) {
      case ThreatLevel.CRITICAL:
      case ThreatLevel.HIGH: return <AlertTriangle className="text-rose-500" />;
      case ThreatLevel.MEDIUM: return <AlertTriangle className="text-amber-500" />;
      default: return <CheckCircle2 className="text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-white mb-1">AI Forensic Analyzer</h2>
        <p className="text-slate-400 text-sm">Upload packet captures or raw logs for deep cognitive analysis.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 text-slate-300">
            <FileText size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Raw Input</span>
          </div>
          <textarea
            className="flex-1 min-h-[300px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-indigo-300 font-mono text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
            placeholder="Paste raw Apache/Nginx logs, PCAP hex strings, or Snort alerts here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
            {loading ? 'Crunching Data...' : 'Start Forensic Analysis'}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          {!result && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20">
              <ShieldAlert size={64} className="opacity-20" />
              <p className="text-sm font-medium">Awaiting forensic evidence...</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldAlert className="text-indigo-400 animate-pulse" size={24} />
                </div>
              </div>
              <p className="text-slate-400 animate-pulse text-sm">Consulting AI Knowledge Base...</p>
            </div>
          )}

          {error && (
            <div className="h-full flex flex-col items-center justify-center text-rose-500 text-center px-10">
              <AlertTriangle size={48} className="mb-4" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  {getIconForThreat(result.threatLevel)}
                  <div>
                    <h3 className="text-xl font-bold text-white leading-none mb-1">{result.classification}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono uppercase tracking-tighter">Confidence Score:</span>
                      <span className="text-xs font-bold text-indigo-400">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${THREAT_COLORS[result.threatLevel]}`}>
                  {result.threatLevel}
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technical Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                    {result.description}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <section>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Affected Assets</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.affectedAssets.map((asset, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] rounded">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority</h4>
                    <div className="text-white text-sm font-semibold capitalize">
                      {result.threatLevel.toLowerCase()} remediation required
                    </div>
                  </section>
                </div>

                <section>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SOC Recommendation</h4>
                  <div className="bg-indigo-600/10 border border-indigo-500/30 p-4 rounded-xl text-sm text-indigo-200">
                    <p className="leading-relaxed">{result.recommendation}</p>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
