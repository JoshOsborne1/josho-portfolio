"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, ChevronRight, Stethoscope, Briefcase, Activity, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [comm, setComm] = useState("");
  const [desc, setDesc] = useState("");
  
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else router.push("/proto/dashboard");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as const;


  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#FAFAFA] font-sans overflow-hidden">
      
      {/* Background medical grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 px-6">
        
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
           className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
             <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Verification Complete</span>
          </div>
          
          <h1 className="text-[2.5rem] font-bold tracking-tight text-slate-900 leading-[1.1] mb-3">
             Configure Your <span className="text-guld-600">Agent</span>
          </h1>
          <p className="text-[15px] font-medium text-slate-500 max-w-md mx-auto">
             Establish your context. Your personal router will use this to optimize RAMS, SharePoint searches, and multi-agent directives.
          </p>
        </motion.div>

        {/* Setup Card */}
        <motion.div
           initial={{ opacity: 0, scale: 0.96 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
           className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-[0_24px_64px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
        >
          {/* Progress Strip */}
          <div className="flex w-full h-1.5 bg-slate-100">
             <motion.div 
                className="h-full bg-guld-500" 
                initial={{ width: "33%" }}
                animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
             />
          </div>

          <div className="p-8 sm:p-12 relative min-h-[460px] flex flex-col">
            
            {/* Nav Back */}
            {step > 1 && (
               <button 
                  onClick={handleBack}
                  className="absolute top-6 left-6 sm:top-8 sm:left-8 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" />
               </button>
            )}

            <AnimatePresence mode="wait">
               {step === 1 && (
                 <motion.div key="1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="pt-6">
                   <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-slate-50 border border-slate-200 mb-6 shadow-sm">
                      <Briefcase className="w-5 h-5 text-slate-700" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-900 mb-2">1. Operating Role</h2>
                   <p className="text-[13px] text-slate-500 font-medium mb-8">Select your primary function to calibrate document schemas.</p>
                   
                   <div className="grid sm:grid-cols-2 gap-4">
                     {[
                       { id: "field", title: "Field Engineer", desc: "Installations & RAMS", icon: Activity },
                       { id: "hs", title: "H&S Manager", desc: "Compliance Sign-offs", icon: ShieldCheck },
                       { id: "service", title: "Service Ops", desc: "Maintenance & Routing", icon: Zap },
                       { id: "sales", title: "Commercial", desc: "Quotes & CRM", icon: Briefcase }
                     ].map((r) => {
                        const Icon = r.icon;
                        const active = role === r.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`flex flex-col items-start text-left p-5 rounded-[18px] border transition-all ${
                               active 
                               ? "border-guld-500/40 bg-guld-50/50 shadow-[0_8px_24px_rgba(205,150,43,0.08)] ring-1 ring-guld-500/20" 
                               : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                            }`}
                          >
                             <div className="flex items-center justify-between w-full mb-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-guld-100 text-guld-600" : "bg-slate-100 text-slate-500"}`}>
                                   <Icon className="w-4 h-4" />
                                </div>
                                {active && <CheckCircle2 className="w-5 h-5 text-guld-500" />}
                             </div>
                             <span className={`text-[15px] font-bold ${active ? "text-guld-700" : "text-slate-800"}`}>{r.title}</span>
                             <span className={`text-[11px] uppercase tracking-widest mt-1 font-bold ${active ? "text-guld-500" : "text-slate-400"}`}>{r.desc}</span>
                          </button>
                        );
                     })}
                   </div>
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div key="2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="pt-6">
                   <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-slate-50 border border-slate-200 mb-6 shadow-sm">
                      <Stethoscope className="w-5 h-5 text-slate-700" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-900 mb-2">2. Clinical Acumen</h2>
                   <p className="text-[13px] text-slate-500 font-medium mb-8">How should your agent format operational output?</p>
                   
                   <div className="flex flex-col gap-4">
                     {[
                        { id: "direct", title: "Direct & Concise", desc: "Bullet points, strict factual logging. Best for field reports." },
                        { id: "detailed", title: "Comprehensive", desc: "Full context, step-by-step reasoning. Best for audits and H&S analysis." }
                     ].map((c) => {
                        const active = comm === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setComm(c.id)}
                            className={`flex flex-col items-start p-6 rounded-[20px] border transition-all ${
                               active 
                               ? "border-guld-500/40 bg-guld-50/50 shadow-[0_8px_24px_rgba(205,150,43,0.08)] ring-1 ring-guld-500/20" 
                               : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                            }`}
                          >
                            <span className={`text-base font-bold ${active ? "text-guld-700" : "text-slate-800"}`}>{c.title}</span>
                            <span className={`text-[13px] leading-relaxed mt-1.5 ${active ? "text-guld-600/80" : "text-slate-500"}`}>{c.desc}</span>
                          </button>
                        );
                     })}
                   </div>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div key="3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="pt-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-slate-50 border border-slate-200 mb-6 shadow-sm">
                      <Bot className="w-5 h-5 text-slate-700" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-900 mb-2">3. Initial Context Directives</h2>
                   <p className="text-[13px] text-slate-500 font-medium mb-8">Provide strict context defining your day-to-day operations.</p>
                   
                   <textarea
                      className="w-full min-h-[160px] p-6 rounded-[20px] border border-slate-200 bg-slate-50 text-[14px] leading-relaxed text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-guld-400 focus:ring-4 focus:ring-guld-400/10 transition-all resize-none shadow-inner placeholder:text-slate-400"
                      placeholder="e.g. My primary focus is GH3 ceiling track installations in NHS Trust hospitals. I need RAMS drafted under standard HTM guidelines and my documents must be saved to the London compliance folder structure..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                   />
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Footer Action */}
            <div className="mt-auto pt-10 border-t border-slate-100/0 flex justify-end">
               <button
                 onClick={handleNext}
                 disabled={(step === 1 && !role) || (step === 2 && !comm) || (step === 3 && !desc.trim())}
                 className="group h-[52px] px-8 rounded-[16px] bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 text-white text-[13px] uppercase tracking-widest font-bold shadow-[0_8px_24px_rgba(15,23,42,0.2)] transition-all flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden relative"
               >
                 <span className="relative z-10">{step === 3 ? "Initialize Workspace" : "Continue Routing"}</span>
                 <div className="relative z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                 </div>
               </button>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
