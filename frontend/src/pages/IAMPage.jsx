import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';
import { Key, User, ShieldAlert, Fingerprint, Database, ListFilter, AlertCircle } from 'lucide-react';

export default function IAMPage() {
  const [activeTab, setActiveTab] = useState('problematic'); // 'problematic' or 'all'
  const { findings, inventory, loading } = useSecurity();

  if (loading) return null;

  const iamFindings = findings.filter(f => f.service === "IAM");
  
  // Create the secondary "All Entities" list
  const allEntities = [
    ...(inventory?.iam_roles || []).map(r => ({ ...r, name: r.role_name, type: 'ROLE' })),
    ...(inventory?.iam_users || []).map(u => ({ ...u, name: u.user_name, type: 'USER' }))
  ];

  // Filter primary "Problematic" list
  const problematicEntities = allEntities.filter(entity => 
    iamFindings.some(f => f.resource_id === entity.name)
  );

  const displayList = activeTab === 'problematic' ? problematicEntities : allEntities;

  return (
    <div className="max-w-7xl mx-auto py-16 px-10">
      <header className="mb-12 flex justify-between items-end border-l border-white/10 pl-6">
        <div>
          <p className="text-[10px] font-mono text-slate-600 tracking-[0.6em] uppercase">
            Identity_Governance // Privilege_Audit
          </p>
        </div>
        
        {/* Minimalist Tab Toggle */}
        <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('problematic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'problematic' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <AlertCircle size={12} /> Problematic ({problematicEntities.length})
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <ListFilter size={12} /> Total Audit ({allEntities.length})
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {displayList.length > 0 ? displayList.map((entity, i) => {
            const entityIssues = iamFindings.filter(f => f.resource_id === entity.name);
            const isVulnerable = entityIssues.length > 0;
            
            return (
              <motion.div 
                key={`${activeTab}-${entity.name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-[#0c0c0e] border p-10 rounded-[2rem] flex flex-col h-[350px] transition-colors ${isVulnerable ? 'border-purple-500/20' : 'border-white/5'}`}
              >
                {/* Header Section */}
                <div className="flex justify-between items-start h-16 mb-6">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="min-w-[48px] h-[48px] bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center">
                      {entity.type === 'ROLE' ? <Key size={20} className="text-slate-400" /> : <User size={20} className="text-slate-400" />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-lg font-bold text-white tracking-tight truncate w-full uppercase">
                        {entity.name}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-600 tracking-widest mt-1">ENTITY_TYPE: {entity.type}</p>
                    </div>
                  </div>
                  
                  {isVulnerable && (
                    <span className="whitespace-nowrap text-[9px] font-black text-purple-400 bg-purple-400/10 px-3 py-1 rounded-md tracking-tighter uppercase border border-purple-500/20">
                      {entityIssues[0].severity} RISK
                    </span>
                  )}
                </div>

                {/* Findings Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                  {isVulnerable ? (
                    <div className="space-y-4">
                      {entityIssues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-3 border-l border-white/20 pl-4 py-1">
                          <ShieldAlert size={12} className="text-slate-500 mt-0.5 shrink-0" />
                          <p className="text-[11px] font-medium text-slate-400 italic tracking-tight leading-relaxed uppercase">
                            {issue.issue}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 h-full opacity-30">
                      <Fingerprint size={14} className="text-slate-500" />
                      <p className="text-[10px] font-mono text-slate-500 italic uppercase">Permissions Verified // Stable</p>
                    </div>
                  )}
                </div>

                {/* Metrics Section */}
                <div className="pt-8 border-t border-white/[0.03] flex justify-between items-end">
                  <div className="flex gap-10">
                    <StatusMetric label="Wildcard_Check" active={!entityIssues.some(f => f.issue.includes("*"))} />
                    <StatusMetric label="Governance" active={!isVulnerable} />
                  </div>
                  <div className="flex items-center gap-2 opacity-20">
                    <Database size={10} />
                    <span className="text-[8px] font-mono text-white uppercase tracking-[0.3em]">CLOUSEC_DB</span>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-2 py-40 text-center">
              <p className="text-[10px] font-mono text-slate-700 tracking-[0.5em] uppercase italic">No identity threats detected in this layer.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusMetric({ label, active }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none">{label}</span>
      <span className={`text-[10px] font-bold tracking-tighter ${active ? 'text-slate-500' : 'text-purple-400 underline underline-offset-8 decoration-slate-800'}`}>
        {active ? 'STABLE' : 'PERMISSIVE'}
      </span>
    </div>
  );
}