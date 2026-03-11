"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Team, WordPair, WORD_PAIRS } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// Full-width half-dial — canvas, pivot at bottom-centre
// ─────────────────────────────────────────────────────────────────────────────
interface DialProps {
  guess: number;       // -80..80
  target?: number;     // -80..80, omit to hide
  interactive: boolean;
  onChange?: (v: number) => void;
  leftWord?: string;
  rightWord?: string;
}

function HalfDial({ guess, target, interactive, onChange, leftWord, rightWord }: DialProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef(guess);    // smoothed needle position
  const guessRef   = useRef(guess);
  const rafRef     = useRef(0);
  const targetRef  = useRef(target);

  useEffect(() => { guessRef.current = guess; }, [guess]);
  useEffect(() => { targetRef.current = target; }, [target]);

  // ── Draw everything to canvas ──────────────────────────────────────────────
  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const CW  = c.offsetWidth;
    const CH  = c.offsetHeight;
    if (!CW || !CH) return;

    const tw = Math.round(CW * dpr);
    const th = Math.round(CH * dpr);
    if (c.width !== tw || c.height !== th) { c.width = tw; c.height = th; }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CW, CH);

    const cx = CW / 2;
    const cy = CH;                  // pivot = bottom centre
    const R  = CW / 2 - 14;        // arc fills near full width

    // game-angle (−80..80) → canvas radians
    // 0 = up (−π/2), positive = clockwise
    const rad = (deg: number) => (deg - 90) * (Math.PI / 180);

    // ── 1. Subtle radial glow under arc ──────────────────────────────────────
    const bg = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.1);
    bg.addColorStop(0, "rgba(196,181,253,0.07)");
    bg.addColorStop(1, "rgba(196,181,253,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R + 20, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();

    // ── 2. Track ─────────────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy, R, rad(-80), rad(80));
    ctx.strokeStyle = "rgba(203,213,225,0.55)";
    ctx.lineWidth   = 14;
    ctx.lineCap     = "round";
    ctx.stroke();

    // ── 3. Scoring zones ─────────────────────────────────────────────────────
    const t = targetRef.current;
    if (t !== undefined) {
      const zones = [
        { hw: 22, color: "#7DD3FC", lw: 28, blur: 8,  alpha: 0.7  },
        { hw: 14, color: "#6EE7B7", lw: 28, blur: 12, alpha: 0.85 },
        { hw:  6, color: "#C4B5FD", lw: 28, blur: 20, alpha: 1.0  },
      ];
      for (const z of zones) {
        const a0 = Math.max(-80, t - z.hw);
        const a1 = Math.min( 80, t + z.hw);
        ctx.beginPath();
        ctx.arc(cx, cy, R, rad(a0), rad(a1));
        ctx.strokeStyle  = z.color;
        ctx.lineWidth    = z.lw;
        ctx.lineCap      = "round";
        ctx.globalAlpha  = z.alpha;
        ctx.shadowColor  = z.color;
        ctx.shadowBlur   = z.blur;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur  = 0;
      }

      // target tick
      const tr = rad(t);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(tr) * (R - 22), cy + Math.sin(tr) * (R - 22));
      ctx.lineTo(cx + Math.cos(tr) * (R + 10),  cy + Math.sin(tr) * (R + 10));
      ctx.strokeStyle = "white";
      ctx.lineWidth   = 3;
      ctx.lineCap     = "round";
      ctx.shadowColor = "rgba(255,255,255,0.9)";
      ctx.shadowBlur  = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // ── 4. Needle ─────────────────────────────────────────────────────────────
    const nr  = rad(displayRef.current);
    const nx  = cx + Math.cos(nr) * (R - 20);
    const ny  = cy + Math.sin(nr) * (R - 20);

    // shaft
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = "#A78BFA";
    ctx.lineWidth   = 4;
    ctx.lineCap     = "round";
    ctx.shadowColor = "#A78BFA";
    ctx.shadowBlur  = 24;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // orb gradient
    const og = ctx.createRadialGradient(nx - 4, ny - 4, 1, nx, ny, 16);
    og.addColorStop(0, "#EDE9FE");
    og.addColorStop(1, "#7C3AED");
    ctx.beginPath();
    ctx.arc(nx, ny, 16, 0, Math.PI * 2);
    ctx.fillStyle   = og;
    ctx.shadowColor = "#C4B5FD";
    ctx.shadowBlur  = 28;
    ctx.fill();
    ctx.shadowBlur  = 0;

    // specular highlight
    ctx.beginPath();
    ctx.arc(nx - 5, ny - 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fill();

    // ── 5. Hub ────────────────────────────────────────────────────────────────
    const hg = ctx.createRadialGradient(cx - 7, cy - 7, 2, cx, cy, 28);
    hg.addColorStop(0, "#ffffff");
    hg.addColorStop(1, "#E2E8F0");
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle   = hg;
    ctx.shadowColor = "rgba(0,0,0,0.14)";
    ctx.shadowBlur  = 18;
    ctx.fill();
    ctx.shadowBlur  = 0;

    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.fillStyle = "#C4B5FD";
    ctx.fill();
  }, []);

  // ── Animate needle → guessRef ──────────────────────────────────────────────
  const animate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const d = guessRef.current - displayRef.current;
      if (Math.abs(d) < 0.07) {
        displayRef.current = guessRef.current;
        draw();
        return;
      }
      displayRef.current += d * 0.24;
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => { animate(); }, [guess, animate]);
  useEffect(() => { draw();    }, [target, draw]);

  // ResizeObserver for canvas sizing
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(c);
    draw();
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  // ── Pointer → angle ────────────────────────────────────────────────────────
  const getAngle = (clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c) return 0;
    const r  = c.getBoundingClientRect();
    const dx = clientX - (r.left + r.width / 2);
    const dy = clientY - r.bottom;   // negative = above pivot
    const a  = Math.atan2(dx, -dy) * (180 / Math.PI);
    return Math.max(-80, Math.min(80, a));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive || !onChange) return;
    e.preventDefault();
    onChange(getAngle(e.clientX, e.clientY));
    const move = (ev: PointerEvent) => { ev.preventDefault(); onChange(getAngle(ev.clientX, ev.clientY)); };
    const up   = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup",   up);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Word labels flanking the arc */}
      {leftWord && (
        <div style={{
          position: "absolute", left: 6, bottom: 10, zIndex: 2,
          fontSize: 11, fontWeight: 900, color: "#F87171",
          maxWidth: "22%", lineHeight: 1.2, wordBreak: "break-word",
          textShadow: "0 1px 8px rgba(248,113,113,0.25)",
        }}>
          {leftWord}
        </div>
      )}
      {rightWord && (
        <div style={{
          position: "absolute", right: 6, bottom: 10, zIndex: 2, textAlign: "right",
          fontSize: 11, fontWeight: 900, color: "#2DD4BF",
          maxWidth: "22%", lineHeight: 1.2, wordBreak: "break-word",
          textShadow: "0 1px 8px rgba(45,212,191,0.25)",
        }}>
          {rightWord}
        </div>
      )}

      {/* Container enforces 2:1 ratio; canvas fills it */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1" }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            touchAction: "none",
            cursor: interactive ? "pointer" : "default",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Mobile Game
// ─────────────────────────────────────────────────────────────────────────────
export default function WaveMobile() {
  const [gameState,     setGameState]     = useState<GameState>("SETUP");
  const [teams,         setTeams]         = useState<Team[]>([
    { id: "1", name: "Team One", score: 0 },
    { id: "2", name: "Team Two", score: 0 },
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [currentPair,    setCurrentPair]    = useState<WordPair>(WORD_PAIRS[0]);
  const [targetAngle,    setTargetAngle]    = useState(0);
  const [dialValue,      setDialValue]      = useState(0);
  const [roundScore,     setRoundScore]     = useState(0);

  const currentTeam  = teams[currentTeamIdx];
  const otherIdx     = (currentTeamIdx + 1) % teams.length;

  const rand       = () => Math.random() * 160 - 80;
  const getRandom  = (excl?: WordPair) => {
    const pool = WORD_PAIRS.filter(p => p !== excl);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startRound = () => {
    setCurrentPair(getRandom());
    setTargetAngle(rand());
    setRoundScore(0);
    setDialValue(0);
    setGameState("CLUE_GIVER");
  };

  const calcScore = (g: number, t: number) => {
    const d = Math.abs(g - t);
    return d <= 6 ? 4 : d <= 14 ? 3 : d <= 22 ? 2 : 0;
  };

  const lockGuess = () => {
    const s = calcScore(dialValue, targetAngle);
    setRoundScore(s);
    setTeams(prev => prev.map((t, i) => i === currentTeamIdx ? { ...t, score: t.score + s } : t));
    setGameState("REVEAL");
  };

  const updateName = (id: string, name: string) =>
    setTeams(t => t.map(x => x.id === id ? { ...x, name } : x));

  // ── Shared style tokens ──
  const PRIMARY   = "w-full py-4 rounded-2xl font-black text-white text-[17px] shadow-lg active:scale-95 transition-transform select-none";
  const SECONDARY = "w-full py-4 rounded-2xl font-black text-[#0F766E] text-[17px] shadow-lg active:scale-95 transition-transform select-none";
  const CLAY      = "flex-1 py-3 bg-white/80 backdrop-blur rounded-xl font-bold text-[#475569] text-sm shadow-sm active:scale-95 transition-transform select-none";

  // ── Scoreboard strip ──
  const ScoreStrip = () => (
    <div className="flex gap-2">
      {teams.map((t, i) => (
        <div
          key={t.id}
          className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
            i === currentTeamIdx ? "bg-white/85 shadow-sm" : "bg-white/35 opacity-55"
          }`}
        >
          <div
            className="font-bold text-[#64748B] text-xs outline-none truncate"
            contentEditable
            suppressContentEditableWarning
            onBlur={e => updateName(t.id, e.currentTarget.textContent || t.name)}
          >
            {t.name}
          </div>
          <div className="text-xl font-black text-[#334155] ml-2">{t.score}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: "#FAFAFA",
        fontFamily: "'Nunito', system-ui, sans-serif",
        paddingTop:    "max(env(safe-area-inset-top,    0px), 18px)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
        paddingLeft:  12,
        paddingRight: 12,
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        html, body { background: #FAFAFA !important; overflow: hidden !important; }
      `}} />

      {/* Ambient blobs */}
      <div style={{ position:"absolute",top:-80,left:-80,width:"55vw",height:"55vw",borderRadius:"50%",background:"rgba(167,243,208,0.38)",filter:"blur(80px)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:-80,right:-80,width:"65vw",height:"65vw",borderRadius:"50%",background:"rgba(196,181,253,0.35)",filter:"blur(100px)",pointerEvents:"none" }} />

      <AnimatePresence mode="wait">

        {/* ─── SETUP ─────────────────────────────────────────────────────── */}
        {gameState === "SETUP" && (
          <motion.div key="setup"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20, position: "relative", zIndex: 10 }}
          >
            <div className="text-center pt-4">
              <div className="text-xs font-bold text-[#94A3B8] tracking-widest uppercase mb-1">Up Next</div>
              <div className="text-5xl font-black text-[#334155]">{currentTeam.name}</div>
              <div className="text-7xl font-black text-[#C4B5FD] leading-none mt-1">{currentTeam.score}</div>
            </div>

            <div className="space-y-2">
              {teams.map((t, i) => (
                <div key={t.id} className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                  i === currentTeamIdx ? "bg-white/85 shadow-sm" : "bg-white/45"
                }`}>
                  <div className="font-bold text-[#475569] outline-none text-sm" contentEditable suppressContentEditableWarning
                    onBlur={e => updateName(t.id, e.currentTarget.textContent || t.name)}>
                    {t.name}
                  </div>
                  <div className="text-2xl font-black text-[#334155]">{t.score}</div>
                </div>
              ))}
              <button
                onClick={() => setTeams([...teams, { id: Date.now().toString(), name: `Team ${teams.length + 1}`, score: 0 }])}
                className="w-full py-2 bg-white/40 rounded-2xl font-bold text-[#A78BFA] text-sm active:scale-95 transition-transform"
              >
                + Add Team
              </button>
            </div>

            <button onClick={startRound}
              className={PRIMARY}
              style={{ background: "linear-gradient(to bottom, #C4B5FD, #A78BFA)" }}
            >
              Begin Round
            </button>
          </motion.div>
        )}

        {/* ─── CLUE GIVER ────────────────────────────────────────────────── */}
        {gameState === "CLUE_GIVER" && (
          <motion.div key="clue"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 10, gap: 12 }}
          >
            <div>
              <ScoreStrip />
              <div className="text-center mt-3">
                <span className="inline-block px-3 py-1 bg-[#C4B5FD]/20 text-[#7C3AED] rounded-full text-xs font-bold tracking-widest uppercase">
                  Clue Giver - you see the target
                </span>
              </div>
            </div>

            {/* Big pair labels */}
            <div className="text-center px-2">
              <div className="text-4xl font-black text-[#F87171] leading-none">{currentPair.left}</div>
              <div className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest my-2">vs</div>
              <div className="text-4xl font-black text-[#2DD4BF] leading-none">{currentPair.right}</div>
            </div>

            {/* Full-width half-dial, target visible */}
            <HalfDial
              guess={targetAngle}
              target={targetAngle}
              interactive={false}
              leftWord={currentPair.left}
              rightWord={currentPair.right}
            />

            <div className="space-y-2">
              <div className="flex gap-2">
                <button onClick={() => { setTargetAngle(rand()); setDialValue(0); }} className={CLAY}>Respin</button>
                <button onClick={() => { setCurrentPair(getRandom(currentPair)); setTargetAngle(rand()); setDialValue(0); }} className={CLAY}>Skip</button>
              </div>
              <button onClick={() => setGameState("TEAM_GUESSES")}
                className={PRIMARY}
                style={{ background: "linear-gradient(to bottom, #C4B5FD, #A78BFA)" }}
              >
                Hide for Guessers
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── TEAM GUESSES ──────────────────────────────────────────────── */}
        {gameState === "TEAM_GUESSES" && (
          <motion.div key="guess"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 10, gap: 12 }}
          >
            <div>
              <ScoreStrip />
              <div className="text-center mt-3">
                <span className="inline-block px-3 py-1 bg-[#A78BFA]/15 text-[#7C3AED] rounded-full text-xs font-bold tracking-widest uppercase">
                  Touch the dial to guess
                </span>
              </div>
            </div>

            <div className="text-center px-2">
              <div className="text-4xl font-black text-[#F87171] leading-none">{currentPair.left}</div>
              <div className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest my-2">vs</div>
              <div className="text-4xl font-black text-[#2DD4BF] leading-none">{currentPair.right}</div>
            </div>

            {/* Full-width half-dial, interactive, target hidden */}
            <HalfDial
              guess={dialValue}
              interactive
              onChange={setDialValue}
              leftWord={currentPair.left}
              rightWord={currentPair.right}
            />

            <button onClick={lockGuess}
              className={SECONDARY}
              style={{ background: "linear-gradient(to bottom, #A7F3D0, #5EEAD4)" }}
            >
              Reveal
            </button>
          </motion.div>
        )}

        {/* ─── REVEAL ────────────────────────────────────────────────────── */}
        {gameState === "REVEAL" && (
          <motion.div key="reveal"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 10, gap: 12 }}
          >
            <div>
              <ScoreStrip />
              <div className="text-center mt-2 px-2">
                <div className="text-3xl font-black text-[#F87171] leading-none">{currentPair.left}</div>
                <div className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest my-1">vs</div>
                <div className="text-3xl font-black text-[#2DD4BF] leading-none">{currentPair.right}</div>
              </div>
            </div>

            {/* Dial shows guess needle + scoring target */}
            <HalfDial
              guess={dialValue}
              target={targetAngle}
              interactive={false}
              leftWord={currentPair.left}
              rightWord={currentPair.right}
            />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">{currentTeam.name}</div>
              <div className={`text-6xl font-black leading-none mt-1 ${
                roundScore === 4 ? "text-[#C4B5FD]" : roundScore >= 2 ? "text-[#5EEAD4]" : "text-[#F87171]"
              }`}>
                {roundScore > 0 ? `+${roundScore}` : "Miss"}
              </div>
            </motion.div>

            <button onClick={() => { setCurrentTeamIdx(otherIdx); setGameState("SETUP"); }}
              className={PRIMARY}
              style={{ background: "linear-gradient(to bottom, #C4B5FD, #A78BFA)" }}
            >
              Next Round
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
