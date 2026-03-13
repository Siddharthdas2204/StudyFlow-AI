"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Sparkles, Brain, Loader2, X, Activity, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoiceTutorPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Mock transcript after delay
      setTimeout(() => {
        setTranscript("Can you explain the difference between aerobic and anaerobic respiration?");
        setIsListening(false);
        simulateResponse();
      }, 3000);
    }
  };

  const simulateResponse = () => {
    setIsSpeaking(true);
    setResponse("Aerobic respiration requires oxygen to produce energy (ATP), while anaerobic respiration occurs in the absence of oxygen and produces less ATP plus lactic acid or ethanol...");
    // Mock speaking duration
    setTimeout(() => {
      setIsSpeaking(false);
    }, 5000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col items-center justify-center relative">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000",
          isListening ? "bg-primary/30" : isSpeaking ? "bg-blue-400/20" : "bg-white/5"
        )} />
      </div>

      <div className="text-center space-y-8 relative z-10 w-full">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-4">Voice <span className="text-gradient">Tutor</span></h2>
          <p className="text-white/40 text-sm font-medium">Speak naturally. Learn effectively.</p>
        </div>

        {/* Pulsing Visualizer */}
        <div className="relative h-64 flex items-center justify-center">
          <AnimatePresence>
            {isListening || isSpeaking ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1.5 h-32"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: [20, Math.random() * 80 + 20, 20],
                      backgroundColor: isListening ? "#8B5CF6" : "#60A5FA"
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5 + Math.random() * 0.5,
                      ease: "easeInOut"
                    }}
                    className="w-1.5 rounded-full"
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-48 h-48 rounded-full glass flex items-center justify-center border-white/5 relative group cursor-pointer"
                onClick={toggleListening}
              >
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                <Brain className="w-16 h-16 text-white/10 group-hover:text-primary/40 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Area */}
        <div className="max-w-xl mx-auto min-h-[120px] flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {transcript && (
              <motion.div 
                key="transcript"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-white/40" />
                </div>
                <p className="text-white/60 text-sm italic">"{transcript}"</p>
              </motion.div>
            )}
            {response && (
              <motion.div 
                key="response"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-white font-medium text-sm leading-relaxed">{response}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pt-10">
          <button className="p-4 glass rounded-2xl text-white/40 hover:text-white transition-all">
            <Volume2 className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleListening}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl relative",
              isListening ? "bg-red-500 scale-110 shadow-red-500/20" : "bg-primary shadow-primary/20 hover:scale-105"
            )}
          >
            {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
          </button>

          <button className="p-4 glass rounded-2xl text-white/40 hover:text-white transition-all">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
