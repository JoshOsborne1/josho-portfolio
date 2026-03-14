"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";
import GameShell from "../components/GameShell";

// --- 6x6 Sudoku: rows/cols/boxes unique, numbers 1-6 ---
// Boxes: 3 cols x 2 rows = 6 boxes
// Box index: Math.floor(r/2)*2 + Math.floor(c/3)
function isValid6(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 6; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const br = Math.floor(row / 2) * 2;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 2; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === num) return false;
    }
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

function solve6(board: number[][]): boolean {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6]);
        for (const n of nums) {
          if (isValid6(board, r, c, n)) {
            board[r][c] = n;
            if (solve6(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generatePuzzle6(): { puzzle: number[][], solution: number[][] } {
  const board: number[][] = Array(6).fill(null).map(() => Array(6).fill(0));
  // Fill first row randomly to get unique solutions
  const first = shuffle([1, 2, 3, 4, 5, 6]);
  for (let c = 0; c < 6; c++) board[0][c] = first[c];
  solve6(board);
  const solution = board.map(r => [...r]);
  const puzzle = board.map(r => [...r]);
  // Remove 14 cells leaving 22 given (good difficulty for 6x6)
  const cells = shuffle(Array.from({ length: 36 }, (_, i) => i));
  let removed = 0;
  for (const cell of cells) {
    if (removed >= 14) break;
    const r = Math.floor(cell / 6), c = cell % 6;
    puzzle[r][c] = 0;
    removed++;
  }
  return { puzzle, solution };
}

export default function SudokuGame() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry, ready } = useDaily('sudoku');
  const { playSuccess, playError, playWin, vibrate } = useSounds();
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [board, setBoard] = useState<number[][]>([]);
  const [given, setGiven] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState<"setup" | "playing" | "won" | "lost">("setup");
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [cellStates, setCellStates] = useState<string[][]>([]);

  const startGame = useCallback(() => {
    const { puzzle: p, solution: s } = generatePuzzle6();
    setPuzzle(p);
    setSolution(s);
    setBoard(p.map(r => [...r]));
    setGiven(p.map(r => r.map(v => v !== 0)));
    setSelected(null);
    setMistakes(0);
    setTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    setCellStates(Array(6).fill(null).map(() => Array(6).fill("neutral")));
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
    const newCellStates = cellStates.map(row => [...row]);
    if (num === 0) {
      newBoard[r][c] = 0;
      newCellStates[r][c] = "neutral";
    } else if (solution[r][c] === num) {
      newBoard[r][c] = num;
      newCellStates[r][c] = "correct";
      playSuccess(); vibrate([20, 10, 20]);
    } else {
      newBoard[r][c] = num;
      newCellStates[r][c] = "wrong";
      playError(); vibrate([50]);
      const nm = mistakes + 1;
      setMistakes(nm);
      if (nm >= 3) {
        setBoard(newBoard);
        setCellStates(newCellStates);
        setGameState("lost");
        setTimerRunning(false);
        markPlayed({ result: 'lost', time: formatTime(timer) });
        return;
      }
    }
    setBoard(newBoard);
    setCellStates(newCellStates);
    const isComplete = newBoard.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]));
    if (isComplete) {
      setGameState("won");
      setTimerRunning(false);
      playWin(); vibrate([50, 30, 50, 30, 100]);
      markPlayed({ result: 'won', time: formatTime(timer) });
    }
  }, [selected, gameState, given, board, solution, cellStates, mistakes, timer, markPlayed, playSuccess, playError, playWin, vibrate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (/^[1-6]$/.test(e.key)) placeNumber(parseInt(e.key));
      else if (e.key === "Backspace" || e.key === "0") placeNumber(0);
      else if (e.key === "ArrowUp" && selected) setSelected([Math.max(0, selected[0] - 1), selected[1]]);
      else if (e.key === "ArrowDown" && selected) setSelected([Math.min(5, selected[0] + 1), selected[1]]);
      else if (e.key === "ArrowLeft" && selected) setSelected([selected[0], Math.max(0, selected[1] - 1)]);
      else if (e.key === "ArrowRight" && selected) setSelected([selected[0], Math.min(5, selected[1] + 1)]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [placeNumber, selected]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const getCellStyle = (r: number, c: number) => {
    const state = cellStates[r]?.[c];
    const isSel = selected && selected[0] === r && selected[1] === c;
    const isSameNum = selected && board[selected[0]]?.[selected[1]] && board[r][c] === board[selected[0]][selected[1]] && board[r][c] !== 0;
    // Same box highlight
    const selBox = selected ? Math.floor(selected[0] / 2) * 2 + Math.floor(selected[1] / 3) : -1;
    const cellBox = Math.floor(r / 2) * 2 + Math.floor(c / 3);
    const isHighlight = selected && (selected[0] === r || selected[1] === c || cellBox === selBox);
    if (isSel) return { background: "rgba(167,139,250,0.3)", border: "2px solid #A78BFA" };
    if (state === "correct") return { background: "rgba(94,234,212,0.2)", border: "1px solid rgba(94,234,212,0.4)" };
    if (state === "wrong") return { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" };
    if (isSameNum) return { background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.25)" };
    if (isHighlight) return { background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.12)" };
    return { background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.7)" };
  };

  if (!canPlay && completionEntry) {
    return <CompletedReplay gameTitle="Sudoku 6x6" gameSlug="sudoku" completionEntry={completionEntry} hoursUntilReset={hoursUntilReset} />;
  }
  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: "linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>
        <div className="font-black text-4xl" style={{ color: "#A78BFA" }}>Come back soon</div>
        <div className="font-bold text-sm text-center" style={{ color: "#94a3b8" }}>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color: "#A78BFA" }}>Back to games</Link>
      </div>
    );
  }

  if (gameState === "setup") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[32px] flex flex-col gap-5 items-center" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", boxShadow: "0 16px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.8)", maxWidth: 340, width: "90%" }}>
          <Link href="/games" className="no-underline self-start">
            <span className="font-bold text-sm" style={{ color: "#A78BFA" }}>Back</span>
          </Link>
          <div className="flex items-center justify-center font-black text-white rounded-2xl" style={{ width: 52, height: 52, background: "linear-gradient(135deg,#C4B5FD,#A78BFA)", fontSize: 22 }}>P</div>
          <div className="text-center">
            <div className="font-black text-2xl mb-2" style={{ color: "#1e1b4b" }}>Sudoku 6x6</div>
            <div className="font-bold text-sm leading-relaxed" style={{ color: "#64748b" }}>Fill the grid with 1-6.<br />No repeats in any row, column, or 3x2 box.</div>
          </div>
          <motion.button onClick={() => startGame()} whileTap={{ scale: 0.95 }} className="w-full py-4 rounded-2xl font-black text-white text-base" style={{ background: "linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow: "0 8px 20px rgba(167,139,250,0.3)" }}>
            Play
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width: 32, height: 32, background: "linear-gradient(135deg,#C4B5FD,#A78BFA)", fontSize: 14 }}>P</div>
          <span className="font-black text-xs" style={{ color: "#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color: "#1e1b4b" }}>Sudoku 6x6</span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: "#64748b" }}>{formatTime(timer)}</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= mistakes ? "#ef4444" : "rgba(239,68,68,0.2)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
        <div className="rounded-3xl p-3" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(24px)", boxShadow: "0 16px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3 }}>
            {board.map((row, ri) =>
              row.map((val, ci) => {
                const cellStyle = getCellStyle(ri, ci);
                const isGiven = given[ri]?.[ci];
                // Thick borders for box boundaries
                const extraRight = ci === 2 ? { borderRight: "3px solid rgba(167,139,250,0.35)" } : {};
                const extraBottom = (ri === 1 || ri === 3) ? { borderBottom: "3px solid rgba(167,139,250,0.35)" } : {};
                return (
                  <motion.div
                    key={`${ri}-${ci}`}
                    onClick={() => !isGiven && setSelected([ri, ci])}
                    whileTap={!isGiven ? { scale: 0.88 } : {}}
                    className="flex items-center justify-center font-black"
                    style={{
                      width: "min(52px, calc((100vw - 3.5rem) / 6))",
                      height: "min(52px, calc((100vw - 3.5rem) / 6))",
                      borderRadius: 10,
                      ...cellStyle,
                      ...extraRight,
                      ...extraBottom,
                      color: isGiven ? "#1e1b4b" : cellStates[ri]?.[ci] === "wrong" ? "#ef4444" : "#7c3aed",
                      fontSize: "min(20px, calc((100vw - 5rem) / 9))",
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

        {/* Number pad 1-6 */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <motion.button
              key={n}
              onClick={() => placeNumber(n)}
              whileTap={{ scale: 0.9 }}
              className="font-black rounded-2xl"
              style={{
                width: "min(48px, calc((100vw - 5rem) / 7))",
                height: "min(48px, calc((100vw - 5rem) / 7))",
                fontSize: 18,
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,1)",
                border: "1px solid rgba(255,255,255,0.9)",
                color: "#1e1b4b",
              }}
            >
              {n}
            </motion.button>
          ))}
          <motion.button
            onClick={() => placeNumber(0)}
            whileTap={{ scale: 0.95 }}
            className="font-bold rounded-2xl text-xs px-3"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(167,139,250,0.2)", color: "#7c3aed", height: "min(48px, calc((100vw - 5rem) / 7))" }}
          >
            Clr
          </motion.button>
        </div>

        <div className="font-bold text-xs" style={{ color: "#94a3b8" }}>No repeats in rows, columns, or 3x2 boxes</div>
      </div>

      {/* Win/Lose */}
      <AnimatePresence>
        {(gameState === "won" || gameState === "lost") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(240,235,255,0.85)", backdropFilter: "blur(20px)" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-5 p-8 rounded-[32px]" style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 24px 60px rgba(167,139,250,0.2)", maxWidth: 320, width: "90%" }}>
              <div className="font-black text-3xl" style={{ color: gameState === "won" ? "#A78BFA" : "#ef4444" }}>
                {gameState === "won" ? "Solved!" : "Game Over"}
              </div>
              <div className="font-bold text-sm" style={{ color: "#64748b" }}>
                {gameState === "won" ? `Time: ${formatTime(timer)}` : "3 mistakes reached"}
              </div>
              <div className="flex gap-3 w-full">
                <motion.button onClick={() => startGame()} whileTap={{ scale: 0.95 }} className="flex-1 py-3 rounded-2xl font-black text-white" style={{ background: "linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow: "0 8px 20px rgba(167,139,250,0.3)" }}>
                  Play Again
                </motion.button>
                <Link href="/games" className="flex-1 no-underline">
                  <div className="py-3 rounded-2xl font-black text-center" style={{ background: "rgba(255,255,255,0.8)", color: "#475569", border: "1px solid rgba(255,255,255,0.9)" }}>Home</div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
