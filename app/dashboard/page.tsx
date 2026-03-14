"use client";

import { motion } from "framer-motion";
import { 
  Play, 
  FileText, 
  Briefcase, 
  Download,
  Clock,
  ExternalLink,
  Youtube,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [inputType, setInputType] = useState<"youtube" | "text">("youtube");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Job Application State
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const bio = user?.user_metadata?.bio || "";
        
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio })
        });
        
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      } catch (e) {
         console.error("Failed to fetch jobs");
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSummarize = async () => {
    if (inputType === "youtube" && (!youtubeUrl || (!youtubeUrl.includes("youtube.com") && !youtubeUrl.includes("youtu.be")))) {
       return toast.error("Please enter a valid YouTube link.");
    }
    if (inputType === "text" && !rawText.trim()) {
       return toast.error("Please enter some text to summarize.");
    }

    setLoadingNotes(true);
    setNotes(null);
    try {
       const endpoint = inputType === "youtube" ? "/api/youtube" : "/api/notes/text";
       const bodyPayload = inputType === "youtube" ? { url: youtubeUrl } : { text: rawText };

       const res = await fetch(endpoint, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(bodyPayload)
       });
       
       const data = await res.json();
       if (!res.ok) throw new Error(data.error || "Failed to generate notes.");
       
       setNotes(data.notes);
       toast.success("AI extraction complete. Notes ready!");
       if (inputType === "youtube") setYoutubeUrl("");
       else setRawText("");
    } catch (e: any) {
       toast.error(e.message || "Failed to process data.");
    } finally {
       setLoadingNotes(false);
    }
  };

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setResumeUploaded(false);
  };

  const confirmApplication = () => {
    if (!resumeUploaded) return toast.error("Please upload or select a resume first.");
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setSelectedJob(null);
      toast.success("Application Submitted! The company will contact you via your StudyFlow Inbox within 48 hours.");
    }, 1500);
  };

  const downloadNotes = () => {
    if (!notes) return toast.error("No notes to download yet!");
    const blob = new Blob([notes], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "StudyFlow_Notes.md";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Notes exported as Markdown");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary">Ethereal</span> Workspace
        </h2>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
          AI-Powered Academic & Career Intelligence
        </p>
      </section>

      {/* Grid Layout Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (YouTube + Notes) */}
        <div className="lg:col-span-7 space-y-8 flex flex-col">
          
          {/* Section 1: Notes Maker Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex flex-col gap-6 relative overflow-hidden group border-white/10 p-8"
          >
            {/* Neon Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full group-hover:bg-cyan-500/30 transition-all duration-700 pointer-events-none" />
            
            <div className="flex items-center justify-between z-10 w-full mb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {inputType === "youtube" ? <Youtube className="w-6 h-6 text-cyan-400" /> : <FileText className="w-6 h-6 text-cyan-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">AI Knowledge Extraction</h3>
                  <p className="text-[10px] text-cyan-400/80 font-black uppercase tracking-[0.2em] mt-1">
                    {inputType === "youtube" ? "Video" : "Raw Text"} to Knowledge Base
                  </p>
                </div>
              </div>

              {/* Input Toggle */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button 
                  onClick={() => setInputType("youtube")}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${inputType === "youtube" ? "bg-cyan-500/20 text-cyan-400" : "text-white/40 hover:text-white"}`}
                >
                  YouTube
                </button>
                <button 
                  onClick={() => setInputType("text")}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${inputType === "text" ? "bg-cyan-500/20 text-cyan-400" : "text-white/40 hover:text-white"}`}
                >
                  Raw Text
                </button>
              </div>
            </div>

            <div className="relative z-10">
              {inputType === "youtube" ? (
                <input 
                  type="text" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSummarize()}
                  disabled={loadingNotes}
                  placeholder="Paste YouTube Link Here..." 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-white/20 font-bold backdrop-blur-md shadow-inner disabled:opacity-50"
                />
              ) : (
                <textarea 
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  disabled={loadingNotes}
                  placeholder="Paste your raw lecture text, academic paper, or notes here..." 
                  className="w-full h-32 resize-none bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-white/20 font-medium backdrop-blur-md shadow-inner disabled:opacity-50 custom-scrollbar"
                />
              )}
              
              <button 
                onClick={handleSummarize}
                disabled={loadingNotes}
                className={`absolute right-2 text-black flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:hover:scale-100 hover:scale-105 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer transition-all duration-300 ${inputType === "youtube" ? "top-2 bottom-2 aspect-square" : "bottom-2 right-2 px-6 py-3"}`}
              >
                {loadingNotes ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                   inputType === "youtube" ? <Play className="w-5 h-5 fill-black" /> : <span className="text-[10px] font-black tracking-widest uppercase">Summarize</span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Section 2: AI Notes Maker */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-card flex flex-col gap-6 relative overflow-hidden group border-white/10 flex-1 p-8"
          >
            {/* Neon Accent */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-magenta-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">AI Notes Maker</h3>
                  <p className="text-[10px] text-purple-400/80 font-black uppercase tracking-[0.2em] mt-1">Recent Extraction</p>
                </div>
              </div>
              
              <button 
                onClick={downloadNotes}
                disabled={!notes}
                className="px-5 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border border-purple-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export to MD
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-sm text-white/60 leading-relaxed font-medium z-10 relative custom-scrollbar overflow-y-auto min-h-[250px] shadow-inner backdrop-blur-md">
              <div className="space-y-5">
                {loadingNotes ? (
                   <div className="flex flex-col items-center justify-center h-40 text-purple-400/60 gap-4">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs uppercase font-black tracking-widest">Synthesizing Audio Transcripts...</span>
                   </div>
                ) : notes ? (
                  <div className="prose prose-invert prose-purple max-w-none text-sm font-medium leading-loose prose-h1:text-xl prose-h1:font-black prose-h2:text-lg prose-h2:tracking-tight prose-a:text-cyan-400 prose-strong:text-purple-100 prose-ul:my-4">
                    <ReactMarkdown>{notes}</ReactMarkdown>
                  </div>
                ) : (
                  <>
                    <h4 className="text-white font-black text-base uppercase tracking-tight">System Status: Waiting for input</h4>
                    <p className="text-xs text-white/40">Enter a YouTube URL above to instantly generate structured markdown study notes, complete with summaries, key concepts, and actionable insights.</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column (Job Searcher) */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">

          {/* Section 3: AI Job Searcher */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card flex-1 flex flex-col gap-6 relative overflow-hidden group border-white/10 p-8"
          >
             {/* Neon Accent */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full transition-all duration-700 pointer-events-none" />

            <div className="flex flex-col gap-1 z-10 shrink-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Briefcase className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">AI Job Feed</h3>
                  <p className="text-[10px] text-amber-400/80 font-black uppercase tracking-[0.2em] mt-1">Matched to Profile</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 z-10 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
              
              {loadingJobs ? (
                  <div className="flex flex-col items-center justify-center h-40 text-amber-400/60 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs uppercase font-black tracking-widest">Querying Global Opportunities...</span>
                 </div>
              ) : jobs.length > 0 ? jobs.map((job) => (
                 <div key={job.id} className="p-6 rounded-3xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group/job backdrop-blur-md flex flex-col shadow-inner">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-black text-lg mb-1 tracking-tight">{job.title}</h4>
                      <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">{job.company}</p>
                    </div>
                    <span className="text-[10px] shrink-0 bg-green-500/10 border border-green-500/20 text-green-400 font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                      {job.match}
                    </span>
                  </div>
                  {job.description && (
                     <p className="text-xs text-white/40 mb-4 line-clamp-3 leading-relaxed font-medium">
                       {job.description}
                     </p>
                  )}
                  <div className="flex items-center gap-5 text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6 mt-auto">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-white/30" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-white/30" /> {job.type}</span>
                  </div>
                  <button 
                    onClick={() => handleApply(job)}
                    className="w-full py-4 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 hover:from-amber-400 hover:via-amber-500 hover:to-amber-400 text-amber-500 hover:text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-500/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              )) : (
                 <div className="p-6 rounded-3xl bg-black/40 border border-white/10 text-center py-10 shadow-inner">
                    <p className="text-white/40 text-sm font-medium">Please add a Bio in your settings to get personalized job feeds.</p>
                 </div>
              )}
            </div>

          </motion.div>
        </div>
      </div>
      {/* Job Application Modal Gateway */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
          >
             <button 
               onClick={() => setSelectedJob(null)}
               className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all"
               disabled={isApplying}
             >
               ✕
             </button>
             
             <h3 className="text-xl font-black uppercase tracking-tight mb-2">Initialize Application</h3>
             <p className="text-sm text-white/60 mb-6">You are applying for <span className="text-amber-400 font-bold">{selectedJob.title}</span> at <span className="font-bold text-white">{selectedJob.company}</span>.</p>

             {/* Resume Selection */}
             <div className="space-y-4 mb-8">
               <h4 className="text-[10px] font-black tracking-widest uppercase text-white/40">Select Sovereign Authenticated Resume</h4>
               
               <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${resumeUploaded ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                 <input type="radio" name="resume" className="mt-1" onChange={() => setResumeUploaded(true)} />
                 <div>
                   <h5 className="font-bold text-sm text-white">Main Tech Resume (Default)</h5>
                   <p className="text-xs text-white/40 mt-1">Uploaded 2 months ago. Verified by AI Matcher.</p>
                 </div>
               </label>
               
               <label className="relative flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/20 bg-black/20 text-white/50 hover:bg-white/5 hover:text-white cursor-pointer transition-all overflow-hidden group">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeUploaded(true);
                        toast.success(`Attached ${e.target.files[0].name} successfully!`);
                      }
                    }}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:scale-105 transition-transform">+ Upload New PDF Resume</span>
               </label>
             </div>

             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-200 text-xs mb-8 flex leading-relaxed">
               <span className="mr-3 text-lg">ℹ️</span>
               <span>If accepted, {selectedJob.company} recruiters will automatically reach out via your secure StudyFlow Inbox connection.</span>
             </div>

             <button 
               onClick={confirmApplication}
               disabled={!resumeUploaded || isApplying}
               className="w-full py-4 flex items-center justify-center bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 disabled:opacity-50 disabled:bg-amber-500/50 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:shadow-none"
             >
               {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Transmit Application"}
             </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
