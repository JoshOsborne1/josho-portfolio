"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";

// --- Game Logic & Types ---
type GameState = 
  | "SETUP"
  | "PSYCHIC_SEES"
  | "GIVE_CLUE"
  | "TEAM_GUESSES"
  | "REVEAL"
  | "LEFT_RIGHT_STEAL"
  | "ROUND_END";

type Team = "A" | "B";

interface WordPair {
  left: string;
  right: string;
}

const WORD_PAIRS: WordPair[] = [
  { left: "Hot", right: "Cold" },
  { left: "Fast", right: "Slow" },
  { left: "Soft", right: "Hard" },
  { left: "Light", right: "Heavy" },
  { left: "Cheap", right: "Expensive" },
  { left: "Ugly", right: "Beautiful" },
  { left: "Weak", right: "Strong" },
  { left: "Quiet", right: "Loud" },
  { left: "Boring", right: "Exciting" },
  { left: "Dry", right: "Wet" },
  { left: "Smells Bad", right: "Smells Good" },
  { left: "Round", right: "Pointy" },
  { left: "Sad", right: "Happy" },
  { left: "Useless", right: "Useful" },
  { left: "Normal", right: "Weird" },
  { left: "Easy", right: "Hard" },
  { left: "Clean", right: "Dirty" },
  { left: "Bad Actor", right: "Good Actor" },
  { left: "Needs Skill", right: "Needs Luck" },
  { left: "Temporary", right: "Permanent" },
  { left: "Dangerous", right: "Safe" },
  { left: "Trash", right: "Treasure" },
  { left: "Sci-Fi", right: "Fantasy" },
  { left: "Under-rated", right: "Over-rated" },
  { left: "Villain", right: "Hero" },
  { left: "Snack", right: "Meal" },
  { left: "Tastes Bad", right: "Tastes Good" },
  { left: "Dystopia", right: "Utopia" },
  { left: "Rough", right: "Smooth" },
  { left: "Guilty Pleasure", right: "High Art" }
];

