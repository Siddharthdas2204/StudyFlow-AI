"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Mic, 
  FileText, 
  Sparkles, 
  Loader2, 
  X, 
  Play, 
  Pause,
  Download,
  Share2,
  Trash2,
  Settings2,
  Search
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LectureNotesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"upload" | "result">("upload");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success("File attached: " + selectedFile.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': [], 'video/*': [] },
    multiple: false
  });

  const generateNotes = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("/api/notes/generate", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setNotes(data.notes);
      setViewMode("result");
      toast.success("Notes generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Transcription failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Lecture to <span className="text-gradient">Smart Notes</span></h2>
          <p className="text-white/50 text-sm font-medium">Capture every detail with AI transcription and summarization.</p>
        </div>
        {viewMode === "result" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode("upload")} className="px-4 py-2 glass hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
              Translate New
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
              <Download className="w-3 h-3" />
              Export PDF
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "upload" ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Upload Area */}
            <div className="lg:col-span-2 space-y-6">
              <div 
                {...getRootProps()} 
                className={cn(
                  "relative h-[400px] glass-card border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all",
                  isDragActive ? "border-primary bg-primary/5" : "border-white/10",
                  file ? "border-solid border-primary/40" : ""
                )}
              >
                <input {...getInputProps()} />
                
                {file ? (
                  <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center neon-glow">
                      <Mic className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{file.name}</h4>
                      <p className="text-sm text-white/40">{(file.size / (1024 * 1024)).toFixed(2)} MB • Audio Recording</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-red-500/60 hover:text-red-500 text-xs font-bold transition-colors underline"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center px-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all neon-glow">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Upload Lecture Audio</p>
                      <p className="text-sm text-white/40">Drag and drop or click to select MP3, WAV, or MP4</p>
                    </div>
                    <div className="flex gap-4 mt-4 opacity-20">
                      <Mic className="w-5 h-5" />
                      <Play className="w-5 h-5" />
                      <Settings2 className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={generateNotes}
                disabled={!file || isProcessing}
                className={cn(
                  "w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-3 transition-all",
                  !file || isProcessing 
                    ? "bg-white/5 text-white/20" 
                    : "bg-primary text-white hover:scale-[1.01] shadow-xl shadow-primary/20"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Neural Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Intelligent Notes
                  </>
                )}
              </button>
            </div>

            {/* Sidebar: History/Stats */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center justify-between">
                  Recent Notes
                  <Search className="w-4 h-4 text-white/20" />
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-white/5 group">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Thermodynamics Lecture {4-i}</p>
                        <p className="text-[10px] text-white/30 uppercase font-black">March 1{2-i}, 2024</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 bg-primary/5 border-primary/20">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Storage Usage</h4>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary w-[45%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-white/30">
                  <span>225 MB used</span>
                  <span>500 MB limit</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Actual Notes Markdown */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-card p-10 min-h-[600px] prose prose-invert max-w-full relative">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                   <FileText className="w-32 h-32" />
                 </div>
                 <ReactMarkdown>{notes || ""}</ReactMarkdown>
              </div>
            </div>

            {/* Formatting/AI Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-6 space-y-6">
                <h3 className="font-bold text-sm tracking-wide uppercase text-white/40 mb-4">Smart Actions</h3>
                
                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all group">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Simplify Concepts
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Extract Key Terms
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all group">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-red-500/60" />
                    Delete Session
                  </div>
                </button>
              </div>

              <div className="glass-card p-6 bg-blue-500/5 border-blue-500/10">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Next Step</h4>
                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  These notes are perfect for a study roadmap. Want to generate one based on this lecture?
                </p>
                <button className="w-full py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:scale-105 transition-all">
                  Create Roadmap
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
