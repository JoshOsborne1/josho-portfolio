"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";
import GameShell from "../components/GameShell";

function generateQuestion(difficulty: "easy" | "medium" | "hard") {
  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;
  const ops = ["+", "-", "x", "/"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  if (op === "+") {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else if (op === "x") {
    const maxFactor = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20;
    a = Math.floor(Math.random() * maxFactor) + 1;
    b = Math.floor(Math.random() * maxFactor) + 1;
    answer = a * b;
  } else {
    b = Math.floor(Math.random() * (difficulty === "easy" ? 9 : 19)) + 1;
    answer = Math.floor(Math.random() * (difficulty === "easy" ? 10 : 20)) + 1;
    a = b * answer;
  }

  return { question: `${a} ${op} ${b}`, answer, op };
}

export default function MathGame() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry, ready } = useDaily('math');
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

  const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy");
  const [gameState, setGameState] = useState<"setup"|"playing"|"done">("setup");
  const [current, setCurrent] = useState(() => generateQuestion("easy"));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState<"correct"|"wrong"|null>(null);
  const [best, setBest] = useState(() => typeof window !== "undefined" ? parseInt(localStorage.getItem("math-best") || "0") : 0);

  const getMultiplier = (s: number) => {
    if (s >= 8) return 3;
    if (s >= 5) return 2;
    if (s >= 3) return 1.5;
    return 1;
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState("done");
          markPlayed({ score, streak });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [gameState]);

  const handleAnswer = useCallback(() => {
    if (gameState !== "playing") return;
    const ans = parseInt(input);
    if (isNaN(ans)) return;

    const correct = ans === current.answer;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    setFeedback(correct ? "correct" : "wrong");

    if (correct) {
      const mult = getMultiplier(newStreak);
      const points = Math.round(10 * mult);
      setScore(s => s + points);
    }

    setQuestionsAnswered(q => q + 1);
    setTimeout(() => {
      setCurrent(generateQuestion(difficulty));
      setInput("");
      setFeedback(null);
    }, 300);
  }, [gameState, input, current.answer, streak, difficulty]);

  useEffect(() => {
    if (gameState === "done" && score > best) {
      setBest(score);
      if (typeof window !== "undefined") localStorage.setItem("math-best", String(score));
    }
  }, [gameState, score, best]);

  const startGame = (diff: "easy"|"medium"|"hard") => {
    setDifficulty(diff);
    setCurrent(generateQuestion(diff));
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setQuestionsAnswered(0);
    setFeedback(null);
    setInput("");
    setGameState("playing");
  };

  const mult = getMultiplier(streak);

  if (gameState === "setup") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>


        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="p-8 rounded-[32px] flex flex-col gap-5 items-center" style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(24px)", boxShadow:"0 16px 40px rgba(0,0,0,0.06)", border:"1px solid rgba(255,255,255,0.8)", maxWidth:320, width:"100%" }}>
          <Link href="/games" className="no-underline self-start font-bold text-sm" style={{ color:"#A78BFA" }}>Back</Link>
          <div className="flex items-center justify-center font-black text-white rounded-2xl" style={{ width:48,height:48,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",fontSize:20 }}>P</div>
          <div className="text-center">
            <div className="font-black text-2xl mb-1" style={{ color:"#1e1b4b" }}>Math Challenge</div>
            <div className="font-bold text-sm" style={{ color:"#64748b" }}>60 seconds. How many can you get?</div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {(["easy","medium","hard"] as const).map(d => (
              <motion.button key={d} onClick={() => startGame(d)} whileTap={{ scale:0.95 }} className="w-full py-3 rounded-2xl font-black text-sm capitalize active:scale-95" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", color:"#fff", boxShadow:"0 8px 20px rgba(167,139,250,0.25)" }}>
                {d} (1-{d==="easy"?"10":d==="medium"?"50":"100"})
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="p-8 rounded-[32px] flex flex-col gap-5 items-center" style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(24px)", boxShadow:"0 24px 60px rgba(167,139,250,0.15)", border:"1px solid rgba(255,255,255,0.9)", maxWidth:320, width:"100%" }}>
          <div className="font-black text-3xl" style={{ color:"#1e1b4b" }}>Time Up!</div>
          <div className="flex gap-6">
            <div className="text-center p-4 rounded-2xl" style={{ background:"rgba(167,139,250,0.1)" }}>
              <div className="font-black text-4xl" style={{ color:"#7c3aed" }}>{score}</div>
              <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Score</div>
            </div>
            <div className="text-center p-4 rounded-2xl" style={{ background:"rgba(94,234,212,0.1)" }}>
              <div className="font-black text-4xl" style={{ color:"#0F766E" }}>{questionsAnswered}</div>
              <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Answered</div>
            </div>
          </div>
          {score === best && score > 0 && <div className="font-black text-base" style={{ color:"#A78BFA" }}>New best score!</div>}
          <div className="flex gap-3 w-full">
            <motion.button onClick={() => startGame(difficulty)} whileTap={{ scale:0.95 }} className="flex-1 py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)" }}>Play Again</motion.button>
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
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Math Challenge</span>
        <div className="flex items-center gap-2">
          <span className="font-black text-xl" style={{ color: timeLeft <= 10 ? "#ef4444" : "#1e1b4b" }}>{timeLeft}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 max-w-lg mx-auto w-full">
        {/* Score display */}
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <motion.div key={score} initial={{ scale:1.2 }} animate={{ scale:1 }} className="font-black text-5xl" style={{ color:"#A78BFA" }}>{score}</motion.div>
            <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Score</div>
          </div>
          {mult > 1 && (
            <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} className="px-3 py-2 rounded-2xl font-black text-white" style={{ background:"linear-gradient(135deg,#FBBF24,#F59E0B)" }}>
              {mult}x
            </motion.div>
          )}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={questionsAnswered}
            initial={{ opacity:0, y:12, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-12 }}
            className="w-full p-8 rounded-[32px] text-center"
            style={{
              background: feedback === "correct" ? "rgba(94,234,212,0.2)"
                : feedback === "wrong" ? "rgba(239,68,68,0.1)"
                : "rgba(255,255,255,0.7)",
              backdropFilter:"blur(20px)",
              border: feedback === "correct" ? "1px solid #5EEAD4"
                : feedback === "wrong" ? "1px solid rgba(239,68,68,0.3)"
                : "1px solid rgba(255,255,255,0.8)",
              boxShadow:"0 16px 40px rgba(0,0,0,0.05)",
            }}
          >
            <div className="font-black text-5xl" style={{ color:"#1e1b4b", letterSpacing:"-0.03em" }}>{current.question} = ?</div>
          </motion.div>
        </AnimatePresence>

        {/* Input */}
        <div className="w-full flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value.replace(/[^0-9-]/g, ""))}
            onKeyDown={e => e.key === "Enter" && handleAnswer()}
            placeholder="Answer..."
            autoFocus
            className="flex-1 px-5 py-4 rounded-2xl font-black text-2xl text-center outline-none"
            style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)", border:"2px solid rgba(167,139,250,0.3)", color:"#1e1b4b" }}
          />
          <motion.button onClick={handleAnswer} whileTap={{ scale:0.95 }} className="px-6 py-4 rounded-2xl font-black text-white active:scale-95" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 8px 20px rgba(167,139,250,0.3)" }}>
            OK
          </motion.button>
        </div>

        {/* Streak */}
        {streak >= 2 && (
          <div className="font-bold text-sm" style={{ color:"#7c3aed" }}>
            {streak} in a row!{streak >= 3 ? " Keep going for bonus" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
