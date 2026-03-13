import { useAuth, supabase } from "@workspace/replit-auth-web";
import { setTokenGetter } from "@workspace/api-client-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Brain, Sparkles, BookOpen, Code2, Target, Mic, Camera, Map, Zap, Terminal } from "lucide-react";

const FEATURES = [
  { icon: Brain, label: "AI Tutor Chat", color: "#7B5CFF" },
  { icon: Camera, label: "Image Doubt Solver", color: "#FF6B9D" },
  { icon: Mic, label: "Lecture to Notes", color: "#39C6FF" },
  { icon: Target, label: "Exam Predictor", color: "#FF8C42" },
  { icon: Code2, label: "Coding Playground", color: "#4ADE80" },
  { icon: Map, label: "Study Roadmap", color: "#A78BFA" },
  { icon: BookOpen, label: "PDF Study Mode", color: "#F59E0B" },
  { icon: Zap, label: "AI Voice Tutor", color: "#38BDF8" },
];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, login, mockLogin } = useAuth();

  useEffect(() => {
    setTokenGetter(async () => {
      // Return "demo-token" if in mock mode
      if (localStorage.getItem("mock_auth") === "true") {
        return "demo-token";
      }
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col"
        style={{ background: 'linear-gradient(135deg, #050816 0%, #0B0F2A 50%, #050816 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7B5CFF, #5A6BFF)', boxShadow: '0 0 40px rgba(123,92,255,0.6)' }}>
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl animate-ping opacity-40"
              style={{ background: 'linear-gradient(135deg, #7B5CFF, #5A6BFF)' }} />
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-[#7B5CFF]" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #050816 0%, #0B0F2A 60%, #050816 100%)' }}>

        {/* Cyber grid */}
        <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />

        {/* Ambient glow orbs */}
        <div className="absolute top-[-10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(123,92,255,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(57,198,255,0.14) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Top nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7B5CFF, #5A6BFF)', boxShadow: '0 0 20px rgba(123,92,255,0.5)' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Study<span className="text-gradient">Flow.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[rgba(255,255,255,0.5)]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex gap-4">
            <button onClick={mockLogin}
              className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white border border-white/20 rounded-xl transition-all hover:bg-white/10 glass">
              Demo Mode
            </button>
            <button onClick={login}
              className="btn-primary text-sm px-6 py-2.5">
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-16 pb-12 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — headline + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="tag-pill mb-6 inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#7B5CFF]" />
                AI-Powered Study Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 tracking-tight">
                <span className="text-white">Discover, Learn &</span><br />
                <span className="text-gradient">Master Any Subject</span><br />
                <span className="text-white">with AI</span>
              </h1>

              <p className="text-[rgba(255,255,255,0.55)] text-lg leading-relaxed mb-10 max-w-xl">
                Your all-in-one AI study assistant. Solve doubts from images, convert lectures to notes, predict exam questions, and get personalized roadmaps — powered by cutting-edge AI.
              </p>

              {/* Stats row */}
              <div className="flex gap-6 mb-10">
                {[
                  { value: "14+", label: "AI Features" },
                  { value: "∞", label: "Study Hours" },
                  { value: "100%", label: "Free" },
                ].map(({ value, label }) => (
                  <div key={label} className="stat-badge text-center">
                    <p className="text-2xl font-extrabold text-gradient">{value}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.45)] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-4 flex-wrap">
                <button onClick={login} className="btn-primary text-base flex items-center gap-2.5 px-8 py-3.5">
                  <Sparkles className="w-5 h-5" />
                  Start Learning Free
                </button>
                <button onClick={mockLogin} className="btn-outline-neon text-base flex items-center gap-2.5 px-8 py-3.5">
                  <Terminal className="w-5 h-5" />
                  Try Demo Mode
                </button>
              </div>
            </motion.div>

            {/* Right — Feature cards grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="grid grid-cols-2 gap-3"
            >
              {FEATURES.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                  className="card-neon p-4 cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <p className="text-[13px] font-semibold text-white leading-snug">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Neon divider */}
        <div className="neon-divider mx-8 md:mx-16 my-4" />

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-center py-8 px-8"
        >
          <p className="text-sm text-[rgba(255,255,255,0.35)]">
            Powered by <span className="text-[#7B5CFF] font-semibold text-gradient">Groq LLaMA</span> · Voice Tutor · Image AI · PDF Mode
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
