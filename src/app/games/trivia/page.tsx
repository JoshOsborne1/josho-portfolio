"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CompletedReplay } from "../components/CompletedReplay";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";
import Timer from "../components/Timer";

const QUESTIONS = [
  { q:"What planet is closest to the Sun?", opts:["Mercury","Venus","Mars","Earth"], a:0, cat:"Science" },
  { q:"What is the chemical symbol for Gold?", opts:["Go","Au","Ag","Gd"], a:1, cat:"Science" },
  { q:"How many bones are in the human body?", opts:["196","206","216","186"], a:1, cat:"Science" },
  { q:"What gas do plants absorb from the air?", opts:["Oxygen","Hydrogen","Carbon Dioxide","Nitrogen"], a:2, cat:"Science" },
  { q:"What is the speed of light (km/s)?", opts:["200,000","300,000","400,000","150,000"], a:1, cat:"Science" },
  { q:"In what year did World War II end?", opts:["1943","1944","1945","1946"], a:2, cat:"History" },
  { q:"Who was the first US President?", opts:["Thomas Jefferson","John Adams","Benjamin Franklin","George Washington"], a:3, cat:"History" },
  { q:"What ancient wonder was located in Alexandria?", opts:["Colossus","Lighthouse","Hanging Gardens","Pyramids"], a:1, cat:"History" },
  { q:"In what year did the Berlin Wall fall?", opts:["1987","1988","1989","1990"], a:2, cat:"History" },
  { q:"Who painted the Mona Lisa?", opts:["Michelangelo","Raphael","Leonardo da Vinci","Botticelli"], a:2, cat:"History" },
  { q:"What is the capital of Australia?", opts:["Sydney","Melbourne","Brisbane","Canberra"], a:3, cat:"Geography" },
  { q:"Which is the longest river in the world?", opts:["Amazon","Nile","Yangtze","Mississippi"], a:1, cat:"Geography" },
  { q:"How many countries are in Africa?", opts:["44","54","64","48"], a:1, cat:"Geography" },
  { q:"What is the smallest country in the world?", opts:["Monaco","San Marino","Vatican City","Liechtenstein"], a:2, cat:"Geography" },
  { q:"Which ocean is the largest?", opts:["Atlantic","Indian","Arctic","Pacific"], a:3, cat:"Geography" },
  { q:"How many players are on a football (soccer) team?", opts:["10","11","12","9"], a:1, cat:"Sport" },
  { q:"In which sport do you use a shuttlecock?", opts:["Squash","Badminton","Tennis","Pickleball"], a:1, cat:"Sport" },
  { q:"How many Grand Slam tennis tournaments are there?", opts:["3","4","5","2"], a:1, cat:"Sport" },
  { q:"What country invented the Olympic Games?", opts:["Italy","Greece","Rome","Egypt"], a:1, cat:"Sport" },
  { q:"How long is a marathon in km?", opts:["40","41","42.195","43"], a:2, cat:"Sport" },
  { q:"Who sings 'Shape of You'?", opts:["Justin Bieber","Shawn Mendes","Ed Sheeran","Charlie Puth"], a:2, cat:"Pop Culture" },
  { q:"What movie features the line 'I'll be back'?", opts:["RoboCop","The Terminator","Die Hard","Predator"], a:1, cat:"Pop Culture" },
  { q:"Which TV show features the Iron Throne?", opts:["Vikings","The Witcher","Game of Thrones","The Last Kingdom"], a:2, cat:"Pop Culture" },
  { q:"What is the best-selling video game of all time?", opts:["Tetris","Minecraft","GTA V","Wii Sports"], a:1, cat:"Pop Culture" },
  { q:"What year was the first iPhone released?", opts:["2005","2006","2007","2008"], a:2, cat:"Pop Culture" },
  { q:"What does CPU stand for?", opts:["Central Processing Unit","Computer Processing Unit","Central Program Unit","Core Processing Unit"], a:0, cat:"Tech" },
  { q:"What programming language is known for 'Hello World' being simple?", opts:["C++","Java","Python","Assembly"], a:2, cat:"Tech" },
  { q:"What does HTML stand for?", opts:["Hyper Text Markup Language","High Transfer Markup Language","Hyper Transfer Meta Language","High Text Markup Link"], a:0, cat:"Tech" },
  { q:"Who co-founded Apple with Steve Jobs?", opts:["Bill Gates","Steve Wozniak","Linus Torvalds","Paul Allen"], a:1, cat:"Tech" },
  { q:"What is the most popular programming language in 2024?", opts:["Java","C++","JavaScript","Python"], a:3, cat:"Tech" },
  { q:"What is the powerhouse of the cell?", opts:["Nucleus","Ribosome","Mitochondria","Golgi Body"], a:2, cat:"Science" },
  { q:"How many moons does Mars have?", opts:["0","1","2","3"], a:2, cat:"Science" },
  { q:"What is the atomic number of Carbon?", opts:["6","8","12","14"], a:0, cat:"Science" },
  { q:"Which element has the symbol 'Fe'?", opts:["Fluorine","Iron","Francium","Fermium"], a:1, cat:"Science" },
  { q:"How many continents are there?", opts:["5","6","7","8"], a:2, cat:"Geography" },
  { q:"What is the capital of Japan?", opts:["Osaka","Kyoto","Tokyo","Hiroshima"], a:2, cat:"Geography" },
  { q:"In basketball, how many points is a free throw?", opts:["1","2","3","4"], a:0, cat:"Sport" },
  { q:"Who wrote Romeo and Juliet?", opts:["Charles Dickens","William Shakespeare","Jane Austen","Oscar Wilde"], a:1, cat:"Pop Culture" },
  { q:"What does AI stand for?", opts:["Automated Intelligence","Artificial Intelligence","Advanced Intelligence","Assisted Intelligence"], a:1, cat:"Tech" },
  { q:"In what year was Google founded?", opts:["1996","1997","1998","1999"], a:2, cat:"Tech" },
  { q:"Which planet has rings?", opts:["Jupiter only","Saturn only","Saturn and Jupiter","Saturn, Jupiter, Uranus, Neptune"], a:3, cat:"Science" },
  { q:"What is the hardest natural substance?", opts:["Quartz","Titanium","Diamond","Granite"], a:2, cat:"Science" },
  { q:"Who was the first woman to win a Nobel Prize?", opts:["Rosalind Franklin","Dorothy Hodgkin","Marie Curie","Lise Meitner"], a:2, cat:"History" },
  { q:"What language has the most native speakers?", opts:["English","Spanish","Hindi","Mandarin Chinese"], a:3, cat:"Geography" },
  { q:"How many strings does a standard guitar have?", opts:["4","5","6","7"], a:2, cat:"Pop Culture" },
  { q:"What does HTTP stand for?", opts:["Hyper Text Transfer Protocol","High Transfer Text Protocol","Hyper Transfer Text Program","Host Transfer Protocol"], a:0, cat:"Tech" },
  { q:"Who invented the telephone?", opts:["Nikola Tesla","Thomas Edison","Alexander Graham Bell","Guglielmo Marconi"], a:2, cat:"History" },
  { q:"What is the chemical formula for water?", opts:["HO","H2O","H3O","H2O2"], a:1, cat:"Science" },
  { q:"How many seconds are in a minute?", opts:["50","60","100","120"], a:1, cat:"Science" },
  { q:"What is the tallest mountain in the world?", opts:["K2","Kangchenjunga","Mount Everest","Lhotse"], a:2, cat:"Geography" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TriviaGame() {
  const { canPlay, markPlayed, hoursUntilReset, completionEntry } = useDaily('trivia');
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  if (!canPlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>
        <div className="font-black text-5xl" style={{ color:"#A78BFA" }}>Come back soon</div>
        <div className="font-bold text-sm text-center" style={{ color:"#94a3b8" }}>You&apos;ve already played today.<br/>Resets in {hoursUntilReset}h</div>
        <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color:"#A78BFA" }}>Back to games</Link>
      </div>
    );
  }

  const [questions, setQuestions] = useState(() => shuffle(QUESTIONS).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<"playing" | "answered" | "done">("playing");
  const [results, setResults] = useState<{ correct: boolean; time: number }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQuestion = useCallback(() => {
    if (current + 1 >= questions.length) {
      setGameState("done");
      markPlayed({ score, streak });
      return;
    }
    setCurrent(c => c + 1);
    setSelected(null);
    setTimeLeft(15);
    setGameState("playing");
  }, [current, questions.length]);

  const handleAnswer = useCallback((optIdx: number) => {
    if (gameState !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(optIdx);
    setGameState("answered");
    const q = questions[current];
    const isCorrect = optIdx === q.a;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    const multiplier = newStreak >= 3 ? 2 : 1;
    if (isCorrect) setScore(s => s + 100 * multiplier);
    setResults(r => [...r, { correct: isCorrect, time: 15 - timeLeft }]);
    setTimeout(nextQuestion, 1200);
  }, [gameState, questions, current, streak, timeLeft, nextQuestion]);

  useEffect(() => {
    if (gameState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleAnswer(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, gameState, handleAnswer]);

  const resetGame = () => {
    setQuestions(shuffle(QUESTIONS).slice(0, 10));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setGameState("playing");
    setResults([]);
  };

  const q = questions[current];

  if (gameState === "done") {
    const correct = results.filter(r => r.correct).length;
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)" }}>


        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm flex flex-col gap-5 p-8 rounded-[32px]" style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(24px)", boxShadow:"0 24px 60px rgba(167,139,250,0.15)", border:"1px solid rgba(255,255,255,0.9)" }}>
          <Link href="/games" className="no-underline font-bold text-sm" style={{ color:"#A78BFA" }}>Back to games</Link>
          <div className="font-black text-3xl" style={{ color:"#1e1b4b" }}>Results</div>
          <div className="flex gap-4">
            <div className="flex-1 p-4 rounded-2xl text-center" style={{ background:"rgba(167,139,250,0.1)" }}>
              <div className="font-black text-3xl" style={{ color:"#7c3aed" }}>{score}</div>
              <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Points</div>
            </div>
            <div className="flex-1 p-4 rounded-2xl text-center" style={{ background:"rgba(94,234,212,0.1)" }}>
              <div className="font-black text-3xl" style={{ color:"#0F766E" }}>{correct}/10</div>
              <div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Correct</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: r.correct ? "rgba(94,234,212,0.1)" : "rgba(239,68,68,0.07)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-black text-xs" style={{ background: r.correct ? "#5EEAD4" : "#fca5a5", color: r.correct ? "#0F766E" : "#ef4444" }}>{r.correct ? "+" : "-"}</div>
                <span className="font-bold text-sm" style={{ color:"#1e1b4b" }}>Q{i+1}: {questions[i].q.slice(0,30)}...</span>
              </div>
            ))}
          </div>
          <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 8px 20px rgba(167,139,250,0.3)" }}>Play Again</motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Trivia</span>
        <div className="flex items-center gap-2">
          <span className="font-black text-base" style={{ color:"#7c3aed" }}>{score}</span>
          {streak >= 3 && <span className="font-bold text-xs px-2 py-0.5 rounded-lg" style={{ background:"rgba(167,139,250,0.15)", color:"#7c3aed" }}>2x</span>}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 max-w-lg mx-auto w-full">
        {/* Progress */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:"rgba(167,139,250,0.15)" }}>
            <motion.div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#C4B5FD,#A78BFA)", width:`${((current)/10)*100}%` }} />
          </div>
          <span className="font-bold text-sm" style={{ color:"#94a3b8" }}>{current+1}/10</span>
          <Timer timeLeft={timeLeft} maxTime={15} size={56} />
        </div>

        {/* Category */}
        <div className="w-full">
          <span className="font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-xl" style={{ background:"rgba(167,139,250,0.1)", color:"#7c3aed" }}>{q.cat}</span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} className="w-full p-6 rounded-[28px]" style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.8)", boxShadow:"0 12px 32px rgba(0,0,0,0.05)" }}>
            <p className="font-black text-lg leading-snug" style={{ color:"#1e1b4b" }}>{q.q}</p>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="w-full grid grid-cols-1 gap-3">
          {q.opts.map((opt, i) => {
            const isCorrect = i === q.a;
            const isSelected = i === selected;
            const revealed = gameState === "answered";
            let bg = "rgba(255,255,255,0.7)";
            let border = "1px solid rgba(255,255,255,0.8)";
            let color = "#1e1b4b";
            if (revealed && isCorrect) { bg = "rgba(94,234,212,0.25)"; border = "1px solid #5EEAD4"; color = "#0F766E"; }
            else if (revealed && isSelected && !isCorrect) { bg = "rgba(239,68,68,0.1)"; border = "1px solid rgba(239,68,68,0.3)"; color = "#ef4444"; }
            return (
              <motion.button key={i} onClick={() => handleAnswer(i)} whileTap={!revealed ? { scale:0.97 } : {}} disabled={revealed} className="w-full px-5 py-4 rounded-2xl font-bold text-left text-sm active:scale-95" style={{ background:bg, border, color, backdropFilter:"blur(12px)", boxShadow:"0 4px 12px rgba(0,0,0,0.04)", cursor: revealed ? "default" : "pointer" }}>
                <span className="font-black mr-3 px-2 py-0.5 rounded-lg text-xs" style={{ background:"rgba(167,139,250,0.12)", color:"#7c3aed" }}>{String.fromCharCode(65+i)}</span>
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
