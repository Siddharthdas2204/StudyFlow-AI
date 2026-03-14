"use client";

import { motion } from "framer-motion";
import { Chrome, ArrowLeft, Network, Activity, Globe, Database, Cpu, Code2, ShieldCheck, Fingerprint } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative selection:bg-blue-500/30 z-10 bg-[#070A13]/80">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Top Left: Platform Initialization (Wide) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-[#14171E]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] rounded-3xl p-8 md:p-10 relative overflow-hidden group flex flex-col justify-between min-h-[220px]"
        >
          {/* Glowing Orb Visual */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-400/20 transition-all duration-1000 pointer-events-none" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
             <Network className="w-40 h-40 text-blue-400 animate-[spin_60s_linear_infinite]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Initialize Session</h2>
            <p className="text-[#9CA3AF] text-sm max-w-sm leading-relaxed font-medium">
              Securely connect your account to access the decentralized knowledge network.
            </p>
          </div>
          
          <div className="relative z-10 mt-10 flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
             <span className="text-xs font-black text-blue-400 uppercase tracking-widest">System Ready</span>
          </div>
        </motion.div>

        {/* Top Right: Network Telemetry (Square) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="md:col-span-1 bg-[#14171E]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px] group"
        >
           {/* Visual */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[40px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
           <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-all duration-500 pointer-events-none">
              <Globe className="w-24 h-24 text-cyan-400" />
           </div>

           <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Status
              </h3>
           </div>

           <div className="relative z-10 mt-auto">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#9CA3AF] mb-1 block">Active Nodes</span>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                12,482
              </p>
           </div>
        </motion.div>

        {/* Center: Quantum Authentication (Featured) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="md:col-span-3 bg-gradient-to-br from-[#DDE8F8] to-[#FFFFFF] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] group flex flex-col items-center text-center"
        >
          {/* Glass Overlay for depth */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 shadow-inner mb-8">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Quantum Auth Protocol</span>
             </div>

             <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#070A13] mb-10">
                SOVEREIGN ACCESS
             </h2>

             <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-5 bg-[#070A13] hover:bg-[#14171E] text-white rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-[0_15px_30px_rgba(7,10,19,0.3)] hover:shadow-[0_20px_40px_rgba(7,10,19,0.4)] border border-white/10 group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <Chrome className="w-5 h-5 text-current" />
                <span className="relative z-10">{isLoading ? "Initializing Handshake..." : "Sovereign Login with Google"}</span>
             </button>

             <div className="mt-10 flex flex-col items-center gap-4">
                <Fingerprint className="w-8 h-8 text-[#9CA3AF] opacity-50" />
                <p className="text-[10px] text-[#070A13]/60 font-bold uppercase tracking-[0.1em] max-w-xs leading-relaxed">
                  Your data is encrypted via end-to-end neural pathways. By connecting, you accept the StudyFlow protocol.
                </p>
             </div>
          </div>
        </motion.div>

        {/* Bottom Left: Navigation (Small) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="md:col-span-1"
        >
          <Link href="/" className="h-full bg-[#14171E]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-black/40 border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-500 mb-4 shadow-inner">
                 <ArrowLeft className="w-6 h-6 text-[#9CA3AF] group-hover:text-white transition-colors group-hover:-translate-x-1" />
              </div>
              <span className="text-[#9CA3AF] group-hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-colors">Return to Base</span>
          </Link>
        </motion.div>

        {/* Bottom Right: System Architecture (Wide) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="md:col-span-2 bg-[#14171E]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[160px] group"
        >
           <div className="relative z-10 mb-6 md:mb-0">
             <h3 className="text-2xl font-black text-white tracking-tight mb-2">System Architecture</h3>
             <p className="text-[#9CA3AF] text-sm max-w-[200px] leading-relaxed font-medium">
                Antigravity Protocol & God-Tier Engine active.
             </p>
           </div>

           <div className="relative z-10 flex items-center gap-6">
              {[Database, Cpu, Code2].map((Icon, i) => (
                <div key={i} className="relative group/icon">
                  <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)] transform transition-transform duration-500 group-hover/icon:-translate-y-2 group-hover/icon:rotate-3">
                     <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     <Icon className="w-7 h-7 text-[#9CA3AF] group-hover/icon:text-blue-400 transition-colors relative z-10" />
                  </div>
                  {/* Glowing Reflection */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-2 bg-blue-500/50 blur-[8px] rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              ))}
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
