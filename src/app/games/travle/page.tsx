"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import {
  COUNTRIES, getDailySeed, findPuzzlePair, findPath, FLAG_URL, BORDERS, type Country
} from "../geo/data";

interface ChainStep {
  country: Country;
  valid: boolean; // does it border previous?
  onPath: boolean;
}

export default function TravlePage() {
  const { canPlay, markPlayed, hoursUntilReset, ready } = useDaily('travle');

  const seed = useMemo(() => getDailySeed('travle'), []);
  const [startCountry, endCountry] = useMemo(() => findPuzzlePair(seed), [seed]);
  const shortestPath = useMemo(() => findPath(startCountry.code, endCountry.code), [startCountry, endCountry]);
  const minHops = shortestPath ? shortestPath.length - 1 : 0;

  const [chain, setChain] = useState<ChainStep[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [won, setWon] = useState(false);
  const [hints, setHints] = useState<number>(0); // 0-3 hints used
  const inputRef = useRef<HTMLInputElement>(null);
  const maxHints = 3;

  const filteredCountries = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [input]);

  const prevCode = chain.length > 0 ? chain[chain.length - 1].country.code : startCountry.code;

  const submitCountry = useCallback((country: Country) => {
    if (won) return;
    setInput("");
    setShowDropdown(false);
    // Check it borders the previous entry
    const borders = BORDERS[prevCode] || [];
    const valid = borders.includes(country.code);
    // Check if it's on the optimal path
    const onPath = shortestPath ? shortestPath.includes(country.code) : false;
    const newChain = [...chain, { country, valid, onPath }];
    setChain(newChain);
    if (country.code === endCountry.code) {
      setWon(true);
      markPlayed({ result: 'won', steps: newChain.length });
    }
  }, [won, chain, prevCode, endCountry, shortestPath, markPlayed]);

  const undoLast = () => {
    if (chain.length > 0) setChain(chain.slice(0, -1));
  };

  const useHint = () => {
    if (hints >= maxHints || !shortestPath) return;
    // Next country in the ideal path after the current position
    const cur = chain.length > 0 ? chain[chain.length - 1].country.code : startCountry.code;
    const idx = shortestPath.indexOf(cur);
    if (idx >= 0 && idx < shortestPath.length - 1) {
      const hintCode = shortestPath[idx + 1];
      const hintCountry = COUNTRIES.find(c => c.code === hintCode);
      if (hintCountry) {
        setHints(hints + 1);
        submitCountry(hintCountry);
      }
    }
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
        <span className="font-black text-base" style={{ color: '#1e1b4b' }}>Travle</span>
        <div className="font-bold text-xs" style={{ color: '#7c3aed' }}>{chain.length} steps</div>
      </div>

      <div className="w-full max-w-md px-4 mt-6 flex flex-col items-center flex-1">
        {/* Journey info */}
        <div className="w-full mb-6 px-5 py-4 rounded-3xl" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 16px 40px rgba(245,158,11,0.1)" }}>
          <div className="text-xs font-bold mb-2 tracking-wide" style={{ color: "#7c3aed" }}>TRAVEL FROM</div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex flex-col items-center gap-1.5 flex-1">
                <img src={FLAG_URL(startCountry.code)} alt="" style={{ width: 40, height: 26, objectFit: "cover", borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <span className="font-black text-sm text-center" style={{ color: "#1e1b4b" }}>{startCountry.name}</span>
            </div>
            <div className="font-black text-lg text-center px-2" style={{ color: "#cbd5e1" }}>→</div>
            <div className="flex flex-col items-center gap-1.5 flex-1">
                <img src={FLAG_URL(endCountry.code)} alt="" style={{ width: 40, height: 26, objectFit: "cover", borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <span className="font-black text-sm text-center" style={{ color: "#1e1b4b" }}>{endCountry.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white border-opacity-50">
            <div className="text-xs font-bold" style={{ color: "#64748b" }}>
                Minimum: {minHops}
            </div>
            <button
                onClick={useHint}
                disabled={hints >= maxHints || won}
                className="font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                style={{ 
                    background: hints < maxHints && !won ? "rgba(245,158,11,0.15)" : "rgba(0,0,0,0.05)", 
                    color: hints < maxHints && !won ? "#d97706" : "#94a3b8" 
                }}
            >
                Hint ({maxHints - hints})
            </button>
          </div>
        </div>

        {/* Chain visualization */}
        <div className="w-full mb-8 relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(245,158,11,0.2), rgba(167,139,250,0.2))' }} />
          
          <div className="flex flex-col gap-3 relative z-10 pl-2">
            {/* Start node */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDE68A, #F59E0B)", boxShadow: "0 4px 12px rgba(245,158,11,0.3)", border: "2px solid white" }}>
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 flex-1" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.9)", color: "#1e1b4b" }}>
                <img src={FLAG_URL(startCountry.code)} alt="" style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 3 }} />
                {startCountry.name}
              </div>
            </div>

            {/* Chain steps */}
            <AnimatePresence>
            {chain.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: step.valid ? "white" : "#fee2e2", border: `2px solid ${step.valid ? '#e2e8f0' : '#f87171'}` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: step.valid ? (step.onPath ? '#F59E0B' : '#94a3b8') : '#ef4444' }} />
                </div>
                <div
                  className="px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 flex-1 relative overflow-hidden"
                  style={{
                    background: step.valid
                      ? (step.country.code === endCountry.code ? "linear-gradient(135deg,#34D399,#059669)" : "rgba(255,255,255,0.8)")
                      : "rgba(254,226,226,0.8)",
                    color: step.valid
                      ? (step.country.code === endCountry.code ? "white" : "#1e1b4b")
                      : "#991b1b",
                    border: step.valid
                      ? "1px solid rgba(255,255,255,0.9)"
                      : "1px solid rgba(248,113,113,0.4)",
                    boxShadow: step.onPath && step.valid ? "0 4px 12px rgba(245,158,11,0.15)" : "none",
                  }}
                >
                  {step.valid && step.country.code === endCountry.code ? null : (
                    <img src={FLAG_URL(step.country.code)} alt="" style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 3 }} />
                  )}
                  <span className="truncate">{step.country.name}</span>
                  {!step.valid && (
                    <span className="absolute right-3 text-[10px] font-bold text-red-500 uppercase tracking-wide">No Border</span>
                  )}
                </div>
              </motion.div>
            ))}
            </AnimatePresence>

            {/* End target (if not yet reached) */}
            {!won && (
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "transparent", border: "2px dashed #cbd5e1" }} />
                <div className="px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 flex-1" style={{ background: "transparent", border: "2px dashed rgba(167,139,250,0.4)", color: "#64748b" }}>
                  <img src={FLAG_URL(endCountry.code)} alt="" style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 3, filter: 'grayscale(1) opacity(0.5)' }} />
                  {endCountry.name}
                </div>
              </div>
            )}
          </div>
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
                    submitCountry(filteredCountries[0]);
                }
            }}
            placeholder={`Border of ${chain.length > 0 ? chain[chain.length-1].country.name : startCountry.name}...`}
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
                    onMouseDown={() => submitCountry(c)}
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

          {chain.length > 0 && !won && (
            <div className="flex justify-center mt-3">
                <button onClick={undoLast} className="font-bold text-xs px-3 py-1.5 rounded-xl bg-white bg-opacity-50 text-slate-500 hover:bg-opacity-80 transition-all border border-white">
                Undo last step
                </button>
            </div>
          )}
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
                    Journey Complete!
                </div>
                <div className="font-bold text-base mb-8" style={{ color: '#475569' }}>
                    {chain.length} steps (Minimum: {minHops})
                </div>
                
                <div className="flex items-center gap-3 mb-8 w-full justify-center">
                    <div className="relative rounded-xl overflow-hidden" style={{ width: 80, height: 53, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                        <img src={FLAG_URL(startCountry.code)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div className="font-black text-slate-300">→</div>
                    <div className="relative rounded-xl overflow-hidden" style={{ width: 80, height: 53, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                        <img src={FLAG_URL(endCountry.code)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
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