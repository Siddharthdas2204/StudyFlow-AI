"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  Mic, 
  Zap, 
  Code2, 
  Map, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: MessageSquare, label: "Socrates AI", href: "/dashboard/chat" },
  { icon: ImageIcon, label: "Doubt Solver", href: "/dashboard/solve" },
  { icon: FileText, label: "Lecture Notes", href: "/dashboard/notes" },
  { icon: Mic, label: "Voice Tutor", href: "/dashboard/voice" },
  { icon: Zap, label: "Exam Predictor", href: "/dashboard/exam" },
  { icon: Code2, label: "Code Lab", href: "/dashboard/code" },
  { icon: FileText, label: "PDF Chat", href: "/dashboard/pdf" },
  { icon: Map, label: "Roadmaps", href: "/dashboard/roadmap" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020205]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-white/40 font-medium">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="glass border-r border-white/5 flex flex-col z-50 relative"
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="p-1.5 bg-primary/20 rounded-lg neon-glow">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold tracking-tight">StudyFlow<span className="text-primary">.ai</span></span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors ml-auto"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative cursor-pointer",
                pathname === item.href 
                  ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)] border border-primary/20" 
                  : "hover:bg-white/5 text-white/50 hover:text-white"
              )}>
                <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-inherit")} />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 px-2 py-1 bg-popover text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020205] relative overflow-hidden">
        {/* Subtle top bar inside dashboard */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">
              {sidebarItems.find(i => i.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>
          
          <Link href="/dashboard/settings">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold group-hover:text-primary transition-colors">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">Pro Member</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 border border-white/10 overflow-hidden ring-0 group-hover:ring-2 ring-primary/50 transition-all">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
