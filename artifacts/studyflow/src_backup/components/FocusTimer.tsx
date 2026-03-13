import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X, Brain } from 'lucide-react';
import { useFocusTimer } from '@/hooks/use-focus-timer';

export function FocusTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const { isActive, formattedTime, sessionCount, toggleTimer, resetTimer } = useFocusTimer();

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:scale-105 transition-transform flex items-center justify-center border border-white/20"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {isActive ? (
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <Timer className="w-6 h-6 relative z-10" />
          </div>
        ) : (
          <Brain className="w-6 h-6" />
        )}
      </motion.button>

      {/* Expanded Widget */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-24 right-6 z-50 w-80 p-6 rounded-3xl glass-panel-heavy overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-display font-bold text-foreground">Focus Mode</h3>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-8 relative z-10">
                <div className="text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter tabular-nums drop-shadow-lg">
                  {formattedTime}
                </div>
                <p className="text-sm text-primary font-medium mt-2">
                  Session {sessionCount + 1}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 relative z-10">
                <button
                  onClick={() => resetTimer(25)}
                  className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  title="Reset (25m)"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95"
                >
                  {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => resetTimer(5)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors"
                  >
                    5m Break
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
