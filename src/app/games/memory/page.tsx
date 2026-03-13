"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";

const PAIRS = ["AA","BB","CC","DD","EE","FF","GG","HH"];
const PAIR_COLORS: Record<string, { bg: string; text: string }> = {
  AA: { bg: "linear-gradient(135deg,#C4B5FD,#A78BFA)", text: "#fff" },
  BB: { bg: "linear-gradient(135deg,#5EEAD4,#0D9488)", text: "#fff" },
  CC: { bg: "linear-gradient(135deg,#FCD34D,#F59E0B)", text: "#78350F" },
  DD: { bg: "linear-gradient(135deg,#FB7185,#E11D48)", text: "#fff" },
  EE: { bg: "linear-gradient(135deg,#86EFAC,#16A34A)", text: "#14532D" },
  FF: { bg: "linear-gradient(135deg,#93C5FD,#2563EB)", text: "#fff" },
  GG: { bg: "linear-gradient(135deg,#FDBA74,#EA580C)", text: "#fff" },
  HH: { bg: "linear-gradient(135deg,#D8B4FE,#9333EA)", text: "#fff" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

function makeCards(): Card[] {
  return shuffle([...PAIRS, ...PAIRS]).map((v, i) => ({ id: i, value: v, flipped: false, matched: false }));
}

export default function MemoryGame() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry } = useDaily('memory');
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  const [cards, setCards] = useState<Card[]>(makeCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [locked, setLocked] = useState(false);
  const [gameState, setGameState] = useState<"playing"|"won">("playing");
  const [best, setBest] = useState(() => typeof window !== "undefined" ? parseInt(localStorage.getItem("memory-best") || "9999") : 9999);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const handleCardClick = useCallback((id: number) => {
    if (locked || gameState !== "playing") return;
    const card = cards[id];
    if (card.flipped || card.matched || flipped.includes(id)) return;

    if (!timerRunning) setTimerRunning(true);

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = cards[firstId];
      const second = cards[id];

      if (first.value === second.value) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
          ));
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === PAIRS.length) {
            setTimerRunning(false);
            setGameState("won");
            markPlayed({ score: newMatches, time: timer });
            if (timer < best) {
              setBest(timer);
              if (typeof window !== "undefined") localStorage.setItem("memory-best", String(timer));
            }
          }
          setFlipped([]);
          setLocked(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  }, [locked, gameState, cards, flipped, timerRunning, matches, timer, best]);

  const resetGame = () => {
    setCards(makeCards());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setTimerRunning(false);
    setLocked(false);
    setGameState("playing");
  };

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {!canPlay && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
          <div className="font-black text-5xl" style={{ color:"#A78BFA" }}>Come back soon</div>
          <div className="font-bold text-sm text-center" style={{ color:"#94a3b8" }}>You&apos;ve already played today.<br/>Resets in {hoursUntilReset}h</div>
          <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color:"#A78BFA" }}>Back to games</Link>
        </div>
      )}
      {canPlay && (<>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Memory Match</span>
        <div className="flex gap-3 text-sm font-bold" style={{ color:"#64748b" }}>
          <span>{moves} moves</span>
          <span>{formatTime(timer)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(167,139,250,0.15)" }}>
            <motion.div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#C4B5FD,#5EEAD4)", width:`${(matches/PAIRS.length)*100}%` }} animate={{ width:`${(matches/PAIRS.length)*100}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-bold text-xs" style={{ color:"#94a3b8" }}>{matches}/{PAIRS.length} pairs</span>
            {best < 9999 && <span className="font-bold text-xs" style={{ color:"#A78BFA" }}>Best: {formatTime(best)}</span>}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns:"repeat(4,1fr)", maxWidth:340 }}>
          {cards.map(card => (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{ width:72, height:72, cursor: card.matched || card.flipped ? "default" : "pointer", perspective:1000 }}
            >
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle:"preserve-3d" }}
                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* Back */}
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center backface-hidden" style={{ backfaceVisibility:"hidden", background:"rgba(255,255,255,0.8)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 12px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,1)" }}>
                  <div className="w-6 h-6 rounded-full" style={{ background:"linear-gradient(135deg,rgba(196,181,253,0.4),rgba(167,139,250,0.4))" }} />
                </div>
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center font-black text-base"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: PAIR_COLORS[card.value]?.bg || "#A78BFA",
                    color: PAIR_COLORS[card.value]?.text || "#fff",
                    boxShadow: card.matched ? "0 0 0 2px #5EEAD4, 0 4px 16px rgba(94,234,212,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {card.value[0]}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="mt-2 px-6 py-2 rounded-xl font-bold text-sm active:scale-95" style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(167,139,250,0.2)", color:"#7c3aed" }}>New Game</motion.button>
      </div>

      <AnimatePresence>
        {gameState === "won" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(240,235,255,0.88)", backdropFilter:"blur(20px)" }}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} className="p-8 rounded-[32px] flex flex-col items-center gap-5" style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(167,139,250,0.2)", maxWidth:300, width:"90%" }}>
              <div className="font-black text-3xl" style={{ color:"#A78BFA" }}>Matched!</div>
              <div className="flex gap-6">
                <div className="text-center"><div className="font-black text-2xl" style={{ color:"#1e1b4b" }}>{moves}</div><div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Moves</div></div>
                <div className="text-center"><div className="font-black text-2xl" style={{ color:"#7c3aed" }}>{formatTime(timer)}</div><div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Time</div></div>
              </div>
              <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="w-full py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)" }}>Play Again</motion.button>
              <Link href="/games" className="font-bold text-sm no-underline" style={{ color:"#94a3b8" }}>Back to games</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          </>)}
    </div>
  );
}