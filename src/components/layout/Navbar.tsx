import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Compass, User, LogOut, LayoutDashboard, BrainCircuit, FileText, Map, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { user, login, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Resume', icon: FileText, path: '/resume' },
    { label: 'Interview', icon: BrainCircuit, path: '/interview' },
    { label: 'Roadmap', icon: Map, path: '/roadmap' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30 group-hover:bg-brand-500/30 transition-colors">
            <Compass className="w-6 h-6 text-brand-400" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight gradient-text">Pathfinder AI</span>
        </Link>

        {user ? (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 group">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-500/25 active:scale-95"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
