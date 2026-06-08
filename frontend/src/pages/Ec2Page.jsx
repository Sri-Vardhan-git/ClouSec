import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Shield, Globe, Cpu, ChevronRight, Activity 
} from 'lucide-react';

export default function EC2Page() {
  const [activeTab, setActiveTab] = useState('hosts'); 
  const [findings, setFindings] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [findRes, invRes] = await Promise.all([
          axios.get('http://localhost:5000/findings?status=OPEN'),
          axios.get('http://localhost:5000/inventory')
        ]);
        setFindings(findRes.data.filter(f => f.service === "EC2"));
        setInventory(invRes.data);
      } catch (err) {
        console.error("Link Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#070708]">
      <div className="text-indigo-500 animate-pulse uppercase tracking-[0.5em] text-[10px] font-mono">Synchronizing Compute...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-10">
      {/* --- MINIMAL HUD HEADER --- */}
      <header className="mb-12 flex justify-between items-end border-l border-white/10 pl-6">
        <div>
          <p className="text-[10px] font-mono text-slate-600 tracking-[0.6em] uppercase">
            Compute_Architecture // Hardware_Status
          </p>
        </div>
        
        <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('hosts')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'hosts' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <Server size={12} className="inline mr-2" /> Hosts
          </button>
          <button 
            onClick={() => setActiveTab('network')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'network' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <Shield size={12} className="inline mr-2" /> Network
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'hosts' ? (
          <motion.div key="hosts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {inventory?.ec2_instances.map(inst => (
              <HostCard 
                key={inst.instance_id} 
                instance={inst} 
                findings={findings.filter(f => f.resource_id === inst.instance_id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div key="network" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {inventory?.security_groups.map(sg => (
              <NetworkRow 
                key={sg.group_id} 
                sg={sg} 
                findings={findings.filter(f => f.resource_id === sg.group_id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function HostCard({ instance, findings }) {
  const hasIssues = findings.length > 0;
  
  return (
    <div className={`bg-[#0c0c0e] border p-10 rounded-[2.5rem] flex flex-col h-[380px] transition-all hover:bg-[#0e0e11] ${hasIssues ? 'border-red-900/20' : 'border-white/5'}`}>
      <div className="flex justify-between items-start h-16 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <Cpu size={24} className="text-slate-500" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight uppercase">{instance.instance_id}</h4>
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">{instance.type} // {instance.region}</p>
          </div>
        </div>
        
        {hasIssues && (
          <span className="text-[9px] font-black text-white bg-white/10 px-3 py-1 rounded-md tracking-tighter uppercase">
            {findings[0].severity} RISK
          </span>
        )}
      </div>

      {/* INNER LED MATRIX SECTION */}
      <div className="flex-1 space-y-3">
        <SecurityLED label="IMDSv1 Protocol" active={findings.some(f => f.issue.includes("IMDSv1"))} />
        <SecurityLED label="External Gateway" active={findings.some(f => f.issue.includes("public IP"))} />
        <SecurityLED label="EBS Encryption" active={findings.some(f => f.issue.includes("Unencrypted"))} />
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.03] flex justify-between items-center">
        <div className={`text-[8px] font-black px-3 py-1 rounded-full border ${instance.state === 'running' ? 'text-emerald-500/60 border-emerald-500/20' : 'text-slate-600 border-white/5'}`}>
          {instance.state.toUpperCase()}
        </div>
        <span className="text-[8px] font-mono text-slate-800 uppercase tracking-[0.3em]">Hardware_Verified</span>
      </div>
    </div>
  );
}

function SecurityLED({ label, active }) {
  return (
    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.03] group hover:border-white/10 transition-all">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-[9px] font-black tracking-widest ${active ? 'text-red-500' : 'text-emerald-500/40'}`}>
          {active ? 'VULNERABLE' : 'SECURE'}
        </span>
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
          active 
            ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse' 
            : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
        }`} />
      </div>
    </div>
  );
}

function NetworkRow({ sg, findings }) {
  const hasIssues = findings.length > 0;
  return (
    <div className={`bg-[#0c0c0e] border p-6 rounded-2xl flex items-center justify-between group transition-all ${hasIssues ? 'border-orange-500/20' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10">
          <Globe size={20} className="text-slate-400" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-tight">{sg.group_name}</h4>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-1">{sg.group_id}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {findings.map((f, i) => (
          <span key={i} className="text-[9px] font-black text-white bg-white/10 px-3 py-1 rounded-md uppercase italic">
            {f.issue}
          </span>
        ))}
        {!hasIssues && <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">SHIELDED</span>}
        <ChevronRight className="text-slate-800 group-hover:text-white transition-all transform group-hover:translate-x-1" size={18} />
      </div>
    </div>
  );
}