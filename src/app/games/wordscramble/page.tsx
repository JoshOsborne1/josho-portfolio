"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";

const WORD_BANK = [
  "PROBLEM","KITCHEN","CRYSTAL","JOURNEY","CABINET","DOLPHIN","FORTUNE","BLANKET",
  "CHAPTER","ENDLESS","LANTERN","PATTERN","SILENCE","THUNDER","VILLAGE","WARRIOR",
  "COMPLEX","HARVEST","MONSTER","PENGUIN",
];

function scrambleWord(word: string): string {
  const letters = word.split("");
  let scrambled;
  let attempts = 0;
  do {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    scrambled = letters.join("");
    attempts++;
  } while (scrambled === word && attempts < 20);
  return scrambled;
}

export default function WordScrambleGame() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry, ready } = useDaily('wordscramble');
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>
        <div className="font-black text-5xl" style={{ color:"#A78BFA" }}>Come back soon</div>
        <div className="font-bold text-sm text-center" style={{ color:"#94a3b8" }}>You&apos;ve already played today.<br/>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color:"#A78BFA" }}>Back to games</Link>
      </div>
    );
  }

  const [wordIndex, setWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORD_BANK[0]);
  const [scrambled, setScrambled] = useState(() => scrambleWord(WORD_BANK[0]));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<"playing"|"done">("playing");
  const [feedback, setFeedback] = useState<"correct"|"wrong"|null>(null);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [best, setBest] = useState(() => typeof window !== "undefined" ? parseInt(localStorage.getItem("scramble-best") || "0") : 0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadNewWord = useCallback((index: number) => {
    if (index >= WORD_BANK.length) {
      setGameState("done");
      markPlayed({ score, streak });
      return;
    }
    const word = WORD_BANK[index];
    setCurrentWord(word);
    setScrambled(scrambleWord(word));
    setInput("");
    setTimeLeft(45);
    setHintsUsed(0);
    setRevealedLetters(new Set());
    setFeedback(null);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // Skip word
          setStreak(0);
          const nextIndex = wordIndex + 1;
          setWordIndex(nextIndex);
          loadNewWord(nextIndex);
          return 45;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [gameState, wordIndex, loadNewWord]);

  const handleSubmit = useCallback(() => {
    if (gameState !== "playing") return;
    const guess = input.trim().toUpperCase();
    if (guess === currentWord) {
      const timeBonus = timeLeft;
      const points = 50 + timeBonus;
      setScore(s => s + points);
      setStreak(s => s + 1);
      setWordsCompleted(w => w + 1);
      setFeedback("correct");
      setTimeout(() => {
        const nextIndex = wordIndex + 1;
        setWordIndex(nextIndex);
        loadNewWord(nextIndex);
      }, 600);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => { setFeedback(null); setInput(""); }, 500);
    }
  }, [gameState, input, currentWord, timeLeft, wordIndex, loadNewWord]);

  useEffect(() => {
    if (gameState === "done" && score > best) {
      setBest(score);
      if (typeof window !== "undefined") localStorage.setItem("scramble-best", String(score));
    }
  }, [gameState, score, best]);

  const useHint = () => {
    if (hintsUsed >= 3 || gameState !== "playing") return;
    const unrevealed = Array.from({ length: currentWord.length }, (_, i) => i).filter(i => !revealedLetters.has(i));
    if (unrevealed.length === 0) return;
    const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedLetters(prev => new Set([...prev, idx]));
    setHintsUsed(h => h + 1);
    setScore(s => Math.max(0, s - 5));
  };

  const resetGame = () => {
    setWordIndex(0);
    setScore(0);
    setStreak(0);
    setWordsCompleted(0);
    setGameState("playing");
    loadNewWord(0);
  };

  if (gameState === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>


        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="p-8 rounded-[32px] flex flex-col items-center gap-5" style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(24px)", boxShadow:"0 24px 60px rgba(167,139,250,0.15)", border:"1px solid rgba(255,255,255,0.9)", maxWidth:320, width:"100%" }}>
          <div className="font-black text-3xl" style={{ color:"#A78BFA" }}>All Done!</div>
          <div className="flex gap-6">
            <div className="text-center p-4 rounded-2xl" style={{ background:"rgba(167,139,250,0.1)" }}>
              <div className="font-black text-3xl" style={{ color:"#7c3aed" }}>{score}</div>
              <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Score</div>
            </div>
            <div className="text-center p-4 rounded-2xl" style={{ background:"rgba(94,234,212,0.1)" }}>
              <div className="font-black text-3xl" style={{ color:"#0F766E" }}>{wordsCompleted}</div>
              <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Solved</div>
            </div>
          </div>
          {score >= best && score > 0 && <div className="font-black text-sm" style={{ color:"#A78BFA" }}>New best!</div>}
          <div className="flex gap-3 w-full">
            <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="flex-1 py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)" }}>Play Again</motion.button>
            <Link href="/games" className="flex-1 no-underline">
              <div className="py-3 rounded-2xl font-black text-center" style={{ background:"rgba(255,255,255,0.8)", color:"#475569", border:"1px solid rgba(255,255,255,0.9)" }}>Home</div>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Word Scramble</span>
        <div className="flex items-center gap-2">
          <span className="font-black text-base" style={{ color:"#A78BFA" }}>{score}</span>
          {streak > 1 && <span className="font-bold text-xs px-2 py-0.5 rounded-lg" style={{ background:"rgba(94,234,212,0.15)", color:"#0F766E" }}>{streak}x</span>}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 max-w-lg mx-auto w-full">
        {/* Progress + Timer */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background:"rgba(167,139,250,0.12)" }}>
            <motion.div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#C4B5FD,#A78BFA)", width:`${(wordsCompleted/WORD_BANK.length)*100}%` }} />
          </div>
          <span className="font-bold text-xs shrink-0" style={{ color:"#94a3b8" }}>{wordsCompleted}/{WORD_BANK.length}</span>
          <span className="font-black text-lg shrink-0" style={{ color: timeLeft <= 10 ? "#ef4444" : "#1e1b4b" }}>{timeLeft}s</span>
        </div>

        {/* Scrambled word */}
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:1.05 }}
            className="w-full p-8 rounded-[32px] text-center"
            style={{
              background: feedback === "correct" ? "rgba(94,234,212,0.2)"
                : feedback === "wrong" ? "rgba(239,68,68,0.08)"
                : "rgba(255,255,255,0.7)",
              backdropFilter:"blur(20px)",
              border: feedback === "correct" ? "1px solid rgba(94,234,212,0.5)"
                : feedback === "wrong" ? "1px solid rgba(239,68,68,0.2)"
                : "1px solid rgba(255,255,255,0.8)",
              boxShadow:"0 16px 40px rgba(0,0,0,0.04)",
            }}
          >
            {/* Hint reveals */}
            {revealedLetters.size > 0 && (
              <div className="flex justify-center gap-2 mb-4">
                {currentWord.split("").map((letter, i) => (
                  <div key={i} className="w-8 h-8 flex items-center justify-center font-black text-base rounded-lg" style={{ background: revealedLetters.has(i) ? "rgba(94,234,212,0.3)" : "transparent", color: revealedLetters.has(i) ? "#0F766E" : "transparent", border: revealedLetters.has(i) ? "1px solid rgba(94,234,212,0.5)" : "1px solid rgba(167,139,250,0.15)" }}>
                    {revealedLetters.has(i) ? letter : ""}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {scrambled.split("").map((letter, i) => (
                <motion.div
                  key={i}
                  className="w-11 h-11 flex items-center justify-center font-black text-lg rounded-2xl"
                  style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(8px)", boxShadow:"0 4px 12px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04)", border:"1px solid rgba(255,255,255,0.9)", color:"#1e1b4b" }}
                  whileHover={{ y:-2 }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Input */}
        <div className="w-full flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g,""))}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Unscramble..."
            maxLength={currentWord.length}
            className="flex-1 px-5 py-4 rounded-2xl font-black text-xl text-center outline-none uppercase tracking-widest"
            style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)", border:"2px solid rgba(167,139,250,0.3)", color:"#1e1b4b" }}
            autoFocus
          />
          <motion.button onClick={handleSubmit} whileTap={{ scale:0.95 }} className="px-5 py-4 rounded-2xl font-black text-white active:scale-95" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 8px 20px rgba(167,139,250,0.3)" }}>
            Go
          </motion.button>
        </div>

        {/* Hint button */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={useHint}
            whileTap={{ scale:0.95 }}
            disabled={hintsUsed >= 3}
            className="px-4 py-2 rounded-xl font-bold text-sm active:scale-95"
            style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(167,139,250,0.2)", color: hintsUsed >= 3 ? "#94a3b8" : "#7c3aed", opacity: hintsUsed >= 3 ? 0.5 : 1 }}
          >
            Hint (-5pts) [{3 - hintsUsed} left]
          </motion.button>
          {streak >= 2 && <span className="font-bold text-sm" style={{ color:"#0F766E" }}>{streak} in a row!</span>}
        </div>
      </div>
    </div>
  );
}
