"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import {
  COUNTRIES, getDailySeed, getCountryByIndex, haversineKm,
  bearingDeg, proximityPct, bearingArrow, FLAG_URL, SHAPE_URL, type Country
} from "../geo/data";
import GameShell from "../components/GameShell";

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
  const inputRef = useRef<HTMLInputElement>(null);
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
    <GameShell gameSlug="worldle" gameTitle="Worldle">
    <div className="min-h-screen flex flex-col items-center pb-8" style={{ background: 'linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Top Bar */}
      <div className="sticky top-0 w-full z-20 flex items-center justify-between px-4 h-14"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(167,139,250,0.15)' }}>
        <Link href="/games" className="flex items-center gap-2 no-underline">
          <span className="text-lg font-black" style={{ color: '#7c3aed' }}>←</span>
          <span className="font-bold text-sm" style={{ color: '#7c3aed' }}>Games</span>
        </Link>
        <span className="font-black text-base" style={{ color: '#1e1b4b' }}>Worldle</span>
        <div className="font-bold text-xs" style={{ color: '#7c3aed' }}>{guesses.length}/{maxGuesses}</div>
      </div>

      <div className="w-full max-w-md px-4 mt-6 flex flex-col items-center flex-1">
        {/* Game canvas area - Country shape */}
        <div className="rounded-3xl overflow-hidden flex items-center justify-center mb-8 relative" style={{ width: '100%', maxWidth: 280, height: 220, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", boxShadow: "0 16px 40px rgba(245,158,11,0.1)", border: "2px solid rgba(255,255,255,0.9)" }}>
          {imgError ? (
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <div className="font-bold text-xs" style={{ color: "#6b7280" }}>Shape unavailable</div>
            </div>
          ) : (
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src={SHAPE_URL(answer.code)}
              alt="mystery country"
              onError={() => setImgError(true)}
              style={{
                maxWidth: 220,
                maxHeight: 180,
                objectFit: "contain",
                filter: "invert(1) brightness(0.2)",
              }}
            />
          )}
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
            placeholder="Guess the country..."
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
          {guesses.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <img src={FLAG_URL(g.country.code)} alt="" style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
              <span className="font-bold text-sm flex-1 truncate" style={{ color: "#1e1b4b" }}>{g.country.name}</span>
              {g.country.code !== answer.code && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs" style={{ color: "#64748b" }}>{Math.round(g.distKm).toLocaleString()}km</span>
                  <span className="text-base" style={{ color: '#F59E0B' }}>{bearingArrow(g.bearing)}</span>
                  <div className="w-12 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: 'linear-gradient(90deg, #A78BFA, #5EEAD4)' }} />
                  </div>
                </div>
              )}
              {g.country.code === answer.code && (
                <span className="font-black text-sm" style={{ color: "#10b981" }}>Correct!</span>
              )}
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Win/Lose Overlay */}
      <AnimatePresence>
        {(won || lost) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ 
                background: won ? 'rgba(20, 184, 166, 0.4)' : 'rgba(30, 27, 75, 0.4)',
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
                <div className="font-black text-3xl mb-2" style={{ color: won ? '#0d9488' : '#64748b' }}>
                    {won ? 'You got it!' : 'Next time!'}
                </div>
                <div className="font-bold text-base mb-6" style={{ color: '#475569' }}>
                    {won ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}` : 'The answer was'}
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
    </GameShell>
  );
}