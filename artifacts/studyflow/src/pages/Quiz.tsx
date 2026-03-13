import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useGetNotes, useGenerateQuiz, useCreateQuiz, useGetQuizzes } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, X, Sparkles, Loader2, Trophy, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

type Question = {
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  answer: string;
  explanation: string;
};

export default function Quiz() {
  const [step, setStep] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [customText, setCustomText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const queryClient = useQueryClient();
  const { data: notes = [] } = useGetNotes();
  const { data: history = [] } = useGetQuizzes();
  const generateMutation = useGenerateQuiz();
  const createQuizMutation = useCreateQuiz();

  const handleGenerate = async () => {
    let content = customText;
    if (selectedNoteId) {
      const note = notes.find(n => n.id.toString() === selectedNoteId);
      if (note) content = note.content;
    }
    if (!content) return;

    const qs = await generateMutation.mutateAsync({ data: { content, count: 8 } });
    setQuestions(qs as Question[]);
    setAnswers(new Array(qs.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setStep('quiz');
  };

  const handleAnswer = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[current] = option;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      const score = answers.filter((a, i) => a === questions[i]?.answer).length;
      await createQuizMutation.mutateAsync({
        data: {
          noteId: selectedNoteId ? parseInt(selectedNoteId) : undefined,
          title: selectedNoteId ? (notes.find(n => n.id.toString() === selectedNoteId)?.title ?? 'Custom Quiz') : 'Custom Quiz',
          score,
          total: questions.length
        }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      setStep('results');
      if (score / questions.length >= 0.7) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const currentQ = questions[current];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-8 min-h-full">
        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-emerald-500/10 rounded-2xl ring-1 ring-emerald-500/20">
                  <CheckSquare className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-extrabold">AI Quiz Generator</h1>
                  <p className="text-muted-foreground text-lg">Test your knowledge with AI-generated questions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel rounded-3xl p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Source Note</label>
                    <select
                      value={selectedNoteId}
                      onChange={e => setSelectedNoteId(e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">-- Select a note --</option>
                      {notes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
                    </select>
                  </div>

                  {!selectedNoteId && (
                    <div>
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Or Paste Text</label>
                      <textarea
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                        placeholder="Paste your study material here..."
                        className="w-full h-48 bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none text-sm"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending || (!selectedNoteId && !customText)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 text-lg"
                  >
                    {generateMutation.isPending ? <><Loader2 className="w-6 h-6 animate-spin" /> Generating Quiz...</> : <><Sparkles className="w-6 h-6" /> Generate 8-Question Quiz</>}
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">Past Quizzes</h3>
                  {history.length === 0 ? (
                    <div className="glass-panel rounded-2xl p-6 text-center text-muted-foreground text-sm">No quizzes yet</div>
                  ) : (
                    history.slice(-5).reverse().map(q => (
                      <div key={q.id} className="glass-panel rounded-2xl p-4">
                        <p className="font-medium text-sm truncate mb-2">{q.title}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Score</span>
                          <span className={`font-bold text-sm ${(q.score ?? 0) / q.total >= 0.7 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {q.score ?? 0}/{q.total}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && currentQ && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Question {current + 1} of {questions.length}</span>
                  <button onClick={() => setStep('setup')} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <X className="w-4 h-4" /> Exit
                  </button>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-10 mb-6 min-h-[200px] flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-6 w-fit capitalize">
                  {currentQ.type.replace('_', ' ')}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold leading-snug">{currentQ.question}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentQ.options.map((opt, i) => {
                  const isCorrect = opt === currentQ.answer;
                  const isSelected = selected === opt;
                  let cls = 'border border-white/10 bg-card hover:border-primary/40 hover:bg-primary/5';
                  if (selected !== null) {
                    if (isCorrect) cls = 'border-emerald-500/60 bg-emerald-500/10';
                    else if (isSelected) cls = 'border-red-500/60 bg-red-500/10';
                    else cls = 'border-white/5 bg-card/50 opacity-50';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={selected !== null}
                      className={`p-5 rounded-2xl text-left transition-all flex items-center gap-4 ${cls}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm shrink-0">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-medium">{opt}</span>
                      {selected !== null && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="bg-secondary/50 border border-white/10 rounded-2xl p-6 mb-6 overflow-hidden"
                  >
                    <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-2">Explanation</h4>
                    <p className="text-foreground/90">{currentQ.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {selected && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all text-lg"
                >
                  {current < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="glass-panel rounded-3xl p-12 max-w-2xl mx-auto">
                <Trophy className={`w-20 h-20 mx-auto mb-6 ${pct >= 70 ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                <h2 className="text-5xl font-display font-extrabold mb-2">{pct}%</h2>
                <p className="text-xl text-muted-foreground mb-2">{score} out of {questions.length} correct</p>
                <p className={`text-lg font-semibold mb-10 ${pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {pct >= 70 ? '🎉 Excellent work!' : pct >= 50 ? '📚 Keep studying!' : '💪 Review the material and try again!'}
                </p>

                <div className="space-y-3 mb-10 text-left max-h-72 overflow-y-auto">
                  {questions.map((q, i) => {
                    const correct = answers[i] === q.answer;
                    return (
                      <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${correct ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        {correct ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-sm font-medium">{q.question}</p>
                          {!correct && <p className="text-xs text-muted-foreground mt-1">Correct: <span className="text-emerald-400">{q.answer}</span></p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => setStep('setup')} className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all">
                  Take Another Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
