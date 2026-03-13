"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Brain, CheckCircle2, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DoubtSolverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [subject, setSubject] = useState("Mathematics");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setSolution(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const solveDoubt = async () => {
    if (!file) return;
    
    setIsSolving(true);
    setSolution(null);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("subject", subject);

      const res = await fetch("/api/solve", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSolution(data.solution);
      toast.success("Doubt solved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Vision Doubt Solver</h2>
            <p className="text-white/50">Upload a photo of your question and get a step-by-step AI solution.</p>
          </div>
          
          <div className="flex gap-2 p-1 glass rounded-xl">
            {["Mathematics", "Physics", "Chemistry", "Biology"].map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                  subject === s ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-white/40"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Area */}
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={cn(
                "relative h-[400px] glass-card border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all",
                isDragActive ? "border-primary bg-primary/5" : "border-white/10",
                file ? "border-solid" : ""
              )}
            >
              <input {...getInputProps()} />
              
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-4"
                  >
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 text-center px-8"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform neon-glow">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Drop your image here</p>
                      <p className="text-sm text-white/40">or click to browse from files</p>
                    </div>
                    <div className="flex gap-4 mt-2">
                       <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">JPEG</span>
                       <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">PNG</span>
                       <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">HEIC</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={solveDoubt}
              disabled={!file || isSolving}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                !file || isSolving 
                  ? "bg-white/5 text-white/20 cursor-not-allowed" 
                  : "bg-primary text-white hover:scale-[1.02] shadow-xl shadow-primary/20"
              )}
            >
              {isSolving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI is analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Solve Doubt Now
                </>
              )}
            </button>
          </div>

          {/* Right: Solution Area */}
          <div className="glass-card min-h-[400px] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
               <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                 <CheckCircle2 className="w-4 h-4 text-green-500" />
               </div>
               <span className="font-bold text-sm tracking-wide uppercase text-white/60">AI Solution Engine</span>
            </div>

            <div className="flex-1 prose prose-invert prose-sm max-w-full overflow-y-auto">
              {solution ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ReactMarkdown>{solution}</ReactMarkdown>
                </motion.div>
              ) : isSolving ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                   <div className="relative">
                     <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                     <Brain className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                   </div>
                   <p className="text-white/40 font-medium">Processing scan & applying logic...</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/20 py-20">
                  <ImageIcon className="w-12 h-12 mb-4" />
                  <p>Solution will appear here once you upload an image.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
