"use client";

import { motion } from "framer-motion";
import { 
  Play, 
  FileText, 
  Briefcase, 
  Download,
  Clock,
  ExternalLink,
  Youtube
} from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary">Ethereal</span> Workspace
        </h2>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
          AI-Powered Academic & Career Intelligence
        </p>
      </section>

      {/* Grid Layout Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (YouTube + Notes) */}
        <div className="lg:col-span-7 space-y-8 flex flex-col">
          
          {/* Section 1: YouTube Summarizer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex flex-col gap-6 relative overflow-hidden group border-white/10 p-8"
          >
            {/* Neon Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full group-hover:bg-cyan-500/30 transition-all duration-700 pointer-events-none" />
            
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Youtube className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">YouTube Summarizer</h3>
                <p className="text-[10px] text-cyan-400/80 font-black uppercase tracking-[0.2em] mt-1">Video to Knowledge Base</p>
              </div>
            </div>

            <div className="relative z-10 mt-2">
              <input 
                type="text" 
                placeholder="Paste YouTube Link Here..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-white/20 font-bold backdrop-blur-md shadow-inner"
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 hover:scale-105 text-black rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer transition-all duration-300">
                <Play className="w-5 h-5 fill-black" />
              </button>
            </div>
          </motion.div>

          {/* Section 2: AI Notes Maker */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-card flex flex-col gap-6 relative overflow-hidden group border-white/10 flex-1 p-8"
          >
            {/* Neon Accent */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-magenta-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">AI Notes Maker</h3>
                  <p className="text-[10px] text-purple-400/80 font-black uppercase tracking-[0.2em] mt-1">Recent Extraction</p>
                </div>
              </div>
              
              <button className="px-5 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border border-purple-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer">
                <Download className="w-4 h-4" />
                Export to PDF
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-sm text-white/60 leading-relaxed font-medium z-10 relative custom-scrollbar overflow-y-auto min-h-[200px] shadow-inner backdrop-blur-md">
              <div className="space-y-5">
                <h4 className="text-white font-black text-base uppercase tracking-tight">Key Concepts: Quantum Entanglement</h4>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="leading-relaxed">Particles that interact can become permanently correlated, affecting each other instantaneously regardless of distance.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="leading-relaxed">Einstein famously referred to this phenomenon as "spooky action at a distance."</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="leading-relaxed">Fundamental to quantum computing operations and unbreakable quantum cryptography protocols.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column (Job Searcher) */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">

          {/* Section 3: AI Job Searcher */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card flex-1 flex flex-col gap-6 relative overflow-hidden group border-white/10 p-8"
          >
             {/* Neon Accent */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full transition-all duration-700 pointer-events-none" />

            <div className="flex flex-col gap-1 z-10 shrink-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Briefcase className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">AI Job Feed</h3>
                  <p className="text-[10px] text-amber-400/80 font-black uppercase tracking-[0.2em] mt-1">Matched to Profile</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 z-10 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
              
              {/* Job Card 1 */}
              <div className="p-6 rounded-3xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group/job backdrop-blur-md flex flex-col shadow-inner">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-black text-lg mb-1 tracking-tight">MERN Stack Developer</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">TechNova Solutions</p>
                  </div>
                  <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]">98% Match</span>
                </div>
                <div className="flex items-center gap-5 text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-white/30" /> Remote</span>
                  <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-white/30" /> Full-Time</span>
                </div>
                <button className="w-full py-4 mt-auto bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 hover:from-amber-400 hover:via-amber-500 hover:to-amber-400 text-amber-500 hover:text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-500/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer">
                  Auto-Apply with Resume
                </button>
              </div>

               {/* Job Card 2 */}
               <div className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group/job backdrop-blur-md flex flex-col shadow-inner">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-black text-lg mb-1 tracking-tight">Digital Marketing Spec.</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Aura Growth Agency</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black px-2 py-1 rounded-md uppercase tracking-wider">85% Match</span>
                </div>
                <div className="flex items-center gap-5 text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-white/30" /> Hybrid</span>
                  <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-white/30" /> Contract</span>
                </div>
                <button className="w-full py-4 mt-auto bg-black/50 hover:bg-amber-500 hover:text-black border border-white/10 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] text-white/50 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer">
                  Auto-Apply with Resume
                </button>
              </div>

            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
