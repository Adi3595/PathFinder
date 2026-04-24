import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Rocket, BrainCircuit, FileText, Target, BarChart3, Users, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export function Home() {
  const { user, login } = useAuth();

  const features = [
    {
      icon: FileText,
      title: "Resume Intelligence",
      description: "Advanced ATS parsing with multi-point growth feedback and role-specific optimization.",
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      icon: BrainCircuit,
      title: "Neuro-Mock Engine",
      description: "The most realistic AI interviewer, mimicking senior recruiter psychometric patterns.",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Target,
      title: "Strategic Maps",
      description: "Visual skill acquisition paths that evolve based on current market demands.",
      color: "from-emerald-500/20 to-emerald-600/20",
      iconColor: "text-emerald-400"
    },
    {
      icon: BarChart3,
      title: "Success Metrics",
      description: "Track your job-readiness probability with a real-time confidence score engine.",
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400"
    }
  ];

  return (
    <div className="relative isolate overflow-hidden min-h-screen sidebar-layout">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-48 w-96 h-96 brand-gradient opacity-20 blur-[120px] animate-pulse rounded-full" />
      <div className="absolute bottom-0 -right-48 w-96 h-96 brand-gradient opacity-20 blur-[120px] animate-pulse delay-700 rounded-full" />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-48 max-w-6xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-indigo-400">
            <Zap className="w-3 h-3 fill-indigo-400" />
            <span>Next-Gen Career Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9] text-white">
            Architect Your <br/>
            <span className="gradient-text italic">Dream Career.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The elite AI-native workspace for ambitious students to conquer high-stakes interviews and high-paying roles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={login}
              className="w-full sm:w-auto px-10 py-5 brand-gradient text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_-5px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 group"
            >
              Initialize Success
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 glass-button text-white/80 rounded-3xl font-bold text-lg hover:text-white transition-all">
              Explore Intelligence
            </button>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card p-10 group relative border-white/5 hover:border-white/10 transition-colors"
            >
              <div className={`absolute -top-12 -right-12 w-24 h-24 brand-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              
              <div className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 shadow-2xl transition-transform group-hover:scale-110 duration-500",
                feature.color
              )}>
                <feature.icon className={cn("w-7 h-7", feature.iconColor)} />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-32 relative">
         <div className="absolute inset-0 bg-white/[0.02] -skew-y-3" />
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
           {[
             { label: "Elite Members", value: "240k" },
             { label: "AI Sessions", value: "1.2m" },
             { label: "Avg Placement", value: "$42k" },
             { label: "Growth Factor", value: "x3.4" }
           ].map((stat) => (
             <div key={stat.label} className="text-center group">
               <div className="text-6xl md:text-7xl font-display font-bold text-white mb-2 tracking-tighter transition-transform group-hover:scale-110 duration-700">{stat.value}</div>
               <div className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">{stat.label}</div>
             </div>
           ))}
         </div>
      </section>
    </div>
  );
}
