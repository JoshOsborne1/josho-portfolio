"use client";

import { motion } from "framer-motion";
import { Boxes, KeyRound, MessageSquareText, PenTool } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="flex-1 px-6 pt-24 pb-32 max-w-7xl mx-auto w-full">
      <div className="text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Your agent. <span className="text-guld-500">Everything you need.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          No IT ticket. No training session. Just sign in. Everything your field engineers and managers need, handled silently behind a single login.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="space-y-8"
        >
          <div className="flex gap-4">
            <div className="shrink-0 h-12 w-12 rounded-xl bg-guld-500/10 flex items-center justify-center border border-guld-500/20 text-guld-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Sign in with Microsoft</h3>
              <p className="text-muted-foreground">Sign in with your existing Microsoft 365 account. No new password. No separate account. No IT ticket. If you use Outlook, you&apos;re already set up.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="shrink-0 h-12 w-12 rounded-xl bg-guld-500/10 flex items-center justify-center border border-guld-500/20 text-guld-400">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Set up your agent</h3>
              <p className="text-muted-foreground">Your first login takes 90 seconds. Choose your role. Set how you&apos;d like to communicate. Write one sentence about your work. Your personal agent is live immediately.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-96 w-full rounded-3xl bg-secondary/30 border border-border/50 overflow-hidden shadow-2xl shadow-guld-500/5 group"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-guld-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
          <div className="p-8 flex items-center justify-center h-full">
            <div className="p-6 rounded-2xl bg-background/80 backdrop-blur border border-border/50 shadow-xl space-y-4 max-w-sm w-full">
              <div className="h-4 w-1/3 bg-guld-500/20 rounded-full mb-6" />
              <div className="h-10 w-full bg-secondary rounded-lg" />
              <div className="h-10 w-full bg-secondary rounded-lg" />
              <div className="h-10 w-2/3 bg-guld-600/20 rounded-lg mt-6 text-guld-400 flex items-center justify-center text-sm font-medium">Continue with Microsoft 365</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-border/50 pt-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-96 w-full rounded-3xl bg-secondary/30 border border-border/50 overflow-hidden shadow-2xl shadow-guld-500/5 group order-last md:order-first"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-guld-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
          <div className="p-8 flex items-center justify-center h-full">
             <div className="p-6 rounded-2xl bg-background/80 backdrop-blur border border-border/50 shadow-xl max-w-sm w-full">
              <p className="text-sm font-mono text-guld-400 mb-2">RAMS GENERATOR TOOL</p>
              <div className="space-y-3">
                 <div className="h-8 w-full bg-secondary rounded-lg" />
                 <div className="h-24 w-full bg-secondary rounded-lg" />
                 <div className="h-8 w-full bg-guld-600/80 rounded-lg mt-4" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ type: "spring", stiffness: 200, damping: 20 }}
           className="space-y-8"
        >
          <div className="flex gap-4">
            <div className="shrink-0 h-12 w-12 rounded-xl bg-guld-500/10 flex items-center justify-center border border-guld-500/20 text-guld-400">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Ask in plain English</h3>
              <p className="text-muted-foreground">Chat in plain English or open a structured tool. Your agent routes requests to the right specialist automatically. You never choose which AI to use.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="shrink-0 h-12 w-12 rounded-xl bg-guld-500/10 flex items-center justify-center border border-guld-500/20 text-guld-400">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Professional tools, not chat boxes.</h3>
              <p className="text-muted-foreground">For high-stakes work — RAMS, inspections, quotes — a chat box is the wrong tool. Structured forms ensure the AI has everything it needs to produce safe, correct, compliant output.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
