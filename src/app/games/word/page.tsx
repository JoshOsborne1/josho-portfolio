"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";

// 2000-word list (5-letter words)
const WORDS = [
  "about","above","abuse","actor","acute","admit","adopt","adult","after","again",
  "agent","agree","ahead","alarm","album","alert","alien","align","alike","alive",
  "alley","allow","alone","along","aloud","alpha","altar","alter","angel","angle",
  "angry","anime","ankle","annoy","antic","anvil","apart","apple","apply","arena",
  "argue","arise","armor","array","arose","arrow","arson","aside","asset","atlas",
  "attic","audio","audit","avoid","awake","award","aware","awful","badly","baker",
  "basic","basis","batch","beach","began","begin","being","below","bench","billy",
  "black","blade","blame","bland","blank","blast","blaze","bleed","blend","bless",
  "block","blood","blown","blues","board","bonus","booze","botch","bound","brace",
  "braid","brain","brand","brave","break","breed","brick","bride","brief","bring",
  "brink","broad","broke","brook","brown","brush","buddy","build","built","bulge",
  "bunch","burst","buyer","cabin","camel","candy","cargo","carry","cause","cedar",
  "chain","chair","chaos","charm","chart","chase","cheap","check","cheek","chess",
  "chest","chief","child","chill","china","civic","civil","claim","clash","class",
  "clean","clear","clerk","click","cliff","climb","cling","clock","clone","close",
  "cloud","clown","coach","coast","cocoa","comet","comma","comic","coral","count",
  "court","cover","crack","craft","crash","crazy","cream","creek","creep","crest",
  "crime","crisp","cross","crowd","crown","cruel","crush","curve","cycle","daily",
  "dance","debug","decor","delta","demon","depth","derby","dirty","disco","dodge",
  "doing","doubt","dough","draft","drain","drama","drank","drawl","drawn","dream",
  "drive","drone","drove","druid","drunk","dying","eagle","early","earth","eight",
  "elite","email","empty","enemy","enjoy","enter","entry","equal","error","essay",
  "event","every","exact","exile","exist","extra","fable","facet","fairy","faith",
  "false","fancy","fatal","feast","fence","fever","field","fifth","fifty","fight",
  "final","first","fixed","flame","flash","fleet","flesh","float","flood","floor",
  "floss","flour","fluid","flute","focal","focus","force","forge","forth","found",
  "frame","frank","freak","fresh","front","frost","froze","fruit","fungi","funny",
  "gamer","gavel","giant","given","gland","glass","glide","gloom","glory","glove",
  "going","grace","grade","grand","grant","grape","grasp","grass","grave","great",
  "greed","green","greet","grief","grime","grind","grip","groan","groin","gross",
  "group","grove","grown","guard","guest","guide","guild","guile","guilt","gusto",
  "habit","happy","harsh","heart","heavy","hello","hence","herbs","hoist","holly",
  "honor","horse","hotel","hound","house","hover","human","humor","hurry","hydro",
  "ideal","image","imply","infer","inner","input","irony","issue","ivory","jewel",
  "joint","joker","judge","juice","juicy","jumbo","karma","kingx","knife","knock",
  "knowledge","label","large","laser","later","laugh","layer","learn","lease",
  "least","leave","ledge","lemon","level","light","limit","linen","liner","local",
  "lodge","logic","loose","lover","lucky","lunar","lying","magic","maker","manor",
  "maple","march","marsh","match","mayor","media","merit","metal","mimic","minor",
  "minus","mirth","model","money","month","moral","morse","mount","mouse","mouth",
  "movie","muddy","music","naive","never","night","ninja","noble","noise","noted",
  "novel","nurse","oasis","occur","ocean","offer","often","onion","onset","orbit",
  "order","other","ought","outer","ozone","paint","panel","panic","paper","party",
  "pasta","paste","patch","pause","peace","penny","petty","phone","photo","piano",
  "piece","pitch","pixel","place","plain","plank","plane","plant","plate","plaza",
  "plead","pluck","poker","polar","polyp","pound","power","press","price","pride",
  "prime","print","prior","prize","probe","proof","prose","prove","prowl","prune",
  "psalm","pupil","purge","queen","query","queue","quiet","quota","quote","radar",
  "radio","raise","rally","ranch","range","rapid","ratio","reach","ready","realm",
  "rebel","refer","reign","relax","remix","reply","repay","repel","reset","rider",
  "ridge","rifle","right","rigid","risky","rival","river","robot","rocky","rouge",
  "rough","round","route","royal","ruler","rural","salad","sauce","scale","scare",
  "scene","score","scrap","screw","sense","serve","setup","seven","shade","shake",
  "shall","shame","shape","share","shark","sharp","shelf","shell","shift","shine",
  "shirt","shock","shoot","shore","short","shout","sight","since","sixty","skill",
  "skull","slack","slash","slave","sleep","slick","slide","slope","smart","smell",
  "smile","smoke","snake","solar","solid","solve","sorry","sound","south","space",
  "spare","spark","speak","spear","speed","spend","spill","spine","spite","split",
  "spoke","spore","sport","spray","squad","stack","staff","stage","stake","stale",
  "stall","stamp","stand","stare","start","state","stays","steam","steel","steep",
  "steer","stern","still","stock","stone","stood","storm","stove","strap","straw",
  "stray","strip","strive","study","stuff","style","sugar","suite","surge","swamp",
  "swear","sweep","sweet","swept","swift","swing","swipe","sword","swore","sworn",
  "syrup","table","tango","taste","teach","teeth","tempo","tense","terms","tesla",
  "thank","their","theme","there","these","thick","think","third","those","three",
  "threw","throw","thumb","tiger","tight","timer","tired","title","today","token",
  "total","touch","tough","towel","tower","track","trade","trail","train","trait",
  "trash","treat","trend","trial","tribe","trick","tried","troop","trove","truck",
  "truly","trust","truth","tumor","twist","tying","ultra","under","unify","union",
  "until","upper","upset","urban","usher","usual","utter","valid","value","valve",
  "vapor","vault","venue","verse","video","vigor","viral","virus","visit","vista",
  "vital","vivid","vocal","vodka","voice","voter","vowed","vague","wafer","waste",
  "watch","water","weary","weave","wedge","weigh","weird","while","white","whole",
  "whose","wield","witch","witty","women","world","worry","worse","worst","worth",
  "would","wreck","write","wrote","yacht","yield","young","yours","youth","zebra",
  "zonal","adept","allot","amber","amend","ample","angel","annex","armor","atone",
  "augur","azure","baste","bathe","baton","berry","biome","birch","blown","blunt",
  "bogus","bolts","bonus","borax","bored","boron","brood","burly","cacao","cadet",
  "camel","cameo","caste","chant","chard","cheep","cited","civic","clone","coded",
  "comet","corny","coupe","covet","crown","crumb","crust","cubic","curry","cutie",
  "daunt","dated","decay","decry","decal","depot","derby","disco","discs","ditty",
  "divvy","dobby","dodgy","dolly","donor","dowry","drake","drawl","dread","drove",
  "dryer","dunce","duvet","elder","ember","emote","erase","ethic","ethos","evade",
  "exert","faint","farce","fauna","feral","finch","flank","flare","flirt","flop",
  "floss","foamy","foray","frail","franc","fraud","frond","froth","furry","gamer",
  "gauze","gecko","geeky","getup","glint","gloat","globe","gloss","gnome","grill",
  "grime","gripe","groan","grump","guava","guile","guise","gulch","gusto","gyrate",
  "haiku","harsh","haste","haven","hazel","heist","herbs","heron","hilly","hoary",
  "hobby","holly","homer","honda","horny","husky","haste","hutch","icing","idiom",
  "igloo","inept","inlay","inset","ionic","irate","ivory","jaunt","jazzy","jello",
  "jelly","jerky","jilts","jiffy","joust","juror","karma","kayak","knack","kneel",
  "knelt","knoll","knots","kudos","lance","lapel","lapse","latch","lathe","latte",
  "leafy","leapt","lingo","listy","lofty","loopy","lorry","lousy","lucid","lusty",
  "macro","magma","maxim","mealy","melee","mercy","messy","milky","mimic","mince",
  "minty","mirth","mocha","moldy","mommy","motto","muddy","murky","musty","myrrh",
  "natch","natty","needy","nervy","night","nippy","nitty","nutty","nymph","oaken",
  "oafish","ochre","oddly","onward","optic","orate","ovary","ovoid","oxide","paced",
  "paddy","pansy","parry","patch","pawns","preen","prose","proxy","rabid","racer",
  "regal","revel","ripen","rivet","rodeo","rouge","rouse","ruddy","rugby","rumba",
  "saber","sandy","satyr","savvy","scald","scalp","schmo","scone","scope","scout",
  "sedan","seize","serum","siege","simmer","siren","sixth","sixty","skunk","sleek",
  "sleet","slime","slink","snack","snaky","sneer","snide","sniff","snore","snowy",
  "snuck","soggy","spate","speck","spicy","spied","spiky","spiny","spoil","spook",
  "spree","sprig","spunk","spurn","squat","squib","staid","stomp","sting","stoic",
  "stoke","stomp","strut","stunt","suave","sulky","sultry","sumac","sushi","swipe",
  "tacky","talon","tangy","tardy","tawny","teary","terse","testy","timid","tippy",
  "toady","tonic","totem","touchy","toxic","trait","tramp","tryst","tubby","tulip",
  "tummy","tuner","tweak","twice","twirl","twixt","typic","uncut","undue","upset",
  "usury","viper","visor","vouch","waist","waltz","wrath","yearn","yucky","zesty",
].filter(w => w.length === 5).slice(0, 2000);

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","DEL"],
];

