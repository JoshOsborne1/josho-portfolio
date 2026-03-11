"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

type GameState = "SETUP" | "CLUE_GIVER" | "TEAM_GUESSES" | "REVEAL";

interface Team {
  id: string;
  name: string;
  score: number;
}

interface WordPair {
  left: string;
  right: string;
}

const WORD_PAIRS: WordPair[] = [
  // Sensory
  { left: "Hot", right: "Cold" },
  { left: "Soft", right: "Hard" },
  { left: "Quiet", right: "Loud" },
  { left: "Rough", right: "Smooth" },
  { left: "Light", right: "Heavy" },
  { left: "Dry", right: "Wet" },
  { left: "Mild", right: "Spicy" },
  { left: "Sweet", right: "Sour" },
  { left: "Crunchy", right: "Mushy" },
  { left: "Smells Bad", right: "Smells Good" },
  { left: "Tastes Bad", right: "Tastes Good" },
  { left: "Round", right: "Pointy" },
  // Speed / Energy
  { left: "Fast", right: "Slow" },
  { left: "Relaxing", right: "Stressful" },
  { left: "Rushed", right: "Slow Burn" },
  { left: "Energising", right: "Draining" },
  { left: "Lazy", right: "Ambitious" },
  // Value
  { left: "Cheap", right: "Expensive" },
  { left: "Trash", right: "Treasure" },
  { left: "Useless", right: "Useful" },
  { left: "Underrated", right: "Overrated" },
  { left: "Legendary", right: "Forgettable" },
  { left: "Iconic", right: "Generic" },
  { left: "Premium", right: "Bargain" },
  { left: "Priceless", right: "Worthless" },
  // Quality / Craft
  { left: "Guilty Pleasure", right: "High Art" },
  { left: "Raw", right: "Polished" },
  { left: "Authentic", right: "Fake" },
  { left: "Original", right: "Derivative" },
  { left: "Artisan", right: "Mass-Produced" },
  // Social / Status
  { left: "Niche", right: "Mainstream" },
  { left: "Famous", right: "Unknown" },
  { left: "Cringe", right: "Cool" },
  { left: "Classy", right: "Trashy" },
  { left: "Basic", right: "Sophisticated" },
  { left: "Try-Hard", right: "Effortless" },
  { left: "Cult Classic", right: "Mainstream Hit" },
  { left: "Underdog", right: "The Favourite" },
  // Good / Bad vibes
  { left: "Ugly", right: "Beautiful" },
  { left: "Sad", right: "Happy" },
  { left: "Boring", right: "Exciting" },
  { left: "Disappointing", right: "Satisfying" },
  { left: "Terrifying", right: "Adorable" },
  { left: "Inspiring", right: "Depressing" },
  { left: "Addictive", right: "One and Done" },
  { left: "Blessed", right: "Cursed" },
  // Risk / Reward
  { left: "Dangerous", right: "Safe" },
  { left: "Reckless", right: "Calculated" },
  { left: "Coward", right: "Daredevil" },
  { left: "Impulsive", right: "Deliberate" },
  { left: "Needs Skill", right: "Needs Luck" },
  { left: "Rule Breaker", right: "Rule Follower" },
  { left: "Spender", right: "Saver" },
  // Personality
  { left: "Introvert", right: "Extrovert" },
  { left: "Optimist", right: "Pessimist" },
  { left: "Humble", right: "Arrogant" },
  { left: "Stubborn", right: "Flexible" },
  { left: "Selfish", right: "Selfless" },
  { left: "Naive", right: "Cynical" },
  { left: "Reliable", right: "Unreliable" },
  { left: "Charming", right: "Awkward" },
  { left: "Sensitive", right: "Thick Skinned" },
  { left: "Serious", right: "Playful" },
  { left: "Open Minded", right: "Closed Minded" },
  { left: "Trustworthy", right: "Untrustworthy" },
  { left: "Kind", right: "Cruel" },
  { left: "Logical", right: "Emotional" },
  { left: "Independent", right: "Clingy" },
  { left: "High Maintenance", right: "Low Maintenance" },
  { left: "Life of the Party", right: "Wallflower" },
  // Lifestyle
  { left: "Night Owl", right: "Early Bird" },
  { left: "Homebody", right: "Adventurer" },
  { left: "Minimalist", right: "Hoarder" },
  { left: "Healthy", right: "Unhealthy" },
  { left: "Planned", right: "Spontaneous" },
  { left: "Night Out", right: "Night In" },
  { left: "Dog Person", right: "Cat Person" },
  // Effort / Work
  { left: "Easy", right: "Hard" },
  { left: "Simple", right: "Complex" },
  { left: "Temporary", right: "Permanent" },
  { left: "High Effort", right: "Low Effort" },
  { left: "Rewarding", right: "Thankless" },
  { left: "Overachiever", right: "Underachiever" },
  { left: "Manual", right: "Automatic" },
  // Place / Environment
  { left: "Urban", right: "Rural" },
  { left: "Ancient", right: "Futuristic" },
  { left: "Indoor", right: "Outdoor" },
  { left: "City Life", right: "Country Life" },
  { left: "Overcrowded", right: "Deserted" },
  { left: "Local", right: "Global" },
  // Time / Era
  { left: "Old School", right: "Cutting Edge" },
  { left: "Nostalgic", right: "Forward-Thinking" },
  { left: "Morning", right: "Night" },
  { left: "Short", right: "Long" },
  { left: "Timeless", right: "Trendy" },
  // Ethics / Morality
  { left: "Ethical", right: "Unethical" },
  { left: "Honest", right: "Deceptive" },
  { left: "Innocent", right: "Guilty" },
  { left: "Sacred", right: "Profane" },
  { left: "Empowering", right: "Demeaning" },
  { left: "Progressive", right: "Traditional" },
  { left: "Celebrated", right: "Cancelled" },
  { left: "Respected", right: "Ridiculed" },
  // Creative / Art
  { left: "Art", right: "Science" },
  { left: "Fiction", right: "Reality" },
  { left: "Creative", right: "Analytical" },
  { left: "Sci-Fi", right: "Fantasy" },
  { left: "Dystopia", right: "Utopia" },
  { left: "Villain", right: "Hero" },
  { left: "Analog", right: "Digital" },
  { left: "Colourful", right: "Monochrome" },
  // Food context
  { left: "Snack", right: "Meal" },
  { left: "Comfort Food", right: "Fine Dining" },
  { left: "Street Food", right: "Michelin Star" },
  { left: "Fast Food", right: "Home Cooked" },
  // Relationships / Social dynamics
  { left: "Romantic", right: "Unromantic" },
  { left: "Formal", right: "Casual" },
  { left: "Leader", right: "Follower" },
  { left: "Giver", right: "Taker" },
  { left: "Public", right: "Private" },
  { left: "Approachable", right: "Intimidating" },
  // Physical / Natural
  { left: "Fragile", right: "Durable" },
  { left: "Wild", right: "Tame" },
  { left: "Rare", right: "Common" },
  { left: "Natural", right: "Artificial" },
  { left: "Organic", right: "Synthetic" },
  { left: "Comfortable", right: "Uncomfortable" },
  // Abstract / Philosophical
  { left: "Predictable", right: "Unpredictable" },
  { left: "Chaotic", right: "Orderly" },
  { left: "Freedom", right: "Control" },
  { left: "Theory", right: "Practice" },
  { left: "Wholesome", right: "Dark" },
  { left: "Cozy", right: "Edgy" },
  { left: "Deep", right: "Shallow" },
  { left: "Normal", right: "Weird" },
  { left: "Clean", right: "Dirty" },
  { left: "Bold", right: "Subtle" },
  { left: "Practical", right: "Idealistic" },
  // Pop culture
  { left: "Pop", right: "Rock" },
  { left: "Mainstream", right: "Indie" },
  { left: "Nerd", right: "Cool Kid" },
  { left: "Bad Actor", right: "Good Actor" },
  { left: "Summer Vibe", right: "Winter Vibe" },
  { left: "Sci-Fi Fan", right: "Fantasy Fan" },
  // Controversial / debate-worthy
  { left: "Smart", right: "Clueless" },
  { left: "Mature", right: "Childish" },
  { left: "Work Hard", right: "Play Hard" },
  { left: "Messy", right: "Neat" },
  { left: "Grounded", right: "Unhinged" },
  { left: "Physically Demanding", right: "Mentally Demanding" },
  { left: "Lucky", right: "Unlucky" },
  { left: "Genius", right: "Average" },
  { left: "Uplifting", right: "Soul-Crushing" },
];

