"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Target, BookText, Loader2, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ExamPredictorPage() {
  const [topic, setTopic] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [level, setLevel] = useState("University");
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const predict = async () => {
    if (!topic || !syllabus) {
      toast.error("Please provide topic and syllabus context.");
      return;
    }

    setIsPredicting(true);
    setResult(null);

    try {
      const res = await fetch("/api/exam/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, syllabus, level })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data.predictions);
      toast.success("Predictions generated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">AI Exam Predictor</h2>
        <p className="text-white/50">Identify high-probability questions using pattern analysis of your syllabus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Config Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Subject / Topic</label>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Organic Chemistry"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Syllabus Context (Copy-paste)</label>
                <textarea 
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Paste table of contents, lecture titles, or specific notes here..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Academic Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {["High School", "University"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all",
                        level === l 
                          ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                          : "border-white/10 text-white/40 hover:border-white/20"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={predict}
              disabled={isPredicting}
              className={cn(
                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                isPredicting 
                  ? "bg-white/5 text-white/20" 
                  : "bg-primary text-white hover:scale-105 shadow-xl shadow-primary/20"
              )}
            >
              {isPredicting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Predict Questions
                </>
              )}
            </button>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-yellow-500/5">
             <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-xs text-yellow-500/70 leading-relaxed font-medium">
                  This tool uses probabilistic analysis. Predictions are for study guidance only. Always review your entire syllabus before exams.
                </p>
             </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          <div className="glass-card min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="font-bold text-sm tracking-wide uppercase text-white/60">Probability Matrix</span>
               </div>
               
               {result && (
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
                 >
                   <Sparkles className="w-3 h-3" />
                   High Confidence
                 </motion.div>
               )}
            </div>

            <div className="flex-1 p-8">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="prose prose-invert max-w-full"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              ) : isPredicting ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border-t-2 border-r-2 border-primary rounded-full"
                    />
                    <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-lg">Cross-referencing global curriculum database...</p>
                    <p className="text-white/30 text-sm">Identifying recurrent thematic patterns</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
                  <BookText className="w-16 h-16 mb-6" />
                  <p className="max-w-xs font-medium">Configure your syllabus and topic on the left to generate predictions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