type LetterState = "correct" | "present" | "absent" | "empty" | "active";

interface Cell {
  letter: string;
  state: LetterState;
}

function getRandomWord() {
  const pool = WORDS.filter(w => w.length === 5);
  return pool[Math.floor(Math.random() * pool.length)].toUpperCase();
}

function scoreGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("absent");
  const remaining = target.split("");
  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      remaining[i] = "";
    }
  }
  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = "";
    }
  }
  return result;
}

const STATE_COLORS: Record<LetterState, { bg: string; text: string }> = {
  correct: { bg: "#5EEAD4", text: "#0F766E" },
  present: { bg: "#A78BFA", text: "#fff" },
  absent: { bg: "rgba(100,116,139,0.15)", text: "#475569" },
  empty: { bg: "rgba(255,255,255,0.6)", text: "#1e1b4b" },
  active: { bg: "rgba(255,255,255,0.9)", text: "#1e1b4b" },
};

export default function WordGame() {
  const { canPlay, markPlayed, hoursUntilReset } = useDaily('word');
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  const [target, setTarget] = useState<string>(() => getRandomWord());
  const [guesses, setGuesses] = useState<Cell[][]>(
    Array(6).fill(null).map(() => Array(5).fill({ letter: "", state: "empty" as LetterState }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
  const [streak, setStreak] = useState(() => {
    if (typeof window !== "undefined") return parseInt(localStorage.getItem("word-streak") || "0");
    return 0;
  });
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const addLetter = useCallback((letter: string) => {
    if (gameState !== "playing" || currentCol >= 5) return;
    markPlayed();
    playTap(); vibrate([10]);
    setGuesses(prev => {
      const next = prev.map(r => [...r]);
      next[currentRow][currentCol] = { letter, state: "active" };
      return next;
    });
    setCurrentCol(c => c + 1);
  }, [gameState, currentRow, currentCol]);

  const deleteLetter = useCallback(() => {
    if (currentCol <= 0) return;
    setGuesses(prev => {
      const next = prev.map(r => [...r]);
      next[currentRow][currentCol - 1] = { letter: "", state: "empty" };
      return next;
    });
    setCurrentCol(c => c - 1);
  }, [currentRow, currentCol]);

  const submitGuess = useCallback(() => {
    if (currentCol < 5) {
      setMessage("Not enough letters");
      setShakeRow(currentRow);
      playError(); vibrate([50]);
      setTimeout(() => { setShakeRow(null); setMessage(""); }, 600);
      return;
    }
    const guess = guesses[currentRow].map(c => c.letter).join("");
    if (!WORDS.map(w => w.toUpperCase()).includes(guess) && !WORDS.includes(guess.toLowerCase())) {
      setMessage("Not in word list");
      setShakeRow(currentRow);
      playError(); vibrate([50]);
      setTimeout(() => { setShakeRow(null); setMessage(""); }, 600);
      return;
    }
    const states = scoreGuess(guess, target);
    const newGuesses = guesses.map((r, ri) => {
      if (ri !== currentRow) return r;
      return r.map((cell, ci) => ({ ...cell, state: states[ci] }));
    });
    setGuesses(newGuesses);

    // Update key states
    const newKeyStates = { ...keyStates };
    for (let i = 0; i < 5; i++) {
      const key = guess[i];
      const existing = newKeyStates[key];
      const newState = states[i];
      if (!existing || newState === "correct" || (newState === "present" && existing === "absent")) {
        newKeyStates[key] = newState;
      }
    }
    setKeyStates(newKeyStates);

    if (guess === target) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (typeof window !== "undefined") localStorage.setItem("word-streak", String(newStreak));
      setGameState("won");
      setMessage("Brilliant!");
      playWin(); vibrate([50,30,50,30,100]);
    } else if (currentRow >= 5) {
      setStreak(0);
      if (typeof window !== "undefined") localStorage.setItem("word-streak", "0");
      setGameState("lost");
      setMessage(target);
      playError(); vibrate([100]);
    } else {
      playSuccess(); vibrate([20,10,20]);
      setCurrentRow(r => r + 1);
      setCurrentCol(0);
    }
  }, [currentCol, currentRow, guesses, target, keyStates, streak]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") submitGuess();
      else if (e.key === "Backspace") deleteLetter();
      else if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitGuess, deleteLetter, addLetter]);

  const resetGame = () => {
    setTarget(getRandomWord());
    setGuesses(Array(6).fill(null).map(() => Array(5).fill({ letter: "", state: "empty" as LetterState })));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameState("playing");
    setKeyStates({});
    setMessage("");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {!canPlay && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
          <div className="font-black text-5xl" style={{ color:"#A78BFA" }}>Come back soon</div>
          <div className="font-bold text-sm text-center" style={{ color:"#94a3b8" }}>You&apos;ve already played today.<br/>Resets in {hoursUntilReset}h</div>
          <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color:"#A78BFA" }}>Back to games</Link>
        </div>
      )}
      {canPlay && (<>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl text-sm" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",boxShadow:"0 4px 12px rgba(167,139,250,0.4)" }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Word Guess</span>
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.2)" }}>
          <span className="font-bold text-xs" style={{ color:"#7c3aed" }}>{streak} streak</span>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity:0, y:-8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            className="text-center py-2 font-black text-sm"
            style={{ color:"#7c3aed" }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4">
        <div className="flex flex-col gap-2">
          {guesses.map((row, ri) => (
            <motion.div
              key={ri}
              className="flex gap-2"
              animate={shakeRow === ri ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {row.map((cell, ci) => (
                <motion.div
                  key={ci}
                  className="w-14 h-14 flex items-center justify-center font-black text-xl rounded-2xl"
                  style={{
                    background: STATE_COLORS[cell.state].bg,
                    color: STATE_COLORS[cell.state].text,
                    border: `2px solid ${cell.letter ? "rgba(167,139,250,0.3)" : "rgba(167,139,250,0.1)"}`,
                    boxShadow: cell.state !== "empty" && cell.state !== "active"
                      ? "0 4px 12px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.5)"
                      : "inset 0 4px 8px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  animate={cell.letter && cell.state === "active" ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.1 }}
                >
                  {cell.letter}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-2 px-2 pb-6 max-w-lg mx-auto w-full">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(key => {
              const state = keyStates[key];
              const isWide = key === "ENTER" || key === "DEL";
              return (
                <motion.button
                  key={key}
                  onClick={() => {
                    if (key === "ENTER") submitGuess();
                    else if (key === "DEL") deleteLetter();
                    else addLetter(key);
                  }}
                  whileTap={{ scale: 0.92 }}
                  className={`${isWide ? "px-3" : "w-9"} h-14 rounded-xl font-black text-xs active:scale-95`}
                  style={{
                    background: state === "correct" ? "#5EEAD4"
                      : state === "present" ? "#A78BFA"
                      : state === "absent" ? "rgba(100,116,139,0.15)"
                      : "rgba(255,255,255,0.8)",
                    color: state === "correct" ? "#0F766E"
                      : state === "present" ? "#fff"
                      : state === "absent" ? "#94a3b8"
                      : "#1e1b4b",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(255,255,255,0.9)",
                  }}
                >
                  {key}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Win/Lose overlay */}
      <AnimatePresence>
        {(gameState === "won" || gameState === "lost") && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background:"rgba(240,235,255,0.85)", backdropFilter:"blur(20px)" }}
          >
            <motion.div
              initial={{ scale:0.9, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              className="flex flex-col items-center gap-5 p-8 rounded-[32px]"
              style={{ background:"rgba(255,255,255,0.85)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(167,139,250,0.2)", maxWidth:320, width:"90%" }}
            >
              <div className="font-black text-4xl" style={{ color: gameState === "won" ? "#A78BFA" : "#ef4444" }}>
                {gameState === "won" ? "Nice!" : "Oops"}
              </div>
              <div className="text-center">
                <div className="font-bold text-sm" style={{ color:"#64748b" }}>
                  {gameState === "won" ? `Solved in ${currentRow + 1} / 6 attempts` : `The word was`}
                </div>
                {gameState === "lost" && (
                  <div className="font-black text-2xl mt-1" style={{ color:"#1e1b4b" }}>{target}</div>
                )}
                {gameState === "won" && (
                  <div className="font-black text-lg mt-1" style={{ color:"#7c3aed" }}>{streak} streak</div>
                )}
              </div>
              <motion.button
                onClick={resetGame}
                whileTap={{ scale:0.95 }}
                className="w-full py-3 rounded-2xl font-black text-white"
                style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 12px 24px rgba(167,139,250,0.3)" }}
              >
                New Word
              </motion.button>
              <Link href="/games" className="font-bold text-sm no-underline" style={{ color:"#94a3b8" }}>
                Back to games
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>)}
    </div>
  );
}
