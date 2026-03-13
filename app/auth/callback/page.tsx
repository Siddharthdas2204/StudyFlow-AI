"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth error:", error.message);
      }
      router.push("/dashboard");
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#020205]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-white/50 font-medium animate-pulse">Completing authentication...</p>
    </div>
  );
}
