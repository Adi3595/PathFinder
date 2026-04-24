import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { analyzeResume } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, Sparkles, AlertCircle, CheckCircle, Lightbulb, Trophy, ArrowRight } from 'lucide-react';
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
      
      // Save to Firestore
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 3 Flash</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Resume AI Analyzer</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Paste your resume text below and get deep insights, ATS optimization tips, and improvement areas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Resume Text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !resumeText.trim()}
              className="w-full mt-4 glass-button py-3 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileSearch className="w-5 h-5" />
                  Run Analysis
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Lightbulb className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-500">Awaiting Input</h3>
                <p className="text-slate-600 mt-2">Your analysis report will appear here once you run the scan.</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="glass-card p-8 text-center bg-brand-500/5 border-brand-500/20">
                  <div className="text-slate-400 font-medium mb-1">ATS Match Score</div>
                  <div className="text-6xl font-display font-bold gradient-text">{result.score}%</div>
                  <div className="mt-4 text-sm text-slate-400">
                    Your resume performs {result.score >= 80 ? 'exceptionally well' : result.score >= 60 ? 'fairly well' : 'needs significant improvements'}.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-1.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {result.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6 border-brand-500/20 bg-brand-500/5">
                    <h4 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-brand-400" />
                      ATS Optimization Tips
                    </h4>
                    <ul className="space-y-3">
                      {result.atsOptimizationTips.map((tip: string, i: number) => (
                        <li key={i} className="text-slate-300 text-sm bg-white/5 rounded-lg p-3 border border-white/5">
                          {tip}
                        </li>
                      ))}
                    </ul>
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
