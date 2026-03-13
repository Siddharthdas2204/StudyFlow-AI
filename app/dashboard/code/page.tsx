"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Play, Sparkles, Loader2, RotateCcw, Copy, Terminal, Bug, Layout, PanelRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const languages = [
  { id: "javascript", name: "JavaScript", icon: "JS", color: "text-yellow-400" },
  { id: "python", name: "Python", icon: "PY", color: "text-blue-400" },
  { id: "cpp", name: "C++", icon: "C++", color: "text-blue-600" },
  { id: "java", name: "Java", icon: "JV", color: "text-red-500" },
];

export default function CodeLabPage() {
  const [code, setCode] = useState(`// Welcome to StudyFlow AI Code Lab\n\nfunction studyTips() {\n  console.log("Consistency is key!");\n  console.log("AI makes coding easier.");\n}\n\nstudyTips();`);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    
    // Simulate execution delay
    setTimeout(() => {
      if (code.includes("console.log")) {
        const lines = code.match(/console\.log\((['"])(.*?)\1\)/g);
        if (lines) {
          const content = lines.map(line => line.match(/(['"])(.*?)\1/)?.[2]).join("\n");
          setOutput(content || "Code executed successfully (no output)");
        } else {
          setOutput("Code executed successfully.");
        }
      } else {
        setOutput("Code executed. Output stream redirected to console.");
      }
      setIsRunning(false);
      toast.success("Execution complete");
    }, 1500);
  };

  const optimizeWithAi = async () => {
    setIsAiOptimizing(true);
    try {
      const res = await fetch("/api/code/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setCode(data.optimizedCode);
      toast.success("AI Optimization applied!");
    } catch (error: any) {
      toast.error(error.message || "AI logic failed. Check your API key.");
    } finally {
      setIsAiOptimizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass p-4 rounded-2xl border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center neon-glow">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              Code Lab <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40">BETA</span>
            </h3>
            <p className="text-xs text-white/40">AI-Powered Programming Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  language === lang.id ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/5 pl-3">
            <button 
              onClick={optimizeWithAi}
              disabled={isAiOptimizing}
              className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-xs font-bold rounded-xl transition-all border-primary/20"
            >
              {isAiOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-primary" />}
              AI Refactor
            </button>
            <button 
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-4 fill-current" />}
              Run Code
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Editor Area */}
        <div className="lg:col-span-8 glass-card p-0 flex flex-col overflow-hidden group">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">main.{language === "javascript" ? "js" : language === "python" ? "py" : language === "cpp" ? "cpp" : "java"}</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent p-6 font-mono text-sm resize-none outline-none text-white/80 selection:bg-primary/30"
            spellCheck={false}
          />
        </div>

        {/* Console / Debug Area */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 glass-card p-0 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-black/20">
              <Terminal className="w-4 h-4 text-white/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Output Terminal</span>
            </div>
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto">
              {output ? (
                <div className="space-y-1">
                  {output.split("\n").map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-white/20">{i + 1}</span>
                      <span className="text-green-400/90">{line}</span>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    EXIITED WITH CODE 0
                  </div>
                </div>
              ) : isRunning ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 opacity-20">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p>Spawning child process...</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 opacity-10">
                  <Terminal className="w-10 h-10" />
                  <p className="max-w-[150px]">Run your code to see the output here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Bug className="w-16 h-16" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">AI Debugger</h4>
            <p className="text-[11px] text-white/50 leading-relaxed mb-4">
              Caught a bug? Paste your error and Socrates will analyze the stack trace for you.
            </p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
              Initialize Debugger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
