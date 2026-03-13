import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@workspace/replit-auth-web';
import { useGetProgress } from '@workspace/api-client-react';
import {
  BookOpen, Layers, CheckCircle, Flame, Target, TrendingUp,
  MessageSquare, Camera, Mic, Code2, Map, FileText, Sparkles, Youtube, Brain, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

const ACTIVITY_DATA = [
  { day: 'Mon', hours: 2.5, notes: 3 },
  { day: 'Tue', hours: 3.8, notes: 5 },
  { day: 'Wed', hours: 1.5, notes: 2 },
  { day: 'Thu', hours: 4.2, notes: 7 },
  { day: 'Fri', hours: 3.0, notes: 4 },
  { day: 'Sat', hours: 5.5, notes: 8 },
  { day: 'Sun', hours: 2.0, notes: 3 },
];

const QUICK_ACTIONS = [
  { href: '/tutor', icon: MessageSquare, label: 'AI Tutor', desc: 'Chat with Socrates AI', color: '#7B5CFF', bg: 'rgba(123,92,255,0.12)' },
  { href: '/doubt-solver', icon: Camera, label: 'Doubt Solver', desc: 'Solve from image', color: '#FF6B9D', bg: 'rgba(255,107,157,0.1)' },
  { href: '/lecture-notes', icon: Mic, label: 'Lecture Notes', desc: 'Audio to notes', color: '#39C6FF', bg: 'rgba(57,198,255,0.1)' },
  { href: '/exam-predictor', icon: Target, label: 'Exam Predictor', desc: 'Predict questions', color: '#FF8C42', bg: 'rgba(255,140,66,0.1)' },
  { href: '/coding', icon: Code2, label: 'Coding AI', desc: 'Code playground', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
  { href: '/roadmap', icon: Map, label: 'Roadmap', desc: 'Personalized plan', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  { href: '/pdf-study', icon: FileText, label: 'PDF Study', desc: 'Ask your docs', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  { href: '/youtube', icon: Youtube, label: 'YouTube', desc: 'Summarize lectures', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-xs font-medium"
        style={{ background: 'rgba(11,15,42,0.95)', border: '1px solid rgba(123,92,255,0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <p className="text-[rgba(255,255,255,0.5)] mb-1">{label}</p>
        <p style={{ color: '#7B5CFF' }}>{payload[0].value}h studied</p>
      </div>
    );
  }
  return null;
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: progress } = useGetProgress();

  const stats = progress || { notesCount: 0, flashcardsStudied: 0, quizzesCompleted: 0, studyStreak: 0, totalFlashcards: 0 };
  const firstName = user?.firstName || user?.username || 'Scholar';

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

        {/* ── HERO BANNER ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0E1338 0%, #1A1F4D 50%, #0E1338 100%)',
            border: '1px solid rgba(123,92,255,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(123,92,255,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(57,198,255,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                  {stats.studyStreak} Day Streak
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                Welcome back,{' '}
                <span className="text-gradient">{firstName}</span>
              </h1>
              <p className="text-[rgba(255,255,255,0.5)] text-base">
                Ready to learn something amazing today?
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: BookOpen, value: stats.notesCount, label: 'Notes', color: '#7B5CFF' },
                { icon: Layers, value: stats.totalFlashcards, label: 'Cards', color: '#39C6FF' },
                { icon: CheckCircle, value: stats.quizzesCompleted, label: 'Quizzes', color: '#4ADE80' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="stat-badge flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color, width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white leading-none">{value}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── QUICK ACTIONS GRID ───────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#7B5CFF]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[rgba(255,255,255,0.5)]">Quick Access</h2>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color, bg }) => (
              <motion.div key={href} variants={item}>
                <Link href={href} className="block">
                  <div className="card-neon p-4 cursor-pointer h-full"
                    style={{ background: 'rgba(14,19,56,0.7)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: bg, border: `1px solid ${color}25` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <p className="text-sm font-bold text-white mb-0.5">{label}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] leading-snug">{desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── CHARTS ROW ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Hours Chart */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="card-neon p-6"
            style={{ background: 'rgba(14,19,56,0.8)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#7B5CFF]" />
                <h3 className="font-bold text-white">Study Hours</h3>
              </div>
              <div className="tag-pill">This Week</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ACTIVITY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B5CFF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7B5CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(123,92,255,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" stroke="#7B5CFF" strokeWidth={2.5} fill="url(#hoursGrad)" dot={{ fill: '#7B5CFF', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#7B5CFF', strokeWidth: 2, stroke: 'rgba(123,92,255,0.3)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Notes per day */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="card-neon p-6"
            style={{ background: 'rgba(14,19,56,0.8)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#39C6FF]" />
                <h3 className="font-bold text-white">Notes Created</h3>
              </div>
              <div className="tag-pill">This Week</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ACTIVITY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="notesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39C6FF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#5A6BFF" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,198,255,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="notes" fill="url(#notesGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ── GET STARTED BANNER ──────────────────────────────────────── */}
        {stats.notesCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-2xl overflow-hidden p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(123,92,255,0.15), rgba(57,198,255,0.08))',
              border: '1px solid rgba(123,92,255,0.2)',
            }}
          >
            <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7B5CFF, #5A6BFF)', boxShadow: '0 0 30px rgba(123,92,255,0.5)' }}>
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-3">Start Your AI Study Journey</h3>
              <p className="text-[rgba(255,255,255,0.5)] mb-6 max-w-md mx-auto">
                Create your first note, chat with the AI tutor, or upload a question image to get started.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/tutor">
                  <button className="btn-primary flex items-center gap-2 px-6 py-3">
                    <Sparkles className="w-4 h-4" /> Chat with AI Tutor
                  </button>
                </Link>
                <Link href="/notes">
                  <button className="btn-outline-neon flex items-center gap-2 px-6 py-3">
                    <BookOpen className="w-4 h-4" /> Create First Note
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