export default function WaveGame() {
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team One", score: 0 },
    { id: "2", name: "Team Two", score: 0 }
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  
  const [currentPair, setCurrentPair] = useState<WordPair>(WORD_PAIRS[0]);
  const [targetRotation, setTargetRotation] = useState(0); // -80 to +80
  
  const [roundScore, setRoundScore] = useState(0);

  const dialRotation = useMotionValue(0);
  const dialRef = useRef<HTMLDivElement>(null);

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
    dialRotation.set(0);
    setGameState("CLUE_GIVER");
  };

  const respin = () => {
    const angle = (Math.random() * 160) - 80;
    setTargetRotation(angle);
    setRoundScore(0);
    dialRotation.set(0);
  };

  const skip = () => {
    const pair = getRandomPair(currentPair);
    const angle = (Math.random() * 160) - 80;
    setCurrentPair(pair);
    setTargetRotation(angle);
    setRoundScore(0);
    dialRotation.set(0);
  };

  const calculateScore = (guess: number, target: number) => {
    const diff = Math.abs(guess - target);
    if (diff <= 6) return 4;
    if (diff <= 14) return 3;
    if (diff <= 22) return 2;
    return 0;
  };

  const lockGuess = () => {
    const guess = dialRotation.get();
    const score = calculateScore(guess, targetRotation);
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameState !== "TEAM_GUESSES") return;
    
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom; 
    
    const updateAngle = (clientX: number, clientY: number) => {
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      angle = angle + 90; 
      
      if (angle < -85) angle = -85;
      if (angle > 85) angle = 85;
      
      dialRotation.set(angle);
    };
    
    updateAngle(e.clientX, e.clientY);
    
    const handleMove = (moveEvent: PointerEvent) => {
      updateAngle(moveEvent.clientX, moveEvent.clientY);
    };
    
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const puckTransform = useTransform(dialRotation, (v) => `rotate(${v}deg)`);

  const clayButtonClass = "px-6 py-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_16px_rgba(0,0,0,0.04),inset_0_4px_8px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.04)] border border-white/90 font-bold text-[#475569] active:scale-95 transition-transform select-none";
  const primaryButtonClass = "px-8 py-5 bg-gradient-to-b from-[#C4B5FD] to-[#A78BFA] rounded-2xl shadow-[0_12px_24px_rgba(167,139,250,0.3),inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.1)] border border-white/50 font-black text-white active:scale-95 transition-transform select-none text-lg tracking-wide";
  const secondaryButtonClass = "px-8 py-5 bg-gradient-to-b from-[#A7F3D0] to-[#5EEAD4] rounded-2xl shadow-[0_12px_24px_rgba(167,243,208,0.3),inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.1)] border border-white/50 font-black text-[#0F766E] active:scale-95 transition-transform select-none text-lg tracking-wide";
  const glassCardClass = "bg-white/60 backdrop-blur-2xl rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white/80 p-6";

  const createArc = (radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(100, 100, radius, endAngle);
    const end = polarToCartesian(100, 100, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", 100, 100,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col text-[#334155] selection:bg-[#C4B5FD]/30 relative pb-safe" style={{ fontFamily: "'Nunito', system-ui, sans-serif", background: '#FAFAFA' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        html, body { background: #FAFAFA !important; }
      `}} />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#A7F3D0]/50 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#C4B5FD]/40 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#FED7AA]/40 blur-[70px] pointer-events-none" />

      <header className="relative z-10 w-full p-4 sm:p-8 flex flex-wrap justify-center sm:justify-between items-center max-w-5xl mx-auto gap-4">
        <div className="flex gap-4 sm:gap-8 order-2 sm:order-1 flex-1 justify-center sm:justify-start">
          {teams.map((t, idx) => (
            <div key={t.id} className={`flex flex-col items-center p-3 rounded-2xl transition-colors ${currentTeamIdx === idx ? 'bg-white/80 shadow-sm border border-white/50' : 'opacity-60'}`}>
              <div 
                className="text-xs sm:text-sm font-bold tracking-widest uppercase bg-transparent text-center outline-none w-24 sm:w-32 focus:border-b-2 border-[#C4B5FD] cursor-pointer"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateTeamName(t.id, e.currentTarget.textContent || t.name)}
              >
                {t.name}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#475569] tracking-tighter mt-1">
                {t.score}
              </div>
            </div>
          ))}
        </div>
        
        {gameState === "SETUP" && (
          <motion.button whileTap={{ scale: 0.96 }} onClick={addTeam} className="order-3 sm:order-2 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[#475569] font-bold shadow-sm hover:bg-white transition-colors">
            +
          </motion.button>
        )}
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-end sm:justify-center pb-8 w-full max-w-4xl mx-auto px-4">
        
        <AnimatePresence mode="wait">
          {gameState === "SETUP" && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col items-center gap-8 text-center ${glassCardClass} w-full max-w-md my-auto`}
            >
              <div className="space-y-2">
                <span className="inline-block px-4 py-1.5 bg-[#C4B5FD]/20 text-[#A78BFA] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                  Next Round
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#334155]">{currentTeam.name}</h2>
                <p className="text-[#64748B] font-medium text-sm sm:text-base px-4">
                  One player sees the target and gives a single verbal clue. The rest guess.
                </p>
              </div>
              
              <motion.button whileTap={{ scale: 0.96 }} onClick={startRound} className={primaryButtonClass + " w-full"}>
                Begin Round
              </motion.button>
            </motion.div>
          )}

          {gameState !== "SETUP" && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center justify-end flex-1 max-h-[800px]"
            >
              
              <div className="flex justify-between items-end w-full px-2 sm:px-12 mb-6 sm:mb-12 relative z-10">
                <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-sm border border-white font-black text-lg sm:text-3xl text-[#F87171] transform -rotate-2">
                  {currentPair.left}
                </div>
                <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-sm border border-white font-black text-lg sm:text-3xl text-[#6EE7B7] transform rotate-2">
                  {currentPair.right}
                </div>
              </div>

              <div 
                ref={dialRef}
                onPointerDown={handlePointerDown}
                className="relative w-full aspect-[2/1] bg-white/40 backdrop-blur-xl rounded-t-[1000px] shadow-[0_-8px_32px_rgba(0,0,0,0.03),inset_0_4px_12px_rgba(255,255,255,0.8)] border-t border-x border-white overflow-hidden flex items-end justify-center touch-none select-none"
              >
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FCA5A5" />
                      <stop offset="50%" stopColor="#C4B5FD" />
                      <stop offset="100%" stopColor="#A7F3D0" />
                    </linearGradient>
                  </defs>
                  <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="url(#arcGrad)" strokeWidth="3" opacity="0.25" strokeLinecap="round" />
                </svg>

                <motion.div 
                  className="absolute inset-0 origin-bottom pointer-events-none"
                  initial={false}
                  animate={{ rotate: targetRotation }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                  <AnimatePresence>
                    {(gameState === "CLUE_GIVER" || gameState === "REVEAL") && (
                      <motion.svg 
                        className="absolute inset-0 w-full h-full" 
                        viewBox="0 0 200 100" 
                        preserveAspectRatio="none"
                      >
                        <motion.path 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.6, scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          d={createArc(100, -22, 22)} fill="#BAE6FD" 
                        />
                        <motion.path 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.8, scale: 1 }}
                          transition={{ delay: 0.1, type: "spring" }}
                          d={createArc(100, -14, 14)} fill="#A7F3D0" 
                        />
                        <motion.path 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0, type: "spring" }}
                          d={createArc(100, -6, 6)} fill="#C4B5FD" 
                        />
                        <line x1="100" y1="100" x2="100" y2="0" stroke="#fff" strokeWidth="1" opacity="0.8" strokeLinecap="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {(gameState === "TEAM_GUESSES") && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 bg-white/70 backdrop-blur-md rounded-t-[1000px] pointer-events-none flex items-center justify-center"
                    >
                      <span className="text-[#94A3B8] font-bold tracking-widest text-sm uppercase mb-10">Target Hidden</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[14px] sm:w-[20px] h-[95%] origin-bottom z-30 pointer-events-none"
                  style={{ transform: puckTransform }}
                >
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1.5 h-full bg-[#CBD5E1] rounded-t-full shadow-inner opacity-60" />
                  
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[48px] h-[48px] bg-gradient-to-b from-white to-[#F1F5F9] rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_4px_8px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.05)] border border-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#A78BFA] shadow-inner" />
                  </div>
                </motion.div>

                <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-b from-white to-[#F8FAFC] rounded-full shadow-[0_-4px_16px_rgba(0,0,0,0.05),inset_0_4px_8px_rgba(255,255,255,1)] border border-white z-40 flex items-center justify-center">
                   <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#F1F5F9] shadow-inner border border-white/50" />
                </div>
              </div>

              <div className="h-40 sm:h-48 mt-8 flex flex-col items-center justify-start w-full relative z-50 px-4">
                <AnimatePresence mode="wait">
                  
                  {gameState === "CLUE_GIVER" && (
                    <motion.div key="clue-giver" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-4 w-full max-w-sm">
                      <p className="text-[#64748B] font-bold text-sm">Give your team one verbal clue.</p>
                      <motion.button whileTap={{ scale: 0.96 }} onClick={() => setGameState("TEAM_GUESSES")} className={primaryButtonClass + " w-full"}>
                        Hide for Guessers
                      </motion.button>
                      <div className="flex gap-3 w-full">
                        <motion.button whileTap={{ scale: 0.96 }} onClick={respin} className={clayButtonClass + " flex-1 text-sm"}>
                          Respin
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={skip} className={clayButtonClass + " flex-1 text-sm"}>
                          Skip
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {gameState === "TEAM_GUESSES" && (
                    <motion.div key="guess" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-4 w-full max-w-sm">
                      <p className="text-[#A78BFA] font-bold text-sm animate-pulse">Drag the puck to guess.</p>
                      <motion.button whileTap={{ scale: 0.96 }} onClick={lockGuess} className={secondaryButtonClass + " w-full"}>
                        Reveal
                      </motion.button>
                    </motion.div>
                  )}

                  {gameState === "REVEAL" && (
                    <motion.div key="reveal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-4 w-full max-w-md">
                      <div className="flex gap-3 sm:gap-6 items-center justify-center w-full bg-white/60 backdrop-blur-xl px-4 py-3 sm:py-4 rounded-2xl shadow-sm border border-white">
                        <div className="flex flex-col items-center text-center">
                          <span className="text-[10px] sm:text-xs text-[#94A3B8] uppercase font-bold tracking-widest">{currentTeam.name}</span>
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                            className="text-2xl sm:text-3xl font-black text-[#C4B5FD]"
                          >
                            {roundScore > 0 ? `+${roundScore}` : "Miss"}
                          </motion.span>
                        </div>
                      </div>
                      <motion.button whileTap={{ scale: 0.96 }} onClick={nextRound} className={primaryButtonClass + " w-full max-w-sm"}>
                        Next Round
                      </motion.button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}