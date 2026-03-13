import { useState, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader2, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUBJECTS = ["General", "Math", "Physics", "Chemistry", "Biology", "Programming", "History", "Economics", "English"];

export default function DoubtSolver() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [subject, setSubject] = useState("General");
  const [context, setContext] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB");
      return;
    }
    setError("");
    setImage(file);
    setSolution("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSolve = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setSolution("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("subject", subject);
      formData.append("context", context);

      const res = await fetch("/api/doubt/solve", { method: "POST", body: formData });
      const data = await res.json() as { solution?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to solve doubt");
      setSolution(data.solution || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to solve doubt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 p-5 glass-panel rounded-2xl">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <Camera className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Doubt Solver</h1>
            <p className="text-muted-foreground text-sm">Upload any question image — handwritten or printed — and get a step-by-step explanation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Panel */}
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => !image && fileRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                isDragging ? "border-primary bg-primary/10" : "border-white/15 hover:border-primary/50 hover:bg-white/[0.02]"
              } ${image ? "border-solid border-white/10" : ""}`}
              style={{ minHeight: "300px" }}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                    <img src={preview} alt="Question" className="w-full object-contain max-h-72 rounded-xl" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); setSolution(""); }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-72 gap-4 p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Drop your question image here</p>
                      <p className="text-sm text-muted-foreground">or click to browse • JPG, PNG, WEBP • Max 10MB</p>
                    </div>
                    <p className="text-xs text-muted-foreground/60 max-w-xs">Works with handwritten homework, textbook problems, exam papers, and whiteboard photos</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Additional context (optional)</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. 'This is from Chapter 5 on Integration'"
                  className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSolve}
                disabled={!image || loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : <><Sparkles className="w-5 h-5" /> Solve This Doubt</>}
              </button>
            </div>
          </div>

          {/* Solution Panel */}
          <div className="glass-panel rounded-2xl p-6 min-h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Step-by-Step Solution</h2>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">AI is analyzing your question…</p>
              </div>
            ) : solution ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="markdown-body text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{solution}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
                <Camera className="w-12 h-12 opacity-20" />
                <p className="text-sm">Upload a question image and click "Solve" to get an AI explanation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
