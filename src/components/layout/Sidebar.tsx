import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Compass, User, LogOut, LayoutDashboard, BrainCircuit, FileText, Map, Rocket, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Sidebar() {
  const { user, login, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Resume Analyzer', icon: FileText, path: '/resume' },
    { label: 'Mock Interview', icon: BrainCircuit, path: '/interview' },
    { label: 'Skill Roadmap', icon: Map, path: '/roadmap' },
  ];

  if (!user) return null;

  return (
    <aside className="w-72 border-r border-white/5 bg-[#080808]/50 backdrop-blur-3xl flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight gradient-text">Pathfinder</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Navigation</p>
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-brand-400" : "text-slate-600 group-hover:text-slate-400")} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-4 h-4 text-brand-400" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="p-5 glass-card relative overflow-hidden group border border-brand-500/10">
          <div className="absolute top-0 right-0 w-24 h-24 brand-gradient opacity-10 blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150" />
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Career Goal</p>
          <p className="text-xs text-slate-400 leading-relaxed">Upgrade to Pro for unlimited AI sessions.</p>
        </div>

        <div className="mt-6 flex items-center justify-between px-2">
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-10 h-10 rounded-xl border border-white/10 group-hover:border-brand-500/50 transition-colors" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none mb-1">{user.displayName?.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-500 font-medium">Free Tier</span>
            </div>
          </Link>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors border border-transparent hover:border-red-400/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
