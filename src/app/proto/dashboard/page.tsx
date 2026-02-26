"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Bot, Calendar, CheckSquare, Clock, FileCheck, Search, Activity, HeartPulse, Building2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-10 pb-32">
       
      {/* Top Bar / Greeting */}
      <motion.header
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ type: "spring", stiffness: 300, damping: 25 }}
         className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-4 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
             <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">Live &middot; Authenticated</span>
          </div>
          <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 leading-[1.1]">James&apos; Workspace.</h1>
          <p className="text-[14px] font-medium text-slate-500 max-w-md mt-2">
             You have <strong className="text-slate-800">2 upcoming jobs</strong> and <strong className="text-slate-800">1 document</strong> awaiting sign-off.
          </p>
        </div>
        <div className="flex items-center gap-4">
           {/* Omni Search Bar representing smart routing */}
           <div className="relative group w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Bot className="w-4 h-4 text-slate-400 group-focus-within:text-guld-500 transition-colors" />
              </div>
              <input 
                 type="text" 
                 placeholder="Search documents or trigger agent..." 
                 className="w-full bg-white border border-slate-200/80 rounded-full py-2.5 pl-10 pr-4 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-300 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all placeholder:text-slate-400"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                 <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                    Cmd K
                 </kbd>
              </div>
           </div>
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Central Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Critical Alerts Strip */}
          <div className="grid sm:grid-cols-2 gap-4">
             {/* Alert Card */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="bg-white border-l-4 border-l-red-500 border-y border-r border-y-slate-200 border-r-slate-200 rounded-r-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] relative overflow-hidden group hover:bg-slate-50 transition-colors"
             >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <AlertCircle className="w-24 h-24 text-red-500" />
                </div>
                <div className="inline-flex items-center gap-2 mb-4">
                   <div className="w-6 h-6 rounded-[8px] bg-red-50 border border-red-100 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                   </div>
                   <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-red-600">Action Required</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">Hoist Certifications Expiring</h3>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-6">
                   Lifting equipment at Royal Surrey Hospital requires LOLER recertification prior to Friday.
                </p>
                <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-[11px] font-bold tracking-widest uppercase text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-sm transition-all inline-flex items-center gap-2">
                   Generate Notice <ArrowRight className="w-3.5 h-3.5" />
                </button>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.15 }}
               className="bg-white border-l-4 border-l-guld-500 border-y border-r border-y-slate-200 border-r-slate-200 rounded-r-2xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] relative overflow-hidden group hover:bg-slate-50 transition-colors"
             >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <CheckSquare className="w-24 h-24 text-guld-500" />
                </div>
                <div className="inline-flex items-center gap-2 mb-4">
                   <div className="w-6 h-6 rounded-[8px] bg-guld-50 border border-guld-100 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-guld-600" />
                   </div>
                   <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-guld-600">Pending Sign-off</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">Northgate RAMS Ready</h3>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-6">
                   Site-specific method statement for GH3 track installation has been automated and awaits your signature.
                </p>
                <button className="h-9 px-4 rounded-xl bg-guld-600 hover:bg-guld-500 text-white border border-guld-700 text-[11px] font-bold tracking-widest uppercase shadow-md shadow-guld-500/20 transition-all inline-flex items-center gap-2">
                   Review Document <ArrowRight className="w-3.5 h-3.5" />
                </button>
             </motion.div>
          </div>

          {/* Detailed Job Queue */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="bg-white border border-slate-200/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.04)] ring-1 ring-slate-100 overflow-hidden"
          >
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-[12px] bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      <Activity className="w-4 h-4 text-slate-700" />
                   </div>
                   <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Active Operations</h2>
                </div>
                <span className="px-2.5 py-1 rounded-[6px] bg-slate-100 border border-slate-200 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                   Today
                </span>
             </div>
             <div className="divide-y divide-slate-100">
                {[
                   { id: "JOB-2041", type: "Installation", icon: CheckSquare, desc: "GH3 Ceiling Track", loc: "Northgate Care Home", time: "09:00 - 14:00", state: "In Progress", stateColor: "text-amber-600 bg-amber-50 border-amber-200" },
                   { id: "SV-8832", type: "Routine Servicing", icon: HeartPulse, desc: "Hoist Weight Test", loc: "Swindon General Hospital", time: "14:30 - 16:30", state: "Scheduled", stateColor: "text-slate-600 bg-slate-50 border-slate-200" },
                   { id: "DOC-991", type: "Tender Draft", icon: FileCheck, desc: "Commercial Proposal", loc: "St. Jude Clinic", time: "Awaiting Input", state: "Agent Prompt", stateColor: "text-emerald-600 bg-emerald-50 border-emerald-200" }
                ].map((job) => {
                   const Icon = job.icon;
                   return (
                     <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-[16px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-800 transition-colors shadow-sm">
                              <Icon className="w-5 h-5" />
                           </div>
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-3">
                                 <h4 className="text-[14px] font-bold text-slate-900 tracking-tight">{job.id}</h4>
                                 <span className="px-2 py-0.5 rounded-[6px] bg-white border border-slate-200 text-[10px] font-bold tracking-widest uppercase text-slate-500 shadow-sm">{job.type}</span>
                              </div>
                              <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {job.loc}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right hidden sm:block">
                              <div className="text-[13px] font-bold text-slate-700">{job.time}</div>
                              <div className="text-[11px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{job.desc}</div>
                           </div>
                           <span className={`px-2.5 py-1 rounded-[6px] border text-[10px] font-bold tracking-widest uppercase whitespace-nowrap ${job.stateColor}`}>
                              {job.state}
                           </span>
                        </div>
                     </div>
                   );
                })}
             </div>
          </motion.div>
        </div>

        {/* Sidebar / Medical Log Area */}
        <div className="lg:col-span-4 flex flex-col gap-6 pt-4 lg:pt-0">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="bg-white border border-slate-200/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.04)] ring-1 ring-slate-100 flex flex-col sticky top-28 h-[calc(100vh-160px)] min-h-[600px] overflow-hidden"
           >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h2 className="text-[13px] font-bold tracking-[0.2em] text-slate-900 uppercase">Context Memory Log</h2>
                 <p className="text-[11px] font-medium text-slate-500 mt-1">Guldmann Router parses this text continuously.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-white p-6 flex flex-col gap-8 scrollbar-thin scrollbar-thumb-slate-200">
                 
                 {/* Raw Input Area simulating notes */}
                 <div>
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Wed, Oct 24</span>
                       <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <textarea 
                       className="w-full min-h-[140px] p-5 rounded-[16px] border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-700 leading-relaxed focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all resize-none placeholder:text-slate-400"
                       placeholder="Free text area. Agents will read this to generate context..."
                       defaultValue={"- Check suspended ceiling condition closely at Northgate Care Home. Need additional bracket support (GH3 standard).\n- Follow up on LOLER certification from last week's installation at Swindon."}
                    />
                 </div>

                 <div className="w-full h-px bg-slate-100" />

                 {/* Agent Activity Feed */}
                 <div>
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-5">Background Agent Processes</h3>
                    <div className="flex flex-col gap-5">
                       {[
                         { agent: "RAMS Agent", act: "Generated preliminary document for JOB-2041 using GH3 template.", time: "10m ago" },
                         { agent: "Compliance Agent", act: "Flagged upcoming LOLER recertification requirement.", time: "45m ago" },
                         { agent: "SharePoint Agent", act: "Indexed newly uploaded product manual for Ceiling Tracks.", time: "2h ago" }
                       ].map((log, i) => (
                         <div key={i} className="flex gap-4 items-start relative pb-5 last:pb-0">
                            {i !== 2 && <div className="absolute left-[11px] top-6 w-px h-[calc(100%-12px)] bg-slate-200 z-0" />}
                            <div className="w-6 h-6 rounded-[8px] border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 z-10 shadow-sm mt-0.5">
                               <Bot className="w-3 h-3 text-slate-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{log.agent}</span>
                                  <span className="text-[10px] font-semibold text-slate-400">{log.time}</span>
                               </div>
                               <span className="text-[12px] font-medium text-slate-600 leading-relaxed max-w-[220px]">{log.act}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
