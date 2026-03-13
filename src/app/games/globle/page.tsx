"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import {
  COUNTRIES, getDailySeed, getCountryByIndex, haversineKm,
  proximityPct, FLAG_URL, type Country
} from "../geo/data";

// Lazy-load globe (three.js)
const GlobeView = dynamic(() => import("./GlobeView"), { ssr: false, loading: () => (
  <div className="w-full flex items-center justify-center" style={{ height: 280 }}>
    <div className="font-bold text-sm" style={{ color: "#60A5FA" }}>Loading globe...</div>
  </div>
)});

interface GuessEntry {
  country: Country;
  pct: number;
  correct: boolean;
}

export default function GloblePage() {
  const { canPlay, markPlayed, hoursUntilReset, ready } = useDaily('globle');

  const seed = useMemo(() => getDailySeed('globle'), []);
  const answer = useMemo(() => getCountryByIndex(seed), [seed]);

  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [won, setWon] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [input]);

  const submitGuess = useCallback((country: Country) => {
    if (won) return;
    setInput("");
    setShowDropdown(false);
    const dist = haversineKm(answer.lat, answer.lng, country.lat, country.lng);
    const pct = proximityPct(dist);
    const correct = country.code === answer.code;
    const entry = { country, pct, correct };
    const newGuesses = [...guesses, entry];
    setGuesses(newGuesses);
    if (correct) {
      setWon(true);
      markPlayed({ result: 'won', guesses: newGuesses.length });
    }
  }, [won, guesses, answer, markPlayed]);

  // Color by proximity: white(0) -> orange(50) -> dark red(90+) -> gold(correct)
  const pctToColor = (pct: number, correct: boolean) => {
    if (correct) return "#FFD700";
    if (pct > 90) return "#dc2626";
    if (pct > 70) return "#ea580c";
    if (pct > 50) return "#f97316";
    if (pct > 30) return "#fbbf24";
    return "#d1d5db";
  };

  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg,#DBEAFE,#BFDBFE)" }}>
        <div className="font-black text-4xl" style={{ color: "#2563EB" }}>Come back soon</div>
        <div className="font-bold text-sm" style={{ color: "#6b7280" }}>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline" style={{ color: "#2563EB" }}>Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-8 px-4" style={{ background: "linear-gradient(135deg,#DBEAFE,#BFDBFE,#EFF6FF)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div className="flex items-center justify-between w-full max-w-sm pt-4 pb-2">
        <Link href="/games" className="no-underline">
          <span className="font-black text-sm" style={{ color: "#2563EB" }}>Back</span>
        </Link>
        <span className="font-black text-xl" style={{ color: "#1e3a8a" }}>Globle</span>
        <span className="font-bold text-xs" style={{ color: "#1d4ed8" }}>{guesses.length} guesses</span>
      </div>

      {/* Globe */}
      <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ background: "rgba(15,23,42,0.92)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "2px solid rgba(96,165,250,0.2)" }}>
        <GlobeView
          guesses={guesses.map(g => ({ lat: g.country.lat, lng: g.country.lng, color: pctToColor(g.pct, g.correct) }))}
          answerLat={won ? answer.lat : undefined}
          answerLng={won ? answer.lng : undefined}
        />
      </div>

      {/* Win */}
      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 px-6 py-4 rounded-3xl text-center" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
            <div className="font-black text-2xl" style={{ color: "#1e3a8a" }}>Found it!</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <img src={FLAG_URL(answer.code)} alt={answer.name} style={{ width: 32, height: 20, objectFit: "cover", borderRadius: 3 }} />
              <span className="font-bold text-sm" style={{ color: "#374151" }}>{answer.name} - {guesses.length} guess{guesses.length !== 1 ? "es" : ""}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      {!won && (
        <div className="relative w-full max-w-sm mt-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => { setInput(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Guess a country..."
              className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.85)", border: "2px solid rgba(37,99,235,0.3)", color: "#1e3a8a" }}
            />
            <motion.button
              onClick={() => { const m = COUNTRIES.find(c => c.name.toLowerCase() === input.toLowerCase()); if (m) submitGuess(m); }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-2xl font-black text-white"
              style={{ background: "linear-gradient(180deg,#60A5FA,#2563EB)", boxShadow: "0 6px 16px rgba(37,99,235,0.3)" }}
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
                style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              >
                {filteredCountries.map(c => (
                  <button
                    key={c.code}
                    onMouseDown={() => submitGuess(c)}
                    className="w-full px-4 py-2.5 text-left font-bold text-sm flex items-center gap-3"
                    style={{ color: "#1e3a8a", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
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

      {/* Guess list */}
      {guesses.length > 0 && (
        <div className="w-full max-w-sm mt-3 flex flex-col gap-1.5">
          {[...guesses].reverse().slice(0, 5).map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: pctToColor(g.pct, g.correct), flexShrink: 0 }} />
              <img src={FLAG_URL(g.country.code)} alt="" style={{ width: 24, height: 15, objectFit: "cover", borderRadius: 2 }} />
              <span className="font-bold text-xs flex-1" style={{ color: "#1e3a8a" }}>{g.country.name}</span>
              <span className="font-bold text-xs" style={{ color: "#6b7280" }}>{g.correct ? "Correct!" : `${g.pct}%`}</span>
            </motion.div>
          ))}
          {guesses.length > 5 && <div className="text-center font-bold text-xs" style={{ color: "#9ca3af" }}>+{guesses.length - 5} more</div>}
        </div>
      )}

      {won && (
        <div className="w-full max-w-sm mt-4 flex gap-3">
          <Link href="/games" className="flex-1 no-underline">
            <div className="py-3 rounded-2xl font-black text-center text-sm" style={{ background: "rgba(255,255,255,0.8)", color: "#1e3a8a" }}>All Games</div>
          </Link>
          <div className="flex-1 py-3 rounded-2xl font-black text-center text-sm" style={{ background: "linear-gradient(180deg,#60A5FA,#2563EB)", color: "white" }}>
            Back in {hoursUntilReset}h
          </div>
        </div>
      )}
    </div>
  );
}
