import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@workspace/replit-auth-web';
import {
  LayoutDashboard, MessageSquare, Youtube, BookOpen, Layers,
  CheckSquare, Calendar, Sparkles, Camera, Mic, Target,
  Code2, Map, FileText, LogOut, ChevronDown, ChevronRight, Brain,
} from 'lucide-react';
import { FocusTimer } from './FocusTimer';

const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
      { href: '/youtube', label: 'YouTube Summarizer', icon: Youtube },
    ],
  },
  {
    label: 'Notes & Memory',
    items: [
      { href: '/notes', label: 'Smart Notes', icon: BookOpen },
      { href: '/generate-notes', label: 'Generate Notes', icon: Sparkles },
      { href: '/flashcards', label: 'Flashcards', icon: Layers },
      { href: '/quiz', label: 'Quizzes', icon: CheckSquare },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/doubt-solver', label: 'Doubt Solver', icon: Camera },
      { href: '/lecture-notes', label: 'Lecture → Notes', icon: Mic },
      { href: '/exam-predictor', label: 'Exam Predictor', icon: Target },
      { href: '/coding', label: 'Code Playground', icon: Code2 },
      { href: '/roadmap', label: 'Study Roadmap', icon: Map },
      { href: '/pdf-study', label: 'PDF Study Mode', icon: FileText },
    ],
  },
  {
    label: 'Planning',
    items: [
      { href: '/planner', label: 'Study Planner', icon: Calendar },
    ],
  },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="min-h-screen flex text-foreground overflow-hidden" style={{ background: 'linear-gradient(135deg, #050816 0%, #0B0F2A 60%, #050816 100%)' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className="w-[240px] shrink-0 flex flex-col relative z-20 border-r border-[rgba(123,92,255,0.12)]"
        style={{ background: 'rgba(7,10,30,0.95)', backdropFilter: 'blur(20px)' }}>

        {/* Subtle vertical glow along sidebar edge */}
        <div className="absolute right-0 top-1/4 w-px h-1/2 bg-gradient-to-b from-transparent via-[#7B5CFF]/40 to-transparent" />

        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-[rgba(123,92,255,0.1)]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #7B5CFF, #5A6BFF)', boxShadow: '0 0 20px rgba(123,92,255,0.5)' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight">
              <span className="text-white">Study</span>
              <span className="text-gradient">Flow.ai</span>
            </h1>
            <p className="text-[9px] text-[#7B5CFF] uppercase tracking-[0.15em] font-semibold">AI Study Assistant</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar space-y-1">
          {NAV_SECTIONS.map((section) => {
            const isCollapsed = collapsed[section.label];
            const hasActive = section.items.some(item =>
              location === item.href || (item.href !== '/' && location.startsWith(item.href))
            );

            return (
              <div key={section.label} className="mb-1">
                <button
                  onClick={() => toggle(section.label)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors mb-0.5 ${hasActive && isCollapsed ? 'text-[#7B5CFF]' : 'text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.5)]'}`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em]">{section.label}</span>
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden space-y-0.5"
                    >
                      {section.items.map((item) => {
                        const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} className="block">
                            <div className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 group cursor-pointer text-[13px] ${
                              isActive
                                ? 'text-white font-semibold'
                                : 'text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.85)] hover:bg-[rgba(123,92,255,0.06)]'
                            }`}
                            style={isActive ? {
                              background: 'linear-gradient(135deg, rgba(123,92,255,0.18), rgba(90,107,255,0.1))',
                              borderLeft: '2px solid #7B5CFF',
                              boxShadow: 'inset 0 0 20px rgba(123,92,255,0.05)',
                            } : {}}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#7B5CFF]' : ''}`} />
                              <span className="truncate">{item.label}</span>
                              {isActive && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#7B5CFF]"
                                  style={{ boxShadow: '0 0 6px #7B5CFF' }} />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-3 border-t border-[rgba(123,92,255,0.1)]">
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(123,92,255,0.06)', border: '1px solid rgba(123,92,255,0.12)' }}>
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.username || 'User'} className="w-8 h-8 rounded-full object-cover border border-[rgba(123,92,255,0.3)]" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7B5CFF, #5A6BFF)' }}>
                  {(user.firstName?.[0] || user.username?.[0] || 'S').toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white truncate">{user.firstName || user.username || 'Scholar'}</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.4)] truncate">{user.email || 'Student'}</p>
              </div>
              <button onClick={logout} title="Sign out"
                className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.15)] hover:text-red-400 text-[rgba(255,255,255,0.3)] transition-colors shrink-0">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 relative overflow-hidden flex flex-col cyber-grid">
        {/* Ambient glow orbs */}
        <div className="glow-orb w-[600px] h-[600px] top-[-200px] left-[15%] opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #7B5CFF, transparent)' }} />
        <div className="glow-orb w-[500px] h-[500px] bottom-[-150px] right-[10%] opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #39C6FF, transparent)' }} />

        <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth custom-scrollbar">
          {children}
        </div>
      </main>

      <FocusTimer />
    </div>
  );
}
