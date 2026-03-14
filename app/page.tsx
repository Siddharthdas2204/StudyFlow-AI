"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Brain, BookOpen, Calculator, Code, Rocket, ArrowRight, Github, Chrome, Zap, Youtube, Briefcase } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  { icon: Bot, title: "Socrates AI Tutor", desc: "Interactive study coaching with voice & context awareness." },
  { icon: Brain, title: "Vision Doubt Solver", desc: "Upload high-res photos for instant step-by-step logic." },
  { icon: BookOpen, title: "Notes Maker", desc: "Convert texts into beautiful structured markdown." },
  { icon: Youtube, title: "YouTube Summarizer", desc: "Extract knowledge bases directly from any YouTube video." },
  { icon: Briefcase, title: "AI Job Searcher", desc: "Get automatically matched to top tech roles using your resume." },
  { icon: Rocket, title: "Study Roadmap", desc: "Architectural learning paths designed for your goals." }
];

const TwinklingStars = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(60)].map((_, i) => (
        <motion.div
           key={i}
           className="absolute bg-white rounded-full"
           style={{
             width: Math.random() * 3 + 1 + 'px',
             height: Math.random() * 3 + 1 + 'px',
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
             boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
           }}
           animate={{
             opacity: [0, 0.7, 0],
             scale: [0.5, 1.2, 0.5],
           }}
           transition={{
             duration: Math.random() * 3 + 2,
             repeat: Infinity,
             delay: Math.random() * 5,
           }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center selection:bg-primary/30 min-h-screen relative overflow-hidden">
      <TwinklingStars />
      {/* Navbar */}
      <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center bg-transparent relative z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="p-3 glass rounded-2xl group-hover:scale-110 transition-transform duration-500 neon-halo">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter">STUDYFLOW<span className="text-primary font-black">.ai</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-white/50"
        >
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
          <Link href="/login" className="px-8 py-3 glass rounded-full hover:bg-white/[0.05] transition-all border-white/10 text-white">
            Connect
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative mt-20 md:mt-40 px-6 flex flex-col items-center text-center max-w-6xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-6 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10 border-primary/20 flex items-center gap-3 backdrop-blur-3xl"
        >
          <Sparkles className="w-4 h-4" />
          <span>Genesis Of Academic Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tight mb-12 leading-[0.9] text-white"
        >
          Architect Your <br />
          <span className="text-gradient">Future.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-2xl text-white/40 mb-16 max-w-3xl leading-relaxed font-light"
        >
          The world's most sophisticated AI study ecosystem. Immerse yourself in a workspace 
          designed for elite performance and cognitive mastery.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link href="/dashboard" className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 hover:scale-105 transition-all flex items-center justify-center gap-3 group relative overflow-hidden">
            <span className="relative z-10 text-white">Initialize System</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          <Link href="#features" className="px-10 py-5 glass text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3 border-white/10 group">
            Explore Core
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.div 
        id="platform"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="mt-40 grid grid-cols-2 lg:grid-cols-4 gap-12 border-y border-white/[0.05] py-20 w-full max-w-6xl px-12 glass z-10 relative" style={{ borderLeft: 'none', borderRight: 'none', borderRadius: '0' }}
      >
        {[
          { label: "Elite Members", val: "10K+" },
          { label: "Logic Accuracy", val: "99.4%" },
          { label: "Neural Latency", val: "<50ms" },
          { label: "Knowledge Base", val: "1PB+" }
        ].map((stat, i) => (
          <div key={i} className="text-center group">
            <h3 className="text-4xl font-black text-white mb-2 group-hover:text-primary transition-colors duration-500">{stat.val}</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black leading-none">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <section id="features" className="py-40 px-8 w-full max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-32 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Quantum Capabilities</h2>
          <p className="text-white/40 text-lg font-light tracking-wide max-w-2xl mx-auto">Proprietary AI models fine-tuned for academic excellence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card flex flex-col items-start text-left group"
            >
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-8 border-primary/20 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                <f.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">{f.desc}</p>
              <div className="mt-auto w-full pt-8 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">System Core v4.0</span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.05] py-24 px-12 mt-40 glass" style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none', borderRadius: '0' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              <span className="text-2xl font-black tracking-tighter">STUDYFLOW<span className="text-primary">.ai</span></span>
            </div>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Redefining Human Potential Since 2024</p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <Link href="#" className="hover:text-primary transition-all">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-all">Protocol</Link>
            <Link href="#" className="hover:text-primary transition-all">Support</Link>
          </div>
          
          <div className="flex gap-6">
            <Link href="#" className="p-4 glass rounded-[1.5rem] hover:scale-110 hover:border-primary/50 transition-all group">
              <Github className="w-5 h-5 text-white/50 group-hover:text-primary" />
            </Link>
            <Link href="#" className="p-4 glass rounded-[1.5rem] hover:scale-110 hover:border-primary/50 transition-all group">
              <Chrome className="w-5 h-5 text-white/50 group-hover:text-primary" />
            </Link>
          </div>
        </div>
        <div className="mt-20 text-center">
          <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">Global Decentralized Network Status: Operational</p>
        </div>
      </footer>
    </div>
  );
}
