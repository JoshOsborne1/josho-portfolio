"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface GameHeaderProps {
  gameTitle: string;
  score?: number;
  streak?: number;
}

export default function GameHeader({ gameTitle, score, streak }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
      {/* Logo + Back */}
      <div className="flex items-center gap-3">
        <motion.div whileTap={{ scale: 0.95 }} className="active:scale-95">
          <Link href="/games" className="flex items-center gap-2 no-underline">
            {/* CSS logo mark - P in pill */}
            <div
              className="flex items-center justify-center font-black text-white text-sm rounded-xl"
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)",
                boxShadow: "0 4px 12px rgba(167,139,250,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
                letterSpacing: "-0.02em",
                fontSize: 14,
              }}
            >
              P
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-black" style={{ color: "#A78BFA", letterSpacing: "0.05em" }}>PLAY</span>
              <span className="text-xs" style={{ color: "#94a3b8", fontSize: 9, letterSpacing: "0.08em" }}>josho.pro</span>
            </div>
          </Link>
        </motion.div>
        <div
          className="h-4 w-px ml-1"
          style={{ background: "rgba(167,139,250,0.2)" }}
        />
        <span className="font-black text-sm" style={{ color: "#1e1b4b" }}>{gameTitle}</span>
      </div>

      {/* Score / Streak */}
      <div className="flex items-center gap-3">
        {streak !== undefined && streak > 0 && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(94,234,212,0.15) 100%)",
              border: "1px solid rgba(167,139,250,0.25)",
            }}
          >
            <span className="text-xs font-bold" style={{ color: "#7c3aed" }}>
              {streak} streak
            </span>
          </div>
        )}
        {score !== undefined && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <span className="text-xs font-black" style={{ color: "#1e1b4b" }}>{score}</span>
          </div>
        )}
      </div>
    </div>
  );
}
