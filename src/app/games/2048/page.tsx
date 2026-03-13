"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";

type Grid = (number | 0)[][];

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: "rgba(255,255,255,0.3)", text: "transparent" },
  2:    { bg: "rgba(255,255,255,0.8)", text: "#1e1b4b" },
  4:    { bg: "rgba(196,181,253,0.4)", text: "#4c1d95" },
  8:    { bg: "#C4B5FD", text: "#4c1d95" },
  16:   { bg: "#A78BFA", text: "#fff" },
  32:   { bg: "#5EEAD4", text: "#0F766E" },
  64:   { bg: "#34D399", text: "#065F46" },
  128:  { bg: "#FCD34D", text: "#92400E" },
  256:  { bg: "#FBBF24", text: "#78350F" },
  512:  { bg: "#F59E0B", text: "#fff" },
  1024: { bg: "#F97316", text: "#fff" },
  2048: { bg: "linear-gradient(135deg,#FBBF24,#F59E0B)", text: "#fff" },
};

function emptyGrid(): Grid {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (grid[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter(v => v !== 0);
  const merged: number[] = [];
  let score = 0;
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function moveLeft(grid: Grid): { grid: Grid; score: number; moved: boolean } {
  let score = 0;
  let moved = false;
  const newGrid = grid.map(row => {
    const { row: newRow, score: s } = slideRow(row);
    score += s;
    if (newRow.join() !== row.join()) moved = true;
    return newRow;
  });
  return { grid: newGrid, score, moved };
}

function rotateGrid(grid: Grid): Grid {
  return grid[0].map((_, ci) => grid.map(row => row[ci]).reverse());
}

function move(grid: Grid, dir: "left" | "right" | "up" | "down"): { grid: Grid; score: number; moved: boolean } {
  let g = grid;
  let rotations = 0;
  if (dir === "right") { g = rotateGrid(rotateGrid(g)); rotations = 2; }
  else if (dir === "up") { g = rotateGrid(rotateGrid(rotateGrid(g))); rotations = 3; }
  else if (dir === "down") { g = rotateGrid(g); rotations = 1; }
  const result = moveLeft(g);
  let rg = result.grid;
  for (let i = 0; i < (4 - rotations) % 4; i++) rg = rotateGrid(rg);
  return { grid: rg, score: result.score, moved: result.moved };
}

function hasWon(grid: Grid): boolean {
  return grid.some(row => row.some(v => v >= 2048));
}

function hasLost(grid: Grid): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
      if (c < 3 && grid[r][c] === grid[r][c+1]) return false;
      if (r < 3 && grid[r][c] === grid[r+1][c]) return false;
    }
  }
  return true;
}

