import { useState, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, X, Loader2, Sparkles, MessageSquare, AlertCircle, Send, BookOpen, Layers, ListChecks } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Mode = "qa" | "summarize" | "flashcards" | "quiz";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: Mode;
}

const MODE_CONFIG: Record<Mode, { label: string; icon: React.ElementType; color: string; placeholder: string }> = {
  qa: { label: "Ask Question", icon: MessageSquare, color: "text-primary", placeholder: "Ask anything about the document…" },
  summarize: { label: "Summarize", icon: BookOpen, color: "text-green-400", placeholder: "Which section or topic to summarize?" },
  flashcards: { label: "Flashcards", icon: Layers, color: "text-yellow-400", placeholder: "Which topic to generate flashcards for?" },
  quiz: { label: "Quiz", icon: ListChecks, color: "text-red-400", placeholder: "Which topic to create a quiz on?" },
};

export default function PDFStudyMode() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [summary, setSummary] = useState("");
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("qa");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") { setError("Please upload a PDF file"); return; }
    if (file.size > 20 * 1024 * 1024) { setError("PDF must be smaller than 20MB"); return; }
    setError(""); setUploading(true); setMessages([]); setSummary("");

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch("/api/pdf/upload", { method: "POST", body: formData });
      const data = await res.json() as { sessionId?: string; filename?: string; summary?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSessionId(data.sessionId || "");
      setFilename(data.filename || file.name);
      setSummary(data.summary || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAsk = async () => {
    if (!input.trim() || !sessionId || asking) return;
    const userInput = input.trim();
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: `[${MODE_CONFIG[mode].label}] ${userInput}`, mode };
    setMessages(prev => [...prev, userMsg]);

    setAsking(true);
    try {
      const res = await fetch("/api/pdf/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question: userInput, mode }),
      });
      const data = await res.json() as { answer?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to get answer");

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: data.answer || "", mode };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 100);
    } catch (e: unknown) {
      const errMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${e instanceof Error ? e.message : "Failed"}`, mode };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 p-5 glass-panel rounded-2xl">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI PDF Study Mode</h1>
            <p className="text-muted-foreground text-sm">Upload any PDF — textbook, paper, notes — and ask questions, get summaries, or generate flashcards</p>
          </div>
        </div>

        {!sessionId ? (
          /* Upload State */
          <div className="max-w-2xl mx-auto">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer ${isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/15 hover:border-purple-500/50 hover:bg-white/[0.02]"}`}
              style={{ minHeight: "300px" }}
            >
              <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              <div className="flex flex-col items-center justify-center h-72 gap-5 p-8 text-center">
                {uploading ? (
                  <>
                    <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 animate-spin border-t-purple-500" />
                    <p className="font-medium">Processing PDF…</p>
                    <p className="text-sm text-muted-foreground">Extracting and analyzing content</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold mb-2">Drop your PDF here</p>
                      <p className="text-muted-foreground">or click to browse • Max 20MB</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-w-sm w-full mt-2">
                      {Object.entries(MODE_CONFIG).map(([key, { icon: Icon, label, color }]) => (
                        <div key={key} className="flex items-center gap-2 p-2.5 glass-panel rounded-xl text-left">
                          <Icon className={`w-4 h-4 ${color} shrink-0`} />
                          <span className="text-xs text-foreground/70">{label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
          </div>
        ) : (
          /* Study State */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Document info + summary */}
            <div className="space-y-4">
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-sm truncate max-w-[160px]">{filename}</span>
                  </div>
                  <button
                    onClick={() => { setSessionId(null); setMessages([]); setSummary(""); setFilename(""); }}
                    className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Document loaded
                </div>
              </div>

              {summary && (
                <div className="glass-panel rounded-2xl p-4 overflow-y-auto max-h-[450px] custom-scrollbar">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> Document Overview</h3>
                  <div className="markdown-body text-xs">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Chat Interface */}
            <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
              {/* Mode selector */}
              <div className="flex gap-1 p-3 border-b border-white/5 bg-background/30 flex-shrink-0 flex-wrap">
                {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG[Mode]][]).map(([key, { icon: Icon, label, color }]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === key ? `bg-white/5 ${color} border border-white/10` : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                      <MessageSquare className="w-10 h-10 opacity-20 mb-3" />
                      <p className="text-sm">Ask anything about <strong className="text-foreground/60">{filename}</strong></p>
                      <p className="text-xs mt-1">Try: "What are the main topics?" or "Summarize chapter 1"</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === "user" ? "bg-primary/20 border border-primary/30 rounded-tr-sm" : "bg-secondary/80 border border-white/5 rounded-tl-sm"}`}>
                          <div className="markdown-body text-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {asking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="p-4 rounded-2xl bg-secondary/80 border border-white/5 rounded-tl-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5 bg-background/30 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    placeholder={MODE_CONFIG[mode].placeholder}
                    disabled={asking}
                    className="flex-1 bg-secondary/80 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
                  />
                  <button
                    onClick={handleAsk}
                    disabled={!input.trim() || asking}
                    className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors shadow-lg"
                  >
                    {asking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