export default function WaveGame() {
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [currentTeam, setCurrentTeam] = useState<Team>("A");
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [targetRotation, setTargetRotation] = useState(0); // -90 to +90
  const [currentPair, setCurrentPair] = useState<WordPair>(WORD_PAIRS[0]);
  const [clue, setClue] = useState("");
  const [roundScore, setRoundScore] = useState(0);
  const [stealDirection, setStealDirection] = useState<"LEFT" | "RIGHT" | null>(null);

  // Motion values for the puck
  const dialRotation = useMotionValue(0);
  const dialControls = useAnimation();
  
  // Ref for the spectrum container to calculate drag
  const spectrumRef = useRef<HTMLDivElement>(null);

  const startRound = () => {
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    // Random angle between -80 and +80 to keep it in the visible semicircle
    const angle = (Math.random() * 160) - 80;
    
    setCurrentPair(pair);
    setTargetRotation(angle);
    setClue("");
    setRoundScore(0);
    setStealDirection(null);
    dialRotation.set(0);
    setGameState("PSYCHIC_SEES");
  };

  const handleClueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clue.trim()) {
      setGameState("TEAM_GUESSES");
    }
  };

  const calculateScore = (guess: number, target: number) => {
    const diff = Math.abs(guess - target);
    if (diff <= 5) return 4;
    if (diff <= 15) return 3;
    if (diff <= 25) return 2;
    return 0;
  };

  const reveal = () => {
    const guess = dialRotation.get();
    const score = calculateScore(guess, targetRotation);
    setRoundScore(score);
    
    if (score === 4) {
      // Perfect guess, skip steal phase
      setScores(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + score }));
      setGameState("ROUND_END");
    } else {
      setGameState("REVEAL");
    }
  };

  const handleStealGuess = (dir: "LEFT" | "RIGHT") => {
    const guess = dialRotation.get();
    const targetIsRight = targetRotation > guess;
    const targetIsLeft = targetRotation < guess;
    
    let stealPoints = 0;
    if ((dir === "RIGHT" && targetIsRight) || (dir === "LEFT" && targetIsLeft)) {
      stealPoints = 1;
    }
    
    setStealDirection(dir);
    
    // Update total scores
    const otherTeam = currentTeam === "A" ? "B" : "A";
    setScores(prev => ({
      ...prev,
      [currentTeam]: prev[currentTeam] + roundScore,
      [otherTeam]: prev[otherTeam] + stealPoints
    }));
    
    setGameState("ROUND_END");
  };

  const nextRound = () => {
    setCurrentTeam(prev => prev === "A" ? "B" : "A");
    setGameState("SETUP");
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-zinc-800 font-sans overflow-hidden selection:bg-rose-200">
      
      {/* Soft background glow */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,transparent_100%)] pointer-events-none" />

      {/* Header / Scores */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center">
        <div className="flex flex-col items-center">
          <span className="text-xs text-rose-500 font-bold tracking-widest uppercase mb-1 drop-shadow-[0_1px_2px_rgba(244,63,94,0.3)]">Team A</span>
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F5F3ED] shadow-[6px_6px_16px_#d1cfc7,-6px_-6px_16px_#ffffff] text-3xl font-black text-rose-500">
            {scores.A}
          </div>
        </div>
        
        <div className="text-center flex flex-col items-center">
          <h1 className="text-2xl font-black tracking-[0.15em] uppercase text-zinc-400 drop-shadow-sm">Wavelength</h1>
          {gameState !== "SETUP" && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#F5F3ED] shadow-[inset_4px_4px_8px_#d1cfc7,inset_-4px_-4px_8px_#ffffff] text-xs font-bold text-zinc-500 tracking-wide"
            >
              Round: Team {currentTeam}
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-sky-500 font-bold tracking-widest uppercase mb-1 drop-shadow-[0_1px_2px_rgba(14,165,233,0.3)]">Team B</span>
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F5F3ED] shadow-[6px_6px_16px_#d1cfc7,-6px_-6px_16px_#ffffff] text-3xl font-black text-sky-500">
            {scores.B}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 h-[calc(100vh-120px)] max-w-lg mx-auto w-full">
        
        {/* State: SETUP */}
        {gameState === "SETUP" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-10 text-center w-full"
          >
            <div className="w-32 h-32 rounded-full bg-[#F5F3ED] shadow-[10px_10px_20px_#d1cfc7,-10px_-10px_20px_#ffffff] flex items-center justify-center mb-4">
               <div className="w-16 h-16 rounded-full bg-rose-400 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-zinc-700">Transmission Ready</h2>
              <p className="text-zinc-500 text-sm font-medium px-8">Team {currentTeam} psychic, step forward. Everyone else, look away.</p>
            </div>
            
            <button 
              onClick={startRound}
              className="w-full max-w-[240px] py-4 rounded-2xl bg-[#F5F3ED] shadow-[8px_8px_16px_#d1cfc7,-8px_-8px_16px_#ffffff] active:shadow-[inset_6px_6px_12px_#d1cfc7,inset_-6px_-6px_12px_#ffffff] text-zinc-600 font-black uppercase tracking-widest transition-all duration-200"
            >
              I am ready
            </button>
          </motion.div>
        )}

        {/* The Spectrum Device (Visible in most states) */}
        {gameState !== "SETUP" && (
          <div className="w-full flex flex-col items-center gap-8 mt-4">
            
            {/* Word Pair & Clue */}
            <div className="w-full flex flex-col items-center gap-4 relative z-50">
               <div className="flex justify-between w-full px-4 items-center">
                <div className="px-4 py-2 rounded-xl bg-[#F5F3ED] shadow-[4px_4px_10px_#d1cfc7,-4px_-4px_10px_#ffffff] text-sm font-black tracking-widest uppercase text-zinc-500">
                  {currentPair.left}
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#F5F3ED] shadow-[4px_4px_10px_#d1cfc7,-4px_-4px_10px_#ffffff] text-sm font-black tracking-widest uppercase text-zinc-500">
                  {currentPair.right}
                </div>
              </div>
              
              <div className="h-14 flex items-center justify-center">
                {clue && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="px-8 py-3 rounded-2xl bg-[#F5F3ED] shadow-[inset_4px_4px_8px_#d1cfc7,inset_-4px_-4px_8px_#ffffff] text-xl text-zinc-700 font-black tracking-wide"
                  >
                    "{clue}"
                  </motion.div>
                )}
              </div>
            </div>

            {/* The Dial Assembly */}
            <div className="relative w-full aspect-[2/1] mt-8 bg-[#F5F3ED] rounded-t-[200px] shadow-[12px_12px_24px_#d1cfc7,-12px_-12px_24px_#ffffff] overflow-hidden flex items-end justify-center pb-4 border-8 border-white/50">
              
              {/* The Target Zone (Hidden or Revealed) */}
              <motion.div 
                className="absolute bottom-4 w-4 h-[85%] origin-bottom"
                initial={false}
                animate={{ 
                  rotate: targetRotation,
                  opacity: (gameState === "PSYCHIC_SEES" || gameState === "REVEAL" || gameState === "ROUND_END" || gameState === "LEFT_RIGHT_STEAL") ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              >
                {/* 4 points */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[12%] bg-emerald-400 rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(52,211,153,0.4)] z-10" />
                {/* 3 points */}
                <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-20 h-[15%] bg-amber-300 rounded-t-full -z-10 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]" />
                {/* 2 points */}
                 <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-32 h-[15%] bg-rose-300 rounded-t-full -z-20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]" />
              </motion.div>

              {/* The Screen / Curtain */}
              {gameState === "GIVE_CLUE" || gameState === "TEAM_GUESSES" ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 rounded-t-[192px] shadow-[inset_10px_10px_20px_#d1cfc7,inset_-10px_-10px_20px_#ffffff] bg-[#F5F3ED]/95 backdrop-blur-sm"
                />
              ) : null}

              {/* The Dial Indicator */}
              <motion.div 
                className="absolute bottom-4 w-3 h-[85%] origin-bottom z-30 pointer-events-none"
                style={{ rotate: dialRotation }}
              >
                <div className="w-full h-full bg-rose-500 rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(244,63,94,0.4)]" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-[2px_4px_8px_rgba(0,0,0,0.15),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-zinc-200 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
                </div>
              </motion.div>

              {/* Invisible Drag Area */}
              {gameState === "TEAM_GUESSES" && (
                <div 
                  className="absolute inset-0 z-40 rounded-t-full cursor-grab active:cursor-grabbing touch-none"
                  onPointerDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.bottom - 16; // offset for the pb-4 padding
                    
                    const handleMove = (moveEvent: PointerEvent) => {
                      const dx = moveEvent.clientX - centerX;
                      const dy = moveEvent.clientY - centerY;
                      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                      
                      angle = angle + 90;
                      
                      if (angle < -85) angle = -85;
                      if (angle > 85) angle = 85;
                      
                      dialRotation.set(angle);
                    };
                    
                    const handleUp = () => {
                      window.removeEventListener('pointermove', handleMove);
                      window.removeEventListener('pointerup', handleUp);
                    };
                    
                    window.addEventListener('pointermove', handleMove);
                    window.addEventListener('pointerup', handleUp);
                    
                    handleMove(e as unknown as PointerEvent);
                  }}
                />
              )}

              {/* Base Pivot */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#F5F3ED] rounded-t-full shadow-[inset_4px_4px_8px_#d1cfc7,inset_-4px_-4px_8px_#ffffff] z-50 flex items-end justify-center pb-2 border-t-4 border-white/60">
                 <div className="w-6 h-6 rounded-full bg-zinc-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            {/* Context Actions */}
            <div className="min-h-[140px] flex items-center justify-center w-full mt-4">
              
              {gameState === "PSYCHIC_SEES" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full">
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">Memorize the target</p>
                  <button 
                    onClick={() => setGameState("GIVE_CLUE")}
                    className="w-full max-w-[260px] py-4 rounded-2xl bg-zinc-800 text-white shadow-[6px_6px_12px_#d1cfc7,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4)] font-black uppercase tracking-widest transition-all duration-200"
                  >
                    Hide & Give Clue
                  </button>
                </motion.div>
              )}

              {gameState === "GIVE_CLUE" && (
                <motion.form 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleClueSubmit}
                  className="flex flex-col w-full gap-5"
                >
                  <input
                    type="text"
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder="Enter one clue..."
                    className="w-full rounded-2xl bg-[#F5F3ED] shadow-[inset_6px_6px_12px_#d1cfc7,inset_-6px_-6px_12px_#ffffff] p-5 text-center text-xl font-bold text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-rose-200/50 transition-all"
                    autoFocus
                  />
                  <button type="submit" className="w-full py-4 rounded-2xl bg-rose-500 text-white shadow-[6px_6px_12px_#d1cfc7,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)] font-black uppercase tracking-widest transition-all duration-200">
                    Send Clue
                  </button>
                </motion.form>
              )}

              {gameState === "TEAM_GUESSES" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full">
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4 animate-pulse">Drag the red needle</p>
                  <button 
                    onClick={reveal}
                    className="w-full max-w-[260px] py-4 rounded-2xl bg-zinc-800 text-white shadow-[6px_6px_12px_#d1cfc7,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4)] font-black uppercase tracking-widest transition-all duration-200"
                  >
                    Lock Guess
                  </button>
                </motion.div>
              )}

              {gameState === "REVEAL" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 w-full">
                  <div className="px-6 py-3 rounded-2xl bg-[#F5F3ED] shadow-[inset_4px_4px_8px_#d1cfc7,inset_-4px_-4px_8px_#ffffff] text-2xl font-black text-emerald-500">
                    {roundScore > 0 ? `+${roundScore} Points!` : "Miss!"}
                  </div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">
                    Team {currentTeam === "A" ? "B" : "A"}: Steal Opportunity
                  </p>
                  <div className="flex gap-4 w-full justify-center">
                    <button onClick={() => handleStealGuess("LEFT")} className="flex-1 max-w-[140px] py-3 rounded-xl bg-[#F5F3ED] shadow-[4px_4px_10px_#d1cfc7,-4px_-4px_10px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1cfc7,inset_-4px_-4px_8px_#ffffff] text-xs font-black tracking-widest uppercase text-zinc-600 transition-all">Target is Left</button>
                    <button onClick={() => handleStealGuess("RIGHT")} className="flex-1 max-w-[140px] py-3 rounded-xl bg-[#F5F3ED] shadow-[4px_4px_10px_#d1cfc7,-4px_-4px_10px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1cfc7,inset_-4px_-4px_8px_#ffffff] text-xs font-black tracking-widest uppercase text-zinc-600 transition-all">Target is Right</button>
                  </div>
                </motion.div>
              )}

              {gameState === "ROUND_END" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full">
                  <div className="text-center w-full p-4 rounded-2xl bg-[#F5F3ED] shadow-[inset_6px_6px_12px_#d1cfc7,inset_-6px_-6px_12px_#ffffff]">
                    <p className="text-xl font-black text-zinc-700">Round Complete</p>
                    <div className="mt-3 flex flex-col gap-1">
                      <p className="text-sm font-bold text-zinc-500">
                        Team {currentTeam}: <span className="text-emerald-500">+{roundScore}</span>
                      </p>
                      {stealDirection && (
                        <p className="text-sm font-bold text-zinc-500">
                          Team {currentTeam === "A" ? "B" : "A"} (Steal): <span className="text-sky-500">{calculateScore(dialRotation.get(), targetRotation) === 4 ? 0 : 
                          ((stealDirection === "RIGHT" && targetRotation > dialRotation.get()) || 
                           (stealDirection === "LEFT" && targetRotation < dialRotation.get())) ? "+1" : "0"}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={nextRound}
                    className="w-full max-w-[260px] py-4 rounded-2xl bg-zinc-800 text-white shadow-[6px_6px_12px_#d1cfc7,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4)] font-black uppercase tracking-widest transition-all duration-200"
                  >
                    Next Round
                  </button>
                </motion.div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}