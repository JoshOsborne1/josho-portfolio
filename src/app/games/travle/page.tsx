"use client";

import { useState, useCallback, useMemo } from "react";
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
  if (!ready) return <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#FCE7F3,#FBCFE8)" }} />;

  const seed = useMemo(() => getDailySeed('travle'), []);
  const [startCountry, endCountry] = useMemo(() => findPuzzlePair(seed), [seed]);
  const shortestPath = useMemo(() => findPath(startCountry.code, endCountry.code), [startCountry, endCountry]);
  const minHops = shortestPath ? shortestPath.length - 1 : 0;

  const [chain, setChain] = useState<ChainStep[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [won, setWon] = useState(false);
  const [hints, setHints] = useState<number>(0); // 0-3 hints used
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

  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg,#FCE7F3,#FBCFE8)" }}>
        <div className="font-black text-4xl" style={{ color: "#BE185D" }}>Come back soon</div>
        <div className="font-bold text-sm" style={{ color: "#6b7280" }}>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline" style={{ color: "#BE185D" }}>Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-8 px-4" style={{ background: "linear-gradient(135deg,#FCE7F3,#FBCFE8,#FDF2F8)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm pt-4 pb-3">
        <Link href="/games" className="no-underline">
          <span className="font-black text-sm" style={{ color: "#BE185D" }}>Back</span>
        </Link>
        <span className="font-black text-xl" style={{ color: "#831843" }}>Travle</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs" style={{ color: "#9d174d" }}>{chain.length} steps</span>
          <button
            onClick={useHint}
            disabled={hints >= maxHints || won}
            className="font-bold text-xs px-2 py-1 rounded-lg"
            style={{ background: hints < maxHints && !won ? "rgba(190,24,93,0.15)" : "rgba(0,0,0,0.06)", color: hints < maxHints && !won ? "#BE185D" : "#9ca3af" }}
          >
            Hint ({maxHints - hints})
          </button>
        </div>
      </div>

      {/* Journey info */}
      <div className="w-full max-w-sm mb-3 px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <div className="text-xs font-bold mb-1" style={{ color: "#9d174d" }}>TRAVEL FROM</div>
        <div className="flex items-center gap-2 mb-2">
          <img src={FLAG_URL(startCountry.code)} alt="" style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 3 }} />
          <span className="font-black text-base" style={{ color: "#831843" }}>{startCountry.name}</span>
          <span className="font-bold text-sm" style={{ color: "#9ca3af" }}>to</span>
          <img src={FLAG_URL(endCountry.code)} alt="" style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 3 }} />
          <span className="font-black text-base" style={{ color: "#831843" }}>{endCountry.name}</span>
        </div>
        <div className="text-xs font-bold" style={{ color: "#9ca3af" }}>
          Minimum {minHops} border crossing{minHops !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Chain visualization */}
      <div className="w-full max-w-sm overflow-x-auto mb-4">
        <div className="flex items-center gap-1.5 pb-1" style={{ minWidth: "max-content" }}>
          {/* Start node */}
          <div className="flex flex-col items-center">
            <div className="px-3 py-1.5 rounded-xl font-black text-xs" style={{ background: "linear-gradient(135deg,#F472B6,#BE185D)", color: "white" }}>
              {startCountry.name}
            </div>
          </div>

          {/* Chain steps */}
          {chain.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span style={{ color: "#F472B6", fontSize: 14 }}>→</span>
              <div className="flex flex-col items-center">
                <div
                  className="px-3 py-1.5 rounded-xl font-black text-xs"
                  style={{
                    background: step.valid
                      ? (step.country.code === endCountry.code ? "linear-gradient(135deg,#34D399,#059669)" : "rgba(255,255,255,0.9)")
                      : "rgba(239,68,68,0.15)",
                    color: step.valid
                      ? (step.country.code === endCountry.code ? "white" : "#831843")
                      : "#ef4444",
                    border: step.valid
                      ? "1px solid rgba(255,255,255,0.8)"
                      : "1px solid rgba(239,68,68,0.4)",
                    boxShadow: step.onPath ? "0 0 0 2px rgba(190,24,93,0.3)" : "none",
                  }}
                >
                  {step.country.name}
                </div>
                {!step.valid && (
                  <div className="text-xs font-bold mt-0.5" style={{ color: "#ef4444" }}>no border</div>
                )}
              </div>
            </div>
          ))}

          {/* End target (if not yet reached) */}
          {!won && (
            <>
              <span style={{ color: "#F472B6", fontSize: 14 }}>...</span>
              <div className="px-3 py-1.5 rounded-xl font-black text-xs" style={{ background: "rgba(244,114,182,0.15)", color: "#BE185D", border: "2px dashed rgba(190,24,93,0.4)" }}>
                {endCountry.name}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Win */}
      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm px-5 py-4 rounded-3xl text-center mb-4" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }}>
            <div className="font-black text-2xl mb-1" style={{ color: "#831843" }}>Arrived!</div>
            <div className="font-bold text-sm" style={{ color: "#6b7280" }}>
              {chain.length} steps - minimum was {minHops} ({chain.length === minHops ? "perfect!" : `+${chain.length - minHops}`})
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      {!won && (
        <div className="relative w-full max-w-sm">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => { setInput(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder={`Border of ${chain.length > 0 ? chain[chain.length-1].country.name : startCountry.name}...`}
              className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.85)", border: "2px solid rgba(190,24,93,0.3)", color: "#831843" }}
            />
            <motion.button
              onClick={() => { const m = COUNTRIES.find(c => c.name.toLowerCase() === input.toLowerCase()); if (m) submitCountry(m); }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-2xl font-black text-white"
              style={{ background: "linear-gradient(180deg,#F472B6,#BE185D)", boxShadow: "0 6px 16px rgba(190,24,93,0.3)" }}
            >
              Go
            </motion.button>
          </div>
          <AnimatePresence>
            {showDropdown && filteredCountries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute w-full mt-1 rounded-2xl overflow-hidden z-50"
                style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
              >
                {filteredCountries.map(c => (
                  <button
                    key={c.code}
                    onMouseDown={() => submitCountry(c)}
                    className="w-full px-4 py-2.5 text-left font-bold text-sm flex items-center gap-3"
                    style={{ color: "#831843", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <img src={FLAG_URL(c.code)} alt="" style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 3 }} />
                    {c.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {chain.length > 0 && (
            <button onClick={undoLast} className="mt-2 font-bold text-xs" style={{ color: "#9ca3af" }}>
              Undo last step
            </button>
          )}
        </div>
      )}

      {won && (
        <div className="w-full max-w-sm mt-4 flex gap-3">
          <Link href="/games" className="flex-1 no-underline">
            <div className="py-3 rounded-2xl font-black text-center text-sm" style={{ background: "rgba(255,255,255,0.8)", color: "#831843" }}>All Games</div>
          </Link>
          <div className="flex-1 py-3 rounded-2xl font-black text-center text-sm" style={{ background: "linear-gradient(180deg,#F472B6,#BE185D)", color: "white" }}>
            Back in {hoursUntilReset}h
          </div>
        </div>
      )}
    </div>
  );
}
