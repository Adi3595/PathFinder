import { motion } from 'motion/react';
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
  Lightbulb,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

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
    { label: 'Resume Analyzer', icon: FileText, path: '/resume', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Mock Interview', icon: BrainCircuit, path: '/interview', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Skill Roadmap', icon: Map, path: '/roadmap', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
            Intelligence <span className="gradient-text italic">Overview</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
              System: Syncing
            </span>
            <p className="text-slate-500 text-sm font-medium">Last analysis 4h ago</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Weekly Growth</span>
            <div className="flex items-center gap-2">
               <ArrowUpRight className="w-4 h-4 text-emerald-400" />
               <span className="text-xl font-display font-bold text-white">+12.4%</span>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <Link to="/profile" className="w-12 h-12 rounded-2xl brand-gradient p-0.5 group transition-transform hover:scale-105">
             <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#050505]">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                )}
             </div>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
        {/* Main Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 lg:col-span-2 glass-card p-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 brand-gradient opacity-10 blur-[80px] -mr-32 -mt-32" />
          <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Career Velocity</h3>
                <p className="text-slate-500 text-xs font-medium">Calculated based on 12 key skill vectors</p>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-slate-300 text-xs font-bold">
                Level 4 Seeker
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Confidence</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white tracking-tighter">{profile?.confidenceScore || 0}%</span>
                  <span className="text-xs text-emerald-400 font-bold">High</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Skills</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white tracking-tighter">{profile?.skills?.length || 0}</span>
                  <span className="text-xs text-brand-400 font-bold">Verified</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sessions</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white tracking-tighter">8</span>
                  <span className="text-xs text-purple-400 font-bold">Completed</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#velocityGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Action Sidebar */}
        <div className="space-y-8 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 bg-gradient-to-br from-indigo-900/20 to-transparent border-indigo-500/20"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center shadow-2xl">
                  <BrainCircuit className="w-6 h-6 text-white" />
               </div>
               <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">AI Mock Ready</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              You haven't practiced behavioral questions this week. Your performance risk is increasing.
            </p>
            <Link to="/interview" className="w-full glass-button brand-gradient border-none py-4 text-center hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-shadow block">
              Start Intensive Session
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex-1"
          >
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-6">Smart Tools</h4>
            <div className="space-y-4">
              {quickTools.map((tool) => (
                <Link 
                  key={tool.label}
                  to={tool.path}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", tool.bg)}>
                      <tool.icon className={cn("w-5 h-5", tool.color)} />
                    </div>
                    <span className="text-white font-semibold text-sm">{tool.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 glass-card p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Target className="w-5 h-5 text-emerald-400" />
               Job Match Analysis
            </h3>
            <div className="space-y-6">
               {[
                 { role: 'Frontend Engineer', fit: 92, status: 'Ideal Match', color: 'bg-emerald-500' },
                 { role: 'Product Designer', fit: 74, status: 'Good Potential', color: 'bg-indigo-500' },
                 { role: 'Backend Developer', fit: 45, status: 'Skill Gap High', color: 'bg-orange-500' }
               ].map((match) => (
                 <div key={match.role} className="space-y-2">
                   <div className="flex justify-between items-end px-1">
                      <div>
                         <span className="text-sm font-bold text-white">{match.role}</span>
                         <span className="ml-3 text-[10px] font-bold text-slate-500 uppercase">{match.status}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{match.fit}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${match.fit}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={cn("h-full rounded-full", match.color)} 
                      />
                   </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-card p-8 bg-brand-500/5 border-brand-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 brand-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-1000" />
            <div className="relative z-10">
               <Lightbulb className="w-8 h-8 text-brand-400 mb-6" />
               <h4 className="text-lg font-bold text-white mb-3">AI Projection</h4>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  "Based on current velocity, you are projected to clear top-tier technical rounds within <span className="text-brand-400">14 days</span>. Focus on Graph Algorithms."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
