import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, Server, Lock, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ec2', icon: Server, label: 'Compute' },
  { path: '/s3', icon: Lock, label: 'Storage' },
  { path: '/iam', icon: Users, label: 'Identity' }
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[100px] flex flex-col items-center py-12 z-50">
      {/* Top Logo - Floating independently */}
      <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-2xl shadow-indigo-500/20 mb-auto">
        <Shield size={22} className="text-indigo-500" />
      </div>

      {/* Navigation Elements - Spread Apart */}
      <nav className="flex-1 flex flex-col justify-center gap-12">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="relative group flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isActive 
                  ? 'bg-white/10 border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                  : 'bg-white/[0.03] border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              {/* Floating Label - Sharp & Minimal */}
              <div className="absolute left-20 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                <div className="bg-[#0c0c0e] border border-white/10 px-4 py-2 rounded-xl shadow-2xl">
                  <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Spacer to keep nav centered */}
      <div className="mt-auto h-[66px] invisible" />
    </aside>
  );
}