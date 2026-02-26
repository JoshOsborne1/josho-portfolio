"use client";

import { motion } from "framer-motion";
import { Shield, Fingerprint, Lock, DatabaseBackup, ActivitySquare } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Microsoft Sign-In",
    description: "Staff sign in using their existing Microsoft 365 accounts. No credentials are stored on our platform. Azure AD manages all identity."
  },
  {
    icon: Shield,
    title: "GDPR-Protected AI",
    description: "Every AI call routes through GitHub Copilot Business — which includes a contractual GDPR Data Processing Agreement. Prompts are not used for training. Nothing is retained beyond the API call."
  },
  {
    icon: Lock,
    title: "Per-User Isolation",
    description: "Each user's memory, conversation history, and documents are isolated by their Microsoft identity. No cross-user data access. Technically enforced, not just policy."
  },
  {
    icon: ActivitySquare,
    title: "Full Audit Trail",
    description: "Every agent action is logged: user, timestamp, action type. No personal data in logs. Compliant with GDPR Article 30 records of processing."
  },
  {
    icon: DatabaseBackup,
    title: "Your Data, Your Control",
    description: "Documents are generated and stored in Guldmann's own SharePoint. The platform uses Guldmann's Microsoft 365 tenant. Guldmann owns the data. Always."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};


export default function SecurityPage() {
  return (
    <div className="flex-1 px-6 pt-24 pb-32 max-w-6xl mx-auto w-full relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-guld-600/10 rounded-full blur-3xl -z-10" />
      
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center justify-center p-4 rounded-full bg-guld-500/10 mb-6 text-guld-400"
        >
          <Shield className="w-12 h-12" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Security built for a <span className="text-guld-500">regulated industry.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground"
        >
          This platform handles documentation for vulnerable people and regulated equipment. Every design decision reflects that priority.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              className="p-8 rounded-3xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-guld-500/30 transition-all flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-guld-500/5 rounded-bl-full group-hover:bg-guld-500/10 transition-colors" />
              <div className="h-12 w-12 rounded-xl bg-background border border-border/50 flex items-center justify-center text-guld-400 mb-6 relative z-10 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
