"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// 10 themed 5x5 mini crossword puzzles
// grid: 5x5, '#' = black cell, letter = solution
const PUZZLES = [
  {
    theme: "Animals",
    grid: [
      ["C","A","T","#","#"],
      ["O","#","I","#","#"],
      ["W","H","A","L","E"],
      ["#","#","N","#","#"],
      ["#","#","T","#","#"],
    ],
    clues: {
      across: [
        { num:1, row:0, col:0, len:3, clue:"Feline pet" },
        { num:3, row:2, col:0, len:5, clue:"Largest ocean animal" },
      ],
      down: [
        { num:1, row:0, col:0, len:3, clue:"Female bovine" },
        { num:2, row:0, col:2, len:5, clue:"Big striped cat" },
      ],
    },
  },
  {
    theme: "Space",
    grid: [
      ["M","O","O","N","#"],
      ["A","#","R","#","#"],
      ["R","A","B","I","T"],
      ["S","#","I","#","#"],
      ["#","#","T","#","#"],
    ],
    clues: {
      across: [
        { num:1, row:0, col:0, len:4, clue:"Earth's natural satellite" },
        { num:3, row:2, col:0, len:5, clue:"Small mammal that hops" },
      ],
      down: [
        { num:1, row:0, col:0, len:4, clue:"Red planet" },
        { num:2, row:0, col:2, len:5, clue:"Rings around planets" },
      ],
    },
  },
  {
    theme: "Food",
    grid: [
      ["P","A","S","T","A"],
      ["I","#","A","#","P"],
      ["Z","#","L","#","P"],
      ["Z","#","A","#","L"],
      ["A","#","D","#","E"],
    ],
    clues: {
      across: [
        { num:1, row:0, col:0, len:5, clue:"Italian noodle dish" },
      ],
      down: [
        { num:1, row:0, col:0, len:5, clue:"Italian pie with cheese" },
        { num:2, row:0, col:2, len:5, clue:"Tossed mixed greens" },
        { num:3, row:0, col:4, len:5, clue:"Fruit with core" },
      ],
    },
  },
];

// Use first puzzle for now (rotate or pick random)
function getRandomPuzzle() {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
}

function initBoard(grid: string[][]): string[][] {
  return grid.map(row => row.map(cell => cell === "#" ? "#" : ""));
}

