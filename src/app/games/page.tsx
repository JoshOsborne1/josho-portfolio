"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DailyProgressStrip } from "./components/DailyProgress";
import { useAllDailyStatus } from "./components/useDaily";
import { useSubscription } from "./components/useSubscription";
import { ProGate } from "./components/ProGate";
import { ProBadge } from "./components/ProBadge";

const CATEGORIES = [
  {
    id: 'word',
    label: 'Word Games',
    icon: '✦',  // use text/emoji icon - no external icon lib
    color: '#A78BFA',
    games: ['word','wordchain','wordscramble','crossword']
  },
  {
    id: 'numbers',
    label: 'Number & Logic',
    icon: '#',
    color: '#5EEAD4',
    games: ['2048','sudoku','math','memory','trivia']
  },
  {
    id: 'geography',
    label: 'Geography',
    icon: '◎',
    color: '#F59E0B',
    games: ['flagle','worldle','globle','travle']
  },
  {
    id: 'music',
    label: 'Music',
    icon: '♪',
    color: '#F472B6',
    games: ['wave']
  }
];

// Original games array - keeping existing game data
const allGames = [
  {
    slug: "word",
    title: "Word Guess",
    desc: "Guess the 5-letter word in 6 tries",
    difficulty: 2,
    canvasColor: ["#C4B5FD", "#A78BFA"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const letters = ["W", "O", "R", "D", "S"];
      const colors = ["#5EEAD4", "#A78BFA", "#94a3b8", "#5EEAD4", "#A78BFA"];
      letters.forEach((l, i) => {
        const x = (i / 5) * w + w / 10;
        const y = h / 2 + Math.sin(t * 2 + i) * 4;
        const scale = 1 + Math.sin(t * 3 + i * 0.8) * 0.05;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = colors[i];
        ctx.font = `900 ${w * 0.16}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(l, 0, 0);
        ctx.restore();
      });
    },
  },
  {
    slug: "sudoku",
    title: "Sudoku",
    desc: "Classic 9x9 number puzzle",
    difficulty: 3,
    canvasColor: ["#A78BFA", "#7C3AED"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cell = w / 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const x = c * cell;
          const y = r * cell;
          const pulse = Math.sin(t * 2 + r * 1.2 + c * 0.8) * 0.08 + 0.15;
          ctx.fillStyle = `rgba(167,139,250,${pulse})`;
          ctx.beginPath();
          ctx.roundRect(x + 2, y + 2, cell - 4, cell - 4, 4);
          ctx.fill();
          ctx.fillStyle = "#1e1b4b";
          ctx.font = `700 ${cell * 0.4}px system-ui`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(r * 3 + c + 1), x + cell / 2, y + cell / 2);
        }
      }
    },
  },
  {
    slug: "2048",
    title: "2048",
    desc: "Slide and merge tiles to reach 2048",
    difficulty: 2,
    canvasColor: ["#5EEAD4", "#0D9488"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const tiles = [
        { v: 2, x: 0, y: 0 }, { v: 4, x: 1, y: 0 },
        { v: 8, x: 0, y: 1 }, { v: 16, x: 1, y: 1 },
      ];
      const colors: Record<number, string> = { 2: "#f8fafc", 4: "#ede9fe", 8: "#A78BFA", 16: "#5EEAD4" };
      const cell = w / 2.4;
      const gap = (w - cell * 2) / 3;
      tiles.forEach((tile, i) => {
        const x = tile.x * (cell + gap) + gap;
        const y = tile.y * (cell + gap) + gap;
        const s = 1 + Math.sin(t * 1.5 + i * 0.7) * 0.04;
        ctx.save();
        ctx.translate(x + cell / 2, y + cell / 2);
        ctx.scale(s, s);
        ctx.fillStyle = colors[tile.v] || "#A78BFA";
        ctx.beginPath();
        ctx.roundRect(-cell / 2, -cell / 2, cell, cell, 6);
        ctx.fill();
        ctx.fillStyle = tile.v <= 4 ? "#1e1b4b" : "#fff";
        ctx.font = `900 ${cell * 0.35}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(tile.v), 0, 0);
        ctx.restore();
      });
    },
  },
  {
    slug: "trivia",
    title: "Trivia",
    desc: "Test your general knowledge",
    difficulty: 2,
    canvasColor: ["#F59E0B", "#D97706"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const r = w * 0.38;
      const progress = (Math.sin(t * 1.2) + 1) / 2;
      ctx.strokeStyle = "rgba(167,139,250,0.2)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#A78BFA";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#1e1b4b";
      ctx.font = `900 ${w * 0.3}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", w / 2, h / 2);
    },
  },
  {
    slug: "memory",
    title: "Memory Match",
    desc: "Flip and match the pairs",
    difficulty: 1,
    canvasColor: ["#5EEAD4", "#0D9488"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const grid = [[0, 1], [2, 3]];
      const colors = ["#C4B5FD", "#5EEAD4", "#C4B5FD", "#5EEAD4"];
      const cell = w / 2.4;
      const gap = (w - cell * 2) / 3;
      grid.forEach((row, ri) => {
        row.forEach((ci, cj) => {
          const x = cj * (cell + gap) + gap;
          const y = ri * (cell + gap) + gap;
          const flipPhase = Math.sin(t * 1.5 + ri * 2 + cj * 1.3);
          const scaleX = Math.abs(flipPhase);
          ctx.save();
          ctx.translate(x + cell / 2, y + cell / 2);
          ctx.scale(scaleX, 1);
          ctx.fillStyle = flipPhase > 0 ? colors[ci + ri * 2] : "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.roundRect(-cell / 2, -cell / 2, cell, cell, 6);
          ctx.fill();
          if (flipPhase > 0.3) {
            ctx.fillStyle = "#fff";
            ctx.font = `900 ${cell * 0.4}px system-ui`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String.fromCharCode(65 + ci + ri * 2), 0, 0);
          }
          ctx.restore();
        });
      });
    },
  },
  {
    slug: "wordchain",
    title: "Word Chain",
    desc: "Chain words — last letter starts the next",
    difficulty: 3,
    canvasColor: ["#A78BFA", "#7C3AED"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const words = ["CAT", "TOP", "PEN"];
      words.forEach((word, i) => {
        const y = (i + 0.7) * (h / 3.2);
        const x = w / 2 + Math.sin(t + i) * 3;
        ctx.fillStyle = i === 0 ? "#A78BFA" : i === 1 ? "#5EEAD4" : "#C4B5FD";
        ctx.beginPath();
        const tw = word.length * w * 0.085 + 8;
        ctx.roundRect(x - tw / 2, y - 8, tw, 16, 8);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = `700 ${w * 0.12}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(word, x, y);
      });
    },
  },
  {
    slug: "math",
    title: "Math Challenge",
    desc: "Speed maths - beat the clock",
    difficulty: 2,
    canvasColor: ["#5EEAD4", "#0D9488"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const ops = ["+", "-", "x"];
      const op = ops[Math.floor((t * 0.5) % ops.length)];
      const pulse = 1 + Math.sin(t * 3) * 0.05;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "#A78BFA";
      ctx.font = `900 ${w * 0.45}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(op, 0, 0);
      ctx.restore();
    },
  },
  {
    slug: "crossword",
    title: "Crossword",
    desc: "Mini 5x5 crossword puzzle",
    difficulty: 3,
    canvasColor: ["#A78BFA", "#7C3AED"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const grid = [
        [1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
      ];
      const cell = w / 5.5;
      const off = (w - cell * 5) / 2;
      grid.forEach((row, ri) => {
        row.forEach((v, ci) => {
          if (!v) return;
          const x = ci * cell + off;
          const y = ri * cell + off;
          const pulse = Math.sin(t * 1.5 + ri + ci) * 0.06 + 0.18;
          ctx.fillStyle = `rgba(167,139,250,${pulse})`;
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 1, cell - 2, cell - 2, 2);
          ctx.fill();
        });
      });
    },
  },
  {
    slug: "wordscramble",
    title: "Word Scramble",
    desc: "Unscramble the jumbled letters",
    difficulty: 1,
    canvasColor: ["#5EEAD4", "#A78BFA"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const letters = ["S", "C", "A", "M", "R"];
      letters.forEach((l, i) => {
        const angle = (i / letters.length) * Math.PI * 2 + t * 0.5;
        const r = w * 0.32;
        const x = w / 2 + Math.cos(angle) * r;
        const y = h / 2 + Math.sin(angle) * r;
        ctx.fillStyle = i % 2 === 0 ? "#A78BFA" : "#5EEAD4";
        ctx.beginPath();
        ctx.arc(x, y, w * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = `900 ${w * 0.12}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(l, x, y);
      });
    },
  },
  {
    slug: "flagle",
    title: "Flagle",
    desc: "Guess the flag from revealed tiles",
    difficulty: 1,
    canvasColor: ["#FEF9C3", "#FDE047"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = 3; const rows = 2;
      const cw = (w - 8) / cols; const ch = (h - 8) / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "#FDE047" : "#FEF9C3";
        ctx.beginPath();
        ctx.roundRect(4 + c * cw, 4 + r * ch, cw - 2, ch - 2, 4);
        ctx.fill();
      }
    },
  },
  {
    slug: "worldle",
    title: "Worldle",
    desc: "Guess the country silhouette",
    difficulty: 2,
    canvasColor: ["#D1FAE5", "#34D399"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#34D39966";
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, w / 3, h / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
  },
  {
    slug: "globle",
    title: "Globle",
    desc: "Find the country on the globe",
    difficulty: 3,
    canvasColor: ["#DBEAFE", "#60A5FA"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) / 2.5, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(w * 0.4, h * 0.35, 2, w / 2, h / 2, Math.min(w, h) / 2.5);
      grad.addColorStop(0, "#93C5FD");
      grad.addColorStop(1, "#1D4ED8");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "#60A5FA";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Lat/lon lines
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, (Math.min(w, h) / 2.5) * (i / 3), Math.min(w, h) / 2.5, t * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  },
  {
    slug: "travle",
    title: "Travle",
    desc: "Navigate between countries via borders",
    difficulty: 3,
    canvasColor: ["#FCE7F3", "#F472B6"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#F472B6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, h / 2);
      ctx.lineTo(w - 10, h / 2);
      ctx.stroke();
      [10, w / 2, w - 10].forEach(x => {
        ctx.beginPath();
        ctx.arc(x, h / 2, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#F472B6";
        ctx.fill();
      });
    },
  },
  {
    slug: "wave",
    title: "Wave",
    desc: "The original josho.pro party game",
    difficulty: 2,
    canvasColor: ["#F472B6", "#EC4899"],
    drawPreview: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const points = [];
      for (let x = 0; x <= w; x += w / 10) {
        const y = h / 2 + Math.sin(t * 2 + x * 0.1) * (h / 4);
        points.push({x, y});
      }
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#F472B6");
      grad.addColorStop(1, "#EC4899");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.stroke();
    },
  }
];

