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
  X,
  Mail,
  Shield
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
  { icon: Mail, label: "Inbox", href: "/dashboard/inbox" },
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
      <div className="h-screen w-full flex items-center justify-center bg-[#030014]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">Initializing Secure Environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden selection:bg-primary/30">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 90 : 300 }}
        className="glass border-r border-white/5 flex flex-col z-50 relative m-4 rounded-[2rem] shadow-2xl"
      >
        <div className="p-8 flex items-center justify-between">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 glass rounded-xl neon-halo">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">STUDYFLOW</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-3 hover:bg-white/[0.05] rounded-xl transition-all ml-auto glass border-white/10"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative cursor-pointer",
                pathname === item.href 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]" 
                  : "hover:bg-white/[0.03] text-white/40 hover:text-white"
              )}>
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === item.href ? "text-primary" : "text-inherit")} />
                {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-20 px-3 py-2 glass text-white text-[10px] uppercase font-black tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* Admin Link */}
          {user?.user_metadata?.role === 'admin' && (
            <Link href="/dashboard/admin">
              <div className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative cursor-pointer border border-amber-500/20 bg-amber-500/5",
                pathname === "/dashboard/admin" 
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]" 
                  : "hover:bg-amber-500/10 text-amber-500/60 hover:text-amber-500"
              )}>
                <Shield className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === "/dashboard/admin" ? "text-amber-500" : "text-inherit")} />
                {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Admin Console</span>}
                {isCollapsed && (
                  <div className="absolute left-20 px-3 py-2 glass text-amber-500 text-[10px] uppercase font-black tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 border border-amber-500/20">
                    Admin
                  </div>
                )}
              </div>
            </Link>
          )}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-2">
          <Link href="/dashboard/settings">
            <button className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl hover:bg-white/[0.03] text-white/40 hover:text-white transition-all group">
              <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Settings</span>}
            </button>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Terminate</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">
        {/* Subtle top bar inside dashboard */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 glass m-4 mb-0 rounded-[2rem] sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 leading-none mb-1">Navigation / {pathname.split('/').pop() || 'Overview'}</span>
              <h1 className="font-black text-2xl uppercase tracking-tight">
                {sidebarItems.find(i => i.href === pathname)?.label || "Workspace"}
              </h1>
            </div>
          </div>
          
          <Link href="/dashboard/settings">
            <div className="flex items-center gap-4 cursor-pointer group glass p-2 pr-6 rounded-full border-white/10 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary border border-white/10 overflow-hidden ring-0 group-hover:ring-4 ring-primary/20 transition-all">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-black text-white">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.1em]">Level 01 Scholar</span>
              </div>
            </div>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-10 relative custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
