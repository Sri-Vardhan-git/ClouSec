import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSecurity } from '../context/SecurityContext';
import RiskGlobe from '../components/RiskGlobe';
import { ShieldAlert, CheckCircle2, ArrowRight, Terminal, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const { dashboard, inventory, loading } = useSecurity();
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();

  if (loading || !dashboard) return (
    <div className="h-screen flex items-center justify-center bg-darkBg font-mono">
      <div className="text-indigo-500 animate-pulse uppercase tracking-[0.5em]">Establishing Neural Link...</div>
    </div>
  );

  const getSevStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500 text-red-500';
      case 'HIGH': return 'border-orange-500 text-orange-500';
      default: return 'border-yellow-500 text-yellow-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] grid grid-cols-12 gap-8 items-center relative overflow-hidden">
      
      {/* --- LEFT: AGGREGATED METRICS --- */}
      <div className="col-span-3 space-y-4 z-10">
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-10 leading-none">
          SENTINEL <span className="text-indigo-600">SOC</span>
        </h1>
        
        <MetricBox label="Threats" val={dashboard.open} color="text-red-500" icon={ShieldAlert} />
        <MetricBox label="Resolved" val={dashboard.resolved} color="text-emerald-400" icon={CheckCircle2} />
        
        <div className="glass-card p-6 rounded-3xl border border-white/5 mt-12 bg-white/[0.01]">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Risk Distribution</p>
          {Object.entries(dashboard.by_severity).map(([sev, count]) => (
            <div key={sev} className="flex justify-between items-center mb-3">
              <span className={`text-[10px] font-bold ${getSevStyles(sev).split(' ')[1]}`}>{sev}</span>
              <span className="text-sm font-black text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- CENTER: THE 3D RISK GLOBE --- */}
      <div className="col-span-6 flex flex-col items-center justify-center relative h-full">
        <RiskGlobe />
        <div className="absolute bottom-10 flex flex-col items-center gap-4">
          <p className="text-[9px] font-mono text-indigo-500/40 tracking-[0.6em] uppercase">Global Infrastructure Matrix</p>
          
          {/* Debug Toggle Button */}
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <Terminal size={12} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Link Debugger</span>
            <ChevronDown size={12} className={`text-slate-500 transition-transform duration-300 ${showDebug ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* --- RIGHT: INTERACTIVE THREAT FEED --- */}
      <div className="col-span-3 h-full flex flex-col justify-center py-10 z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-black text-slate-500 tracking-widest uppercase text-sharp">Live Stream</h3>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
          {dashboard.open_findings.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: -5 }}
              onClick={() => navigate(`/${f.service.toLowerCase()}`)}
              className={`group cursor-pointer border-b-2 pb-3 transition-all ${getSevStyles(f.severity)} border-opacity-20 hover:border-opacity-100`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {f.issue}
                  </p>
                  <p className="text-[9px] font-mono text-slate-600 uppercase mt-1">
                    {f.region} // {f.resource_id.substring(0, 12)}...
                  </p>
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- NEURAL LINK DEBUGGER SECTION --- */}
      <AnimatePresence>
        {showDebug && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#0c0c0e]/95 backdrop-blur-3xl border-t border-indigo-500/20 z-50 p-6 overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Neural Link Status: Linked</span>
                <span className="text-[9px] font-mono text-slate-500">Source: mongodb://clousec_prod</span>
              </div>
              <button onClick={() => setShowDebug(false)} className="text-slate-500 hover:text-white transition-colors">
                <ChevronDown size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 h-full pb-4">
              <div className="flex flex-col gap-2 h-full">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest px-2">Findings Feed</p>
                <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[10px] text-blue-300 overflow-auto scrollbar-hide border border-white/5">
                  <pre>{JSON.stringify(dashboard, null, 2)}</pre>
                </div>
              </div>
              <div className="flex flex-col gap-2 h-full">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest px-2">Inventory Stream</p>
                <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[10px] text-emerald-300 overflow-auto scrollbar-hide border border-white/5">
                  <pre>{JSON.stringify(inventory, null, 2)}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MetricBox({ label, val, color, icon: Icon }) {
  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon size={16} />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-2xl font-black italic text-sharp ${color}`}>{val}</span>
    </div>
  );
}