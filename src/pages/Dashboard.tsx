import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  Rocket, 
  BarChart3, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Clock, 
  Zap, 
  TrendingUp,
  BrainCircuit,
  FileText,
  Map,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function Dashboard() {
  const { user, profile } = useAuth();

  const activityData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 68 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 72 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 82 },
    { day: 'Sun', score: 90 },
  ];

  const quickTools = [
    { label: 'Resume Analyzer', icon: FileText, path: '/resume', color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Mock Interview', icon: BrainCircuit, path: '/interview', color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Skill Roadmap', icon: Map, path: '/roadmap', color: 'bg-green-500/10 text-green-400' },
    { label: 'Career Profile', icon: Rocket, path: '/profile', color: 'bg-orange-500/10 text-orange-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
        <p className="text-slate-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-400" />
          You're in the top 5% of job seekers this week. Keep going!
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Confidence Score</p>
                <h2 className="text-4xl font-display font-bold text-white">{profile?.confidenceScore || 0}%</h2>
              </div>
              <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-brand-400" />
              </div>
            </div>
            <div className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Skills Mastered</p>
                <h2 className="text-4xl font-display font-bold text-white">{profile?.skills?.length || 0}</h2>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              Preparation Progress
            </h3>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0c91e6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0c91e6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#0c91e6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-display font-bold text-white mb-4">Quick Tools</h3>
            <div className="space-y-3">
              {quickTools.map((tool) => (
                <Link 
                  key={tool.label}
                  to={tool.path}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.color}`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-300 font-medium group-hover:text-white">{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-brand-500/5 border-brand-500/20">
            <div className="flex items-center gap-2 text-brand-400 font-bold mb-3">
              <Lightbulb className="w-5 h-5" />
              AI Insight
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "Based on your recent mock interview, focusing on System Design patterns could increase your match rate for Senior roles by 15%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
