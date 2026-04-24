import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { analyzeResume } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { FileSearch, Sparkles, AlertCircle, CheckCircle, Lightbulb, Trophy, ArrowRight, Zap, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export function ResumeAnalyzer() {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    setError('');
    try {
      const analysis = await analyzeResume(resumeText);
      setResult(analysis);
      
      await addDoc(collection(db, 'resumeAnalyses'), {
        userId: user?.uid,
        ...analysis,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-indigo-500/20">
          <Zap className="w-3 h-3 fill-indigo-400" />
          <span>Neuro-Parsing Engine v2.4</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-3">Resume <span className="gradient-text italic">Laboratory</span></h1>
        <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
          Upload your semantic fingerprint. Our AI simulates recruitment bots to identify critical weaknesses in your ATS compliance.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-1 overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Plain Text Input</label>
                <div className="flex gap-1">
                   <div className="w-1 h-1 rounded-full bg-emerald-500" />
                   <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
                   <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
                </div>
              </div>
              
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here for structural analysis..."
                className="w-full h-[400px] bg-[#080808]/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-all resize-none font-mono leading-relaxed"
              />
              
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !resumeText.trim()}
                className="w-full brand-gradient py-4 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-95"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                    Scanning Patterns...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-5 h-5" />
                    Initiate Lab Scan
                  </>
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 relative">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass rounded-[2.5rem] border-dashed border-white/5"
              >
                <div className="w-24 h-24 rounded-3xl bg-white/[0.02] flex items-center justify-center mb-8 animate-float">
                  <Lightbulb className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-600 mb-2">Awaiting Intelligence</h3>
                <p className="text-slate-700 max-w-sm font-medium">Your semantic score and bot-compliance metrics will be rendered here.</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="glass-card p-10 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 brand-gradient opacity-10 blur-[100px] -mt-32" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 relative z-10">ATS COMPLIANCE SCORE</p>
                  <div className="text-8xl font-display font-bold text-white tracking-tighter relative z-10 text-glow">{result.score}%</div>
                  <div className="mt-6 flex items-center justify-center gap-3 relative z-10">
                     <span className={cn(
                       "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                       result.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                     )}>
                       {result.score >= 80 ? 'Optimal Performance' : 'Growth Required'}
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card p-8 group">
                    <h4 className="font-display font-bold text-white mb-6 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Semantic Strengths
                    </h4>
                    <ul className="space-y-4">
                      {result.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-slate-400 text-sm font-medium flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-8 group">
                    <h4 className="font-display font-bold text-white mb-6 flex items-center gap-3">
                      <Target className="w-5 h-5 text-orange-400" />
                      System Gaps
                    </h4>
                    <ul className="space-y-4">
                      {result.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="text-slate-400 text-sm font-medium flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 flex-shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="glass-card p-8 bg-brand-500/5 border-brand-500/20">
                  <h4 className="font-display font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-xs">
                    <Trophy className="w-5 h-5 text-brand-400" />
                    Optimization Roadblocks
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.atsOptimizationTips.map((tip: string, i: number) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-slate-300 font-medium leading-relaxed group hover:bg-white/5 transition-all">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
