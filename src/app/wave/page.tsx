"use client";

import { useState } from "react";
import { motion, useMotionValue } from "framer-motion";

type GameState = "SETUP" | "PSYCHIC_SEES" | "TEAM_GUESSES" | "REVEAL" | "ROUND_END";
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
  const [roundScore, setRoundScore] = useState(0);
  const [stealDirection, setStealDirection] = useState<"LEFT" | "RIGHT" | null>(null);

  const dialRotation = useMotionValue(0);

  const startRound = () => {
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    const angle = (Math.random() * 160) - 80;
    
    setCurrentPair(pair);
    setTargetRotation(angle);
    setRoundScore(0);
    setStealDirection(null);
    dialRotation.set(0);
    setGameState("PSYCHIC_SEES");
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

  const amberBtnClass = "px-8 py-4 rounded-full bg-gradient-to-b from-[#d97706] to-[#92400e] border border-[#f59e0b]/50 text-[#fef3c7] font-bold tracking-widest uppercase text-sm shadow-[0_5px_20px_rgba(217,119,6,0.4)] hover:shadow-[0_5px_25px_rgba(245,158,11,0.6)] transition-all active:scale-95";
  const indigoBtnClass = "px-8 py-4 rounded-full bg-gradient-to-b from-[#2d1b69] to-[#1a0a2e] border border-[#a78bfa]/30 text-[#fef3c7] font-bold tracking-widest uppercase text-sm shadow-[0_5px_20px_rgba(45,27,105,0.6)] hover:shadow-[0_5px_25px_rgba(167,139,250,0.4)] transition-all active:scale-95";

  return (
    <div className="min-h-screen bg-[#08030f] text-[#fef3c7] font-sans overflow-hidden flex flex-col selection:bg-[#f59e0b]/30 relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(45,27,105,0.4)_0%,transparent_100%)] pointer-events-none" />

      {/* Header / Scores */}
      <header className="relative z-10 w-full p-8 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex flex-col items-center">
          <span className="text-xs text-[#f59e0b] font-bold tracking-widest uppercase mb-2">Team A</span>
          <div className="text-4xl font-serif font-black text-[#fef3c7] drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
            {scores.A}
          </div>
        </div>
        
        <div className="text-center flex flex-col items-center">
          <h1 className="text-sm font-black tracking-[0.3em] uppercase text-[#fef3c7]/30">Wavelength</h1>
          {gameState !== "SETUP" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 px-4 py-1 rounded-full border border-[#fef3c7]/10 bg-[#1a0a2e]/50 backdrop-blur-md text-xs font-bold text-[#fef3c7]/70 tracking-widest uppercase"
            >
              Team {currentTeam}
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-[#a78bfa] font-bold tracking-widest uppercase mb-2">Team B</span>
          <div className="text-4xl font-serif font-black text-[#fef3c7] drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">
            {scores.B}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pb-12 w-full max-w-5xl mx-auto px-4">
        
        {/* SETUP STATE */}
        {gameState === "SETUP" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-12 text-center"
          >
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-serif text-[#fef3c7] tracking-wide drop-shadow-md">Establish Connection</h2>
              <p className="text-[#fef3c7]/60 text-sm tracking-widest uppercase max-w-md mx-auto">
                Team {currentTeam} psychic, prepare your mind. All others, avert your eyes.
              </p>
            </div>
            
            <button 
              onClick={startRound}
              className={amberBtnClass}
            >
              Commence Synchronization
            </button>
          </motion.div>
        )}

        {/* ACTIVE GAME STATES */}
        {gameState !== "SETUP" && (
          <div className="w-full flex flex-col items-center">
            
            {/* Word Pairs */}
            <div className="flex justify-between items-end w-full px-4 sm:px-8 mb-8 sm:mb-12 relative z-10">
              <motion.h2 layoutId="leftWord" className="text-2xl sm:text-4xl font-serif text-[#fef3c7] tracking-wider drop-shadow-lg text-left w-1/2 leading-tight">
                {currentPair.left}
              </motion.h2>
              <motion.h2 layoutId="rightWord" className="text-2xl sm:text-4xl font-serif text-[#fef3c7] tracking-wider drop-shadow-lg text-right w-1/2 leading-tight">
                {currentPair.right}
              </motion.h2>
            </div>

            {/* Dial Assembly */}
            <div className="relative w-full max-w-3xl aspect-[2/1] bg-gradient-to-t from-[#160b24] to-[#201138] rounded-t-[1000px] shadow-[0_-15px_60px_rgba(26,10,46,0.8),inset_0_5px_20px_rgba(254,243,199,0.05)] overflow-hidden border-t border-x border-[#fef3c7]/10 flex items-end justify-center">
              
              {/* Tick Marks SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                {Array.from({ length: 37 }).map((_, i) => {
                  const angle = -90 + (i * 5);
                  const isMajor = i % 9 === 0;
                  return (
                    <line
                      key={i}
                      x1="100" y1="100" x2="100" y2={isMajor ? "5" : "15"}
                      transform={`rotate(${angle} 100 100)`}
                      stroke={isMajor ? "rgba(254, 243, 199, 0.3)" : "rgba(254, 243, 199, 0.1)"}
                      strokeWidth={isMajor ? "1" : "0.3"}
                    />
                  );
                })}
              </svg>

              {/* Target Zone */}
              <motion.div 
                className="absolute inset-0 origin-bottom pointer-events-none"
                initial={false}
                animate={{ rotate: targetRotation }}
                transition={{ type: "spring", stiffness: 45, damping: 14 }}
              >
                {/* The Psychic's Secret Line */}
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[#fef3c7] shadow-[0_0_15px_#fef3c7,0_0_30px_#fef3c7]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: gameState === "PSYCHIC_SEES" ? 1 : 0 }}
                />

                {/* The Full Revealed Scoring Wedge */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from 335deg at 50% 100%, transparent 0deg, rgba(146,64,14,0.6) 0deg 10deg, rgba(217,119,6,0.8) 10deg 20deg, rgba(245,158,11,1) 20deg 30deg, rgba(217,119,6,0.8) 30deg 40deg, rgba(146,64,14,0.6) 40deg 50deg, transparent 50deg)`
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: gameState === "ROUND_END" ? 1 : 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              {/* Fog of War / Curtain during TEAM_GUESSES and REVEAL (steal phase) */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: (gameState === "TEAM_GUESSES" || gameState === "REVEAL") ? 1 : 0 }}
                className="absolute inset-0 z-20 rounded-t-[1000px] bg-gradient-to-t from-[#08030f]/90 to-[#1a0a2e]/60 backdrop-blur-[3px] pointer-events-none"
              />

              {/* Physical Needle/Puck */}
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-[92%] origin-bottom z-30 pointer-events-none"
                style={{ rotate: dialRotation }}
              >
                <div className="w-full h-full bg-gradient-to-t from-[#d97706] to-[#fef3c7] rounded-t-full shadow-[0_0_20px_rgba(245,158,11,1)]" />
              </motion.div>

              {/* Invisible Drag Area */}
              {gameState === "TEAM_GUESSES" && (
                <div 
                  className="absolute inset-0 z-40 rounded-t-[1000px] cursor-grab active:cursor-grabbing touch-none"
                  onPointerDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.bottom;
                    
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
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#08030f] rounded-full border-4 border-[#2d1b69] z-50 flex items-center justify-center shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
                 <div className="w-6 h-6 rounded-full bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
              </div>
            </div>

            {/* Contextual Actions Panel */}
            <div className="h-32 mt-16 flex items-center justify-center w-full relative z-50">
              
              {gameState === "PSYCHIC_SEES" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 w-full">
                  <p className="text-[#fef3c7]/50 text-xs tracking-widest uppercase">Internalize the frequency</p>
                  <button 
                    onClick={() => setGameState("TEAM_GUESSES")}
                    className={indigoBtnClass}
                  >
                    Hide & Speak Clue
                  </button>
                </motion.div>
              )}

              {gameState === "TEAM_GUESSES" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 w-full">
                  <p className="text-[#f59e0b] text-xs tracking-widest uppercase animate-pulse">Drag needle to tune frequency</p>
                  <button 
                    onClick={reveal}
                    className={amberBtnClass}
                  >
                    Lock Frequency
                  </button>
                </motion.div>
              )}

              {gameState === "REVEAL" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 w-full">
                  <p className="text-[#a78bfa] text-xs tracking-widest uppercase text-center">
                    Team {currentTeam === "A" ? "B" : "A"} Intercept: Where is the target?
                  </p>
                  <div className="flex gap-4 w-full justify-center">
                    <button onClick={() => handleStealGuess("LEFT")} className={indigoBtnClass}>Target is Left</button>
                    <button onClick={() => handleStealGuess("RIGHT")} className={indigoBtnClass}>Target is Right</button>
                  </div>
                </motion.div>
              )}

              {gameState === "ROUND_END" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full">
                  <div className="flex gap-12 items-center bg-[#1a0a2e]/50 px-10 py-5 rounded-3xl border border-[#fef3c7]/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#fef3c7]/50 uppercase tracking-widest mb-1">Team {currentTeam}</span>
                      <span className="text-3xl font-serif text-[#f59e0b]">{roundScore > 0 ? `+${roundScore}` : "Miss"}</span>
                    </div>
                    
                    {stealDirection && (
                      <>
                        <div className="w-px h-12 bg-[#fef3c7]/10" />
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-[#fef3c7]/50 uppercase tracking-widest mb-1">Intercept</span>
                          <span className="text-3xl font-serif text-[#a78bfa]">
                            +{((stealDirection === "RIGHT" && targetRotation > dialRotation.get()) || 
                               (stealDirection === "LEFT" && targetRotation < dialRotation.get())) ? 1 : 0}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={nextRound}
                    className={amberBtnClass}
                  >
                    Next Transmission
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