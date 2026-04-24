import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateRoadmap } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, 
  Sparkles, 
  Brain, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  Target,
  Zap,
  ArrowUpRight,
  MousePointer2
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Roadmap() {
  const { user, profile } = useAuth();
  const [targetRole, setTargetRole] = useState('');
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim()) return;
    setGenerating(true);
    try {
      const skills = (profile?.skills || []).map((s: any) => s.name);
      const newRoadmap = await generateRoadmap(targetRole, skills);
      setRoadmap(newRoadmap);
      
      await addDoc(collection(db, 'roadmaps'), {
        userId: user?.uid,
        role: targetRole,
        ...newRoadmap,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-emerald-500/20">
          <Map className="w-3 h-3" />
          <span>Strategic Skill Acquisition</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-3">Strategic <span className="gradient-text italic">Roadmaps</span></h1>
        <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
          Define your ultimate career destination. Our AI backend backtracks from the top to create a logical, high-velocity acquisition path.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {!roadmap ? (
          <div className="max-w-xl">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-card p-1 overflow-hidden"
             >
               <div className="p-8 space-y-8">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                     <Target className="w-8 h-8 text-emerald-400" />
                  </div>
                  
                  <div>
                     <h3 className="text-2xl font-display font-bold text-white mb-2">Initialize <span className="gradient-text">Destination</span></h3>
                     <p className="text-slate-500 text-sm font-medium">Input your goal to initiate path calculation.</p>
                  </div>

                  <div className="space-y-4">
                     <input
                       type="text"
                       value={targetRole}
                       onChange={(e) => setTargetRole(e.target.value)}
                       placeholder="e.g. Senior Frontend Engineer at Netflix"
                       className="w-full bg-[#080808] border border-white/10 rounded-2xl p-5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-medium"
                     />
                     
                     <button
                       onClick={handleGenerate}
                       disabled={generating || !targetRole.trim()}
                       className="w-full brand-gradient py-5 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-95 group"
                     >
                       {generating ? (
                         <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                       ) : (
                         <>
                           <Zap className="w-5 h-5 fill-white" />
                           Generate Career Logic
                           <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </>
                       )}
                     </button>
                  </div>

                  <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                     <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Sparkles className="w-3 h-3" />
                       Optimization Note
                     </h4>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       Roadmaps are dynamically generated using live market job descriptions from top-tier tech hubs.
                     </p>
                  </div>
               </div>
             </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Overview */}
            <div className="lg:col-span-4 sticky top-32 h-fit">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="glass-card p-8 space-y-6"
               >
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">TARGET ROLE</p>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">{targetRole}</h2>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                       {roadmap.milestones.length * 3} Weeks
                    </div>
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                       {roadmap.milestones.length} Milestones
                    </div>
                 </div>
                 <div className="h-[1px] w-full bg-white/5" />
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Brain className="w-5 h-5 text-purple-400" />
                       <span className="text-white text-sm font-bold">Preparation Strategy</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      Calculated focus on technical depth and project implementation over theoretical study.
                    </p>
                 </div>
                 <button 
                  onClick={() => setRoadmap(null)}
                  className="w-full glass-button text-slate-400 hover:text-white"
                 >
                   Reset Generator
                 </button>
               </motion.div>
            </div>

            {/* Main Roadmap Timeline */}
            <div className="lg:col-span-8 relative ml-6">
               <div className="absolute left-6 top-10 bottom-10 w-[1px] bg-gradient-to-b from-indigo-500/50 via-emerald-500/50 to-transparent" />
               
               <div className="space-y-12">
                 {roadmap.milestones.map((milestone: any, i: number) => (
                   <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-20"
                   >
                     {/* Step indicator */}
                     <div className="absolute left-0 top-0 w-12 h-12 rounded-3xl brand-gradient flex items-center justify-center border border-white/20 z-10 shadow-[0_0_20px_rgba(99,102,241,0.5)] group hover:scale-110 transition-transform">
                        <span className="text-xs font-bold text-white">{i + 1}</span>
                     </div>
                     
                     <div className="glass-card p-10 group hover:bg-white/[0.02] transition-all border-white/5">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-2xl font-display font-bold text-white tracking-tight mb-1">{milestone.title}</h3>
                            <div className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Estimated: {milestone.duration}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <ArrowUpRight className="w-5 h-5 text-slate-400" />
                          </div>
                        </div>

                        <p className="text-slate-400 text-base leading-relaxed mb-8 font-medium">
                          {milestone.description}
                        </p>

                        {milestone.resources && (
                          <div className="p-6 bg-[#080808] rounded-2xl border border-white/5">
                             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <BookOpen className="w-3 h-3 text-brand-400" />
                                Strategic Resources
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {milestone.resources.map((res: string, j: number) => (
                                 <div key={j} className="flex items-center gap-3 text-xs text-brand-300 font-bold hover:text-white cursor-pointer group/item">
                                    <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                                    <span className="truncate">{res}</span>
                                 </div>
                               ))}
                             </div>
                          </div>
                        )}
                     </div>
                   </motion.div>
                 ))}

                 {/* Success Final Step */}
                 <div className="relative pl-20">
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-3xl bg-emerald-500 flex items-center justify-center border border-white/20 z-10 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                       <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="glass-card p-10 bg-emerald-500/5 border-emerald-500/20 border-dashed">
                       <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">Destination Locked</h3>
                       <p className="text-slate-400 font-medium leading-relaxed max-w-lg">
                          Upon reaching this milestone, your profile metrics will align with {targetRole} requirements at top-tier firms.
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
