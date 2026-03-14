"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAllDailyStatus, GAME_LABELS } from "./useDaily";
import { useSubscription } from "./useSubscription";

const SHELL_CATEGORIES = [
  { label: "Word", color: "#A78BFA", slugs: ["word","wordchain","wordscramble","crossword"] },
  { label: "Numbers", color: "#5EEAD4", slugs: ["2048","sudoku","math","memory","trivia"] },
  { label: "Geo", color: "#F59E0B", slugs: ["flagle","worldle","globle","travle"] },
  { label: "Music", color: "#F472B6", slugs: ["wave"] },
];

interface GameShellProps {
  gameSlug: string;
  gameTitle: string;
  guessCount?: number;
  maxGuesses?: number;
  children: React.ReactNode;
  showAdSlot?: boolean;
}

export default function GameShell({ gameSlug, gameTitle, guessCount, maxGuesses, children, showAdSlot = true }: GameShellProps) {
  const { statuses, completedCount, totalCount } = useAllDailyStatus();
  const { isPro } = useSubscription();
  const streak = 0; // TODO: wire to Clerk when available

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 w-full" style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/games" className="no-underline flex items-center gap-2">
              <div className="flex items-center justify-center font-black text-white rounded-xl text-sm"
                style={{ width: 32, height: 32, background: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)", boxShadow: "0 4px 12px rgba(167,139,250,0.4)" }}>P</div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-black" style={{ color: "#A78BFA", letterSpacing: "0.05em" }}>PLAY</span>
                <span style={{ color: "#94a3b8", fontSize: 9, letterSpacing: "0.08em", fontWeight: 600 }}>josho.pro</span>
              </div>
            </Link>
            <div className="h-4 w-px" style={{ background: "rgba(167,139,250,0.2)" }} />
            <span className="font-black text-sm" style={{ color: "#1e1b4b" }}>{gameTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            {guessCount !== undefined && maxGuesses !== undefined && (
              <span className="font-mono font-black text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(167,139,250,0.1)", color: "#7c3aed" }}>
                {guessCount}/{maxGuesses}
              </span>
            )}
            <div className="px-2 py-1 rounded-full font-black text-[10px] uppercase tracking-wide"
              style={isPro ? { background: "linear-gradient(135deg,#C4B5FD,#A78BFA)", color: "#fff" } : { background: "rgba(167,139,250,0.1)", color: "#A78BFA" }}>
              {isPro ? "Pro" : "Free"}
            </div>
          </div>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Ad slot */}
      {showAdSlot && (
        <div className="max-w-2xl mx-auto w-full px-4 py-2">
          <div className="game-ad-slot rounded-2xl flex items-center justify-center min-h-[90px] text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.4)", border: "1px dashed rgba(167,139,250,0.2)", color: "#cbd5e1" }}>
            Advertisement
          </div>
        </div>
      )}

      {/* Other games nav */}
      <div className="w-full py-3 px-4" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(167,139,250,0.1)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>More Games</div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {SHELL_CATEGORIES.map(cat => (
              <div key={cat.label} className="flex flex-col gap-1.5 flex-shrink-0">
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: cat.color }}>{cat.label}</div>
                <div className="flex gap-1.5">
                  {cat.slugs.map(slug => {
                    const done = statuses[slug] != null;
                    const active = slug === gameSlug;
                    return (
                      <Link key={slug} href={`/games/${slug}`} className="no-underline">
                        <motion.div
                          whileTap={{ scale: 0.92 }}
                          className="flex items-center gap-1 px-2 py-1 rounded-xl font-bold text-[10px] flex-shrink-0"
                          style={{
                            background: active ? "linear-gradient(135deg,#C4B5FD,#A78BFA)" : done ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.7)",
                            border: active ? "none" : done ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(167,139,250,0.15)",
                            color: active ? "#fff" : done ? "#166534" : "#64748b",
                          }}
                        >
                          {done && !active && <span>✓</span>}
                          {GAME_LABELS[slug]}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="w-full px-4 py-2" style={{ background: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(167,139,250,0.08)" }}>
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-black text-xs" style={{ color: "#A78BFA" }}>{completedCount}/{totalCount}</span>
            <span className="font-bold text-[10px]" style={{ color: "#94a3b8" }}>today</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-black text-xs" style={{ color: "#F59E0B" }}>{streak}</span>
              <span className="font-bold text-[10px]" style={{ color: "#94a3b8" }}>streak</span>
            </div>
          )}
          {!isPro && (
            <Link href="/games/pro" className="no-underline ml-auto">
              <span className="font-black text-[10px] px-2 py-1 rounded-full" style={{ background: "linear-gradient(135deg,#C4B5FD,#A78BFA)", color: "#fff" }}>
                Upgrade
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}