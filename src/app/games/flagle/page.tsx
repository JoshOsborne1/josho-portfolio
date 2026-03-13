"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import {
  COUNTRIES, getDailySeed, getCountryByIndex, haversineKm,
  bearingDeg, proximityPct, bearingArrow, FLAG_URL, type Country
} from "../geo/data";

interface Guess {
  country: Country;
  distKm: number;
  bearing: number;
  pct: number;
}

const TILE_ORDER = [0, 1, 2, 3, 4, 5]; // left-to-right, top-to-bottom

export default function FlaglePage() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry, ready } = useDaily('flagle');
  if (!ready) return <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#FEF9C3,#FDE68A)" }} />;

  const seed = useMemo(() => getDailySeed('flagle'), []);
  const answer = useMemo(() => getCountryByIndex(seed), [seed]);

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const revealed = Math.min(guesses.length, 6);
  const maxGuesses = 6;

  const filteredCountries = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [input]);

  const submitGuess = useCallback((country: Country) => {
    if (won || lost) return;
    setInput("");
    setShowDropdown(false);
    const dist = haversineKm(answer.lat, answer.lng, country.lat, country.lng);
    const bear = bearingDeg(answer.lat, answer.lng, country.lat, country.lng);
    const pct = proximityPct(dist);
    const newGuesses = [...guesses, { country, distKm: dist, bearing: bear, pct }];
    setGuesses(newGuesses);
    if (country.code === answer.code) {
      setWon(true);
      markPlayed({ result: 'won', guesses: newGuesses.length, answer: answer.name });
    } else if (newGuesses.length >= maxGuesses) {
      setLost(true);
      markPlayed({ result: 'lost', guesses: newGuesses.length, answer: answer.name });
    }
  }, [won, lost, guesses, answer, markPlayed]);

  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: "linear-gradient(135deg,#FEF9C3,#FDE68A)" }}>
        <div className="font-black text-4xl" style={{ color: "#D97706" }}>Come back soon</div>
        <div className="font-bold text-sm" style={{ color: "#78716c" }}>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline" style={{ color: "#D97706" }}>Back to games</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-8 px-4" style={{ background: "linear-gradient(135deg,#FEF9C3,#FDE68A,#FEF3C7)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm pt-4 pb-3">
        <Link href="/games" className="no-underline">
          <span className="font-black text-sm" style={{ color: "#D97706" }}>Back</span>
        </Link>
        <span className="font-black text-xl" style={{ color: "#78350f" }}>Flagle</span>
        <span className="font-bold text-xs" style={{ color: "#92400e" }}>{guesses.length}/{maxGuesses}</span>
      </div>

      {/* Flag reveal grid */}
      <div className="relative rounded-2xl overflow-hidden" style={{ width: 288, height: 192, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", border: "2px solid rgba(255,255,255,0.8)" }}>
        <img
          src={FLAG_URL(answer.code)}
          alt="flag"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* 3x2 tile overlay */}
        {TILE_ORDER.map(i => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const isRevealed = i < revealed;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 1 }}
              animate={{ opacity: isRevealed ? 0 : 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                position: "absolute",
                left: `${col * 33.333}%`,
                top: `${row * 50}%`,
                width: "33.333%",
                height: "50%",
                background: "linear-gradient(135deg,#d1d5db,#9ca3af)",
                border: "1px solid rgba(255,255,255,0.3)",
                pointerEvents: "none",
              }}
            />
          );
        })}
        {/* Win/Lose overlay */}
        {(won || lost) && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: won ? "rgba(16,185,129,0.85)" : "rgba(239,68,68,0.85)" }}>
            <div className="font-black text-white text-xl text-center px-4">
              {won ? `${guesses.length === 1 ? "1st guess!" : `${guesses.length}/6`}` : answer.name}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {!won && !lost && (
        <div className="relative w-full max-w-sm mt-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Country name..."
              className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.85)", border: "2px solid rgba(217,119,6,0.3)", color: "#1c1917", backdropFilter: "blur(12px)" }}
            />
            <motion.button
              onClick={() => { const m = COUNTRIES.find(c => c.name.toLowerCase() === input.toLowerCase()); if (m) submitGuess(m); }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-2xl font-black text-white"
              style={{ background: "linear-gradient(180deg,#FBBF24,#D97706)", boxShadow: "0 6px 16px rgba(217,119,6,0.3)" }}
            >
              Guess
            </motion.button>
          </div>
          <AnimatePresence>
            {showDropdown && filteredCountries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute w-full mt-1 rounded-2xl overflow-hidden z-50"
                style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.8)" }}
              >
                {filteredCountries.map(c => (
                  <button
                    key={c.code}
                    onMouseDown={() => submitGuess(c)}
                    className="w-full px-4 py-2.5 text-left font-bold text-sm flex items-center gap-3"
                    style={{ color: "#1c1917", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <img src={FLAG_URL(c.code)} alt="" style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 3 }} />
                    {c.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Guess history */}
      {guesses.length > 0 && (
        <div className="w-full max-w-sm mt-4 flex flex-col gap-2">
          {guesses.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
              style={{
                background: g.country.code === answer.code ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.7)",
                border: g.country.code === answer.code ? "2px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
              }}
            >
              <img src={FLAG_URL(g.country.code)} alt="" style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 3 }} />
              <span className="font-bold text-xs flex-1 truncate" style={{ color: "#1c1917" }}>{g.country.name}</span>
              {g.country.code !== answer.code && (
                <>
                  <span className="font-mono text-xs" style={{ color: "#78716c" }}>{Math.round(g.distKm).toLocaleString()} km</span>
                  <span className="text-base">{bearingArrow(g.bearing)}</span>
                  <div className="w-10 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
                    <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.pct > 80 ? "#10b981" : g.pct > 50 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <span className="font-bold text-xs w-8 text-right" style={{ color: "#78716c" }}>{g.pct}%</span>
                </>
              )}
              {g.country.code === answer.code && (
                <span className="font-black text-xs" style={{ color: "#10b981" }}>Correct!</span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Done banner */}
      {(won || lost) && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mt-4 flex gap-3">
          <Link href="/games" className="flex-1 no-underline">
            <div className="py-3 rounded-2xl font-black text-center text-sm" style={{ background: "rgba(255,255,255,0.8)", color: "#78350f" }}>All Games</div>
          </Link>
          <div className="flex-1 py-3 rounded-2xl font-black text-center text-sm" style={{ background: "linear-gradient(180deg,#FBBF24,#D97706)", color: "white", boxShadow: "0 6px 16px rgba(217,119,6,0.3)" }}>
            Back in {hoursUntilReset}h
          </div>
        </motion.div>
      )}
    </div>
  );
}
