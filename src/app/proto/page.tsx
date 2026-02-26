"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Activity, Bot, ShieldCheck, Database, Server } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/proto/setup");
  };

  return (
    <div className="absolute inset-0 bg-white flex overflow-hidden font-sans">
      {/* Left Pane - Visual Medical Tech Side */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between relative overflow-hidden px-12 py-16 border-r border-border bg-slate-50">
        
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-guld-500/10 via-slate-200/50 to-transparent rounded-full blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 via-emerald-100/30 to-transparent rounded-full blur-3xl opacity-60 translate-y-1/4 -translate-x-1/4" />
        
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

        {/* Branding Area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 font-semibold tracking-[0.2em] text-[11px] text-guld-600 uppercase mb-16">
            <div className="w-2 h-2 rounded-full bg-guld-500 shadow-[0_0_12px_rgba(205,150,43,0.8)]" />
            Guldmann Internal
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h1 className="text-[3rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-6">
              Engineering <br />
              <span className="text-slate-400">Intelligence.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-md">
              Secure, multi-agent orchestration for clinical ceiling track compliance. Available the moment you log in.
            </p>
          </motion.div>
        </div>

        {/* Feature Grid representing "Hospital Industry" & "Security" */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3, duration: 1 }}
           className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-10 max-w-lg mt-12"
        >
           {[
             { title: "RAMS Generation", icon: Activity, desc: "Automated HSE site compliance." },
             { title: "GDPR Isolated", icon: ShieldCheck, desc: "Strict per-user data governance." },
             { title: "Specialist Agents", icon: Bot, desc: "8 native roles routed silently." },
             { title: "SharePoint Link", icon: Database, desc: "Direct tenant-to-tenant sync." }
           ].map((feature, i) => (
             <div key={i} className="flex flex-col gap-2">
               <feature.icon className="w-5 h-5 text-slate-400" />
               <h3 className="text-sm font-bold text-slate-800 tracking-tight">{feature.title}</h3>
               <p className="text-[13px] text-slate-500 leading-snug">{feature.desc}</p>
             </div>
           ))}
        </motion.div>

        {/* Footer info */}
        <div className="relative z-10 mt-auto pt-12">
           <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <span>v2.1.0</span>
             <span className="w-1 h-1 rounded-full bg-slate-300" />
             <span>ISO 27001 Ready</span>
             <span className="w-1 h-1 rounded-full bg-slate-300" />
             <span className="flex items-center gap-1.5"><Server className="w-3 h-3" /> All systems operational</span>
           </div>
        </div>
      </div>

      {/* Right Pane - Strict Minimal Login */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center relative bg-white px-6">
        <motion.div 
           initial={{ opacity: 0, scale: 0.96 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
           className="w-full max-w-[420px]"
        >
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Secure Gateway</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Verify your identity with Microsoft Azure AD to access the Guldmann agent platform.</p>
          </div>

          <div className="p-8 pb-10 rounded-[24px] bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 relative">
             <button
               onClick={handleLogin}
               className="group relative w-full h-[54px] flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl transition-all shadow-sm overflow-hidden"
             >
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-slate-50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
               
               {/* Windows / MSFT Logo SVG */}
               <svg width="22" height="22" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="relative z-10 shrink-0">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
               </svg>
               <span className="relative z-10 uppercase tracking-wide text-xs">Sign in with Microsoft 365</span>
               
               <div className="absolute right-3 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all z-10">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
               </div>
             </button>

             <div className="mt-8 flex items-center justify-center gap-1.5 pt-6 border-t border-slate-100">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                 Identity Managed by Azure Active Directory
               </span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
