import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';
import { Database, AlertTriangle, ShieldCheck, ListFilter, AlertCircle } from 'lucide-react';

export default function S3Page() {
  const [activeTab, setActiveTab] = useState('problematic'); // 'problematic' or 'all'
  const { findings, inventory, loading } = useSecurity();

  if (loading) return null;

  const s3Findings = findings.filter(f => f.service === "S3");
  const allBuckets = inventory?.s3_buckets || [];

  // Filter primary "Problematic" list
  const problematicBuckets = allBuckets.filter(bucket => 
    s3Findings.some(f => f.resource_id === bucket.bucket_name)
  );

  const displayList = activeTab === 'problematic' ? problematicBuckets : allBuckets;

  // Helper for border colors based on severity
  const getBorderColor = (issues) => {
    if (issues.length === 0) return 'border-white/5';
    const topSev = issues[0].severity;
    if (topSev === 'CRITICAL') return 'border-red-500/20';
    if (topSev === 'HIGH') return 'border-orange-500/20';
    return 'border-yellow-500/20'; // Medium/Low
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-10">
      <header className="mb-12 flex justify-between items-end border-l border-white/10 pl-6">
        <div>
          <p className="text-[10px] font-mono text-slate-600 tracking-[0.6em] uppercase">
            Data_Privacy_Layer // S3_Node_Audit
          </p>
        </div>
        
        {/* Minimalist HUD Toggle */}
        <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('problematic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'problematic' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <AlertCircle size={12} /> Problematic ({problematicBuckets.length})
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <ListFilter size={12} /> Total Audit ({allBuckets.length})
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {displayList.map((bucket, i) => {
            const bucketIssues = s3Findings.filter(f => f.resource_id === bucket.bucket_name);
            const isVulnerable = bucketIssues.length > 0;
            
            return (
              <motion.div 
                key={`${activeTab}-${bucket.bucket_name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-[#0c0c0e] border p-10 rounded-[2rem] flex flex-col h-[380px] transition-all ${getBorderColor(bucketIssues)}`}
              >
                <div className="flex justify-between items-start h-16 mb-6">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="min-w-[48px] h-[48px] bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center">
                      <Database size={20} className="text-slate-400" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-lg font-bold text-white tracking-tight truncate w-full uppercase">
                        {bucket.bucket_name}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-600 tracking-widest mt-1">NODE: {bucket.region || 'GLOBAL'}</p>
                    </div>
                  </div>
                  
                  {isVulnerable ? (
                    <span className="whitespace-nowrap text-[9px] font-black text-white bg-white/10 px-3 py-1 rounded-md tracking-tighter uppercase">
                      {bucketIssues[0].severity} RISK
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={12} /> Stable Node
                    </span>
                  )}
                </div>

                {/* Findings Section - Properly Contained */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                  {isVulnerable ? (
                    <div className="space-y-4">
                      {bucketIssues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-3 border-l border-white/20 pl-4 py-1">
                          <AlertTriangle size={12} className="text-slate-500 mt-0.5 shrink-0" />
                          <p className="text-[11px] font-medium text-slate-400 italic tracking-tight leading-relaxed uppercase">
                            {issue.issue}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 h-full opacity-30">
                      <ShieldCheck size={14} className="text-slate-500" />
                      <p className="text-[10px] font-mono text-slate-500 italic uppercase">Security Baseline Maintained</p>
                    </div>
                  )}
                </div>

                {/* Metrics Section */}
                <div className="pt-8 border-t border-white/[0.03] grid grid-cols-4 gap-4">
                  <StatusItem label="BPA" active={!bucketIssues.some(f => f.issue.includes("Block Public Access"))} />
                  <StatusItem label="ACL" active={!bucketIssues.some(f => f.issue.includes("ACL"))} />
                  <StatusItem label="POLICY" active={!bucketIssues.some(f => f.issue.includes("policy"))} />
                  <StatusItem label="ENCRYPT" active={!bucketIssues.some(f => f.issue.includes("encrypted"))} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusItem({ label, active }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none">{label}</span>
      <span className={`text-[10px] font-bold tracking-tighter ${active ? 'text-slate-500' : 'text-white underline underline-offset-8 decoration-slate-800'}`}>
        {active ? 'STABLE' : 'BREACHED'}
      </span>
    </div>
  );
}