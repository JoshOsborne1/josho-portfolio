"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.2 }}
        className="text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight mb-4"
        >
          Josh Osborne
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Engineering Intelligence.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-4xl w-full">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-xl font-bold mb-2">Project 1</h3>
          <p className="text-muted-foreground">Description of the project.</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-xl font-bold mb-2">Project 2</h3>
          <p className="text-muted-foreground">Description of the project.</p>
        </motion.div>
      </div>
    </div>
  );
}
