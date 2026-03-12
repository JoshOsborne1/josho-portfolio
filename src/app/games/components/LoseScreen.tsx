"use client";
import { motion } from "framer-motion";

interface LoseScreenProps {
  score: number;
  message?: string;
  onReplay: () => void;
  onHome?: () => void;
}

export default function LoseScreen({ score, message = "Game Over", onReplay, onHome }: LoseScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(240,235,255,0.85)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-[32px]"
        style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.9)",
          maxWidth: 320,
          width: "90%",
        }}
      >
        <div className="font-black text-2xl" style={{ color: "#1e1b4b" }}>{message}</div>
        <div className="text-center">
          <div className="font-bold text-5xl" style={{ color: "#7c3aed" }}>{score}</div>
          <div className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: "#94a3b8" }}>final score</div>
        </div>
        <div className="flex gap-3 w-full">
          <motion.button
            onClick={onReplay}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 rounded-2xl font-black text-white active:scale-95"
            style={{
              background: "linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)",
              boxShadow: "0 12px 24px rgba(167,139,250,0.3), inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            Try Again
          </motion.button>
          {onHome && (
            <motion.button
              onClick={onHome}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 rounded-2xl font-black active:scale-95"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.04), inset 0 4px 8px rgba(255,255,255,1), inset 0 -4px 8px rgba(0,0,0,0.04)",
                border: "1px solid rgba(255,255,255,0.9)",
                color: "#475569",
              }}
            >
              Home
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
