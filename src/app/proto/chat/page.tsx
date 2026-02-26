"use client";

import { motion } from "framer-motion";
import { ArrowUp, Bot, FileText, Paperclip, ShieldCheck, User, Zap, Lock } from "lucide-react";
import { useState } from "react";

type Message = {
  role: "user" | "agent" | "system";
  agentType?: string;
  text: string;
  timestamp: string;
  attachment?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
       role: "system",
       text: "You are connected to the central Guldmann routing platform. Data is GDPR-isolated.",
       timestamp: ""
    },
    {
       role: "agent",
       agentType: "Router Agent",
       text: "Good morning, James. I've analyzed your schedule and noted a pending GH3 installation at Northgate Care Home today. How can I assist?",
       timestamp: "09:00"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
       setIsTyping(false);
       setMessages((prev) => [
         ...prev,
         {
           role: "agent",
           agentType: "RAMS Controller",
           text: "I have prepared the Risk Assessment & Method Statement for Northgate based on standard GH3 protocols. Suspended ceiling hazards have been documented automatically. The compliance package is now stored in the central SharePoint.",
           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
           attachment: "RAMS-2041-Northgate.docx"
         }
       ]);
    }, 2500);
  };

  return (
    <div className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-8 h-[calc(100vh-60px)] flex flex-col relative font-sans">
       
       {/* Chat Header */}
       <motion.div 
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/80 sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-10"
       >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
               <Bot className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-slate-900 leading-tight">Interaction Terminal</h1>
              <p className="text-[11px] font-bold text-guld-600 uppercase tracking-widest mt-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Multi-Agent Active</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
               <ShieldCheck className="w-3.5 h-3.5" /> ISO 27001
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
               <Lock className="w-3 h-3" /> Session Sealed
            </span>
         </div>
       </motion.div>

       {/* Conversation Thread */}
       <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-thin pb-32">
         {messages.map((msg, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 10, scale: 0.98 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 0.4 }}
             className={`flex w-full ${msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"}`}
           >
             {msg.role === "system" && (
                <div className="my-4 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                   {msg.text}
                </div>
             )}

             {msg.role === "agent" && (
                <div className="flex gap-4 max-w-[85%]">
                   <div className="w-10 h-10 rounded-[12px] bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-slate-600" />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-guld-600 bg-guld-50 px-2 py-0.5 rounded-[4px] border border-guld-100">{msg.agentType}</span>
                         <span className="text-[10px] font-semibold text-slate-400 ">{msg.timestamp}</span>
                      </div>
                      <div className="p-5 rounded-[16px] rounded-tl-[4px] bg-white border border-slate-200/80 text-[14px] leading-relaxed text-slate-700 shadow-[0_8px_30px_rgba(15,23,42,0.03)] selection:bg-guld-200">
                         {msg.text}
                      </div>

                      {msg.attachment && (
                         <div className="mt-3 flex items-center gap-4 p-4 rounded-[16px] bg-slate-50 border border-slate-200 w-full hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-10 h-10 rounded-[10px] bg-emerald-100 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                               <FileText className="w-5 h-5 text-emerald-700" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[13px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{msg.attachment}</span>
                               <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">SharePoint Synced</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">324 KB</span>
                               </div>
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             )}

             {msg.role === "user" && (
                <div className="flex gap-4 max-w-[75%] flex-row-reverse">
                   <div className="w-10 h-10 rounded-[12px] bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-4 h-4 text-white" />
                   </div>
                   <div className="flex flex-col gap-1.5 items-end">
                      <span className="text-[10px] font-semibold text-slate-400">{msg.timestamp}</span>
                      <div className="p-5 rounded-[16px] rounded-tr-[4px] bg-slate-900 text-[14px] leading-relaxed text-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                         {msg.text}
                      </div>
                   </div>
                </div>
             )}
           </motion.div>
         ))}
         
         {isTyping && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4 max-w-[85%]">
               <div className="w-10 h-10 rounded-[12px] bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                   <Bot className="w-4 h-4 text-slate-600" />
                </div>
                <div className="p-5 rounded-[16px] rounded-tl-[4px] bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.03)] flex items-center gap-2">
                   <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-2 h-2 rounded-full bg-slate-300" />
                   <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-2 h-2 rounded-full bg-slate-300" />
                   <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
            </motion.div>
         )}
       </div>

       {/* Fixed Input Console */}
       <div className="absolute bottom-6 left-6 right-6 lg:left-0 lg:right-0 bg-[#FAFAFA]/90 backdrop-blur-xl">
         <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto border border-slate-200/80 bg-white rounded-[20px] shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 hover:border-slate-300 transition-colors group">
           <button type="button" className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors z-10">
              <Paperclip className="w-5 h-5" />
           </button>
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Instruct an agent or retrieve a document..."
             className="w-full h-[64px] pl-[64px] pr-[70px] bg-transparent text-[15px] font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
           />
           <button 
             type="submit"
             disabled={!input.trim()}
             className="absolute right-3 w-[44px] h-[44px] flex items-center justify-center bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 rounded-[14px] shadow-[0_4px_12px_rgba(15,23,42,0.15)] transition-all z-10"
           >
              <ArrowUp className="w-5 h-5" />
           </button>
         </form>
         <div className="text-center mt-4 pb-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
               All communications are encrypted & isolated
            </span>
         </div>
       </div>
    </div>
  );
}
