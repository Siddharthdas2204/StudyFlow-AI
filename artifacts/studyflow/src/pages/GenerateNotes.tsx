import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useGenerateNotes, useCreateNote } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Loader2, Save, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GenerateNotes() {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);

  const queryClient = useQueryClient();
  const generateMutation = useGenerateNotes();
  const createMutation = useCreateNote();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setSaved(false);
    await generateMutation.mutateAsync({ data: { text: inputText, title: title || undefined } });
  };

  const handleSave = async () => {
    const data = generateMutation.data;
    if (!data) return;
    await createMutation.mutateAsync({
      data: {
        title: data.title,
        content: data.content,
        tags: 'ai-generated',
        tldr: data.tldr,
        keyConcepts: data.keyConcepts
      }
    });
    queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-8 min-h-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-blue-500/10 rounded-2xl ring-1 ring-blue-500/20">
            <FileText className="w-10 h-10 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-extrabold">AI Notes Generator</h1>
            <p className="text-muted-foreground text-lg">Transform any text into structured, beautiful study notes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="glass-panel rounded-3xl p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Machine Learning Basics"
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Paste Your Text</label>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Paste any text, lecture notes, textbook content, or article here... AI will transform it into structured study notes with key concepts and a summary."
                  className="w-full h-80 bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none text-sm leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={generateMutation.isPending || !inputText.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 text-lg"
              >
                {generateMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Notes...</> : <><Sparkles className="w-5 h-5" /> Generate Notes</>}
              </button>
            </div>
          </form>

          {/* Output */}
          <AnimatePresence mode="wait">
            {generateMutation.isPending && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center glass-panel rounded-3xl"
              >
                <div className="w-20 h-20 relative mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-lg font-medium">Processing your content...</p>
                <p className="text-muted-foreground mt-2">AI is extracting key concepts</p>
              </motion.div>
            )}

            {generateMutation.data && !generateMutation.isPending && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-8 flex flex-col max-h-[700px] overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h2 className="text-2xl font-display font-bold">{generateMutation.data.title}</h2>
                  <button
                    onClick={handleSave}
                    disabled={saved || createMutation.isPending}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                      saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save Note'}
                  </button>
                </div>

                {generateMutation.data.tldr && (
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-5 shrink-0">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> TL;DR
                    </p>
                    <p className="text-foreground/90 text-sm leading-relaxed">{generateMutation.data.tldr}</p>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto markdown-body text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {generateMutation.data.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}

            {!generateMutation.data && !generateMutation.isPending && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center glass-panel rounded-3xl text-center p-10"
              >
                <FileText className="w-20 h-20 text-muted-foreground/20 mb-6" />
                <h3 className="text-xl font-medium mb-2">Generated notes appear here</h3>
                <p className="text-muted-foreground text-sm max-w-sm">Paste your text on the left and click Generate. AI will create structured notes with headings, key concepts, and a summary.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
