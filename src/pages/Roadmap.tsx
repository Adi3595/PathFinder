import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateRoadmap } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Map, Sparkles, Brain, BookOpen, Clock, ExternalLink, ChevronRight, Target } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Personalized Skill Roadmap</h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Bridging the gap between your current skills and your target role with an AI-curated milestone plan.
        </p>
      </header>

      {!roadmap ? (
        <div className="max-w-xl">
           <div className="glass-card p-8">
             <div className="flex items-center gap-3 text-brand-400 font-bold mb-6">
                <Target className="w-6 h-6" />
                Define Your Destination
             </div>
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">What is your dream job role?</label>
                   <input
                     type="text"
                     value={targetRole}
                     onChange={(e) => setTargetRole(e.target.value)}
                     placeholder="e.g. Fullstack Developer, Data Scientist..."
                     className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-display"
                   />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating || !targetRole.trim()}
                  className="w-full glass-button bg-brand-600 hover:bg-brand-500 py-4 text-white font-bold flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                      Designing Your Path...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Career Roadmap
                    </>
                  )}
                </button>
             </div>
           </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6 border-brand-500/20 bg-brand-500/5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Targeting</p>
                <h2 className="text-2xl font-display font-bold text-white">{targetRole}</h2>
                <div className="mt-4 flex items-center gap-2 text-brand-400 text-sm">
                  <Clock className="w-4 h-4" />
                  Estimated: {roadmap.milestones.length * 2} - {roadmap.milestones.length * 3} Weeks
                </div>
              </div>
              
              <div className="glass-card p-6">
                 <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Preparation Strategy
                 </h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   Focus on building small end-to-end projects for each milestone. Consistency is your biggest ally.
                 </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-6">
                {roadmap.milestones.map((milestone: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 relative"
                  >
                    {/* Line */}
                    {i !== roadmap.milestones.length - 1 && (
                      <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-gradient-to-b from-brand-500/50 to-transparent" />
                    )}
                    
                    <div className="w-12 h-12 rounded-full glass border-brand-500/30 flex items-center justify-center flex-shrink-0 z-10">
                      <div className="text-brand-400 font-display font-bold">{i + 1}</div>
                    </div>
                    
                    <div className="flex-1 glass-card p-6 group hover:bg-white/10 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-display font-bold text-white mb-1">{milestone.title}</h3>
                          <div className="text-xs text-brand-400 font-bold uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {milestone.duration}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        {milestone.description}
                      </p>
                      
                      {milestone.resources && (
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <BookOpen className="w-3 h-3" />
                              Recommended Resources
                           </p>
                           <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                             {milestone.resources.map((res: string, j: number) => (
                               <li key={j} className="text-xs text-brand-300 flex items-center gap-2 hover:text-brand-200 cursor-pointer">
                                 <ExternalLink className="w-3 h-3" />
                                 {res}
                               </li>
                             ))}
                           </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 p-8 glass rounded-3xl border-brand-500/20 text-center">
                 <h3 className="text-xl font-display font-bold text-white mb-2">Roadmap Locked & Loaded</h3>
                 <p className="text-slate-400 mb-6 max-w-lg mx-auto">This plan has been added to your profile. You can track your progress in the dashboard.</p>
                 <button onClick={() => window.location.href='/dashboard'} className="glass-button bg-brand-600 text-white font-bold px-8">Go to Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
