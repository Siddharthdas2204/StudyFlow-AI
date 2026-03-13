"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  Brain, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  Zap, 
  Code2, 
  Map,
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";

const quickTools = [
  { icon: MessageSquare, label: "Ask Socrates", color: "text-blue-400", bg: "bg-blue-400/10", href: "/dashboard/chat" },
  { icon: ImageIcon, label: "Solve Photo", color: "text-green-400", bg: "bg-green-400/10", href: "/dashboard/solve" },
  { icon: Code2, label: "Debug Code", color: "text-yellow-400", bg: "bg-yellow-400/10", href: "/dashboard/code" },
  { icon: FileText, label: "Transcribe", color: "text-purple-400", bg: "bg-purple-400/10", href: "/dashboard/notes" },
];

const activeRoadmaps = [
  { title: "Advanced Calculus", progress: 65, status: "On Track", icon: Map },
  { title: "Quantum Physics", progress: 20, status: "Delayed", icon: Zap },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">
            Intelligence <span className="text-gradient">Unlocked</span>
          </h2>
          <p className="text-white/50 text-sm font-medium">Elevate your study session with AI-driven insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all relative">
              <Plus className="w-4 h-4" />
              New Study Session
            </button>
          </div>
        </div>
      </section>

      {/* Quick Launch Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickTools.map((tool, i) => (
          <Link key={i} href={tool.href}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex flex-col items-center justify-center gap-3 py-8 hover:translate-y-[-4px]"
            >
              <div className={`w-12 h-12 ${tool.bg} rounded-xl flex items-center justify-center neon-glow`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <span className="text-sm font-bold">{tool.label}</span>
            </motion.div>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats/Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Active Learning Paths</h3>
                <p className="text-xs text-white/30 font-black uppercase tracking-widest">Ongoing Sessions</p>
              </div>
              <Link href="/dashboard/roadmap" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-8 space-y-6">
              {activeRoadmaps.map((roadmap, i) => (
                <div key={i} className="flex flex-col gap-3 group cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 glass rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <roadmap.icon className="w-5 h-5 text-white/70" />
                      </div>
                      <span className="font-bold">{roadmap.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                      roadmap.status === "On Track" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {roadmap.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${roadmap.progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-white/20">
                    <span>{roadmap.progress}% COMPLETED</span>
                    <span>12 MODULES LEFT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="glass-card p-8 bg-gradient-to-br from-primary/5 to-purple-600/5 border-primary/10">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Daily Intelligence</span>
                <h3 className="text-2xl font-black">AI Recommendations</h3>
              </div>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Exam Prediction
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Based on your notes, there's an 85% chance of "Thermodynamics" appearing in tomorrow's test.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  Smart Recall
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Time to review "Cell Biology". You haven't practiced this in 4 days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar/Activity area */}
        <div className="space-y-8">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-sm font-medium">Calculus notes generated</p>
                    <p className="text-[10px] text-white/30 uppercase font-black">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
              <Brain className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Get unlimited AI reasoning, vision solver, and predictive analytics.
            </p>
            <button className="w-full py-3 glass hover:bg-white/10 rounded-xl font-bold text-sm transition-all">
              Go Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
