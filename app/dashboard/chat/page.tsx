"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, Loader2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm Socrates, your AI study tutor. What concept are we mastering today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("Computer Science");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          subject
        })
      });

      if (!response.ok) throw new Error("Failed to connect to Socrates");

      const reader = response.body?.getReader();
      const decoder = new TextEncoder();
      let assistantResponse = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        assistantResponse += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantResponse;
          return newMessages;
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Subject Select */}
      <div className="flex items-center justify-between glass p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center neon-glow">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Socrates AI</h3>
            <p className="text-xs text-white/40">Adaptive Academic Tutor</p>
          </div>
        </div>

        <select 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
        >
          <option value="Computer Science">Computer Science</option>
          <option value="Advanced Mathematics">Advanced Mathematics</option>
          <option value="Theoretical Physics">Theoretical Physics</option>
          <option value="Organic Chemistry">Organic Chemistry</option>
          <option value="World History">World History</option>
        </select>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-y-auto p-6 space-y-6 flex flex-col">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === "assistant" ? "bg-primary/20 text-primary" : "bg-white/10 text-white"
              )}>
                {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={cn(
                "px-5 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "assistant" 
                  ? "bg-white/5 border border-white/10" 
                  : "bg-primary text-white shadow-lg shadow-primary/10"
              )}>
                <div className="prose prose-invert prose-sm">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Socrates anything..."
          className="w-full glass py-4 pl-6 pr-14 rounded-2xl border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-white/20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          {input.trim() ? (
             <button 
               type="submit"
               disabled={isLoading}
               className="p-2.5 bg-primary text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
             >
               <Send className="w-5 h-5" />
             </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 opacity-50">
               <Sparkles className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Magic Mode</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
