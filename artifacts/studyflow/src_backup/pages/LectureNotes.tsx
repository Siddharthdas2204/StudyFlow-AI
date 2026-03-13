import { useState, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Upload, X, Loader2, FileAudio, BookOpen, AlertCircle, Copy, Check, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUBJECTS = ["General", "Math", "Physics", "Chemistry", "Biology", "Programming", "History", "Economics", "English", "Medicine"];

export default function LectureNotes() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("General");
  const [result, setResult] = useState<{ transcript: string; notes: string; wordCount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "transcript">("notes");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const validTypes = ["audio/", "video/"];
    if (!validTypes.some(t => file.type.startsWith(t))) {
      setError("Please upload an audio or video file (MP3, WAV, M4A, MP4, etc.)");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File must be smaller than 25MB");
      return;
    }
    setError("");
    setAudioFile(file);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleTranscribe = async () => {
    if (!audioFile) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("subject", subject);

      const res = await fetch("/api/lecture/transcribe", { method: "POST", body: formData });
      const data = await res.json() as { transcript?: string; notes?: string; wordCount?: number; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed");
      setResult({ transcript: data.transcript || "", notes: data.notes || "", wordCount: data.wordCount || 0 });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to process audio");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = activeTab === "notes" ? result?.notes : result?.transcript;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = activeTab === "notes" ? result?.notes : result?.transcript;
    const name = activeTab === "notes" ? "lecture-notes.md" : "transcript.txt";
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 p-5 glass-panel rounded-2xl">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Mic className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Lecture to Notes</h1>
            <p className="text-muted-foreground text-sm">Upload any audio recording and get structured, comprehensive study notes instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Panel */}
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => !audioFile && fileRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/15 hover:border-blue-500/50 hover:bg-white/[0.02]"
              }`}
              style={{ minHeight: "200px" }}
            >
              <input ref={fileRef} type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              <AnimatePresence mode="wait">
                {audioFile ? (
                  <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                      <FileAudio className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatSize(audioFile.size)}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setAudioFile(null); setResult(null); }} className="p-1.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 gap-4 p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Drop your lecture recording here</p>
                      <p className="text-sm text-muted-foreground">MP3, WAV, M4A, MP4, WEBM • Max 25MB</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <button
              onClick={handleTranscribe}
              disabled={!audioFile || loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing audio…</> : <><Mic className="w-5 h-5" /> Transcribe & Generate Notes</>}
            </button>

            <div className="p-4 glass-panel rounded-xl text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground/60">How it works:</p>
              <p>1. Upload your lecture audio or video recording</p>
              <p>2. AI transcribes every word with Whisper technology</p>
              <p>3. Notes are structured with key concepts, definitions & summaries</p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
            {result ? (
              <>
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className="flex gap-1">
                    {(["notes", "transcript"] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{result.wordCount.toLocaleString()} words</span>
                    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={handleDownload} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                  <div className="markdown-body text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeTab === "notes" ? result.notes : result.transcript}
                    </ReactMarkdown>
                  </div>
                </div>
              </>
            ) : loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 animate-spin border-t-blue-500" />
                  <Mic className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Transcribing audio…</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a minute for longer recordings</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-3 p-8">
                <BookOpen className="w-12 h-12 opacity-20" />
                <p className="text-sm">Your structured notes will appear here after processing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
