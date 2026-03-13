import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { Map, Loader2, Sparkles, AlertCircle, Calendar, Clock, TrendingUp, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Machine Learning", "Data Science", "Web Development", "History", "Economics", "English", "Medicine", "Law"];
const LEVELS = ["beginner", "elementary", "intermediate", "advanced", "expert"];
const HOURS = [1, 2, 3, 4, 5, 6, 8];

export default function StudyRoadmap() {
  const [subject, setSubject] = useState("Computer Science");
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [targetLevel, setTargetLevel] = useState("intermediate");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [syllabus, setSyllabus] = useState("");
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState<{ roadmap: string; daysAvailable: number; totalHours: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, currentLevel, targetLevel, examDate: examDate || undefined, hoursPerDay, syllabus, goals }),
      });
      const data = await res.json() as { roadmap?: string; daysAvailable?: number; totalHours?: number; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to generate roadmap");
      setResult({ roadmap: data.roadmap || "", daysAvailable: data.daysAvailable || 30, totalHours: data.totalHours || 60 });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 p-5 glass-panel rounded-2xl">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Map className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Study Roadmap Generator</h1>
            <p className="text-muted-foreground text-sm">Get a personalized, phase-by-phase study plan tailored to your goals and timeline</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h2 className="font-bold text-lg">Your Details</h2>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Subject / Topic</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Level</label>
                  <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary capitalize">
                    {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target Level</label>
                  <select value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary capitalize">
                    {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2"><Calendar className="w-4 h-4" /> Target Date (optional)</label>
                <input type="date" value={examDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setExamDate(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2"><Clock className="w-4 h-4" /> Hours per day</label>
                <div className="flex gap-2 flex-wrap">
                  {HOURS.map(h => (
                    <button key={h} onClick={() => setHoursPerDay(h)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${hoursPerDay === h ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{h}h</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Syllabus / Topics (optional)</label>
                <textarea
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="e.g. Calculus, Linear Algebra, Statistics..."
                  rows={3}
                  className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Your Goals (optional)</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Pass final exam, get job at Google, understand deep learning..."
                  rows={2}
                  className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating…</> : <><Map className="w-5 h-5" /> Generate My Roadmap</>}
              </button>
            </div>

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Your Plan</h3>
                {[
                  { icon: Calendar, label: "Days available", value: result.daysAvailable, color: "text-cyan-400" },
                  { icon: Clock, label: "Total study hours", value: result.totalHours, color: "text-primary" },
                  { icon: TrendingUp, label: `${currentLevel} → ${targetLevel}`, value: subject, color: "text-accent" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${color} shrink-0`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-semibold text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Roadmap Result */}
          <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 animate-spin border-t-cyan-500" />
                  <Map className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Building your personalized roadmap…</p>
                  <p className="text-sm text-muted-foreground mt-1">This takes a moment to get right</p>
                </div>
              </div>
            ) : result ? (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-bold text-lg">Your Study Roadmap: {subject}</h2>
                </div>
                <div className="markdown-body text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.roadmap}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-4 p-8">
                <Map className="w-20 h-20 opacity-10" />
                <div>
                  <p className="text-xl font-medium text-foreground/40 mb-2">No roadmap yet</p>
                  <p className="text-sm max-w-xs">Fill in your details on the left and click "Generate My Roadmap" to get a personalized, phase-by-phase study plan</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 max-w-sm w-full">
                  {[
                    { icon: BookOpen, label: "Phase-by-phase plan" },
                    { icon: Calendar, label: "Day-by-day schedule" },
                    { icon: TrendingUp, label: "Progress milestones" },
                    { icon: Sparkles, label: "Resource recommendations" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 p-3 glass-panel rounded-xl text-left">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs text-foreground/70">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
