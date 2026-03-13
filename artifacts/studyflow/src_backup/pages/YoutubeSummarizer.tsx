import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useSummarizeYoutube, useCreateNote } from '@workspace/api-client-react';
import { Youtube, Search, Loader2, Save, CheckCircle, PlaySquare, List, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function YoutubeSummarizer() {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false);
  
  const summarizeMutation = useSummarizeYoutube();
  const createNoteMutation = useCreateNote();

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSaved(false);
    summarizeMutation.mutate({ data: { url } });
  };

  const handleSaveNote = async () => {
    const summary = summarizeMutation.data;
    if (!summary) return;

    // Convert structured summary to markdown
    const mdContent = `
# ${summary.title}

## Summary
${summary.summary}

## Key Points
${summary.keyPoints.map(pt => `- ${pt}`).join('\n')}

## Detailed Notes
${summary.bulletNotes.map(note => `- ${note}`).join('\n')}

*Source: ${url}*
    `.trim();

    await createNoteMutation.mutateAsync({
      data: {
        title: `Video: ${summary.title}`,
        content: mdContent,
        tags: 'youtube, video, summary',
        tldr: summary.summary,
        keyConcepts: summary.keyPoints.join(', ')
      }
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-2xl mb-6 ring-1 ring-red-500/20">
            <Youtube className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4 tracking-tight">Turn Lectures into <span className="text-gradient">Knowledge</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste any YouTube educational video or lecture link. Our AI will extract the transcript, synthesize key points, and generate structured notes instantly.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSummarize} className="relative max-w-2xl mx-auto mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-card rounded-2xl p-2 border border-white/10 shadow-2xl">
            <div className="pl-4 text-muted-foreground">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-transparent border-none px-4 py-4 text-lg focus:outline-none text-foreground placeholder:text-muted-foreground/50"
              required
            />
            <button
              type="submit"
              disabled={summarizeMutation.isPending || !url}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {summarizeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Summarize'}
            </button>
          </div>
        </form>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {summarizeMutation.isPending && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <Youtube className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-medium text-foreground">Analyzing Video...</h3>
              <p className="text-muted-foreground mt-2">Extracting transcript and synthesizing concepts.</p>
            </motion.div>
          )}

          {summarizeMutation.data && !summarizeMutation.isPending && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                    <CheckCircle className="w-4 h-4" /> Summary Complete
                  </div>
                  <h2 className="text-3xl font-display font-bold leading-tight">{summarizeMutation.data.title}</h2>
                </div>
                <button
                  onClick={handleSaveNote}
                  disabled={saved || createNoteMutation.isPending}
                  className={`shrink-0 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                    saved 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-white text-black hover:bg-white/90 shadow-xl'
                  }`}
                >
                  {createNoteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> :
                   saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {saved ? 'Saved to Notes' : 'Save as Note'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-primary">
                      <AlignLeft className="w-5 h-5" /> TL;DR Summary
                    </h3>
                    <p className="text-lg text-foreground/80 leading-relaxed bg-secondary/30 p-6 rounded-2xl border border-white/5">
                      {summarizeMutation.data.summary}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-accent">
                      <List className="w-5 h-5" /> Detailed Notes
                    </h3>
                    <ul className="space-y-3">
                      {summarizeMutation.data.bulletNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                          <span className="text-foreground/90">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <PlaySquare className="w-5 h-5 text-primary" /> Key Takeaways
                    </h3>
                    <div className="space-y-3">
                      {summarizeMutation.data.keyPoints.map((point, i) => (
                        <div key={i} className="px-4 py-3 bg-background/50 rounded-xl border border-white/5 text-sm font-medium">
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
