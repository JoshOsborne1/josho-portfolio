"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Map, Rocket, ShieldCheck, Cpu } from "lucide-react";

const phases = [
  {
    phase: "Foundation",
    icon: ShieldCheck,
    items: ["Azure AD app registration", "Microsoft SSO", "SharePoint connector", "OpenClaw multi-agent config", "Server setup"]
  },
  {
    phase: "The Platform",
    icon: Cpu,
    items: ["React web app", "User onboarding flow", "Personal router agent", "Per-user memory system", "Core dashboard"]
  },
  {
    phase: "Core Specialists",
    icon: Map,
    items: ["RAMS Generator tool", "SharePoint search agent", "Service agent (SyncroTeam)", "Training & cert tracking"]
  },
  {
    phase: "Complete Fleet",
    icon: CheckCircle2,
    items: ["Marketing agent", "TechDocs agent", "CRM agent", "Quote & Inspection tools"]
  },
  {
    phase: "Launch",
    icon: Rocket,
    items: ["Role-specific dashboards", "Notification system", "Security hardening", "User acceptance testing", "Full deployment"]
  }
];

export default function RoadmapPage() {
  return (
    <div className="flex-1 px-6 pt-24 pb-32 max-w-7xl mx-auto w-full">
      <div className="text-center mb-24 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Five phases. <span className="text-guld-500">Fully scoped.</span>
        </motion.h1>
        <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-xl text-muted-foreground"
        >
          A sequenced build with clear milestones at each phase. Not hypothetical. Actionable today.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 relative mb-32">
        <div className="absolute top-8 left-0 right-0 h-px bg-border/50 hidden lg:block" />
        {phases.map((phase, idx) => {
          const Icon = phase.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 24 }}
              className="relative flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0"
            >
              <div className="absolute top-0 lg:-top-6 w-12 h-12 rounded-full bg-background border border-border/50 flex items-center justify-center text-guld-400 z-10 mx-auto left-0 right-0 lg:ml-0 shadow-lg shadow-guld-500/10">
                 <Icon className="w-5 h-5" />
              </div>
              <div className="mt-8 lg:mt-16 bg-secondary/20 border border-border/50 p-6 rounded-2xl w-full">
                <h3 className="text-lg font-bold text-white mb-4">Phase {idx + 1}<br/><span className="text-guld-500">{phase.phase}</span></h3>
                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-guld-500/50 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="border border-border/50 bg-secondary/30 rounded-3xl p-8 lg:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-6">What <span className="text-guld-500">actually</span> changes.</h2>
            <div className="space-y-4">
               <div className="flex gap-4">
                 <Clock className="w-6 h-6 text-guld-400 shrink-0" />
                 <div>
                   <h4 className="font-bold text-white mb-1">Hours returned every week</h4>
                   <p className="text-muted-foreground text-sm">RAMS that took 90 mins take 10. Document searches that took 20 mins are instant. Time goes back to actual work.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <ShieldCheck className="w-6 h-6 text-guld-400 shrink-0" />
                 <div>
                   <h4 className="font-bold text-white mb-1">Compliance stops being a risk</h4>
                   <p className="text-muted-foreground text-sm">Certificate expiry alerts fire 60 days before. RAMS generated from verified templates. Everything version-controlled to SharePoint.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <CheckCircle2 className="w-6 h-6 text-guld-400 shrink-0" />
                 <div>
                   <h4 className="font-bold text-white mb-1">Right information. Right person.</h4>
                   <p className="text-muted-foreground text-sm">An engineer asking about a site gets a technical answer. A manager gets an overview. The platform learns how each works.</p>
                 </div>
               </div>
            </div>
          </motion.div>

           <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="pb-4 font-semibold">Today</th>
                  <th className="pb-4 font-semibold text-guld-500">Day One</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-muted-foreground">
                <tr>
                  <td className="py-4">Generic tools</td>
                  <td className="py-4 text-white">One interface, knows who you are</td>
                </tr>
                <tr>
                  <td className="py-4">SharePoint searches 20+ min</td>
                  <td className="py-4 text-white">Documents in seconds</td>
                </tr>
                <tr>
                  <td className="py-4 text-white">RAMS written from scratch</td>
                  <td className="py-4 text-white font-medium">RAMS in 60 seconds</td>
                </tr>
                <tr>
                  <td className="py-4">Cert renewals in spreadsheets</td>
                  <td className="py-4 text-white">Cert alerts 60 days strictly</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
