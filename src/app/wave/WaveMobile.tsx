"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Team, WordPair, WORD_PAIRS } from "./constants";

// ── Audio ─────────────────────────────────────────────────────────────────────
let _ctx: AudioContext | null = null;
const ac = () => {
  if (!_ctx && typeof window !== "undefined")
    _ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  if (_ctx?.state === "suspended") _ctx.resume();
  return _ctx;
};
const tone = (f: number, dur: number, vol = 0.14, type: OscillatorType = "sine") => {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.connect(g); g.connect(c.destination);
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.start(); o.stop(c.currentTime + dur);
};
const SFX = {
  tick:   ()  => tone(700, 0.025, 0.055),
  lock:   ()  => { tone(300, 0.1, 0.16); setTimeout(() => tone(420, 0.18, 0.1), 70); },
  score4: ()  => { tone(523,0.3,0.11); setTimeout(()=>tone(659,0.3,0.09),70); setTimeout(()=>tone(784,0.38,0.08),145); },
  score3: ()  => { tone(440,0.3,0.11); setTimeout(()=>tone(554,0.3,0.09),80); },
  score2: ()  => { tone(349,0.25,0.1); setTimeout(()=>tone(440,0.25,0.08),90); },
  miss:   ()  => { tone(220,0.35,0.11); setTimeout(()=>tone(185,0.4,0.09),65); },
  begin:  ()  => tone(500, 0.08, 0.09),
};
const vibe = (p: number | number[]) => {
  try { navigator?.vibrate?.(p); } catch {}
};

// ── HalfDial ──────────────────────────────────────────────────────────────────
// Key perf decision: during drag, draw() is called directly from pointermove —
// zero React state updates until pointerup. This gives true 60fps canvas draw.
interface DialProps {
  value: number;       // -80..80, controlled from parent
  target?: number;     // if defined, show scoring zones
  interactive: boolean;
  onChange?: (v: number) => void;
  leftWord?: string;
  rightWord?: string;
}

