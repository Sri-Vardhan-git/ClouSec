import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Hash, Zap } from 'lucide-react';

const severityMap = {
  CRITICAL: 'border-red-500/40 bg-red-500/5 text-red-400 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]',
  HIGH: 'border-orange-500/40 bg-orange-500/5 text-orange-400',
  MEDIUM: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-400',
};

export default function FindingCard({ finding }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`p-6 rounded-2xl border backdrop-blur-md ${severityMap[finding.severity] || 'border-white/10 bg-white/5'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <Zap className="w-4 h-4" /> {finding.severity}
        </div>
        <span className="text-[10px] px-2 py-1 rounded bg-black/30 border border-white/5">{finding.service}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-4 leading-tight">{finding.issue}</h3>
      <div className="space-y-2 text-sm opacity-60 font-mono">
        <div className="flex items-center gap-2"><Hash className="w-3 h-3" /> {finding.resource_id}</div>
        <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {finding.region}</div>
      </div>
    </motion.div>
  );
}