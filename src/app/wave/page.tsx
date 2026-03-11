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
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden selection:bg-purple-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_100%)] pointer-events-none" />

      {/* Header / Scores */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex flex-col items-center">
          <span className="text-xs text-blue-400 tracking-widest uppercase mb-1">Team A</span>
          <span className="text-4xl font-bold text-white">{scores.A}</span>
        </div>
        
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-white/50">Wavelength</h1>
          {gameState !== "SETUP" && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs text-white">
              Round: Team {currentTeam}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-orange-400 tracking-widest uppercase mb-1">Team B</span>
          <span className="text-4xl font-bold text-white">{scores.B}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
        
        {/* State: SETUP */}
        {gameState === "SETUP" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 text-center max-w-lg"
          >
            <h2 className="text-3xl font-bold text-white/90">Prepare for Transmission</h2>
            <p className="text-white/60 text-sm">Team {currentTeam} psychic, step forward. Everyone else, look away.</p>
            <button 
              onClick={startRound}
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
            >
              I am ready
            </button>
          </motion.div>
        )}

        {/* The Spectrum Device (Visible in most states) */}
        {gameState !== "SETUP" && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-12 mt-12">
            
            {/* Word Pair */}
            <div className="flex justify-between w-full text-sm font-bold tracking-widest uppercase text-white/50">
              <span className="w-1/3 text-left">{currentPair.left}</span>
              {clue && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-1/3 text-center text-xl text-white font-sans font-bold"
                >
                  "{clue}"
                </motion.div>
              )}
              <span className="w-1/3 text-right">{currentPair.right}</span>
            </div>

            {/* The Dial Assembly */}
            <div className="relative w-full aspect-[2/1] bg-white/5 rounded-t-full border border-white/10 overflow-hidden flex items-end justify-center pb-2">
              
              {/* The Target Zone (Hidden or Revealed) */}
              <motion.div 
                className="absolute bottom-0 w-2 h-[90%] origin-bottom"
                initial={false}
                animate={{ 
                  rotate: targetRotation,
                  opacity: (gameState === "PSYCHIC_SEES" || gameState === "REVEAL" || gameState === "ROUND_END" || gameState === "LEFT_RIGHT_STEAL") ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              >
                {/* 4 points */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[10%] bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10" />
                {/* 3 points */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-12 h-[10%] bg-cyan-400 opacity-60 rounded-t-full -translate-x-1/2 -z-10" />
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-12 h-[10%] bg-cyan-400 opacity-60 rounded-t-full -translate-x-1/2 -z-10 -scale-x-100" />
                {/* 2 points (approximate visual) */}
                 <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-24 h-[10%] bg-white/20 rounded-t-full -translate-x-1/2 -z-20" />
              </motion.div>

              {/* The Screen / Curtain */}
              {gameState === "GIVE_CLUE" || gameState === "TEAM_GUESSES" ? (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 border-t border-white/10" />
              ) : null}

              {/* The Dial Indicator */}
              <motion.div 
                className="absolute bottom-0 w-1 h-[85%] origin-bottom z-30 pointer-events-none"
                style={{ rotate: dialRotation }}
              >
                <div className="w-full h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </motion.div>

              {/* Invisible Drag Area overlaying the semicircle */}
              {gameState === "TEAM_GUESSES" && (
                <div 
                  className="absolute inset-0 z-40 rounded-t-full cursor-grab active:cursor-grabbing touch-none"
                  onPointerDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.bottom;
                    
                    const handleMove = (moveEvent: PointerEvent) => {
                      const dx = moveEvent.clientX - centerX;
                      const dy = moveEvent.clientY - centerY;
                      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                      
                      // Convert from typical atan2 range to our -90 to 90 range
                      angle = angle + 90;
                      
                      // Clamp
                      if (angle < -90) angle = -90;
                      if (angle > 90) angle = 90;
                      
                      dialRotation.set(angle);
                    };
                    
                    const handleUp = () => {
                      window.removeEventListener('pointermove', handleMove);
                      window.removeEventListener('pointerup', handleUp);
                    };
                    
                    window.addEventListener('pointermove', handleMove);
                    window.addEventListener('pointerup', handleUp);
                    
                    // Initial calculation on down
                    handleMove(e as unknown as PointerEvent);
                  }}
                />
              )}

              {/* Base Pivot */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-zinc-800 rounded-t-full border border-white/20 z-50" />
            </div>

            {/* Context Actions */}
            <div className="h-32 flex items-center justify-center w-full">
              
              {gameState === "PSYCHIC_SEES" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                  <p className="text-white/60 text-sm uppercase tracking-widest">Memorize the target location</p>
                  <button 
                    onClick={() => setGameState("GIVE_CLUE")}
                    className="px-6 py-2 border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
                  >
                    Hide Screen & Give Clue
                  </button>
                </motion.div>
              )}

              {gameState === "GIVE_CLUE" && (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleClueSubmit}
                  className="flex w-full max-w-md gap-2"
                >
                  <input
                    type="text"
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder="Enter one clue..."
                    className="flex-1 bg-white/5 border border-white/20 p-3 text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50"
                    autoFocus
                  />
                  <button type="submit" className="px-6 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90">
                    Send
                  </button>
                </motion.form>
              )}

              {gameState === "TEAM_GUESSES" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                  <p className="text-white/60 text-sm uppercase tracking-widest">Team {currentTeam}: Drag the dial</p>
                  <button 
                    onClick={reveal}
                    className="px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
                  >
                    Lock Guess
                  </button>
                </motion.div>
              )}

              {gameState === "REVEAL" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {roundScore > 0 ? `+${roundScore} Points!` : "Miss!"}
                  </div>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Team {currentTeam === "A" ? "B" : "A"}: Steal opportunity
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => handleStealGuess("LEFT")} className="px-6 py-2 border border-white/30 hover:bg-white/10 text-xs tracking-widest uppercase">Target is Left</button>
                    <button onClick={() => handleStealGuess("RIGHT")} className="px-6 py-2 border border-white/30 hover:bg-white/10 text-xs tracking-widest uppercase">Target is Right</button>
                  </div>
                </motion.div>
              )}

              {gameState === "ROUND_END" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg text-white">Round Complete</p>
                    <p className="text-sm text-white/50 mt-1">
                      Team {currentTeam}: +{roundScore}
                      {stealDirection && ` | Team ${currentTeam === "A" ? "B" : "A"}: ${calculateScore(dialRotation.get(), targetRotation) === 4 ? 0 : 
                        ((stealDirection === "RIGHT" && targetRotation > dialRotation.get()) || 
                         (stealDirection === "LEFT" && targetRotation < dialRotation.get())) ? "+1" : "0"}`}
                    </p>
                  </div>
                  <button 
                    onClick={nextRound}
                    className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90"
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
