"use client";

import { motion } from "framer-motion";
import { Brain, Chrome, ArrowLeft, Sparkles } from "lucide-react";
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

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center neon-glow mb-8">
            <Brain className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-3">Welcome Back</h1>
          <p className="text-white/50 text-sm mb-10 leading-relaxed">
            Elevate your learning experience with AI-powered study tools.
          </p>

          <div className="w-full space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-4 glass hover:bg-white/5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Chrome className="w-5 h-5" />
              <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0b0b14] px-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                  Secured by Supabase
                </span>
              </div>
            </div>

            <p className="text-[11px] text-white/30 px-6">
              By continuing, you agree to StudyFlow's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-white/20 font-medium"
        >
          <Sparkles className="w-3 h-3" />
          <span>Join 10,000+ students worldwide</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
