import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateInterviewQuestion, generateInterviewFeedback } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Send, User, Bot, Sparkles, Trophy, ChevronLeft, Target } from 'lucide-react';
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
        // End interview after 5 responses for demo
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
      <div className="max-w-2xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Interview Simulator</h1>
          <p className="text-slate-400 mb-8">Choose the role you're interviewing for and start practicing with our AI.</p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Engineer, Product Manager..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-display"
            />
            <button
              onClick={startInterview}
              disabled={loading || !role.trim()}
              className="w-full glass-button bg-brand-600 hover:bg-brand-500 py-4 text-white font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Initializing..." : "Start Interview Pro Session"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Interview Analysis</h2>
            <p className="text-slate-400">Great job completing your mock session for {role} role!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Overall Score</p>
              <div className="text-5xl font-display font-bold gradient-text">{feedback.overallScore}%</div>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Technical</p>
              <div className="text-4xl font-display font-bold text-blue-400">{feedback.technicalScore}%</div>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Soft Skills</p>
              <div className="text-4xl font-display font-bold text-purple-400">{feedback.communicationScore}%</div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Comprehensive Feedback
            </h3>
            <p className="text-slate-300 leading-relaxed mb-8">{feedback.summary}</p>
            
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-400" />
              Key Improvement Areas
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.improvementAreas.map((area: string, i: number) => (
                <li key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-slate-400">
                  {area}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center">
             <button onClick={() => window.location.reload()} className="glass-button text-white font-bold px-8">Practice Again</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-120px)] flex flex-col">
      <header className="flex items-center justify-between py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white leading-tight">AI Interviewer</h2>
            <p className="text-xs text-brand-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Live Session: {role}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Questions: {transcript.filter(t => t.role === 'user').length} / 5
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-8 space-y-6 scrollbar-hide">
        {transcript.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border",
              msg.role === 'user' ? "bg-brand-600 border-brand-500" : "bg-white/10 border-white/10"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-400" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' ? "bg-brand-600 text-white rounded-tr-none" : "glass text-slate-200 rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-400" />
             </div>
             <div className="p-4 rounded-2xl glass flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]" />
             </div>
          </div>
        )}
      </div>

      <div className="py-4">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="w-full glass bg-slate-900 px-6 py-4 pr-16 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all shadow-2xl"
          />
          <button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className="absolute right-2 top-2 p-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-2 uppercase tracking-widest font-bold">
          Speak clearly and professionally for best results
        </p>
      </div>
    </div>
  );
}
