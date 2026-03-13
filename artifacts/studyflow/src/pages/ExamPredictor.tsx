import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { Target, Loader2, Sparkles, AlertCircle, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History", "Economics", "English Literature", "Geography", "Psychology"];
const DIFFICULTIES = ["easy", "medium", "hard"];

export default function ExamPredictor() {
  const [subject, setSubject] = useState("Mathematics");
  const [examDate, setExamDate] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [result, setResult] = useState<{ prediction: string; daysUntilExam: number | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/exam/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, examDate: examDate || undefined, difficulty }),
      });
      const data = await res.json() as { prediction?: string; daysUntilExam?: number | null; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to generate predictions");
      setResult({ prediction: data.prediction || "", daysUntilExam: data.daysUntilExam ?? null });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to predict exam questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 p-5 glass-panel rounded-2xl">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Target className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Exam Predictor</h1>
            <p className="text-muted-foreground text-sm">AI analyzes your topics and predicts the most likely exam questions and high-priority areas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config Panel */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h2 className="font-bold text-lg">Exam Details</h2>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Exam Date (optional)
                </label>
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Difficulty Level</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                        difficulty === d
                          ? d === "easy" ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : d === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Predicting…</> : <><Sparkles className="w-5 h-5" /> Predict Exam Questions</>}
              </button>
            </div>

            {/* Stats */}
            {result?.daysUntilExam !== null && result?.daysUntilExam !== undefined && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-primary">{result.daysUntilExam}</p>
                    <p className="text-xs text-muted-foreground">days until exam</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="glass-panel rounded-2xl p-4 text-xs text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground/60 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Tip</p>
              <p>Add notes in the Smart Notes section first for more personalized predictions based on your actual study material.</p>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-red-500/20 animate-spin border-t-red-500" />
                  <Target className="w-6 h-6 text-red-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Analyzing exam patterns…</p>
                  <p className="text-sm text-muted-foreground mt-1">Generating high-probability questions</p>
                </div>
              </div>
            ) : result ? (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="markdown-body text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.prediction}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-4 p-8">
                <Target className="w-16 h-16 opacity-10" />
                <div>
                  <p className="text-lg font-medium text-foreground/50 mb-2">No predictions yet</p>
                  <p className="text-sm">Select your subject and click "Predict Exam Questions" to get AI-generated exam predictions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