export default function Game2048() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry, ready } = useDaily('2048');
  if (!ready) return <div className="min-h-screen" style={{background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)"}} />;
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  const [grid, setGrid] = useState<Grid>(() => addRandomTile(addRandomTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => typeof window !== "undefined" ? parseInt(localStorage.getItem("2048-best") || "0") : 0);
  const [gameState, setGameState] = useState<"playing"|"won"|"lost">("playing");
  const [wonDismissed, setWonDismissed] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleMove = useCallback((dir: "left"|"right"|"up"|"down") => {
    if (gameState === "lost") return;
    if (gameState === "won" && wonDismissed === false) return;
    setGrid(prev => {
      const result = move(prev, dir);
      if (!result.moved) return prev;
      const newGrid = addRandomTile(result.grid);
      const newScore = score + result.score;
      setScore(newScore);
      if (newScore > best) {
        setBest(newScore);
        if (typeof window !== "undefined") localStorage.setItem("2048-best", String(newScore));
      }
      if (hasWon(newGrid) && gameState === "playing") {
        setGameState("won");
        markPlayed({ result: 'won', score: newScore });
      } else if (hasLost(newGrid)) {
        setGameState("lost");
        markPlayed({ result: 'lost', score: newScore });
      }
      return newGrid;
    });
  }, [gameState, score, best, wonDismissed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); handleMove("left"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); handleMove("right"); }
      else if (e.key === "ArrowUp") { e.preventDefault(); handleMove("up"); }
      else if (e.key === "ArrowDown") { e.preventDefault(); handleMove("down"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  const resetGame = () => {
    setGrid(addRandomTile(addRandomTile(emptyGrid())));
    setScore(0);
    setGameState("playing");
    setWonDismissed(false);
  };

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? "right" : "left");
      else handleMove(dy > 0 ? "down" : "up");
      touchStart.current = null;
    },
  };

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
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",boxShadow:"0 4px 12px rgba(167,139,250,0.4)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>2048</span>
        <div className="flex gap-3">
          <div className="flex flex-col items-center px-3 py-1 rounded-xl" style={{ background:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.8)" }}>
            <span className="font-black text-base" style={{ color:"#1e1b4b" }}>{score}</span>
            <span className="font-bold text-xs uppercase tracking-wide" style={{ color:"#94a3b8" }}>Score</span>
          </div>
          <div className="flex flex-col items-center px-3 py-1 rounded-xl" style={{ background:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.8)" }}>
            <span className="font-black text-base" style={{ color:"#A78BFA" }}>{best}</span>
            <span className="font-bold text-xs uppercase tracking-wide" style={{ color:"#94a3b8" }}>Best</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 mt-2 mb-3">
        <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="px-4 py-2 rounded-xl font-bold text-sm active:scale-95" style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(167,139,250,0.2)", color:"#7c3aed" }}>New Game</motion.button>
      </div>

      {/* Grid */}
      <div className="flex flex-col items-center justify-center flex-1" {...swipeHandlers}>
        <div className="p-3 rounded-3xl" style={{ background:"rgba(255,255,255,0.5)", backdropFilter:"blur(20px)", boxShadow:"0 16px 40px rgba(0,0,0,0.06)", border:"1px solid rgba(255,255,255,0.8)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {grid.map((row, ri) =>
              row.map((val, ci) => {
                const colors = TILE_COLORS[val] || TILE_COLORS[2048];
                return (
                  <motion.div
                    key={`${ri}-${ci}`}
                    layout
                    animate={{ scale: val !== 0 ? 1 : 0.95 }}
                    className="w-16 h-16 flex items-center justify-center font-black rounded-2xl"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      fontSize: val >= 1024 ? 14 : val >= 128 ? 18 : 22,
                      boxShadow: val !== 0 ? "0 4px 12px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4)" : "none",
                    }}
                  >
                    {val !== 0 ? val : ""}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        <div className="mt-4 font-bold text-sm text-center" style={{ color:"#94a3b8" }}>
          Arrow keys or swipe to move
        </div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {gameState === "won" && !wonDismissed && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(240,235,255,0.85)", backdropFilter:"blur(20px)" }}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} className="p-8 rounded-[32px] flex flex-col items-center gap-5" style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(167,139,250,0.25)", maxWidth:300, width:"90%" }}>
              <div className="font-black text-4xl" style={{ color:"#A78BFA" }}>2048!</div>
              <div className="font-bold text-base text-center" style={{ color:"#64748b" }}>Score: {score}</div>
              <div className="flex gap-3 w-full">
                <motion.button onClick={() => setWonDismissed(true)} whileTap={{ scale:0.95 }} className="flex-1 py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)" }}>Keep Going</motion.button>
                <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="flex-1 py-3 rounded-2xl font-black" style={{ background:"rgba(255,255,255,0.8)", color:"#475569", border:"1px solid rgba(255,255,255,0.9)" }}>New Game</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {gameState === "lost" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(240,235,255,0.85)", backdropFilter:"blur(20px)" }}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} className="p-8 rounded-[32px] flex flex-col items-center gap-5" style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(0,0,0,0.1)", maxWidth:300, width:"90%" }}>
              <div className="font-black text-3xl" style={{ color:"#1e1b4b" }}>Game Over</div>
              <div className="font-bold text-base" style={{ color:"#64748b" }}>Score: {score} | Best: {best}</div>
              <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="w-full py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 8px 20px rgba(167,139,250,0.3)" }}>Try Again</motion.button>
              <Link href="/games" className="font-bold text-sm no-underline" style={{ color:"#94a3b8" }}>Back to games</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          </>)}
    </div>
  );
}