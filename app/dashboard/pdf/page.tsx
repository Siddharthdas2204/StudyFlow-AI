"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Search, 
  Sparkles, 
  Loader2, 
  X, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  Layers,
  ChevronRight,
  Plus
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PDFStudyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF analyzed: " + selectedFile.name);
    } else {
      toast.error("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: false
  });

  const askPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    const userQuery = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: "user", content: userQuery }]);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/pdf/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, pdfName: file?.name })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      toast.error("Failed to get answer from PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">AI PDF <span className="text-gradient">Immersion</span></h2>
          <p className="text-white/40 text-sm font-medium">Chat with your textbooks and research papers.</p>
        </div>
        {file && (
          <button onClick={() => setFile(null)} className="p-2 glass hover:bg-red-500/10 text-red-500/60 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!file ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center space-y-8"
        >
          <div 
            {...getRootProps()} 
            className={cn(
              "w-full max-w-2xl h-80 glass-card border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all",
              isDragActive ? "border-primary bg-primary/5" : "border-white/10"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 neon-glow group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Drop your PDF here</h3>
            <p className="text-white/30 text-sm">Max file size: 50MB</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {[
              { icon: BookOpen, label: "Summarize", desc: "Get key takeaways" },
              { icon: Zap, label: "Flashcards", desc: "Generate study cards" },
              { icon: Layers, label: "Extract", desc: "Find data & tables" },
            ].map((feature, i) => (
              <div key={i} className="glass p-4 rounded-2xl flex flex-col items-center text-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold">{feature.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
          {/* PDF Viewer Placeholder */}
          <div className="lg:col-span-7 glass-card p-0 flex flex-col overflow-hidden bg-black/40">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold truncate max-w-[200px]">{file.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-white/40"><Search className="w-4 h-4" /></button>
                <button className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold">1 / 42</button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
               <div className="w-[80%] h-[90%] bg-white/5 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-4">
                  <FileText className="w-12 h-12 text-white/10" />
                  <p className="text-white/10 font-bold uppercase tracking-widest text-sm">Content Rendering Engine</p>
               </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 glass-card overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 gap-4">
                   <MessageSquare className="w-12 h-12" />
                   <div className="space-y-1">
                     <p className="font-bold">PDF Analysis Complete</p>
                     <p className="text-xs">Ask anything about the content above</p>
                   </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col gap-2 max-w-[90%]",
                      msg.role === "user" ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-2 rounded-2xl text-sm",
                      msg.role === "user" ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-white/80"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))
              )}
              {isProcessing && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">Studying PDF...</span>
                </div>
              )}
            </div>

            <form onSubmit={askPdf} className="relative">
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about this PDF..."
                className="w-full glass py-4 pl-6 pr-14 rounded-2xl border-white/10 focus:border-primary/50 outline-none transition-all text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
