"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Flag, Compass, Calendar, Loader2, Sparkles, CheckCircle, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RoadmapPage() {
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("8 Weeks");
  const [level, setLevel] = useState("Beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);

  const generateRoadmap = async () => {
    if (!goal) {
      toast.error("Please enter your learning goal.");
      return;
    }

    setIsGenerating(true);
    setRoadmap(null);

    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, timeframe, level })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setRoadmap(data.roadmap);
      toast.success("Roadmap generated! Let's get to work.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Study Roadmaps</h2>
          <p className="text-white/50">Architect your learning journey with precision-engineered milestones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Card */}
        <div className="glass-card p-8 flex flex-col gap-8 h-fit">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center neon-glow mx-auto mb-2">
            <Compass className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">What are you mastering?</label>
              <textarea 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Full-stack Web Development with Next.js or Quantum Mechanics basics"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Target Timeframe</label>
              <div className="grid grid-cols-2 gap-2">
                {["4 Weeks", "8 Weeks", "3 Months", "6 Months"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={cn(
                      "px-3 py-2 text-xs font-bold rounded-xl border transition-all",
                      timeframe === t ? "bg-primary/20 border-primary text-primary" : "border-white/5 text-white/30"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Current Proficiency</label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner", "Intermediate", "Expert"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={cn(
                      "px-2 py-2 text-[10px] font-bold rounded-xl border transition-all",
                      level === l ? "bg-primary/20 border-primary text-primary" : "border-white/5 text-white/30"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateRoadmap}
            disabled={isGenerating}
            className={cn(
              "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
              isGenerating 
                ? "bg-white/5 text-white/20" 
                : "bg-primary text-white hover:scale-[1.02] shadow-xl shadow-primary/20"
            )}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Roadmap"}
          </button>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-2">
           <div className="glass-card min-h-[600px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <Map className="w-64 h-64" />
             </div>

             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                   </div>
                   <span className="font-bold text-sm tracking-wide uppercase text-white/60">Study Blueprint</span>
                </div>
                {roadmap && (
                   <button className="flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs font-bold hover:bg-white/10 transition-all">
                      Sync to Calendar <Calendar className="w-3.5 h-3.5" />
                   </button>
                )}
             </div>

             <div className="flex-1 p-10 overflow-y-auto">
                {roadmap ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="prose prose-invert prose-lg max-w-full"
                  >
                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                  </motion.div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-8 py-20">
                    <div className="relative">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         className="w-24 h-24 border-b-2 border-l-2 border-primary rounded-full blur-[2px]"
                       />
                       <Flag className="absolute inset-0 m-auto w-8 h-8 text-primary animate-bounce" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-bold">Synthesizing Path...</h4>
                       <p className="text-white/30 text-sm max-w-[250px]">Analyzing 1.2M+ learning resources to build your perfect curriculum</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <ArrowUpRight className="w-10 h-10 text-white/10" />
                     </div>
                     <p className="text-white/20 font-medium max-w-[300px]">Define your academic or professional quest to generate a custom roadmap.</p>
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
