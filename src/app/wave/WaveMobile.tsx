"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Team, WordPair, WORD_PAIRS } from "./constants";

export default function WaveMobile() {
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team One", score: 0 },
    { id: "2", name: "Team Two", score: 0 }
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [currentPair, setCurrentPair] = useState<WordPair>(WORD_PAIRS[0]);
  const [targetRotation, setTargetRotation] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [dialValue, setDialValue] = useState(0);

  const currentTeam = teams[currentTeamIdx];
  const otherTeamIdx = (currentTeamIdx + 1) % teams.length;
  const otherTeam = teams[otherTeamIdx];

  const updateTeamName = (id: string, newName: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name: newName } : t));
  };

  const addTeam = () => {
    setTeams([...teams, { id: Date.now().toString(), name: `Team ${teams.length + 1}`, score: 0 }]);
  };

  const getRandomPair = (excluding?: WordPair): WordPair => {
    const available = WORD_PAIRS.filter(p => p !== excluding);
    return available[Math.floor(Math.random() * available.length)];
  };

  const startRound = () => {
    const pair = getRandomPair();
    const angle = (Math.random() * 160) - 80;
    setCurrentPair(pair);
    setTargetRotation(angle);
    setRoundScore(0);
    setDialValue(0);
    setGameState("CLUE_GIVER");
  };

  const respin = () => {
    const angle = (Math.random() * 160) - 80;
    setTargetRotation(angle);
    setRoundScore(0);
    setDialValue(0);
  };

  const skip = () => {
    const pair = getRandomPair(currentPair);
    const angle = (Math.random() * 160) - 80;
    setCurrentPair(pair);
    setTargetRotation(angle);
    setRoundScore(0);
    setDialValue(0);
  };

  const calculateScore = (guess: number, target: number) => {
    const diff = Math.abs(guess - target);
    if (diff <= 6) return 4;
    if (diff <= 14) return 3;
    if (diff <= 22) return 2;
    return 0;
  };

  const lockGuess = () => {
    const score = calculateScore(dialValue, targetRotation);
    setRoundScore(score);
    setTeams(prev => {
      const newTeams = [...prev];
      newTeams[currentTeamIdx].score += score;
      return newTeams;
    });
    setGameState("REVEAL");
  };

  const nextRound = () => {
    setCurrentTeamIdx(otherTeamIdx);
    setGameState("SETUP");
  };

  const handleDialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDialValue(parseInt(e.target.value));
  };

  const primaryBtn = "w-full px-6 py-4 bg-gradient-to-b from-[#C4B5FD] to-[#A78BFA] rounded-2xl shadow-lg font-black text-white text-lg active:scale-95 transition-transform";
  const secondaryBtn = "w-full px-6 py-4 bg-gradient-to-b from-[#A7F3D0] to-[#5EEAD4] rounded-2xl shadow-lg font-black text-[#0F766E] text-lg active:scale-95 transition-transform";
  const clayBtn = "flex-1 px-4 py-3 bg-white/80 backdrop-blur rounded-xl shadow-sm font-bold text-[#475569] active:scale-95 transition-transform";

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex flex-col"
      style={{
        fontFamily: "'Nunito', system-ui, sans-serif",
        background: "#FAFAFA",
        width: "100vw",
        height: "100vh",
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        html, body { background: #FAFAFA !important; overflow: hidden; }
        * { box-sizing: border-box; }
      `}} />

      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#A7F3D0]/50 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-[30%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-[#C4B5FD]/40 blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {gameState === "SETUP" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10"
          >
            <div className="text-center mb-8 w-full">
              <div className="text-sm font-bold text-[#94A3B8] tracking-widest uppercase mb-2">Current Team</div>
              <h1 className="text-4xl font-black text-[#334155] mb-1">{currentTeam.name}</h1>
              <div className="text-5xl font-black text-[#C4B5FD]">{currentTeam.score}</div>
            </div>

            <div className="space-y-2 w-full max-w-xs mb-8">
              {teams.map((t, idx) => (
                <div key={t.id} className={`px-4 py-2 rounded-xl transition-all ${currentTeamIdx === idx ? 'bg-white/80 shadow-sm' : 'bg-white/40'}`}>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{t.name}</div>
                  <div className="text-2xl font-black text-[#475569]">{t.score}</div>
                </div>
              ))}
            </div>

            <button
              onClick={addTeam}
              className="mb-8 w-12 h-12 rounded-full bg-white/60 flex items-center justify-center text-2xl font-black text-[#C4B5FD] active:scale-95 transition-transform"
            >
              +
            </button>

            <button onClick={startRound} className={primaryBtn}>
              Begin Round
            </button>
          </motion.div>
        )}

        {gameState === "CLUE_GIVER" && (
          <motion.div
            key="clue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10"
          >
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 bg-[#C4B5FD]/20 text-[#A78BFA] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                Clue Giver
              </div>
              <h2 className="text-5xl font-black text-[#334155] mb-2">{currentPair.left}</h2>
              <div className="h-1 w-16 bg-[#C4B5FD]/20 rounded-full mx-auto mb-4" />
              <h2 className="text-5xl font-black text-[#334155]">{currentPair.right}</h2>
            </div>

            <div className="text-center text-[#64748B] font-bold mb-12 px-4">
              Think of one verbal clue that describes your team's position between these two words.
            </div>

            <div className="space-y-3 w-full max-w-xs">
              <button onClick={() => setGameState("TEAM_GUESSES")} className={primaryBtn}>
                Hide for Guessers
              </button>
              <div className="flex gap-2">
                <button onClick={respin} className={clayBtn}>Respin</button>
                <button onClick={skip} className={clayBtn}>Skip</button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === "TEAM_GUESSES" && (
          <motion.div
            key="guess"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10"
          >
            <div className="text-center mb-8">
              <div className="text-sm font-bold text-[#94A3B8] tracking-widest uppercase mb-2">Guess</div>
              <h2 className="text-4xl font-black text-[#334155]">{currentPair.left}</h2>
              <div className="my-3 text-2xl text-[#94A3B8]">—</div>
              <h2 className="text-4xl font-black text-[#334155]">{currentPair.right}</h2>
            </div>

            <div className="w-full max-w-xs mb-8">
              <div className="mb-6">
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={dialValue}
                  onChange={handleDialChange}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #FCA5A5 0%, #C4B5FD 50%, #A7F3D0 100%)`,
                    WebkitAppearance: "none",
                  }}
                />
                <style>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    cursor: pointer;
                    border: 2px solid #C4B5FD;
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    cursor: pointer;
                    border: 2px solid #C4B5FD;
                  }
                `}</style>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#94A3B8] mb-6">
                <span>{currentPair.left}</span>
                <span>{currentPair.right}</span>
              </div>
            </div>

            <p className="text-[#A78BFA] font-bold text-sm mb-6 animate-pulse">Drag to guess.</p>
            <button onClick={lockGuess} className={secondaryBtn}>
              Reveal
            </button>
          </motion.div>
        )}

        {gameState === "REVEAL" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10"
          >
            <div className="text-center mb-12">
              <div className="text-sm font-bold text-[#94A3B8] tracking-widest uppercase mb-2">Target</div>
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-2xl font-black text-[#F87171]">{currentPair.left}</span>
                <span className="text-2xl font-black text-[#94A3B8]">-</span>
                <span className="text-2xl font-black text-[#6EE7B7]">{currentPair.right}</span>
              </div>
              <div className="h-1 w-16 bg-[#C4B5FD]/20 rounded-full mx-auto" />
            </div>

            <div className="mb-12 text-center">
              <div className="text-sm font-bold text-[#94A3B8] tracking-widest uppercase mb-2">{currentTeam.name}</div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-6xl font-black text-[#C4B5FD]"
              >
                {roundScore > 0 ? `+${roundScore}` : "Miss"}
              </motion.div>
            </div>

            <button onClick={nextRound} className={primaryBtn}>
              Next Round
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
