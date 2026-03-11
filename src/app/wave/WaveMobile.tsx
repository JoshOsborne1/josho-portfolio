"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Team, WordPair, WORD_PAIRS } from "./constants";

// ── SVG helpers (0 deg = top / 12 o'clock, clockwise positive) ─────────────
const pt = (deg: number, r: number) => {
  const rad = (deg - 90) * (Math.PI / 180);
  return {
    x: +(100 + r * Math.cos(rad)).toFixed(3),
    y: +(100 + r * Math.sin(rad)).toFixed(3),
  };
};

// Clockwise arc from startDeg to endDeg at radius r, clamped to [-80, 80]
const arc = (r: number, startDeg: number, endDeg: number): string => {
  const s = Math.max(-80, startDeg);
  const e = Math.min(80, endDeg);
  if (s >= e) return "";
  const a = pt(s, r), b = pt(e, r);
  const large = e - s > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
};

// ── Rotary Knob ─────────────────────────────────────────────────────────────
interface KnobProps {
  value: number;
  targetValue?: number;
  showTarget: boolean;
  interactive: boolean;
  onChange?: (v: number) => void;
}

function RotaryKnob({ value, targetValue, showTarget, interactive, onChange }: KnobProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive || !onChange) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const calc = (px: number, py: number) =>
      Math.max(-80, Math.min(80, Math.atan2(px - cx, -(py - cy)) * (180 / Math.PI)));

    onChange(calc(e.clientX, e.clientY));

    const onMove = (ev: PointerEvent) => onChange(calc(ev.clientX, ev.clientY));
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const t = targetValue ?? 0;
  const gripAngles = [-60, -40, -20, 0, 20, 40, 60];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      width="248"
      height="248"
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none", userSelect: "none", cursor: interactive ? "pointer" : "default" }}
    >
      <defs>
        <radialGradient id="knob-face" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </radialGradient>
        <filter id="knob-drop" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#000" floodOpacity="0.09" />
        </filter>
      </defs>

      {/* ── Track ── */}
      <path
        d={arc(87, -80, 80)}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* ── Scoring arcs (only when target visible) ── */}
      {showTarget && (
        <>
          {/* 2-pt zone: sky blue */}
          <path
            d={arc(87, t - 22, t + 22)}
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* 3-pt zone: mint */}
          <path
            d={arc(87, t - 14, t + 14)}
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* 4-pt zone: lavender */}
          <path
            d={arc(87, t - 6, t + 6)}
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Target tick mark */}
          <g transform={`rotate(${t} 100 100)`}>
            <line x1="100" y1="79" x2="100" y2="69" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </>
      )}

      {/* ── Dial face ── */}
      <circle cx="100" cy="100" r="71" fill="url(#knob-face)" filter="url(#knob-drop)" />

      {/* ── Grip marks ── */}
      {gripAngles.map((deg) => {
        const inner = pt(deg, 61);
        const outer = pt(deg, 69);
        return (
          <line
            key={deg}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            stroke={deg === 0 ? "#C4B5FD" : "#CBD5E1"}
            strokeWidth={deg === 0 ? 2.5 : 1.2}
            strokeLinecap="round"
          />
        );
      })}

      {/* ── Needle ── */}
      <g transform={`rotate(${value} 100 100)`}>
        <line
          x1="100" y1="90"
          x2="100" y2="36"
          stroke="#A78BFA"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="33" r="6" fill="#A78BFA" />
      </g>

      {/* ── Center cap ── */}
      <circle cx="100" cy="100" r="12" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="100" cy="100" r="5" fill="#C4B5FD" />
    </svg>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function WaveMobile() {
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team One", score: 0 },
    { id: "2", name: "Team Two", score: 0 },
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [currentPair, setCurrentPair] = useState<WordPair>(WORD_PAIRS[0]);
  const [targetRotation, setTargetRotation] = useState(0);
  const [dialValue, setDialValue] = useState(0);
  const [roundScore, setRoundScore] = useState(0);

  const currentTeam = teams[currentTeamIdx];
  const otherTeamIdx = (currentTeamIdx + 1) % teams.length;

  const rand = () => Math.random() * 160 - 80;

  const getRandomPair = (excl?: WordPair): WordPair => {
    const pool = WORD_PAIRS.filter((p) => p !== excl);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startRound = () => {
    setCurrentPair(getRandomPair());
    setTargetRotation(rand());
    setRoundScore(0);
    setDialValue(0);
    setGameState("CLUE_GIVER");
  };

  const respin = () => {
    setTargetRotation(rand());
    setDialValue(0);
  };

  const skip = () => {
    setCurrentPair(getRandomPair(currentPair));
    setTargetRotation(rand());
    setDialValue(0);
  };

  const calcScore = (guess: number, target: number) => {
    const d = Math.abs(guess - target);
    return d <= 6 ? 4 : d <= 14 ? 3 : d <= 22 ? 2 : 0;
  };

  const lockGuess = () => {
    const s = calcScore(dialValue, targetRotation);
    setRoundScore(s);
    setTeams((prev) =>
      prev.map((t, i) => (i === currentTeamIdx ? { ...t, score: t.score + s } : t))
    );
    setGameState("REVEAL");
  };

  const nextRound = () => {
    setCurrentTeamIdx(otherTeamIdx);
    setGameState("SETUP");
  };

  const updateName = (id: string, name: string) =>
    setTeams((t) => t.map((x) => (x.id === id ? { ...x, name } : x)));

  const PRIMARY = "w-full py-4 bg-gradient-to-b from-[#C4B5FD] to-[#A78BFA] rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform select-none";
  const SECONDARY = "w-full py-4 bg-gradient-to-b from-[#A7F3D0] to-[#5EEAD4] rounded-2xl font-black text-[#0F766E] text-lg shadow-lg active:scale-95 transition-transform select-none";
  const CLAY = "flex-1 py-3 bg-white/80 backdrop-blur rounded-xl font-bold text-[#475569] text-sm shadow-sm active:scale-95 transition-transform select-none";

  const Scores = () => (
    <div className="flex gap-2 mb-4">
      {teams.map((t, i) => (
        <div
          key={t.id}
          className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
            i === currentTeamIdx ? "bg-white/85 shadow-sm" : "bg-white/35 opacity-60"
          }`}
        >
          <div
            className="font-bold text-[#64748B] text-sm outline-none min-w-0 truncate"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateName(t.id, e.currentTarget.textContent || t.name)}
          >
            {t.name}
          </div>
          <div className="text-2xl font-black text-[#334155] ml-2">{t.score}</div>
        </div>
      ))}
    </div>
  );

  const Pair = () => (
    <div className="flex items-center justify-center gap-2 mb-2">
      <div className="px-3 py-2 bg-white/85 backdrop-blur rounded-2xl shadow-sm font-black text-[#F87171] text-sm">
        {currentPair.left}
      </div>
      <span className="text-[#CBD5E1] font-bold text-xs">vs</span>
      <div className="px-3 py-2 bg-white/85 backdrop-blur rounded-2xl shadow-sm font-black text-[#5EEAD4] text-sm">
        {currentPair.right}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex flex-col px-4 overflow-hidden"
      style={{
        background: "#FAFAFA",
        fontFamily: "'Nunito', system-ui, sans-serif",
        paddingTop: "max(env(safe-area-inset-top, 0px), 20px)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 20px)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        html, body { background: #FAFAFA !important; overflow: hidden !important; }
      `}} />

      {/* Blobs */}
      <div className="absolute top-0 left-0 w-[65vw] h-[65vw] rounded-full bg-[#A7F3D0]/45 blur-[90px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[70vw] h-[70vw] rounded-full bg-[#C4B5FD]/40 blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      <AnimatePresence mode="wait">

        {/* ── SETUP ── */}
        {gameState === "SETUP" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-center gap-6 relative z-10"
          >
            <div className="text-center">
              <div className="text-xs font-bold text-[#94A3B8] tracking-widest uppercase mb-1">Up Next</div>
              <div className="text-5xl font-black text-[#334155]">{currentTeam.name}</div>
              <div className="text-7xl font-black text-[#C4B5FD]">{currentTeam.score}</div>
            </div>

            <div className="space-y-2">
              {teams.map((t, i) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                    i === currentTeamIdx ? "bg-white/85 shadow-sm" : "bg-white/45"
                  }`}
                >
                  <div
                    className="font-bold text-[#475569] outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateName(t.id, e.currentTarget.textContent || t.name)}
                  >
                    {t.name}
                  </div>
                  <div className="text-2xl font-black text-[#334155]">{t.score}</div>
                </div>
              ))}
              <button
                onClick={() =>
                  setTeams([...teams, { id: Date.now().toString(), name: `Team ${teams.length + 1}`, score: 0 }])
                }
                className="w-full py-2 bg-white/40 rounded-2xl font-bold text-[#A78BFA] text-sm active:scale-95 transition-transform"
              >
                + Add Team
              </button>
            </div>

            <button onClick={startRound} className={PRIMARY}>
              Begin Round
            </button>
          </motion.div>
        )}

        {/* ── CLUE_GIVER ── */}
        {gameState === "CLUE_GIVER" && (
          <motion.div
            key="clue"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between relative z-10"
          >
            <div>
              <Scores />
              <div className="text-center mb-3">
                <span className="inline-block px-3 py-1 bg-[#C4B5FD]/20 text-[#A78BFA] rounded-full text-xs font-bold tracking-widest uppercase">
                  Clue Giver - you see the target
                </span>
              </div>
              <Pair />
            </div>

            <div className="flex justify-center items-center">
              <RotaryKnob
                value={targetRotation}
                targetValue={targetRotation}
                showTarget
                interactive={false}
              />
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <button onClick={respin} className={CLAY}>Respin</button>
                <button onClick={skip} className={CLAY}>Skip</button>
              </div>
              <button onClick={() => setGameState("TEAM_GUESSES")} className={PRIMARY}>
                Hide for Guessers
              </button>
            </div>
          </motion.div>
        )}

        {/* ── TEAM_GUESSES ── */}
        {gameState === "TEAM_GUESSES" && (
          <motion.div
            key="guess"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between relative z-10"
          >
            <div>
              <Scores />
              <div className="text-center mb-3">
                <span className="inline-block px-3 py-1 bg-[#A78BFA]/15 text-[#7C3AED] rounded-full text-xs font-bold tracking-widest uppercase">
                  Touch the dial to guess
                </span>
              </div>
              <Pair />
            </div>

            <div className="flex justify-center items-center">
              <RotaryKnob
                value={dialValue}
                showTarget={false}
                interactive
                onChange={setDialValue}
              />
            </div>

            <button onClick={lockGuess} className={SECONDARY}>
              Reveal
            </button>
          </motion.div>
        )}

        {/* ── REVEAL ── */}
        {gameState === "REVEAL" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between relative z-10"
          >
            <div>
              <Scores />
              <Pair />
            </div>

            <div className="flex flex-col items-center gap-2">
              {/* Dial shows needle (guess) + target scoring zones */}
              <RotaryKnob
                value={dialValue}
                targetValue={targetRotation}
                showTarget
                interactive={false}
              />

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.25 }}
                className="text-center"
              >
                <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                  {currentTeam.name}
                </div>
                <div
                  className={`text-6xl font-black ${
                    roundScore === 4
                      ? "text-[#C4B5FD]"
                      : roundScore >= 2
                      ? "text-[#5EEAD4]"
                      : "text-[#F87171]"
                  }`}
                >
                  {roundScore > 0 ? `+${roundScore}` : "Miss"}
                </div>
              </motion.div>
            </div>

            <button onClick={nextRound} className={PRIMARY}>
              Next Round
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
