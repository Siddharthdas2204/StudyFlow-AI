import { useState, useRef, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useGetChatHistory, useAiChat, useSaveChatMessage, useClearChatHistory } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Send, Bot, User, Trash2, Loader2, Sparkles, Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';

const SUBJECTS = ["General", "Math", "Programming", "Science", "AI & Machine Learning", "History", "Language", "Biology", "Physics", "Chemistry"];

export default function Tutor() {
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('Programming');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { data: history = [], isLoading } = useGetChatHistory();
  const aiChatMutation = useAiChat();
  const saveMessageMutation = useSaveChatMessage();
  const clearHistoryMutation = useClearChatHistory();

  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(text);
    // Auto-submit after a short delay for voice input
    setTimeout(() => {
      inputRef.current?.form?.requestSubmit();
    }, 400);
  }, []);

  const { voiceState, transcript, speakingMessageId, isSupported, startListening, speakText, stopSpeaking } = useVoiceAssistant({
    onTranscript: handleVoiceTranscript,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, aiChatMutation.isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = (input || transcript).trim();
    if (!userMessage || aiChatMutation.isPending) return;

    setInput('');

    await saveMessageMutation.mutateAsync({
      data: { role: 'user', content: userMessage, subject }
    });
    queryClient.invalidateQueries({ queryKey: ['/api/chat'] });

    const formattedHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const aiResponse = await aiChatMutation.mutateAsync({
        data: { message: userMessage, subject, history: formattedHistory }
      });

      await saveMessageMutation.mutateAsync({
        data: { role: 'assistant', content: aiResponse.response, subject }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/chat'] });

      if (autoSpeak) {
        speakText(aiResponse.response, 'latest');
      }
    } catch (error) {
      console.error('AI Chat failed:', error);
    }
  };

  const handleClear = async () => {
    if (confirm('Clear all chat history?')) {
      stopSpeaking();
      await clearHistoryMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ['/api/chat'] });
    }
  };

  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';

  return (
    <AppLayout>
      <div className="h-full flex flex-col max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-card/40 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-primary/20 rounded-xl">
              <Bot className="w-8 h-8 text-primary" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Socrates AI</h1>
              <p className="text-sm text-muted-foreground">Your personal study tutor. Ask me anything.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Auto-speak toggle */}
            {isSupported && (
              <button
                onClick={() => setAutoSpeak(prev => !prev)}
                title={autoSpeak ? 'Auto-read responses: ON' : 'Auto-read responses: OFF'}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  autoSpeak
                    ? 'bg-green-500/20 border-green-500/30 text-green-400'
                    : 'bg-secondary border-white/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">Auto-read</span>
              </button>
            )}

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 md:w-auto bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button
              onClick={handleClear}
              className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors border border-transparent hover:border-destructive/20"
              title="Clear History"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col mb-4 relative">
          {/* Listening overlay banner */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-3 py-3 bg-primary/90 backdrop-blur-sm"
              >
                {/* Animated sound bars */}
                <div className="flex items-end gap-0.5 h-5">
                  {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white rounded-full"
                      animate={{ height: [`${h * 4}px`, `${h * 14}px`, `${h * 4}px`] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
                <span className="text-white text-sm font-semibold">
                  {transcript ? `"${transcript}"` : 'Listening… speak now'}
                </span>
                <Mic className="w-4 h-4 text-white/80" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">How can I help you study?</h3>
                <p className="text-muted-foreground mb-8">
                  Select a subject and ask a question to begin. I can explain concepts, solve problems, or test your knowledge.
                  {isSupported && <span className="block mt-1 text-primary/80">Use the <Mic className="w-3 h-3 inline mb-0.5" /> mic button to speak!</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {["Explain Quantum Computing to a 5 year old", "How does a CPU work?", "Help me practice calculus", "What are SOLID principles?"].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="p-3 text-sm text-left bg-secondary/50 hover:bg-secondary rounded-xl border border-white/5 transition-colors"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {history.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg
                        ${msg.role === 'user' ? 'bg-gradient-to-br from-accent to-pink-500' : 'bg-gradient-to-br from-primary to-blue-600'}`}
                      >
                        {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                      </div>

                      <div className="group relative">
                        <div className={`p-5 rounded-3xl ${
                          msg.role === 'user'
                            ? 'bg-accent/20 border border-accent/30 rounded-tr-sm'
                            : 'bg-secondary/80 border border-white/5 rounded-tl-sm'
                          } ${speakingMessageId === msg.id ? 'ring-2 ring-green-500/50 border-green-500/30' : ''}`}
                        >
                          <div className="markdown-body text-sm md:text-base">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>

                        {/* TTS button on AI messages */}
                        {msg.role === 'assistant' && isSupported && (
                          <button
                            onClick={() => speakText(msg.content, msg.id)}
                            title={speakingMessageId === msg.id ? 'Stop reading' : 'Read aloud'}
                            className={`absolute -bottom-3 ${msg.role === 'user' ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shadow-lg transition-all ${
                              speakingMessageId === msg.id
                                ? 'bg-green-500 text-white opacity-100'
                                : 'bg-secondary border border-white/10 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {speakingMessageId === msg.id ? (
                              <>
                                <Radio className="w-3 h-3 animate-pulse" />
                                <span>Reading…</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Read</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {aiChatMutation.isPending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div className="p-5 rounded-3xl bg-secondary/80 border border-white/5 rounded-tl-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              {/* Voice mic button */}
              {isSupported && (
                <motion.button
                  type="button"
                  onClick={startListening}
                  whileTap={{ scale: 0.9 }}
                  disabled={aiChatMutation.isPending || isSpeaking}
                  title={isListening ? 'Stop listening' : 'Speak your question'}
                  className={`relative shrink-0 p-3 rounded-full transition-all disabled:opacity-40 ${
                    isListening
                      ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'bg-secondary border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30'
                  }`}
                >
                  {isListening ? (
                    <>
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
                      <MicOff className="w-5 h-5 relative z-10" />
                    </>
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </motion.button>
              )}

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening…' : `Ask Socrates about ${subject}…`}
                disabled={aiChatMutation.isPending || isListening}
                className="flex-1 bg-secondary/80 border border-white/10 rounded-full pl-6 pr-14 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60 text-base shadow-inner"
              />

              <button
                type="submit"
                disabled={(!input.trim() && !transcript) || aiChatMutation.isPending || isListening}
                className="absolute right-2 p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-primary/50"
              >
                {aiChatMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>

            {/* Voice status hint */}
            {isSupported && (
              <p className="text-center text-xs text-muted-foreground/60 mt-2">
                {isListening
                  ? 'Tap mic again or wait — message will send automatically'
                  : isSpeaking
                  ? 'AI is reading the response…'
                  : '🎤 Tap the mic to ask by voice · Hover AI messages to read them aloud'}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
