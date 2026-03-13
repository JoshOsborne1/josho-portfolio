"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import {
  COUNTRIES, getDailySeed, getCountryByIndex, haversineKm,
  bearingDeg, proximityPct, bearingArrow, FLAG_URL, SHAPE_URL, type Country
} from "../geo/data";

interface Guess {
  country: Country;
  distKm: number;
  bearing: number;
  pct: number;
}

export default function WorldlePage() {
  const { canPlay, markPlayed, hoursUntilReset, ready } = useDaily('worldle');

  const seed = useMemo(() => getDailySeed('worldle'), []);
  const answer = useMemo(() => getCountryByIndex(seed), [seed]);

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [imgError, setImgError] = useState(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)" }}>
        <div className="font-black text-4xl" style={{ color: "#059669" }}>Come back soon</div>
        <div className="font-bold text-sm" style={{ color: "#4b5563" }}>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline" style={{ color: "#059669" }}>Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-8 px-4" style={{ background: "linear-gradient(135deg,#D1FAE5,#A7F3D0,#ECFDF5)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm pt-4 pb-3">
        <Link href="/games" className="no-underline">
          <span className="font-black text-sm" style={{ color: "#059669" }}>Back</span>
        </Link>
        <span className="font-black text-xl" style={{ color: "#064e3b" }}>Worldle</span>
        <span className="font-bold text-xs" style={{ color: "#065f46" }}>{guesses.length}/{maxGuesses}</span>
      </div>

      {/* Country shape */}
      <div className="rounded-3xl overflow-hidden flex items-center justify-center" style={{ width: 280, height: 220, background: won ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", boxShadow: "0 16px 40px rgba(0,0,0,0.08)", border: "2px solid rgba(255,255,255,0.8)" }}>
        {won ? (
          <div className="flex flex-col items-center gap-3">
            <img src={FLAG_URL(answer.code)} alt={answer.name} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8 }} />
            <div className="font-black text-lg" style={{ color: "#064e3b" }}>{answer.name}</div>
          </div>
        ) : imgError ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="font-black text-6xl" style={{ filter: "grayscale(1) brightness(0.3)" }}>🗺️</div>
            <div className="font-bold text-xs" style={{ color: "#6b7280" }}>Shape unavailable</div>
          </div>
        ) : (
          <img
            src={lost ? FLAG_URL(answer.code) : SHAPE_URL(answer.code)}
            alt={lost ? answer.name : "mystery country"}
            onError={() => setImgError(true)}
            style={{
              maxWidth: 240,
              maxHeight: 200,
              objectFit: "contain",
              filter: lost ? "none" : "brightness(0)",
            }}
          />
        )}
      </div>
      {lost && <div className="font-black text-base mt-2" style={{ color: "#059669" }}>{answer.name}</div>}

      {/* Input */}
      {!won && !lost && (
        <div className="relative w-full max-w-sm mt-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => { setInput(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Guess the country..."
              className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.85)", border: "2px solid rgba(5,150,105,0.3)", color: "#064e3b", backdropFilter: "blur(12px)" }}
            />
            <motion.button
              onClick={() => { const m = COUNTRIES.find(c => c.name.toLowerCase() === input.toLowerCase()); if (m) submitGuess(m); }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-2xl font-black text-white"
              style={{ background: "linear-gradient(180deg,#34D399,#059669)", boxShadow: "0 6px 16px rgba(5,150,105,0.3)" }}
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
                style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.8)" }}
              >
                {filteredCountries.map(c => (
                  <button
                    key={c.code}
                    onMouseDown={() => submitGuess(c)}
                    className="w-full px-4 py-2.5 text-left font-bold text-sm flex items-center gap-3"
                    style={{ color: "#064e3b", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
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
                border: g.country.code === answer.code ? "2px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.8)",
              }}
            >
              <img src={FLAG_URL(g.country.code)} alt="" style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 3 }} />
              <span className="font-bold text-xs flex-1 truncate" style={{ color: "#064e3b" }}>{g.country.name}</span>
              {g.country.code !== answer.code && (
                <>
                  <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{Math.round(g.distKm).toLocaleString()} km</span>
                  <span className="text-base">{bearingArrow(g.bearing)}</span>
                  <div className="w-10 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
                    <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.pct > 80 ? "#10b981" : g.pct > 50 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <span className="font-bold text-xs w-8 text-right" style={{ color: "#6b7280" }}>{g.pct}%</span>
                </>
              )}
              {g.country.code === answer.code && <span className="font-black text-xs" style={{ color: "#10b981" }}>Correct!</span>}
            </motion.div>
          ))}
        </div>
      )}

      {(won || lost) && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mt-4 flex gap-3">
          <Link href="/games" className="flex-1 no-underline">
            <div className="py-3 rounded-2xl font-black text-center text-sm" style={{ background: "rgba(255,255,255,0.8)", color: "#064e3b" }}>All Games</div>
          </Link>
          <div className="flex-1 py-3 rounded-2xl font-black text-center text-sm" style={{ background: "linear-gradient(180deg,#34D399,#059669)", color: "white" }}>
            Back in {hoursUntilReset}h
          </div>
        </motion.div>
      )}
    </div>
  );
}
