"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Coffee, Play, Pause, RotateCcw, Volume2, VolumeX, Moon, Sparkles, Trophy, Brain } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FocusModePage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (!isMuted) {
      const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3");
      audio.play();
    }
    
    if (mode === "focus") {
      toast.success("Session complete! Time for a break.");
      setMode("break");
      setTimeLeft(5 * 60);
    } else {
      toast.success("Break over! Let's focus.");
      setMode("focus");
      setTimeLeft(25 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight uppercase">
          {mode === "focus" ? "Focus" : "Rest"} <span className="text-primary italic">Zone</span>
        </h2>
        <div className="flex items-center justify-center gap-2 text-white/40 text-sm font-bold tracking-widest uppercase">
          <Brain className="w-4 h-4" />
          Neural Efficiency: 94%
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <motion.div 
          className="w-80 h-80 rounded-full glass border-4 border-white/5 flex flex-col items-center justify-center relative z-10 shadow-2xl"
          animate={{ scale: isActive ? 1.05 : 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <span className="text-7xl font-black tracking-tighter mb-2">{formatTime(timeLeft)}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            {mode === "focus" ? "Deep Work Session" : "Recovery Phase"}
          </span>
        </motion.div>

        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-4 p-4 glass rounded-2xl rotate-12"
        >
          <Trophy className="w-6 h-6 text-yellow-500" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-4 -left-4 p-4 glass rounded-2xl -rotate-12"
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-4 glass rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        <button 
          onClick={toggleTimer}
          className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
        </button>

        <button 
          onClick={resetTimer}
          className="p-4 glass rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Mode Select */}
      <div className="flex gap-4 p-1 glass rounded-2xl border-white/5">
        <button 
          onClick={() => { setMode("focus"); setTimeLeft(25 * 60); setIsActive(false); }}
          className={cn(
            "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            mode === "focus" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
          )}
        >
          Deep Work
        </button>
        <button 
          onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsActive(false); }}
          className={cn(
            "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            mode === "break" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
          )}
        >
          Short Break
        </button>
      </div>
    </div>
  );
}