function HalfDial({ value, target, interactive, onChange, leftWord, rightWord }: DialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispRef   = useRef(value);   // what is currently rendered
  const valRef    = useRef(value);   // desired value (may differ when lerping)
  const targRef   = useRef(target);
  const raf       = useRef(0);
  const dragging  = useRef(false);

  useEffect(() => { valRef.current  = value;  }, [value]);
  useEffect(() => { targRef.current = target; draw(); }, [target]); // eslint-disable-line

  // ── Pure imperative draw ───────────────────────────────────────────────────
  const draw = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = c.offsetWidth;
    const H   = c.offsetHeight;
    if (!W || !H) return;

    // sync canvas buffer size to CSS size × DPR
    const bw = Math.round(W * dpr), bh = Math.round(H * dpr);
    if (c.width !== bw || c.height !== bh) { c.width = bw; c.height = bh; }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const CX = W / 2;
    const CY = H - 36;       // pivot 36px above canvas bottom (hub fits fully)
    const R  = W / 2 - 30;   // 30px inset — glows won't clip on sides

    const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

    // ── 1. Ambient floor glow ────────────────────────────────────────────────
    const amb = ctx.createRadialGradient(CX, CY, 0, CX, CY, R + 50);
    amb.addColorStop(0,   "rgba(196,181,253,0.07)");
    amb.addColorStop(0.6, "rgba(167,243,208,0.05)");
    amb.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(CX, CY, R + 50, Math.PI, 0);
    ctx.fillStyle = amb; ctx.fill();

    // ── 2. Track ─────────────────────────────────────────────────────────────
    // outer wide lighter ring
    ctx.beginPath();
    ctx.arc(CX, CY, R, toRad(-80), toRad(80));
    ctx.strokeStyle = "rgba(226,232,240,0.95)";
    ctx.lineWidth   = 22; ctx.lineCap = "round"; ctx.stroke();

    // inner thin dark groove (sunken depth)
    ctx.beginPath();
    ctx.arc(CX, CY, R, toRad(-80), toRad(80));
    ctx.strokeStyle = "rgba(100,116,139,0.17)";
    ctx.lineWidth   = 6; ctx.lineCap = "round"; ctx.stroke();

    // ── 3. Tick marks ────────────────────────────────────────────────────────
    for (let deg = -80; deg <= 80; deg += 8) {
      const major = (deg % 40 === 0) || deg === 0;
      const ir    = major ? R - 10 : R - 5;
      const or    = major ? R + 5  : R + 2;
      const ang   = toRad(deg);
      const cos = Math.cos(ang), sin = Math.sin(ang);
      ctx.beginPath();
      ctx.moveTo(CX + ir * cos, CY + ir * sin);
      ctx.lineTo(CX + or * cos, CY + or * sin);
      ctx.strokeStyle = major ? "rgba(71,85,105,0.45)" : "rgba(148,163,184,0.3)";
      ctx.lineWidth   = major ? 2.2 : 1.1;
      ctx.lineCap     = "round"; ctx.stroke();
    }

    // ── 4. Scoring zones ─────────────────────────────────────────────────────
    const t = targRef.current;
    if (t !== undefined) {
      const zones = [
        { hw: 22, stroke: "#93C5FD", glow: "#BFDBFE", lw: 26, blur: 8,  op: 0.7  },
        { hw: 14, stroke: "#6EE7B7", glow: "#A7F3D0", lw: 26, blur: 14, op: 0.92 },
        { hw:  6, stroke: "#C4B5FD", glow: "#DDD6FE", lw: 26, blur: 24, op: 1.0  },
      ] as const;

      for (const z of zones) {
        const lo = toRad(Math.max(-77, t - z.hw));
        const hi = toRad(Math.min( 77, t + z.hw));
        ctx.beginPath();
        ctx.arc(CX, CY, R, lo, hi);
        ctx.strokeStyle = z.stroke; ctx.lineWidth = z.lw; ctx.lineCap = "round";
        ctx.globalAlpha = z.op; ctx.shadowColor = z.glow; ctx.shadowBlur = z.blur;
        ctx.stroke();
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      // target tick
      const ta = toRad(t), cos = Math.cos(ta), sin = Math.sin(ta);
      ctx.beginPath();
      ctx.moveTo(CX + (R-16)*cos, CY + (R-16)*sin);
      ctx.lineTo(CX + (R+10)*cos, CY + (R+10)*sin);
      ctx.strokeStyle = "rgba(255,255,255,0.95)"; ctx.lineWidth = 3.5;
      ctx.shadowColor = "rgba(255,255,255,0.85)"; ctx.shadowBlur = 14;
      ctx.stroke(); ctx.shadowBlur = 0;
    }

    // ── 5. Needle ─────────────────────────────────────────────────────────────
    const na   = toRad(dispRef.current);
    const tipR = R - 18;
    const NX   = CX + tipR * Math.cos(na);
    const NY   = CY + tipR * Math.sin(na);

    // shaft (gradient along length)
    const sg = ctx.createLinearGradient(CX, CY, NX, NY);
    sg.addColorStop(0, "rgba(167,139,250,0.1)");
    sg.addColorStop(1, "#A78BFA");
    ctx.beginPath();
    ctx.moveTo(CX, CY); ctx.lineTo(NX, NY);
    ctx.strokeStyle = sg; ctx.lineWidth = 3.5; ctx.lineCap = "round";
    ctx.shadowColor = "#A78BFA"; ctx.shadowBlur = 22;
    ctx.stroke(); ctx.shadowBlur = 0;

    // orb body
    const og = ctx.createRadialGradient(NX-5, NY-6, 1, NX, NY, 16);
    og.addColorStop(0,   "#F5F3FF");
    og.addColorStop(0.5, "#8B5CF6");
    og.addColorStop(1,   "#3B0764");
    ctx.beginPath(); ctx.arc(NX, NY, 16, 0, Math.PI * 2);
    ctx.fillStyle = og; ctx.shadowColor = "#DDD6FE"; ctx.shadowBlur = 30;
    ctx.fill(); ctx.shadowBlur = 0;

    // orb specular highlight
    ctx.beginPath(); ctx.arc(NX-5, NY-6, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.52)"; ctx.fill();

    // ── 6. Hub ────────────────────────────────────────────────────────────────
    ctx.beginPath(); ctx.arc(CX, CY, 30, 0, Math.PI * 2);
    const ho = ctx.createRadialGradient(CX-8, CY-8, 2, CX, CY, 30);
    ho.addColorStop(0, "#FFFFFF"); ho.addColorStop(1, "#E2E8F0");
    ctx.fillStyle = ho; ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 20;
    ctx.fill(); ctx.shadowBlur = 0;

    // hub groove ring
    ctx.beginPath(); ctx.arc(CX, CY, 21, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(148,163,184,0.28)"; ctx.lineWidth = 1.5; ctx.stroke();

    // hub centre jewel
    const cj = ctx.createRadialGradient(CX-2, CY-2, 1, CX, CY, 12);
    cj.addColorStop(0, "#DDD6FE"); cj.addColorStop(1, "#6D28D9");
    ctx.beginPath(); ctx.arc(CX, CY, 12, 0, Math.PI * 2);
    ctx.fillStyle = cj; ctx.fill();

    // jewel glint
    ctx.beginPath(); ctx.arc(CX-3, CY-4, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.fill();

  }, []);

  // ── Lerp animation (only when not dragging) ────────────────────────────────
  const startLerp = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const tick = () => {
      if (dragging.current) return;
      const delta = valRef.current - dispRef.current;
      if (Math.abs(delta) < 0.07) { dispRef.current = valRef.current; draw(); return; }
      dispRef.current += delta * 0.22;
      draw();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => { if (!dragging.current) startLerp(); }, [value, startLerp]);

  // ResizeObserver
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(c); draw();
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); };
  }, [draw]);

  // ── Pointer → angle (uses actual pivot coords, not rect.bottom) ───────────
  const getAngle = (px: number, py: number): number => {
    const c = canvasRef.current; if (!c) return 0;
    const rect  = c.getBoundingClientRect();
    const scaleY = rect.height / (c.offsetHeight || 1);
    // pivot is at (cx, cy) in canvas CSS coords, cx = offsetWidth/2, cy = offsetHeight-36
    const pivotX = rect.left + rect.width  / 2;
    const pivotY = rect.top  + (c.offsetHeight - 36) * scaleY;
    const dx = px - pivotX;
    const dy = py - pivotY;
    return Math.max(-80, Math.min(80, Math.atan2(dx, -dy) * (180 / Math.PI)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive || !onChange) return;
    e.preventDefault();
    ac(); // init AudioContext on first gesture
    dragging.current = true;
    cancelAnimationFrame(raf.current);

    const ang = getAngle(e.clientX, e.clientY);
    dispRef.current = ang; valRef.current = ang;
    draw(); vibe(12);

    let lastTick = ang;

    // NOTE: these handlers update canvas DIRECTLY — no React setState during drag.
    // onChange is only called on pointerup to sync React state.
    const onMove = (ev: PointerEvent) => {
      ev.preventDefault();
      const na = getAngle(ev.clientX, ev.clientY);
      dispRef.current = na; valRef.current = na;
      draw();
      if (Math.abs(na - lastTick) >= 5) {
        SFX.tick(); vibe(6);
        lastTick = na;
      }
    };
    const onUp = () => {
      dragging.current = false;
      onChange(dispRef.current); // sync to React state once on release
      SFX.lock(); vibe([20, 10, 20]);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup",   onUp);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {leftWord && (
        <div style={{
          position: "absolute", left: 8, bottom: 34, zIndex: 2,
          fontSize: 11, fontWeight: 900, color: "#F87171",
          maxWidth: "22%", lineHeight: 1.25, wordBreak: "break-word",
          filter: "drop-shadow(0 1px 5px rgba(248,113,113,0.35))",
        }}>{leftWord}</div>
      )}
      {rightWord && (
        <div style={{
          position: "absolute", right: 8, bottom: 34, zIndex: 2, textAlign: "right",
          fontSize: 11, fontWeight: 900, color: "#2DD4BF",
          maxWidth: "22%", lineHeight: 1.25, wordBreak: "break-word",
          filter: "drop-shadow(0 1px 5px rgba(45,212,191,0.35))",
        }}>{rightWord}</div>
      )}
      {/*
        paddingBottom: 62% → container height = 62% of its width.
        This gives: arc room at top (CY = H-36, so top of arc is ~30px below canvas top)
        and hub room at bottom (hub r=30, CY = H-36, so hub bottom = H-6 < H).
        No content clips.
      */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "62%" }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
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

// ── Main Game ─────────────────────────────────────────────────────────────────
export default function WaveMobile() {
  const [gameState,      setGameState]      = useState<GameState>("SETUP");
  const [teams,          setTeams]          = useState<Team[]>([
    { id: "1", name: "Team One",  score: 0 },
    { id: "2", name: "Team Two",  score: 0 },
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [currentPair,    setCurrentPair]    = useState<WordPair>(WORD_PAIRS[0]);
  const [targetAngle,    setTargetAngle]    = useState(0);
  const [dialValue,      setDialValue]      = useState(0);
  const [roundScore,     setRoundScore]     = useState(0);

  const currentTeam = teams[currentTeamIdx];
  const otherIdx    = (currentTeamIdx + 1) % teams.length;

  const rand      = () => Math.random() * 160 - 80;
  const randPair  = (excl?: WordPair) => {
    const pool = WORD_PAIRS.filter(p => p !== excl);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startRound = () => {
    ac(); SFX.begin(); vibe(15);
    setCurrentPair(randPair());
    setTargetAngle(rand());
    setRoundScore(0); setDialValue(0);
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
    // play sound after brief state-commit delay
    setTimeout(() => {
      if (s === 4) { SFX.score4(); vibe([30, 20, 30, 20, 60]); }
      else if (s === 3) { SFX.score3(); vibe([25, 15, 40]); }
      else if (s === 2) { SFX.score2(); vibe([20, 15, 30]); }
      else { SFX.miss(); vibe(40); }
    }, 120);
    setGameState("REVEAL");
  };

  const updateName = (id: string, name: string) =>
    setTeams(t => t.map(x => x.id === id ? { ...x, name } : x));

  const PRIMARY   = { background: "linear-gradient(to bottom, #C4B5FD, #A78BFA)" };
  const SECONDARY = { background: "linear-gradient(to bottom, #A7F3D0, #5EEAD4)" };
  const PCLS = "w-full py-4 rounded-2xl font-black text-white text-[17px] shadow-lg active:scale-95 transition-transform select-none";
  const SCLS = "w-full py-4 rounded-2xl font-black text-[#0F766E] text-[17px] shadow-lg active:scale-95 transition-transform select-none";
  const CLAY = "flex-1 py-3 bg-white/80 backdrop-blur rounded-xl font-bold text-[#475569] text-sm shadow-sm active:scale-95 transition-transform select-none";

  const ScoreStrip = () => (
    <div className="flex gap-2">
      {teams.map((t, i) => (
        <div key={t.id} className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl ${
          i === currentTeamIdx ? "bg-white/85 shadow-sm" : "bg-white/30 opacity-55"
        }`}>
          <div className="font-bold text-[#64748B] text-xs outline-none truncate"
            contentEditable suppressContentEditableWarning
            onBlur={e => updateName(t.id, e.currentTarget.textContent || t.name)}>
            {t.name}
          </div>
          <div className="text-xl font-black text-[#334155] ml-2 tabular-nums">{t.score}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col"
      style={{
        background: "#FAFAFA",
        fontFamily: "'Nunito', system-ui, sans-serif",
        paddingTop:    "max(env(safe-area-inset-top,    0px), 16px)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 14px)",
        paddingLeft: 12, paddingRight: 12,
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        html, body { background: #FAFAFA !important; overflow: hidden !important; }
      `}} />

      {/* Blobs */}
      <div style={{ position:"absolute",top:-80,left:-80,width:"55vw",height:"55vw",borderRadius:"50%",background:"rgba(167,243,208,0.36)",filter:"blur(80px)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:-80,right:-80,width:"65vw",height:"65vw",borderRadius:"50%",background:"rgba(196,181,253,0.32)",filter:"blur(100px)",pointerEvents:"none" }} />

      <AnimatePresence mode="wait">

        {/* ── SETUP ── */}
        {gameState === "SETUP" && (
          <motion.div key="setup"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col justify-between relative z-10 gap-5"
          >
            <div className="text-center pt-4">
              <div className="text-xs font-bold text-[#94A3B8] tracking-widest uppercase mb-1">Up Next</div>
              <div className="text-5xl font-black text-[#334155]">{currentTeam.name}</div>
              <div className="text-7xl font-black text-[#C4B5FD] leading-none mt-1 tabular-nums">{currentTeam.score}</div>
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
                  <div className="text-2xl font-black text-[#334155] tabular-nums">{t.score}</div>
                </div>
              ))}
              <button onClick={() => setTeams([...teams, { id: Date.now().toString(), name: `Team ${teams.length + 1}`, score: 0 }])}
                className="w-full py-2 bg-white/40 rounded-2xl font-bold text-[#A78BFA] text-sm active:scale-95 transition-transform">
                + Add Team
              </button>
            </div>
            <button onClick={startRound} className={PCLS} style={PRIMARY}>Begin Round</button>
          </motion.div>
        )}

        {/* ── CLUE GIVER ── */}
        {gameState === "CLUE_GIVER" && (
          <motion.div key="clue"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col justify-between relative z-10"
            style={{ gap: 10 }}
          >
            <div>
              <ScoreStrip />
              <div className="text-center mt-2">
                <span className="inline-block px-3 py-1 bg-[#C4B5FD]/20 text-[#7C3AED] rounded-full text-xs font-bold tracking-widest uppercase">
                  Clue giver — you see the target
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#F87171] leading-tight">{currentPair.left}</div>
              <div className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest my-1">vs</div>
              <div className="text-4xl font-black text-[#2DD4BF] leading-tight">{currentPair.right}</div>
            </div>
            <HalfDial value={targetAngle} target={targetAngle} interactive={false}
              leftWord={currentPair.left} rightWord={currentPair.right} />
            <div className="space-y-2">
              <div className="flex gap-2">
                <button onClick={() => { setTargetAngle(rand()); setDialValue(0); }} className={CLAY}>Respin</button>
                <button onClick={() => { setCurrentPair(randPair(currentPair)); setTargetAngle(rand()); setDialValue(0); }} className={CLAY}>Skip</button>
              </div>
              <button onClick={() => setGameState("TEAM_GUESSES")} className={PCLS} style={PRIMARY}>
                Hide for Guessers
              </button>
            </div>
          </motion.div>
        )}

        {/* ── TEAM GUESSES ── */}
        {gameState === "TEAM_GUESSES" && (
          <motion.div key="guess"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col justify-between relative z-10"
            style={{ gap: 10 }}
          >
            <div>
              <ScoreStrip />
              <div className="text-center mt-2">
                <span className="inline-block px-3 py-1 bg-[#A78BFA]/15 text-[#7C3AED] rounded-full text-xs font-bold tracking-widest uppercase">
                  Touch and drag to guess
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#F87171] leading-tight">{currentPair.left}</div>
              <div className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest my-1">vs</div>
              <div className="text-4xl font-black text-[#2DD4BF] leading-tight">{currentPair.right}</div>
            </div>
            <HalfDial value={dialValue} interactive onChange={setDialValue}
              leftWord={currentPair.left} rightWord={currentPair.right} />
            <button onClick={lockGuess} className={SCLS} style={SECONDARY}>Reveal</button>
          </motion.div>
        )}

        {/* ── REVEAL ── */}
        {gameState === "REVEAL" && (
          <motion.div key="reveal"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col justify-between relative z-10"
            style={{ gap: 10 }}
          >
            <div>
              <ScoreStrip />
              <div className="text-center mt-1">
                <div className="text-3xl font-black text-[#F87171] leading-tight">{currentPair.left}</div>
                <div className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest my-1">vs</div>
                <div className="text-3xl font-black text-[#2DD4BF] leading-tight">{currentPair.right}</div>
              </div>
            </div>
            <HalfDial value={dialValue} target={targetAngle} interactive={false}
              leftWord={currentPair.left} rightWord={currentPair.right} />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
              className="text-center"
            >
              <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">{currentTeam.name}</div>
              <div className={`text-6xl font-black leading-none mt-1 tabular-nums ${
                roundScore === 4 ? "text-[#C4B5FD]" :
                roundScore >= 2 ? "text-[#5EEAD4]" : "text-[#F87171]"
              }`}>
                {roundScore > 0 ? `+${roundScore}` : "Miss"}
              </div>
            </motion.div>
            <button onClick={() => { setCurrentTeamIdx(otherIdx); setGameState("SETUP"); }}
              className={PCLS} style={PRIMARY}>Next Round</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