function GamePreviewCanvas({
  draw,
  isHovered,
}: {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  isHovered: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = 60;
    const h = 60;

    const animate = () => {
      if (isHovered) timeRef.current += 0.03;
      draw(ctx, w, h, timeRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, isHovered]);

  return <canvas ref={canvasRef} width={60} height={60} style={{ width: 60, height: 60 }} />;
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((d) => (
        <div
          key={d}
          className="w-2 h-2 rounded-full"
          style={{
            background: d <= level ? "#A78BFA" : "rgba(167,139,250,0.2)",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

export default function GamesPage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const { statuses, completedCount } = useAllDailyStatus();
  const { isPro } = useSubscription();
  const [showProGate, setShowProGate] = useState(false);
  const DAILY_LIMIT = 5;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Calculate completed games per category
  const categoryStats = CATEGORIES.map(category => {
    const categoryGames = allGames.filter(game => category.games.includes(game.slug));
    const completedInCategory = categoryGames.filter(game => statuses[game.slug]).length;
    return {
      id: category.id,
      completed: completedInCategory,
      total: categoryGames.length
    };
  });

  // Filter games by category
  const gamesByCategory = CATEGORIES.map(category => {
    return {
      ...category,
      games: allGames.filter(game => category.games.includes(game.slug))
    };
  });

  return (
    <>
      {showProGate && <ProGate onClose={() => setShowProGate(false)} />}
      
      <div
        className="min-h-screen pb-11"
        style={{
          background: "linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Top Bar */}
        <div 
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{
            height: 52,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.8)"
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center font-black text-white rounded-2xl"
              style={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)",
                boxShadow: "0 4px 12px rgba(167,139,250,0.25), inset 0 2px 4px rgba(255,255,255,0.35)",
                fontSize: 14,
              }}
            >G</div>
            <span className="font-black text-sm" style={{ color: "#A78BFA", letterSpacing: "0.06em" }}>Games</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isPro && <ProBadge />}
            <div 
              className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg"
              style={{ 
                background: "rgba(167,139,250,0.12)", 
                color: "#7c3aed",
                minWidth: 70,
                textAlign: 'center'
              }}
            >
              24h left
            </div>
          </div>
        </div>

        {/* Daily Progress Strip */}
        <div className="px-4 py-2">
          <div 
            className="text-xs font-bold flex items-center justify-between px-3 py-1.5 rounded-xl"
            style={{ 
              background: "rgba(255,255,255,0.6)", 
              backdropFilter: "blur(12px)", 
              border: "1px solid rgba(255,255,255,0.8)", 
              color: "#7c3aed" 
            }}
          >
            <span>Today: {completedCount}/13 completed</span>
            <span>Resets in 4h 22m</span>
            {isPro && <span className="text-purple-600">PRO: unlimited</span>}
          </div>
        </div>

        {/* Category Sections */}
        <div className="px-4 py-4 space-y-8">
          {gamesByCategory.map((category, catIndex) => {
            const catStat = categoryStats.find(stat => stat.id === category.id);
            return (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="text-lg"
                      style={{ 
                        color: category.color,
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {category.icon}
                    </div>
                    <h2 
                      className="font-black text-lg"
                      style={{ color: "#1e1b4b" }}
                    >
                      {category.label}
                    </h2>
                  </div>
                  <div 
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ 
                      background: "rgba(167,139,250,0.12)", 
                      color: "#7c3aed" 
                    }}
                  >
                    {catStat?.completed}/{catStat?.total} completed
                  </div>
                </div>

                {/* Game Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {category.games.map((game, gameIndex) => {
                    const done = statuses[game.slug] != null;
                    const canPlayNew = isPro || completedCount < DAILY_LIMIT;
                    const isLocked = !done && !canPlayNew;
                    
                    return (
                      <motion.div
                        key={game.slug}
                        initial={{ opacity: 0, y: 16 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * (catIndex * 5 + gameIndex) }}
                        className="relative"
                        style={{
                          width: '100%',
                          height: 200,
                        }}
                      >
                        <Link
                          href={isLocked ? "#" : `/games/${game.slug}`}
                          onClick={isLocked ? (e) => { e.preventDefault(); setShowProGate(true); } : undefined}
                          className="no-underline block h-full"
                        >
                          <motion.div
                            className="h-full flex flex-col gap-3 p-3 rounded-2xl cursor-pointer relative overflow-hidden"
                            style={{
                              background: isLocked 
                                ? "rgba(220,220,220,0.3)" 
                                : done 
                                  ? "rgba(240,255,244,0.75)" 
                                  : "rgba(255,255,255,0.6)",
                              backdropFilter: "blur(24px)",
                              boxShadow: done
                                ? "0 8px 24px rgba(74,222,128,0.10), inset 0 2px 4px rgba(255,255,255,0.8)"
                                : "0 8px 24px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.8)",
                              border: done 
                                ? "1px solid rgba(74,222,128,0.25)" 
                                : isLocked
                                  ? "1px solid rgba(200,200,200,0.3)"
                                  : "1px solid rgba(255,255,255,0.8)",
                            }}
                            whileHover={{ boxShadow: "0 12px 32px rgba(167,139,250,0.15)", y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={() => setHoveredSlug(game.slug)}
                            onMouseLeave={() => setHoveredSlug(null)}
                          >
                            {/* Lock overlay for locked games */}
                            {isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-50">
                                <div className="text-gray-500 text-2xl">🔒</div>
                              </div>
                            )}
                            
                            {/* Checkmark overlay for completed games */}
                            {done && (
                              <div className="absolute top-2 right-2 rounded-full flex items-center justify-center font-black text-xs z-10"
                                style={{ width: 20, height: 20, background: "linear-gradient(135deg,#86EFAC,#4ADE80)", color: "#166534" }}>
                                ✓
                              </div>
                            )}
                            
                            {/* Game preview canvas - only for playable unplayed games */}
                            {!done && !isLocked && (
                              <div className="rounded-xl overflow-hidden flex items-center justify-center self-start mx-auto"
                                style={{ width: 60, height: 60, background: `linear-gradient(135deg, ${game.canvasColor[0]}22 0%, ${game.canvasColor[1]}22 100%)` }}>
                                <GamePreviewCanvas draw={game.drawPreview} isHovered={hoveredSlug === game.slug} />
                              </div>
                            )}
                            
                            {/* Category-colored background for completed/locked states */}
                            {(done || isLocked) && (
                              <div 
                                className="rounded-xl overflow-hidden flex items-center justify-center self-start mx-auto"
                                style={{ 
                                  width: 60, 
                                  height: 60, 
                                  background: `linear-gradient(135deg, ${category.color}22 0%, ${category.color}44 100%)` 
                                }}
                              >
                                <div className="text-2xl" style={{ color: category.color }}>
                                  {game.slug === 'wave' ? '♪' : 
                                   game.slug.includes('word') ? '✦' :
                                   game.slug.includes('2048') || game.slug.includes('sudoku') || game.slug.includes('math') || game.slug.includes('memory') || game.slug.includes('trivia') ? '#' :
                                   game.slug.includes('flagle') || game.slug.includes('worldle') || game.slug.includes('globle') || game.slug.includes('travle') ? '◎' : '✦'}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="font-black text-sm" style={{ color: "#1e1b4b" }}>{game.title}</div>
                              <div className="font-bold text-xs leading-snug" style={{ color: "#64748b" }}>{game.desc}</div>
                              {done && <div className="font-bold text-[10px] mt-0.5" style={{ color: "#4ADE80" }}>Completed today</div>}
                              {isLocked && <div className="font-bold text-[10px] mt-0.5" style={{ color: "#94a3b8" }}>Limit reached</div>}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <DifficultyDots level={game.difficulty} />
                              <motion.div 
                                className={`px-3 py-1 rounded-xl font-black text-xs text-white ${
                                  done ? 'bg-green-500' : isLocked ? 'bg-gray-400' : ''
                                }`}
                                style={{ 
                                  background: done 
                                    ? "linear-gradient(180deg,#86EFAC,#4ADE80)" 
                                    : isLocked
                                      ? "linear-gradient(180deg, #d1d5db 0%, #9ca3af 100%)"
                                      : "linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)",
                                  boxShadow: done 
                                    ? "0 4px 12px rgba(74,222,128,0.3)" 
                                    : isLocked
                                      ? "0 4px 12px rgba(156,163,175,0.3)"
                                      : "0 4px 12px rgba(167,139,250,0.3)",
                                  color: done ? "#166534" : isLocked ? "#4b5563" : "#fff"
                                }}
                              >
                                {done ? "Review" : isLocked ? "Locked" : "Play"}
                              </motion.div>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscription CTA Strip (only for non-pro users) */}
        {!isPro && (
          <div 
            className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-20"
            style={{ 
              height: 44,
              background: "linear-gradient(90deg, #A78BFA 0%, #7C3AED 100%)",
            }}
          >
            <span className="font-bold text-white text-sm">Free: 5 games/day</span>
            <button 
              onClick={() => setShowProGate(true)}
              className="font-bold text-white flex items-center gap-1"
            >
              Go Pro for unlimited <span>→</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}