import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useGetNotes, useCreateNote, useUpdateNote, useDeleteNote, useAskAboutNote, useSimplifyConceptAi, Note } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FileText, Trash2, Edit3, Save, Sparkles, Brain, X, Share, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes() {
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '' });
  
  // AI Feature Modals
  const [askAiQuery, setAskAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [simplifyLevel, setSimplifyLevel] = useState<'beginner' | 'exam' | 'advanced'>('beginner');

  const queryClient = useQueryClient();
  const { data: notes = [], isLoading } = useGetNotes({ search });
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();
  const askMutation = useAskAboutNote();
  const simplifyMutation = useSimplifyConceptAi();

  const handleCreateNew = async () => {
    const newNote = await createMutation.mutateAsync({
      data: { title: 'Untitled Note', content: '# Start typing...\n\nYour markdown here.', tags: 'general' }
    });
    queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    setSelectedNote(newNote);
    setEditForm({ title: newNote.title, content: newNote.content, tags: newNote.tags });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedNote) return;
    const updated = await updateMutation.mutateAsync({
      id: selectedNote.id,
      data: { ...editForm }
    });
    queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    setSelectedNote(updated);
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this note permanently?')) {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      if (selectedNote?.id === id) setSelectedNote(null);
    }
  };

  const handleAskAi = async () => {
    if (!selectedNote || !askAiQuery) return;
    const res = await askMutation.mutateAsync({
      data: { noteContent: selectedNote.content, question: askAiQuery }
    });
    setAiResponse(res.response);
  };

  const handleSimplify = async () => {
    if (!selectedNote) return;
    setAiResponse('');
    setIsAiModalOpen(true);
    const res = await simplifyMutation.mutateAsync({
      data: { concept: selectedNote.title + "\n" + selectedNote.content.substring(0, 1000), level: simplifyLevel }
    });
    setAiResponse(res.explanation);
  };

  const exportMarkdown = () => {
    if (!selectedNote) return;
    const blob = new Blob([selectedNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden">
        {/* LEFT PANE: Notes List */}
        <div className="w-80 border-r border-white/10 bg-card/50 backdrop-blur-md flex flex-col relative z-10 shrink-0">
          <div className="p-4 border-b border-white/5">
            <button 
              onClick={handleCreateNew}
              disabled={createMutation.isPending}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all mb-4"
            >
              <Plus className="w-5 h-5" /> New Note
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : notes.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No notes found.</p>
              </div>
            ) : (
              notes.map(note => (
                <div 
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                    setEditForm({ title: note.title, content: note.content, tags: note.tags });
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedNote?.id === note.id 
                      ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)]' 
                      : 'bg-background border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <h4 className="font-medium text-foreground truncate">{note.title}</h4>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {note.tags.split(',').slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider font-semibold">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  {/* Smart Summaries Feature #8 */}
                  {note.tldr && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic border-l-2 border-primary/50 pl-2">
                      {note.tldr}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: Note Detail / Editor */}
        <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
          {selectedNote ? (
            <>
              {/* Toolbar */}
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-card/30 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-secondary border border-white/5 text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Saved
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isEditing && (
                    <>
                      <button onClick={exportMarkdown} className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors" title="Export Markdown">
                        <Download className="w-5 h-5" />
                      </button>
                      <div className="w-px h-6 bg-border mx-1"></div>
                      <button onClick={() => setIsAiModalOpen(true)} className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-accent/20">
                        <Sparkles className="w-4 h-4" /> Ask AI
                      </button>
                      <button onClick={handleSimplify} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-primary/20">
                        <Brain className="w-4 h-4" /> Simplify
                      </button>
                    </>
                  )}
                  
                  <div className="w-px h-6 bg-border mx-1"></div>
                  
                  {isEditing ? (
                    <button onClick={handleSave} disabled={updateMutation.isPending} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-emerald-500/30">
                      {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedNote.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Editor / Viewer */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
                <div className="max-w-4xl mx-auto">
                  {isEditing ? (
                    <div className="space-y-6">
                      <input 
                        type="text" 
                        value={editForm.title} 
                        onChange={e => setEditForm(p => ({...p, title: e.target.value}))}
                        className="w-full text-4xl font-display font-bold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground/30"
                        placeholder="Note Title"
                      />
                      <input 
                        type="text" 
                        value={editForm.tags} 
                        onChange={e => setEditForm(p => ({...p, tags: e.target.value}))}
                        className="w-full text-sm font-mono bg-secondary/50 border border-white/5 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-muted-foreground"
                        placeholder="Tags (comma separated)"
                      />
                      <textarea 
                        value={editForm.content} 
                        onChange={e => setEditForm(p => ({...p, content: e.target.value}))}
                        className="w-full h-[600px] bg-card border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-mono text-sm resize-none custom-scrollbar"
                        placeholder="Start typing in markdown..."
                      />
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-32">
                      <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-8 text-foreground tracking-tight">
                        {selectedNote.title}
                      </h1>
                      {selectedNote.tldr && (
                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mb-10 shadow-inner">
                          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> AI Summary
                          </h3>
                          <p className="text-foreground/90 text-lg leading-relaxed">{selectedNote.tldr}</p>
                        </div>
                      )}
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {selectedNote.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 relative">
              {/* landing page hero abstract empty state */}
              <img 
                src={`${import.meta.env.BASE_URL}images/empty-notes.png`} 
                alt="Empty Notes" 
                className="w-64 h-64 object-contain opacity-50 mix-blend-screen mb-8 drop-shadow-2xl"
              />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Your Knowledge Workspace</h2>
              <p className="text-muted-foreground max-w-md mb-8">Select a note from the sidebar or create a new one to start writing and asking AI questions.</p>
              <button 
                onClick={handleCreateNew}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Create First Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ask AI / Simplify Modal */}
      <AnimatePresence>
        {isAiModalOpen && selectedNote && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(var(--primary),0.2)]"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-background/50">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Ask AI about this note
                </h3>
                <button onClick={() => { setIsAiModalOpen(false); setAiResponse(''); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Simplify Mode Selector */}
                <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-xl w-fit border border-white/5">
                  {(['beginner', 'exam', 'advanced'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => { setSimplifyLevel(level); handleSimplify(); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        simplifyLevel === level ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 mb-6">
                  <input 
                    type="text"
                    value={askAiQuery}
                    onChange={e => setAskAiQuery(e.target.value)}
                    placeholder="E.g., What is the main conclusion of this note?"
                    className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                    onKeyDown={e => e.key === 'Enter' && handleAskAi()}
                  />
                  <button onClick={handleAskAi} disabled={askMutation.isPending} className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2">
                    {askMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask'}
                  </button>
                </div>

                <div className="min-h-[200px] max-h-[400px] overflow-y-auto bg-background/50 rounded-2xl p-6 border border-white/5 custom-scrollbar">
                  {simplifyMutation.isPending || askMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Sparkles className="w-8 h-8 animate-pulse mb-3 text-primary" />
                      <p>AI is thinking...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="markdown-body text-base">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground italic">
                      Responses will appear here
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
