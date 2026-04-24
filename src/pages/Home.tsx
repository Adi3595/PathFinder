import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Rocket, BrainCircuit, FileText, Target, BarChart3, Users, Sparkles, ChevronRight } from 'lucide-react';

export function Home() {
  const { user, login } = useAuth();

  const features = [
    {
      icon: FileText,
      title: "Resume Analyzer",
      description: "Get AI-powered feedback on your resume & ATS optimization tips in seconds.",
      color: "text-blue-400"
    },
    {
      icon: BrainCircuit,
      title: "AI Mock Interviews",
      description: "Practice with our advanced AI interviewer tailored for your specific target role.",
      color: "text-purple-400"
    },
    {
      icon: Target,
      title: "Skill Roadmaps",
      description: "Personalized learning paths designed to bridge the gap between you and your dream job.",
      color: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Practice Generator",
      description: "Daily learning plans and aptitude generators to keep you sharp and interview-ready.",
      color: "text-orange-400"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-32 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-brand-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Career Transformation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Crack High Paying Jobs <br />
            <span className="gradient-text">With AI Intelligence</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The all-in-one success platform for students and freshers to become job-ready using state-of-the-art Generative AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={login}
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              Get Job Ready Now
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 glass text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="px-4 py-24 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:bg-white/10 transition-all cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="px-4 py-24 border-y border-white/5 glass-surface">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24">
          {[
            { label: "Active Students", value: "10K+" },
            { label: "AI Mock Interviews", value: "50K+" },
            { label: "Average CTC Boost", value: "45%" },
            { label: "Success Rate", value: "92%" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
