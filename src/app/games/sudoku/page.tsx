"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";

// --- Sudoku generation ---
function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const br = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const bc = 3 * Math.floor(col / 3) + (i % 3);
    if (board[br][bc] === num) return false;
  }
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function solve(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1,2,3,4,5,6,7,8,9]);
        for (const n of nums) {
          if (isValid(board, r, c, n)) {
            board[r][c] = n;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generatePuzzle(difficulty: "easy" | "medium" | "hard"): { puzzle: number[][], solution: number[][] } {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  // Fill diagonal boxes first
  for (let b = 0; b < 3; b++) {
    const nums = shuffle([1,2,3,4,5,6,7,8,9]);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[b*3+i][b*3+j] = nums[i*3+j];
      }
    }
  }
  solve(board);
  const solution = board.map(r => [...r]);
  const puzzle = board.map(r => [...r]);
  const toRemove = { easy: 35, medium: 45, hard: 55 }[difficulty];
  let removed = 0;
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));
  for (const cell of cells) {
    if (removed >= toRemove) break;
    const r = Math.floor(cell / 9), c = cell % 9;
    puzzle[r][c] = 0;
    removed++;
  }
  return { puzzle, solution };
}

export default function SudokuGame() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry } = useDaily('sudoku');
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy");
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [board, setBoard] = useState<number[][]>([]);
  const [given, setGiven] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number,number]|null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState<"setup"|"playing"|"won"|"lost">("setup");
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [cellStates, setCellStates] = useState<string[][]>([]);

  const startGame = useCallback((diff: "easy"|"medium"|"hard") => {
    const { puzzle: p, solution: s } = generatePuzzle(diff);
    setPuzzle(p);
    setSolution(s);
    setBoard(p.map(r => [...r]));
    setGiven(p.map(r => r.map(v => v !== 0)));
    setSelected(null);
    setMistakes(0);
    setTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    setCellStates(Array(9).fill(null).map(() => Array(9).fill("neutral")));
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const placeNumber = useCallback((num: number) => {
    if (!selected || gameState !== "playing") return;
    const [r, c] = selected;
    if (given[r]?.[c]) return;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    const newCellStates = cellStates.map(row => [...row]);
    if (solution[r][c] === num) {
      newCellStates[r][c] = "correct";
      playSuccess(); vibrate([20,10,20]);
    } else {
      newCellStates[r][c] = "wrong";
      playError(); vibrate([50]);
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 3) {
        setGameState("lost");
        setTimerRunning(false);
      }
    }
    markPlayed();
    setBoard(newBoard);
    setCellStates(newCellStates);
    // Check win
    const isComplete = newBoard.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]));
    if (isComplete) {
      setGameState("won");
      setTimerRunning(false);
      playWin(); vibrate([50,30,50,30,100]);
      markPlayed({ result: 'won', time: formatTime(timer) });
    }
  }, [selected, gameState, given, board, solution, cellStates, mistakes]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key)) placeNumber(parseInt(e.key));
      else if (e.key === "Backspace" || e.key === "0") placeNumber(0);
      else if (e.key === "ArrowUp" && selected) setSelected([Math.max(0, selected[0]-1), selected[1]]);
      else if (e.key === "ArrowDown" && selected) setSelected([Math.min(8, selected[0]+1), selected[1]]);
      else if (e.key === "ArrowLeft" && selected) setSelected([selected[0], Math.max(0, selected[1]-1)]);
      else if (e.key === "ArrowRight" && selected) setSelected([selected[0], Math.min(8, selected[1]+1)]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [placeNumber, selected]);

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const getCellStyle = (r: number, c: number) => {
    const isGiven = given[r]?.[c];
    const state = cellStates[r]?.[c];
    const isSel = selected && selected[0] === r && selected[1] === c;
    const isSameNum = selected && board[selected[0]]?.[selected[1]] && board[r][c] === board[selected[0]][selected[1]] && board[r][c] !== 0;
    const isHighlight = selected && (selected[0] === r || selected[1] === c || (Math.floor(r/3) === Math.floor(selected[0]/3) && Math.floor(c/3) === Math.floor(selected[1]/3)));
    if (isSel) return { background: "rgba(167,139,250,0.25)", border: "2px solid #A78BFA" };
    if (state === "correct") return { background: "rgba(94,234,212,0.2)", border: "1px solid rgba(94,234,212,0.4)" };
    if (state === "wrong") return { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" };
    if (isSameNum) return { background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)" };
    if (isHighlight) return { background: "rgba(167,139,250,0.06)", border: "1px solid rgba(255,255,255,0.5)" };
    return { background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.7)" };
  };

  if (gameState === "setup") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="p-8 rounded-[32px] flex flex-col gap-6 items-center" style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(24px)", boxShadow:"0 16px 40px rgba(0,0,0,0.06)", border:"1px solid rgba(255,255,255,0.8)", maxWidth:320, width:"90%" }}>
          <Link href="/games" className="no-underline self-start">
            <span className="font-bold text-sm" style={{ color:"#A78BFA" }}>Back</span>
          </Link>
          <div className="flex items-center justify-center font-black text-white rounded-xl text-sm" style={{ width:40,height:40,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",boxShadow:"0 4px 12px rgba(167,139,250,0.4)",fontSize:18 }}>P</div>
          <div className="text-center">
            <div className="font-black text-2xl mb-1" style={{ color:"#1e1b4b" }}>Sudoku</div>
            <div className="font-bold text-sm" style={{ color:"#64748b" }}>Choose difficulty</div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {(["easy","medium","hard"] as const).map(d => (
              <motion.button
                key={d}
                onClick={() => { setDifficulty(d); startGame(d); }}
                whileTap={{ scale:0.95 }}
                className="w-full py-3 rounded-2xl font-black text-sm capitalize active:scale-95"
                style={{ background: difficulty === d ? "linear-gradient(180deg,#C4B5FD,#A78BFA)" : "rgba(255,255,255,0.8)", color: difficulty === d ? "#fff" : "#1e1b4b", boxShadow: difficulty === d ? "0 8px 20px rgba(167,139,250,0.3)" : "0 4px 12px rgba(0,0,0,0.04),inset 0 2px 4px rgba(255,255,255,1)", border:"1px solid rgba(255,255,255,0.9)" }}
              >
                {d} ({d==="easy"?"35":d==="medium"?"45":"55"} cells removed)
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {!canPlay && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
          <div className="font-black text-5xl" style={{ color:"#A78BFA" }}>Come back soon</div>
          <div className="font-bold text-sm text-center" style={{ color:"#94a3b8" }}>You&apos;ve already played today.<br/>Resets in {hoursUntilReset}h</div>
          <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color:"#A78BFA" }}>Back to games</Link>
        </div>
      )}
      {canPlay && (<>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",boxShadow:"0 4px 12px rgba(167,139,250,0.4)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Sudoku</span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color:"#64748b" }}>{formatTime(timer)}</span>
          <div className="flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= mistakes ? "#ef4444" : "rgba(239,68,68,0.2)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-2">
        <div className="rounded-3xl p-3 overflow-hidden" style={{ background:"rgba(255,255,255,0.6)", backdropFilter:"blur(24px)", boxShadow:"0 16px 40px rgba(0,0,0,0.06)", border:"1px solid rgba(255,255,255,0.8)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", gap:2, maxWidth:"min(320px, calc(100vw - 2rem))", width:"100%" }}>
            {board.map((row, ri) =>
              row.map((val, ci) => {
                const cellStyle = getCellStyle(ri, ci);
                const isGiven = given[ri]?.[ci];
                const borderRight = (ci + 1) % 3 === 0 && ci < 8 ? "3px solid rgba(167,139,250,0.3)" : undefined;
                const borderBottom = (ri + 1) % 3 === 0 && ri < 8 ? "3px solid rgba(167,139,250,0.3)" : undefined;
                return (
                  <motion.div
                    key={`${ri}-${ci}`}
                    onClick={() => !isGiven && setSelected([ri, ci])}
                    whileTap={!isGiven ? { scale:0.93 } : {}}
                    className="flex items-center justify-center font-black cursor-pointer"
                    style={{
                      width:"min(35px, calc((100vw - 2rem - 16px) / 9))", height:"min(35px, calc((100vw - 2rem - 16px) / 9))",
                      borderRadius:8,
                      ...cellStyle,
                      borderRight: borderRight || (cellStyle as {border?: string}).border,
                      borderBottom: borderBottom || (cellStyle as {border?: string}).border,
                      color: isGiven ? "#1e1b4b" : cellStates[ri]?.[ci] === "wrong" ? "#ef4444" : "#7c3aed",
                      fontSize: 16,
                      cursor: isGiven ? "default" : "pointer",
                    }}
                  >
                    {val !== 0 ? val : ""}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Number pad */}
        <div className="flex gap-2">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <motion.button
              key={n}
              onClick={() => placeNumber(n)}
              whileTap={{ scale:0.9 }}
              className="w-9 h-10 rounded-xl font-black text-base active:scale-95"
              style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)", boxShadow:"0 4px 8px rgba(0,0,0,0.04),inset 0 2px 4px rgba(255,255,255,1)", border:"1px solid rgba(255,255,255,0.9)", color:"#1e1b4b" }}
            >
              {n}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={() => placeNumber(0)}
          whileTap={{ scale:0.95 }}
          className="px-6 py-2 rounded-xl font-bold text-sm active:scale-95"
          style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(167,139,250,0.2)", color:"#7c3aed" }}
        >
          Clear
        </motion.button>
      </div>

      {/* Win/Lose */}
      <AnimatePresence>
        {(gameState === "won" || gameState === "lost") && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(240,235,255,0.85)", backdropFilter:"blur(20px)" }}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} className="flex flex-col items-center gap-5 p-8 rounded-[32px]" style={{ background:"rgba(255,255,255,0.85)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(167,139,250,0.2)", maxWidth:320, width:"90%" }}>
              <div className="font-black text-3xl" style={{ color: gameState === "won" ? "#A78BFA" : "#ef4444" }}>{gameState === "won" ? "Solved!" : "Game Over"}</div>
              <div className="font-bold text-sm" style={{ color:"#64748b" }}>{gameState === "won" ? `Time: ${formatTime(timer)}` : "3 mistakes reached"}</div>
              <div className="flex gap-3 w-full">
                <motion.button onClick={() => startGame(difficulty)} whileTap={{ scale:0.95 }} className="flex-1 py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 8px 20px rgba(167,139,250,0.3)" }}>Play Again</motion.button>
                <Link href="/games" className="flex-1 no-underline">
                  <div className="py-3 rounded-2xl font-black text-center" style={{ background:"rgba(255,255,255,0.8)", color:"#475569", boxShadow:"0 4px 12px rgba(0,0,0,0.04)", border:"1px solid rgba(255,255,255,0.9)" }}>Home</div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>)}
    </div>
  );
}
