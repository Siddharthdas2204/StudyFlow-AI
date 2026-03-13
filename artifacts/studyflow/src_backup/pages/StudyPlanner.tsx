import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useGenerateStudyPlan, useCreateStudyPlan, useGetStudyPlans, useDeleteStudyPlan } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, Loader2, Save, Trash2, CheckCircle, Clock, BookOpen } from 'lucide-react';

type DayPlan = { day: string; date: string; tasks: string[]; hours: number };
type GeneratedPlan = { overview: string; dailyPlan: DayPlan[]; tips: string[] };

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [saved, setSaved] = useState(false);

  const queryClient = useQueryClient();
  const { data: plans = [] } = useGetStudyPlans();
  const generateMutation = useGenerateStudyPlan();
  const createMutation = useCreateStudyPlan();
  const deleteMutation = useDeleteStudyPlan();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjects || !examDate) return;
    setSaved(false);
    const result = await generateMutation.mutateAsync({
      data: { subjects, examDate, hoursPerDay }
    });
    setGeneratedPlan(result as GeneratedPlan);
  };

  const handleSave = async () => {
    if (!generatedPlan) return;
    await createMutation.mutateAsync({
      data: {
        subjects,
        examDate,
        planData: JSON.stringify(generatedPlan)
      }
    });
    queryClient.invalidateQueries({ queryKey: ['/api/studyplans'] });
    setSaved(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: ['/api/studyplans'] });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-8 min-h-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-violet-500/10 rounded-2xl ring-1 ring-violet-500/20">
            <Calendar className="w-10 h-10 text-violet-400" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-extrabold">AI Study Planner</h1>
            <p className="text-muted-foreground text-lg">Get a personalized daily study schedule tailored to your exam</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="glass-panel rounded-3xl p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Subjects to Study</label>
                <textarea
                  value={subjects}
                  onChange={e => setSubjects(e.target.value)}
                  placeholder="e.g. Calculus, Data Structures, Machine Learning"
                  className="w-full h-28 bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  min={today}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">
                  Hours/Day: <span className="text-primary">{hoursPerDay}h</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={hoursPerDay}
                  onChange={e => setHoursPerDay(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1h</span><span>10h</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50"
              >
                {generateMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Plan</>}
              </button>
            </form>

            {/* Saved Plans */}
            {plans.length > 0 && (
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="font-semibold uppercase tracking-wider text-muted-foreground text-sm mb-4">Saved Plans</h3>
                <div className="space-y-3">
                  {plans.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-white/5 group">
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{p.subjects}</p>
                        <p className="text-xs text-muted-foreground">Exam: {p.examDate}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated Plan */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {generateMutation.isPending && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-96 glass-panel rounded-3xl"
                >
                  <Sparkles className="w-16 h-16 text-primary animate-pulse mb-4" />
                  <h3 className="text-xl font-medium">Building your plan...</h3>
                  <p className="text-muted-foreground mt-2">Crafting a personalized schedule just for you</p>
                </motion.div>
              )}

              {generatedPlan && !generateMutation.isPending && (
                <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Header */}
                  <div className="glass-panel rounded-3xl p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold text-sm">Plan Ready</span>
                        </div>
                        <h2 className="text-2xl font-display font-bold">Your Study Schedule</h2>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={saved || createMutation.isPending}
                        className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                          saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white text-black hover:bg-white/90'
                        }`}
                      >
                        {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Saved!' : 'Save Plan'}
                      </button>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{generatedPlan.overview}</p>
                  </div>

                  {/* Daily Plan */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {generatedPlan.dailyPlan.map((day, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-display font-bold text-lg">{day.day}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                            <Clock className="w-4 h-4" />
                            {day.hours}h
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {day.tasks.map((task, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-foreground/80">
                              <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tips */}
                  {generatedPlan.tips.length > 0 && (
                    <div className="glass-panel rounded-3xl p-6">
                      <h3 className="font-semibold uppercase tracking-wider text-muted-foreground text-sm mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> Study Tips
                      </h3>
                      <ul className="space-y-2">
                        {generatedPlan.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="text-primary font-bold">{i + 1}.</span>
                            <span className="text-foreground/80">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {!generatedPlan && !generateMutation.isPending && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-96 glass-panel rounded-3xl text-center"
                >
                  <Calendar className="w-20 h-20 text-muted-foreground/30 mb-6" />
                  <h3 className="text-xl font-medium mb-2">No plan generated yet</h3>
                  <p className="text-muted-foreground max-w-sm">Fill in your subjects and exam date, then let AI create your perfect study schedule.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
