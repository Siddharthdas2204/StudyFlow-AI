"use client";

import { motion } from "framer-motion";
import { Chrome, ArrowLeft, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("provider is not enabled")) {
          toast.error("Google Login is not enabled in Supabase. Please enable it in Authentication > Providers.");
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative selection:bg-primary/30">
      <div className="absolute top-10 left-10 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-6 py-3 glass rounded-full text-white/40 hover:text-white transition-all border-white/10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Return to Base</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-16 flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center border-primary/20 neon-halo mb-12">
            <Zap className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">Initialize Session</h1>
          <p className="text-white/40 text-sm mb-12 max-w-xs font-medium leading-relaxed">
            Securely connect your account to access the decentralized knowledge network.
          </p>

          <div className="w-full space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-5 glass hover:bg-white/[0.05] rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] border-white/10 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Chrome className="w-5 h-5 text-primary" />
              <span className="relative z-10">{isLoading ? "Verifying..." : "Sovereign Login with Google"}</span>
            </button>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.05]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="glass px-6 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-white/20 border-white/5">
                  Quantum Auth Protocol
                </span>
              </div>
            </div>

            <p className="text-[9px] text-white/20 px-10 italic uppercase tracking-[0.1em]">
              Your data is encrypted via end-to-end neural pathways. By connecting, you accept the StudyFlow protocol.
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex items-center justify-center gap-3 text-[10px] text-white/20 font-black uppercase tracking-[0.3em]"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Active Nodes: 12,482</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
