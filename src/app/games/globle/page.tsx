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
  <div className="w-full h-full flex items-center justify-center">
    <div className="font-bold text-sm" style={{ color: "#7c3aed" }}>Loading globe...</div>
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  if (!ready) return null;

  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: "linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)" }}>
        <div className="font-black text-4xl" style={{ color: "#F59E0B" }}>Come back soon</div>
        <div className="font-bold text-sm" style={{ color: "#78716c" }}>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline" style={{ color: "#F59E0B" }}>Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-8" style={{ background: 'linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Top Bar */}
      <div className="sticky top-0 w-full z-20 flex items-center justify-between px-4 h-14"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(167,139,250,0.15)' }}>
        <Link href="/games" className="flex items-center gap-2 no-underline">
          <span className="text-lg font-black" style={{ color: '#7c3aed' }}>←</span>
          <span className="font-bold text-sm" style={{ color: '#7c3aed' }}>Games</span>
        </Link>
        <span className="font-black text-base" style={{ color: '#1e1b4b' }}>Globle</span>
        <div className="font-bold text-xs" style={{ color: '#7c3aed' }}>{guesses.length} guesses</div>
      </div>

      <div className="w-full max-w-md px-4 mt-6 flex flex-col items-center flex-1">
        {/* Globe Area */}
        <div className="rounded-3xl overflow-hidden mb-8 relative w-full" style={{ height: 280, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", boxShadow: "0 16px 40px rgba(245,158,11,0.1)", border: "2px solid rgba(255,255,255,0.9)" }}>
          <GlobeView
            guesses={guesses.map(g => ({ lat: g.country.lat, lng: g.country.lng, color: pctToColor(g.pct, g.correct) }))}
            answerLat={won ? answer.lat : undefined}
            answerLng={won ? answer.lng : undefined}
          />
        </div>

        {/* Input */}
        <div className="relative w-full mb-6 z-10">
          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={e => {
                if (e.key === 'Enter' && filteredCountries.length > 0) {
                    submitGuess(filteredCountries[0]);
                }
            }}
            placeholder="Guess a country..."
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1.5px solid rgba(167,139,250,0.3)',
              borderRadius: 16,
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 600,
              color: '#1e1b4b',
              outline: 'none',
              width: '100%',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
          />
          <AnimatePresence>
            {showDropdown && filteredCountries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute w-full mt-2 z-50 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(167,139,250,0.2)',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                {filteredCountries.map((c, idx) => (
                  <button
                    key={c.code}
                    onMouseDown={() => submitGuess(c)}
                    className="w-full px-4 py-3 text-left font-bold text-sm flex items-center gap-3 transition-colors hover:bg-purple-50"
                    style={{ color: "#1e1b4b", borderBottom: idx < filteredCountries.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                  >
                    <img src={FLAG_URL(c.code)} alt="" style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 3, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
                    {c.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guess history */}
        <div className="w-full flex flex-col gap-2 pb-24">
          <AnimatePresence>
          {[...guesses].reverse().map((g, i) => (
            <motion.div
              key={g.country.code + i}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <div className="w-3.5 h-3.5 rounded-full" style={{ background: pctToColor(g.pct, g.correct), boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }} />
              <img src={FLAG_URL(g.country.code)} alt="" style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
              <span className="font-bold text-sm flex-1 truncate" style={{ color: "#1e1b4b" }}>{g.country.name}</span>
              <span className="font-bold text-sm" style={{ color: g.correct ? "#10b981" : "#64748b" }}>{g.correct ? "Correct!" : `${g.pct}%`}</span>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Win Overlay */}
      <AnimatePresence>
        {won && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ 
                background: 'rgba(20, 184, 166, 0.4)',
                backdropFilter: 'blur(16px)'
            }}
          >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center text-center"
                style={{
                    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.8)'
                }}
            >
                <div className="font-black text-3xl mb-2" style={{ color: '#0d9488' }}>
                    You got it!
                </div>
                <div className="font-bold text-base mb-6" style={{ color: '#475569' }}>
                    Solved in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}
                </div>
                
                <div className="relative rounded-2xl overflow-hidden mb-8" style={{ width: 160, height: 106, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                    <img src={FLAG_URL(answer.code)} alt={answer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                
                <div className="font-black text-2xl mb-8" style={{ color: '#1e1b4b' }}>
                    {answer.name}
                </div>

                <div className="w-full flex gap-3">
                    <Link href="/games" className="flex-1 no-underline">
                        <div className="py-3.5 rounded-2xl font-black text-sm text-center" style={{ background: "rgba(167,139,250,0.1)", color: "#7c3aed" }}>
                            Games Hub
                        </div>
                    </Link>
                    <div className="flex-1 py-3.5 rounded-2xl font-black text-sm text-white" style={{ background: "linear-gradient(180deg, #F59E0B, #D97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>
                        Share
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}