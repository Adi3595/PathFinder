import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateInterviewQuestion, generateInterviewFeedback } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Send, 
  User, 
  Sparkles, 
  Trophy, 
  ChevronRight, 
  Target, 
  Video, 
  RefreshCcw, 
  Zap, 
  Mic,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export function MockInterview() {
  const { user } = useAuth();
  const [role, setRole] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [interviewId, setInterviewId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const startInterview = async () => {
    if (!role.trim()) return;
    setLoading(true);
    try {
      const firstQuestion = await generateInterviewQuestion(role, []);
      const newInterview = {
        userId: user?.uid,
        role,
        status: 'ongoing',
        transcript: [{ role: 'ai', content: firstQuestion, timestamp: new Date().toISOString() }],
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'interviews'), newInterview);
      setInterviewId(docRef.id);
      setTranscript(newInterview.transcript);
      setIsStarted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || loading) return;
    
    const newUserMsg = { role: 'user', content: userInput, timestamp: new Date().toISOString() };
    const updatedTranscript = [...transcript, newUserMsg];
    setTranscript(updatedTranscript);
    setUserInput('');
    setLoading(true);

    try {
      if (updatedTranscript.filter(t => t.role === 'user').length >= 5) {
        const interviewFeedback = await generateInterviewFeedback(role, updatedTranscript);
        setFeedback(interviewFeedback);
        await updateDoc(doc(db, 'interviews', interviewId), {
          status: 'completed',
          transcript: updatedTranscript,
          feedback: interviewFeedback
        });
      } else {
        const nextQuestion = await generateInterviewQuestion(role, updatedTranscript);
        const newAiMsg = { role: 'ai', content: nextQuestion, timestamp: new Date().toISOString() };
        const finalTranscript = [...updatedTranscript, newAiMsg];
        setTranscript(finalTranscript);
        await updateDoc(doc(db, 'interviews', interviewId), {
          transcript: finalTranscript
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-card p-12 max-w-2xl w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 brand-gradient opacity-10 blur-[100px] -mt-32" />
          
          <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
            <BrainCircuit className="w-10 h-10 text-purple-400" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">Interview <span className="gradient-text italic">Simulation</span></h1>
          <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">Articulate your career destination. Our engine will calibrate a psychometric session based on industry benchmarks.</p>
          
          <div className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Machine Learning Engineer"
                className="w-full bg-[#080808] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all font-medium text-lg"
              />
            </div>
            
            <button
              onClick={startInterview}
              disabled={loading || !role.trim()}
              className="w-full brand-gradient py-5 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  Initialize Pro Session
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-2">Analysis <span className="gradient-text italic">Report</span></h2>
              <p className="text-slate-500 font-medium">Session metrics for {role} role at high-stakes level.</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="glass-button bg-white/5 border-white/10 px-8 flex items-center gap-3 hover:bg-white/10"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Engine
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 brand-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Overall Score</p>
              <div className="text-7xl font-display font-bold gradient-text">{feedback.overallScore}%</div>
            </div>
            <div className="glass-card p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Technical Strength</p>
              <div className="text-7xl font-display font-bold text-indigo-400">{feedback.technicalScore}%</div>
            </div>
            <div className="glass-card p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Soft Components</p>
              <div className="text-7xl font-display font-bold text-purple-400">{feedback.communicationScore}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 glass-card p-10">
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Strategic Executive Feedback
              </h3>
              <p className="text-slate-400 leading-relaxed text-lg font-medium mb-8">{feedback.summary}</p>
              
              <div className="h-[1px] w-full bg-white/5 mb-8" />
              
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Critical Improvement Vectors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.improvementAreas.map((area: string, i: number) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-slate-300 font-medium flex items-start gap-3 group hover:bg-white/5 transition-all">
                    <ArrowRight className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 glass-card p-8 bg-brand-500/5 border-indigo-500/20">
               <Trophy className="w-10 h-10 text-brand-400 mb-6" />
               <h4 className="text-xl font-display font-bold text-white mb-3">AI Recommendation</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                 Your technical depth is impressive, but you lack structural storytelling in behavioral responses. 
               </p>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-brand-300 font-bold uppercase tracking-widest text-center">
                 Master the STAR Method
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 h-[calc(100vh-2rem)] flex flex-col py-6">
      <header className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border border-indigo-500/20">
            <Video className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl tracking-tight">AI Interviewer</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Active Simulation: {role}
              </p>
            </div>
          </div>
        </div>
        <div className="px-5 py-2 glass rounded-2xl border-white/5 flex items-center gap-4">
           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Progress</span>
           <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(transcript.filter(t => t.role === 'user').length / 5) * 100}%` }}
                className="h-full brand-gradient" 
              />
           </div>
           <span className="text-xs font-bold text-white">{transcript.filter(t => t.role === 'user').length}/5</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-6 pb-24 space-y-10 scrollbar-hide px-4">
        {transcript.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex gap-6 max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all duration-500",
              msg.role === 'user' ? "brand-gradient border-white/20 shadow-2xl" : "bg-[#0c0c0c] border-white/5"
            )}>
              {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <BrainCircuit className="w-6 h-6 text-indigo-400" />}
            </div>
            <div className={cn(
              "p-7 rounded-[2.5rem] text-[15px] leading-relaxed font-medium shadow-2xl relative group",
              msg.role === 'user' 
                ? "brand-gradient text-white rounded-tr-none" 
                : "bg-[#0c0c0c] border border-white/5 text-slate-300 rounded-tl-none"
            )}>
              {msg.content}
              <div className={cn(
                 "absolute -bottom-6 text-[9px] font-bold uppercase tracking-widest text-slate-600",
                 msg.role === 'user' ? "right-2" : "left-2"
              )}>
                {msg.role === 'user' ? 'Candidate' : 'Interviewer Bot'}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-6 max-w-[80%]">
             <div className="w-12 h-12 rounded-2xl bg-[#0c0c0c] border border-white/5 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
             </div>
             <div className="p-7 rounded-[2.5rem] rounded-tl-none bg-[#0c0c0c] border border-white/5 flex gap-1.5 items-center">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce" />
                  <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-2 italic">Processing cognitive response...</span>
             </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-[calc(18rem+2rem)] right-12 z-20">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 brand-gradient opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500 rounded-[2.5rem]" />
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Articulate your professional response..."
            className="w-full bg-[#080808]/80 backdrop-blur-3xl border border-white/5 px-10 py-6 pr-32 rounded-[2.5rem] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-medium text-lg"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
             <button className="p-3 text-slate-500 hover:text-indigo-400 transition-colors">
                <Mic className="w-6 h-6" />
             </button>
             <button
              onClick={handleSend}
              disabled={loading || !userInput.trim()}
              className="p-4 brand-gradient rounded-2xl text-white transition-all disabled:opacity-50 disabled:grayscale shadow-xl hover:scale-105 active:scale-95"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
