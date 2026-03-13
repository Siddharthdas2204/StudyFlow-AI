import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useGetFlashcards, useGetNotes, useGenerateFlashcards, useCreateFlashcard, useUpdateFlashcard, useDeleteFlashcard } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Play, BrainCircuit, Loader2, X, Trash2, Calendar, Sparkles } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';

export default function Flashcards() {
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [generateText, setGenerateText] = useState('');

  const queryClient = useQueryClient();
  const { data: cards = [], isLoading } = useGetFlashcards();
  const { data: notes = [] } = useGetNotes();
  const generateMutation = useGenerateFlashcards();
  const createMutation = useCreateFlashcard();
  const updateMutation = useUpdateFlashcard();
  const deleteMutation = useDeleteFlashcard();

  const dueCards = cards.filter(c => !c.nextReview || isPast(parseISO(c.nextReview)));
  const studyCards = isStudyMode ? dueCards : cards; // Review due cards in study mode

  const handleGenerate = async () => {
    let contentToUse = generateText;
    if (selectedNoteId) {
      const note = notes.find(n => n.id.toString() === selectedNoteId);
      if (note) contentToUse = note.content;
    }

    if (!contentToUse) return;

    try {
      const generated = await generateMutation.mutateAsync({ data: { content: contentToUse, count: 5 } });
      
      // Save all generated cards
      for (const item of generated) {
        await createMutation.mutateAsync({
          data: { 
            question: item.question, 
            answer: item.answer, 
            noteId: selectedNoteId ? parseInt(selectedNoteId) : undefined 
          }
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });
      setIsGenerateOpen(false);
      setGenerateText('');
      setSelectedNoteId('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleScoreCard = async (difficulty: 1 | 2 | 3) => {
    const card = studyCards[studyIndex];
    if (!card) return;

    // Simple SRS logic
    const daysToAdd = difficulty === 1 ? 1 : difficulty === 2 ? 3 : 7;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    await updateMutation.mutateAsync({
      id: card.id,
      data: {
        difficulty,
        lastReviewed: new Date().toISOString(),
        nextReview: nextDate.toISOString()
      }
    });
    queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });

    if (studyIndex < studyCards.length - 1) {
      setIsFlipped(false);
      setStudyIndex(prev => prev + 1);
    } else {
      // Done!
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setIsStudyMode(false);
      setStudyIndex(0);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto min-h-full flex flex-col">
        {isStudyMode ? (
          /* STUDY MODE UI */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setIsStudyMode(false)} className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <X className="w-5 h-5" /> Exit Study Mode
                </button>
                <div className="text-sm font-medium bg-secondary px-4 py-1.5 rounded-full">
                  Card {studyIndex + 1} of {studyCards.length}
                </div>
              </div>

              {/* FLIP CARD */}
              <div 
                className="relative h-96 w-full perspective-1000 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full transform-style-3d transition-all duration-500 ease-out absolute inset-0"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 backface-hidden bg-card border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl hover:border-primary/50 transition-colors">
                    <span className="absolute top-6 left-6 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" /> Question
                    </span>
                    <h2 className="text-3xl font-display font-semibold leading-tight">{studyCards[studyIndex]?.question}</h2>
                    <p className="absolute bottom-6 text-muted-foreground text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to flip <ChevronRight className="w-4 h-4" />
                    </p>
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl rotate-y-180">
                    <span className="absolute top-6 left-6 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Answer
                    </span>
                    <p className="text-2xl text-foreground/90 font-medium leading-relaxed">{studyCards[studyIndex]?.answer}</p>
                  </div>
                </motion.div>
              </div>

              {/* SCORING BUTTONS */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-4 mt-12"
                  >
                    <button onClick={(e) => { e.stopPropagation(); handleScoreCard(1); }} className="px-6 py-3 rounded-xl font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                      Hard (1d)
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleScoreCard(2); }} className="px-6 py-3 rounded-xl font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors">
                      Good (3d)
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleScoreCard(3); }} className="px-6 py-3 rounded-xl font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                      Easy (7d)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* GRID VIEW UI */
          <>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-display font-bold mb-2">Spaced Repetition</h1>
                <p className="text-muted-foreground text-lg">You have <strong className="text-primary">{dueCards.length} cards</strong> due for review today.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsGenerateOpen(true)}
                  className="px-6 py-3 rounded-xl font-semibold bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Generate AI Cards
                </button>
                <button 
                  onClick={() => { if(dueCards.length > 0) setIsStudyMode(true); }}
                  disabled={dueCards.length === 0}
                  className="px-8 py-3 rounded-xl font-bold bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" /> Study Now
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : cards.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}images/empty-flashcards.png`} alt="No cards" className="w-64 h-64 mb-6 opacity-60 mix-blend-screen" />
                <h3 className="text-2xl font-bold">Your deck is empty</h3>
                <p className="text-muted-foreground mb-6">Generate flashcards from your notes using AI.</p>
                <button onClick={() => setIsGenerateOpen(true)} className="px-6 py-3 bg-primary text-white rounded-xl font-medium">Generate Cards</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(card => (
                  <div key={card.id} className="bg-card border border-white/5 rounded-2xl p-6 relative group hover:border-primary/30 transition-colors shadow-lg">
                    <button 
                      onClick={() => deleteMutation.mutate({ id: card.id })}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-lg backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Front</div>
                    <p className="font-medium text-lg mb-6 line-clamp-3">{card.question}</p>
                    <div className="h-px w-full bg-border mb-4"></div>
                    <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Back</div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{card.answer}</p>
                    
                    {card.nextReview && (
                      <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background rounded-lg p-2 border border-white/5 w-fit">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {isPast(parseISO(card.nextReview)) ? <span className="text-orange-400">Due Now</span> : `Review: ${format(parseISO(card.nextReview), 'MMM d')}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Generate Modal */}
        <AnimatePresence>
          {isGenerateOpen && (
            <motion.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-display font-bold">Generate Flashcards with AI</h3>
                  <button onClick={() => setIsGenerateOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Source Note (Optional)</label>
                    <select 
                      value={selectedNoteId} onChange={e => setSelectedNoteId(e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Select a note --</option>
                      {notes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
                    </select>
                  </div>
                  {!selectedNoteId && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Or Paste Text</label>
                      <textarea 
                        value={generateText} onChange={e => setGenerateText(e.target.value)}
                        className="w-full h-32 bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none custom-scrollbar"
                        placeholder="Paste text to generate flashcards from..."
                      />
                    </div>
                  )}
                  <button 
                    onClick={handleGenerate} 
                    disabled={generateMutation.isPending || (!selectedNoteId && !generateText)}
                    className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all disabled:opacity-50"
                  >
                    {generateMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin"/> Generating...</> : <><Sparkles className="w-5 h-5"/> Generate 5 Cards</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
