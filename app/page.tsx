"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Brain, BookOpen, Calculator, Code, Rocket, ArrowRight, Github, Chrome } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Bot, title: "Socrates AI Tutor", desc: "Interactive study coaching with voice & context" },
  { icon: Brain, title: "Vision Doubt Solver", desc: "Upload a photo, get a step-by-step solution" },
  { icon: BookOpen, title: "Lecture to Notes", desc: "Turn any audio lecture into structured notes" },
  { icon: Calculator, title: "Exam Predictor", desc: "Smart prediction of your next exam questions" },
  { icon: Code, title: "Coding Playground", desc: "Run code and get AI-powered explanations" },
  { icon: Rocket, title: "Study Roadmap", desc: "Personalized learning paths for any goal" }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-all neon-glow">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">StudyFlow<span className="text-primary">.ai</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="/login" className="px-5 py-2 glass rounded-full hover:bg-white/10 transition-all">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mt-20 md:mt-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1 glass rounded-full text-xs font-semibold text-primary mb-6 flex items-center gap-2 border-primary/20"
        >
          <Sparkles className="w-3 h-3" />
          <span>The Next Gen of Academic Achievement</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
        >
          Study <span className="text-gradient">Smarter</span>,<br />Not Harder.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed"
        >
          Unleash the power of AI to transform your learning journey. Solve doubts with a photo, 
          predict exam questions, and master any subject in record time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/dashboard" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 glass text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Explore Demo
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-y border-white/5 py-12 w-full max-w-5xl px-6"
      >
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-1">10k+</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Active Scholars</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-1">98%</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Success Rate</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-1">24/7</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">AI Support</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-1">5 Min</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Avg Study Boost</p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 w-full max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Supercharged Learning</h2>
          <p className="text-white/60">Tools built for the modern academic landscape.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card hover:translate-y-[-8px]"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 neon-glow">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">{f.desc}</p>
              <div className="w-full h-[1px] bg-white/5 mb-6" />
              <button className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 group">
                Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-12 px-6 mt-32">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-bold">StudyFlow.ai</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <Link href="#" className="hover:text-white transition-all">Privacy</Link>
            <Link href="#" className="hover:text-white transition-all">Terms</Link>
            <Link href="#" className="hover:text-white transition-all">Support</Link>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="p-2 glass rounded-full hover:scale-110 transition-all"><Github className="w-4 h-4" /></Link>
            <Link href="#" className="p-2 glass rounded-full hover:scale-110 transition-all"><Chrome className="w-4 h-4" /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
