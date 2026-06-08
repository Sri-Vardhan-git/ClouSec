import { motion } from 'framer-motion';
import { Shield, Server, Lock, Users, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'text-white' },
  { name: 'EC2', path: '/ec2', icon: Server, color: 'text-blue-400' },
  { name: 'S3', path: '/s3', icon: Lock, color: 'text-emerald-400' },
  { name: 'IAM', path: '/iam', icon: Users, color: 'text-purple-400' },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] relative">
      {/* Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />

      {/* Sidebar */}
      <motion.aside initial={{ x: -100 }} animate={{ x: 0 }} className="w-64 glass-card border-r border-white/5 p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <Shield className="text-indigo-500 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tighter">CLOUSEC</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.path ? 'bg-indigo-500/10 text-white border border-indigo-500/20' : 'text-slate-400 hover:text-white'}`}>
                <item.icon className={`w-5 h-5 ${pathname === item.path ? item.color : ''}`} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </motion.aside>

      <main className="flex-1 overflow-y-auto p-10 z-10">{children}</main>
    </div>
  );
}