"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Search, Send, Clock, Star, MoreVertical, Archive, Trash2, Reply } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mockMessages = [
  {
    id: 1,
    sender: "Stripe Recruiting",
    subject: "Interview Request: Frontend Engineer",
    preview: "Hi there! We loved your application and would like to schedule an initial technical screen...",
    time: "10:30 AM",
    date: "Today",
    unread: true,
    important: true,
    content: "Hi!\n\nThank you for applying to the Frontend Engineer position at Stripe. We were extremely impressed with your verified StudyFlow technical resume and your match score in our system.\n\nWe would like to invite you to an initial 45-minute technical screen with one of our Engineering Managers next week. Please let us know what your availability looks like regarding the following dates:\n\n- Tuesday at 10 AM PST\n- Wednesday at 2 PM PST\n- Friday at 11 AM PST\n\nLooking forward to hearing from you!\n\nBest regards,\nThe Stripe Recruiting Team"
  },
  {
    id: 2,
    sender: "Netflix Talent Acquisition",
    subject: "Next Steps for Senior UI Developer",
    preview: "Thank you for your interest in Netflix. Your profile matches our current requirements...",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    important: false,
    content: "Hello,\n\nWe appreciate you taking the time to submit your authenticated application through StudyFlow AI.\n\nYour profile definitely aligns with what we're looking for in a UI Developer. We will be reviewing all candidate profiles this week and will follow up with the next steps for a coding assessment soon.\n\nThank you,\nNetflix Talent Team"
  },
  {
    id: 3,
    sender: "Google Careers",
    subject: "Application Received: Software Engineer II",
    preview: "We have received your resume and application for the Google Software Engineering opening in...",
    time: "Mar 12",
    date: "Mar 12",
    unread: false,
    important: false,
    content: "Thank you for applying to Google.\n\nWe have successfully received your automatically parsed resume. Our recruiters are currently reviewing your background against the requirements for the Software Engineer II role.\n\nWe will be in touch if your qualifications match our needs.\n\nBest,\nGoogle Careers Team"
  }
];

export default function InboxPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSelect = (msg: any) => {
    setSelectedMessage(msg);
    setIsReplying(false);
    setReplyText("");
    if (msg.unread) {
      setMessages(messages.map(m => m.id === msg.id ? { ...m, unread: false } : m));
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    toast.success("Reply encrypted and transmitted successfully!");
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col pt-4 pb-12">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase relative">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Inbox</span>
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Encrypted Employer Communications</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        {/* Thread List */}
        <div className="md:col-span-5 lg:col-span-4 glass-card border border-white/10 flex flex-col overflow-hidden shadow-2xl relative z-10">
          
          {/* Search bar */}
          <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search encrypted channels..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={cn(
                  "p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] group",
                  selectedMessage?.id === msg.id ? "bg-primary/10 border-l-2 border-l-primary" : "border-l-2 border-l-transparent",
                  msg.unread ? "bg-white/[0.02]" : ""
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn("text-xs font-black uppercase tracking-wider line-clamp-1", msg.unread ? "text-white" : "text-white/70")}>
                    {msg.sender}
                  </h4>
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ml-2", msg.unread ? "text-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "text-white/30")}>
                    {msg.time}
                  </span>
                </div>
                <h5 className={cn("text-sm font-bold mb-2 line-clamp-1", msg.unread ? "text-white" : "text-white/60")}>
                  {msg.subject}
                </h5>
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {msg.preview}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {msg.important && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    {msg.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold group-hover:text-primary/50 transition-colors">StudyFlow Connect</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message View Area */}
        <div className="md:col-span-7 lg:col-span-8 glass-card border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
           
           {!selectedMessage ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gradient-to-tr from-black/40 to-transparent">
               <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                 <Mail className="w-10 h-10 text-white/20" />
               </div>
               <h3 className="text-xl font-black tracking-tight uppercase mb-2">Select a Transmission</h3>
               <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Pick an encrypted message to decrypt and view its contents.</p>
             </div>
           ) : (
             <>
               {/* Read Header */}
               <div className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-start justify-between">
                 <div>
                   <h2 className="text-xl font-black tracking-tight mb-2 text-white">{selectedMessage.subject}</h2>
                   <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                     <span className="text-primary">{selectedMessage.sender}</span>
                     <span className="text-white/20">•</span>
                     <span className="text-white/40">{selectedMessage.date} at {selectedMessage.time.replace("Today", "10:30 AM")}</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                     <Reply className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                     <Archive className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-2">
                     <MoreVertical className="w-4 h-4" />
                   </button>
                 </div>
               </div>

               {/* Message Body */}
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gradient-to-bl from-transparent via-black/20 to-black/60 relative">
                 {/* Neon Glow Accent */}
                 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] pointer-events-none" />
                 
                 <div className="relative z-10 text-sm text-white/80 leading-loose whitespace-pre-wrap font-medium">
                   {selectedMessage.content}
                 </div>
               </div>

               {/* Reply Section */}
               <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
                 {!isReplying ? (
                   <div 
                     onClick={() => setIsReplying(true)}
                     className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold cursor-text hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3"
                   >
                     <Reply className="w-4 h-4" />
                     Click here to write an encrypted reply...
                   </div>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex flex-col gap-3"
                   >
                     <textarea 
                       autoFocus
                       value={replyText}
                       onChange={(e) => setReplyText(e.target.value)}
                       placeholder="Draft your response here..."
                       className="w-full h-32 resize-none bg-black/60 border border-primary/30 rounded-xl p-4 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/30 custom-scrollbar shadow-inner shadow-primary/5"
                     />
                     <div className="flex items-center justify-between">
                       <button 
                         onClick={() => { setIsReplying(false); setReplyText(""); }}
                         className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                       >
                         Cancel
                       </button>
                       <button 
                         onClick={handleSendReply}
                         disabled={!replyText.trim()}
                         className="px-6 py-2.5 bg-primary hover:bg-primary/80 disabled:bg-primary/30 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:shadow-none transition-all flex items-center gap-2"
                       >
                         <Send className="w-3.5 h-3.5" />
                         Transmit
                       </button>
                     </div>
                   </motion.div>
                 )}
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