export default function CrosswordGame() {
  const [puzzle] = useState(() => getRandomPuzzle());
  const [board, setBoard] = useState(() => initBoard(puzzle.grid));
  const [selected, setSelected] = useState<[number,number]|null>(null);
  const [cellStates, setCellStates] = useState<string[][]>(puzzle.grid.map(r => r.map(() => "neutral")));
  const [gameState, setGameState] = useState<"playing"|"won">("playing");
  const confettiRef = useRef<HTMLCanvasElement>(null);

  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === "#") return;
    setSelected([r, c]);
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!selected || gameState !== "playing") return;
    const [r, c] = selected;
    if (puzzle.grid[r][c] === "#") return;

    if (e.key === "Backspace") {
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = "";
      setBoard(newBoard);
      const newStates = cellStates.map(row => [...row]);
      newStates[r][c] = "neutral";
      setCellStates(newStates);
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      const letter = e.key.toUpperCase();
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = letter;
      setBoard(newBoard);
      const newStates = cellStates.map(row => [...row]);
      if (letter === puzzle.grid[r][c]) {
        newStates[r][c] = "correct";
      } else {
        newStates[r][c] = "wrong";
      }
      setCellStates(newStates);
      // Check win
      const allCorrect = puzzle.grid.every((row, ri) =>
        row.every((cell, ci) => cell === "#" || newBoard[ri][ci] === cell)
      );
      if (allCorrect) setGameState("won");
      // Auto advance
      if (c < 4) setSelected([r, c + 1]);
    } else if (e.key === "ArrowRight" && c < 4) setSelected([r, c + 1]);
    else if (e.key === "ArrowLeft" && c > 0) setSelected([r, c - 1]);
    else if (e.key === "ArrowDown" && r < 4) setSelected([r + 1, c]);
    else if (e.key === "ArrowUp" && r > 0) setSelected([r - 1, c]);
  }, [selected, gameState, board, cellStates, puzzle.grid]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Confetti on win
  useEffect(() => {
    if (gameState !== "won") return;
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: ["#A78BFA","#5EEAD4","#FBBF24","#FB7185","#C4B5FD"][Math.floor(Math.random()*5)],
      vx: (Math.random()-0.5)*3,
      vy: Math.random()*3+2,
      life: 1,
    }));
    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life -= 0.008;
        if (p.life <= 0) continue;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.size, p.size * 0.6, 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (particles.some(p => p.life > 0)) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [gameState]);

  const resetGame = () => {
    setBoard(initBoard(puzzle.grid));
    setSelected(null);
    setCellStates(puzzle.grid.map(r => r.map(() => "neutral")));
    setGameState("playing");
  };

  const getCellStyle = (r: number, c: number) => {
    const state = cellStates[r][c];
    const isSel = selected && selected[0] === r && selected[1] === c;
    if (isSel) return { background:"rgba(167,139,250,0.3)", border:"2px solid #A78BFA" };
    if (state === "correct") return { background:"rgba(94,234,212,0.25)", border:"1px solid rgba(94,234,212,0.5)" };
    if (state === "wrong") return { background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)" };
    return { background:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.8)" };
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {gameState === "won" && <canvas ref={confettiRef} className="fixed inset-0 pointer-events-none z-40" />}

      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Crossword</span>
        <span className="font-bold text-sm px-2 py-1 rounded-xl" style={{ background:"rgba(167,139,250,0.1)", color:"#7c3aed" }}>{puzzle.theme}</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">
        {/* Grid */}
        <div className="p-4 rounded-[28px]" style={{ background:"rgba(255,255,255,0.65)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.8)", boxShadow:"0 12px 32px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4 }}>
            {puzzle.grid.map((row, ri) =>
              row.map((cell, ci) => {
                if (cell === "#") {
                  return <div key={`${ri}-${ci}`} style={{ width:52,height:52,borderRadius:8,background:"rgba(30,27,75,0.1)" }} />;
                }
                const style = getCellStyle(ri, ci);
                return (
                  <motion.div
                    key={`${ri}-${ci}`}
                    onClick={() => handleCellClick(ri, ci)}
                    animate={cellStates[ri][ci] === "wrong" ? { x:[-3,3,-3,3,0] } : {}}
                    transition={{ duration:0.3 }}
                    className="flex items-center justify-center font-black text-base cursor-pointer rounded-xl"
                    style={{ width:52,height:52, ...style, color:"#1e1b4b" }}
                  >
                    {board[ri][ci]}
                  </motion.div>
                );
              })
            )}
          </div>
          <div className="mt-3 text-center font-bold text-xs" style={{ color:"#94a3b8" }}>Click a cell, then type</div>
        </div>

        {/* Clues */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="p-4 rounded-[24px]" style={{ background:"rgba(255,255,255,0.65)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.8)" }}>
            <div className="font-black text-sm mb-3" style={{ color:"#1e1b4b" }}>Across</div>
            {puzzle.clues.across.map(clue => (
              <div key={clue.num} className="flex gap-2 mb-2">
                <span className="font-black text-xs px-1.5 py-0.5 rounded-lg shrink-0" style={{ background:"rgba(167,139,250,0.15)", color:"#7c3aed" }}>{clue.num}A</span>
                <span className="font-bold text-sm" style={{ color:"#475569" }}>{clue.clue}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-[24px]" style={{ background:"rgba(255,255,255,0.65)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.8)" }}>
            <div className="font-black text-sm mb-3" style={{ color:"#1e1b4b" }}>Down</div>
            {puzzle.clues.down.map(clue => (
              <div key={clue.num} className="flex gap-2 mb-2">
                <span className="font-black text-xs px-1.5 py-0.5 rounded-lg shrink-0" style={{ background:"rgba(94,234,212,0.15)", color:"#0F766E" }}>{clue.num}D</span>
                <span className="font-bold text-sm" style={{ color:"#475569" }}>{clue.clue}</span>
              </div>
            ))}
          </div>
          <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="py-2 rounded-2xl font-bold text-sm" style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(167,139,250,0.2)", color:"#7c3aed" }}>Reset</motion.button>
        </div>
      </div>

      <AnimatePresence>
        {gameState === "won" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(240,235,255,0.88)", backdropFilter:"blur(20px)" }}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} className="p-8 rounded-[32px] flex flex-col items-center gap-5" style={{ background:"rgba(255,255,255,0.92)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(167,139,250,0.25)", maxWidth:300, width:"90%" }}>
              <div className="font-black text-3xl" style={{ color:"#A78BFA" }}>Solved!</div>
              <div className="font-bold text-sm text-center" style={{ color:"#64748b" }}>You completed the {puzzle.theme} crossword!</div>
              <div className="flex gap-3 w-full">
                <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="flex-1 py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)" }}>Play Again</motion.button>
                <Link href="/games" className="flex-1 no-underline">
                  <div className="py-3 rounded-2xl font-black text-center" style={{ background:"rgba(255,255,255,0.8)", color:"#475569", border:"1px solid rgba(255,255,255,0.9)" }}>Home</div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
