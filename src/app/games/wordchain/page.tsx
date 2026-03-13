"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDaily } from "../components/useDaily";
import { useSounds } from "../components/useSounds";

// 3000-word valid word list (abbreviated to key words)
const VALID_WORDS = new Set([
  "able","about","above","acid","aged","ages","ago","aid","aim","air","also","ammo","amps","and","ant","any","ape","app","apt","arc","are","ark","arm","art","ask","ate","atm","atom","auto","awn","axe","axis","baby","back","bake","bald","ball","band","bank","bark","barn","base","bath","beam","bean","bear","beat","beef","been","bell","belt","best","bite","blue","boar","boat","bold","bomb","bond","bone","book","boom","boot","born","both","bowl","brag","brat","brew","brow","bulk","bull","bump","burn","bush","busy","butt","byte","cafe","cake","call","came","camp","cane","cant","cape","card","care","cart","case","cash","cast","cave","cell","cent","chat","chin","chip","chop","city","clad","clam","claw","clay","clip","club","clue","coat","coil","cold","cola","colt","come","cone","cook","cool","cope","copy","cord","core","corn","cost","cozy","crab","cram","crib","crop","cube","curb","curl","cyan","czar","damp","dare","dark","dart","dash","data","date","dawn","deal","dean","deck","deer","deft","deli","dell","demo","deny","dial","dice","died","diet","dip","dire","dirt","disc","dish","disk","dole","dome","done","doom","door","dose","dove","down","draw","drop","drum","dusk","dust","duty","each","earl","earn","east","easy","edge","emit","epic","etch","even","ever","exam","face","fact","fail","fair","fall","fame","farm","fast","fate","fawn","fear","feet","fell","felt","fend","fern","file","fill","film","find","fine","fire","firm","fish","fist","flaw","flex","flow","foam","fold","folk","fond","font","food","fool","foot","ford","fork","form","fore","form","fort","foul","four","fowl","free","frog","from","fuel","full","fume","fund","fuse","gale","gall","game","gang","gape","gash","gate","gaze","gear","gibe","gift","girl","gist","give","glad","glen","glow","glue","goat","golf","gone","good","gore","gosh","grab","gram","gray","grew","grin","grit","grub","gulf","guru","hack","hail","hair","half","hall","halt","hand","hang","harm","hate","have","haze","head","heal","heap","heir","help","herd","here","hero","hide","high","hill","him","hike","hire","hive","hold","hole","home","hood","hook","horn","host","hull","hung","hunt","hurl","hurt","idol","inch","into","iris","jade","jail","jolt","jump","just","keen","kept","kite","knob","know","lack","lake","land","lane","last","late","lawn","lazy","lead","leaf","lean","left","lend","less","like","lime","lick","life","lion","list","live","load","loan","lock","loft","long","look","loom","lore","loss","lost","lust","made","maid","mail","main","make","mane","mark","mast","meal","meet","melt","memo","menu","mere","mesh","mild","mile","mill","mime","mind","moan","mode","mold","mole","moon","more","morn","most","moss","moth","move","mule","muse","must","mute","myth","nail","name","need","nest","news","next","nice","node","noon","norm","nose","note","null","oath","obey","odds","once","only","open","oral","over","oven","page","paid","pale","palm","park","pass","path","pave","peak","peel","peg","pelt","pest","pick","pier","pile","pink","plan","play","plea","plod","plop","plot","plow","ploy","plum","pod","poem","poet","poke","pole","poll","pool","poor","pork","port","pose","post","pour","pout","prey","prim","prod","pull","pump","pure","push","rack","raid","rail","rain","ramp","rank","rant","rasp","raze","read","reap","reed","reef","rely","rend","rent","rest","rice","rich","rind","ring","rink","riot","rise","risk","road","roam","roar","rode","rods","role","roll","root","rose","ruin","rump","rung","rust","sack","sage","sail","sake","salt","same","sand","sane","sang","sank","sash","save","seam","seal","seek","seem","seen","self","sell","send","sent","shed","shin","show","side","silk","sill","sing","sink","slap","slat","sled","slim","slip","slot","slow","slug","slum","slut","soap","sock","soda","sofa","soil","sold","some","soot","soul","span","spar","spin","spot","spur","stab","stop","stub","stud","suck","suit","sulk","sung","sunk","swap","sway","take","tale","talk","tall","tame","tape","taut","taxi","team","tear","tell","tend","test","than","that","them","then","thin","this","thus","tick","tide","tied","tile","till","time","told","toll","tome","tone","took","tool","tore","torn","told","town","tray","trim","trio","trod","tuck","tug","tune","turf","turn","twin","twig","type","typo","ugly","undo","upon","used","vain","vale","vane","vary","veer","veil","vela","vile","vine","vino","vise","void","volt","vote","wade","wail","wake","walk","wall","wand","wane","wart","wave","wear","weed","weld","well","wept","west","what","when","whom","wide","wife","wiki","wild","wilt","wine","wing","wink","wire","wish","with","wolf","woke","wool","wore","work","worn","wrap","writ","yard","yell","your","zone","zoom",
  "tiger","river","ocean","table","chair","house","water","world","three","under","after","other","right","still","found","place","where","think","those","every","their","which","about","while","could","first","would","there","since","until","bring","today","again","these","along","above","often","short","heart","small","black","large","given","being","quite","began","comes","taken","known","lives","never","makes","times","thing","learn","doing","power","major","earth","among","might","leave","point","seems","great","whole","story","words","early","young","state","place","where","reach","south","north","local","south","lower","plant","level","light","group","woman","study","night","child","value","money","issue","clear","close","hands","voice","later","human","scene","using","cause","water","horse","music","south","month","watch","start","stand","speak","makes","whole","known","taken","since","those","white","black","right","again","still","place","world","small","every","those","house","quite","early","first","where","there","large","other","begin","comes","never","three","being","times","given","words","south","child","human","today","great","young","study","leave","short","often","level","group","woman","night","local","lower","earth","among","power","major","value","money","clear","voice","later","scene","using","cause","south","month","watch","start","stand","speak","makes","whole","known","taken",
  "apple","beach","build","chart","cloud","dance","dream","earth","flame","grace","grant","house","image","issue","layer","light","model","night","order","peace","pearl","place","plain","point","power","price","pride","print","proof","range","reach","realm","round","scale","scene","score","sense","shade","shake","share","shift","sight","skill","sleep","slide","smile","smoke","solar","solid","solve","sound","space","spark","speak","speed","spell","spend","spent","split","spoke","stand","state","stick","still","stone","story","study","sugar","surge","table","taste","teach","think","three","throw","title","touch","trace","track","trade","train","treat","trial","truck","trust","truth","voice","waste","watch","water","white","world","write","young","above","again","began","being","black","cause","child","clean","clear","close","comes","could","dance","doing","early","earth","every","first","found","given","grace","grand","grant","grass","great","group","grows","hands","heart","heavy","horse","house","human","issue","known","large","later","learn","leave","level","light","local","lower","major","makes","money","month","music","never","night","ocean","often","other","peace","place","plant","point","power","price","quite","reach","right","river","scene","sense","short","since","small","smile","solid","south","speak","stand","start","state","steel","still","story","study","sugar","table","taken","taste","teach","their","there","these","thing","think","those","three","tiger","times","title","today","touch","trace","trade","train","treat","trial","truck","trust","truth","under","until","using","value","voice","waste","watch","water","while","white","whole","woman","words","world","would","young",
]);

const STARTER_WORDS = ["tiger","dream","place","river","ocean","cloud","spark","flame","grace","pearl","stone","earth","light","space","world","table","horse","house","music","dance"];

function isValidWord(word: string): boolean {
  return word.length >= 3 && VALID_WORDS.has(word.toLowerCase());
}

export default function WordChainGame() {
  const { canPlay, markPlayed, hoursUntilReset } = useDaily('wordchain');
  const { playTap, playSuccess, playError, playWin, vibrate } = useSounds();
  const [chain, setChain] = useState<string[]>(() => {
    const start = STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)];
    return [start.toUpperCase()];
  });
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"playing"|"lost">("playing");
  const [error, setError] = useState("");
  const [record, setRecord] = useState(() => typeof window !== "undefined" ? parseInt(localStorage.getItem("wordchain-record") || "0") : 0);
  const chainRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState("lost");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [gameState, chain.length]);

  useEffect(() => {
    if (chainRef.current) {
      chainRef.current.scrollLeft = chainRef.current.scrollWidth;
    }
  }, [chain]);

  const handleSubmit = useCallback(() => {
    if (gameState !== "playing") return;
    const word = input.trim().toUpperCase();
    if (word.length < 3) { setError("Too short"); return; }
    const lastWord = chain[chain.length - 1];
    const lastLetter = lastWord[lastWord.length - 1];
    if (word[0] !== lastLetter) {
      setError(`Must start with ${lastLetter}`);
      return;
    }
    if (chain.includes(word)) { setError("Already used"); return; }
    if (!isValidWord(word)) { setError("Not a valid word"); return; }
    setChain(prev => [...prev, word]);
    setInput("");
    setError("");
    setTimeLeft(30);
  }, [gameState, input, chain]);

  const resetGame = () => {
    const start = STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)];
    setChain([start.toUpperCase()]);
    setInput("");
    setTimeLeft(30);
    setGameState("playing");
    setError("");
    inputRef.current?.focus();
  };

  const handleLoss = useCallback(() => {
    const score = chain.length - 1;
    if (score > record) {
      setRecord(score);
      if (typeof window !== "undefined") localStorage.setItem("wordchain-record", String(score));
    }
  }, [chain.length, record]);

  useEffect(() => {
    if (gameState === "lost") handleLoss();
  }, [gameState, handleLoss]);

  const lastWord = chain[chain.length - 1];
  const nextLetter = lastWord[lastWord.length - 1];

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {!canPlay && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
          <div className="font-black text-5xl" style={{ color:"#A78BFA" }}>Come back soon</div>
          <div className="font-bold text-sm text-center" style={{ color:"#94a3b8" }}>You&apos;ve already played today.<br/>Resets in {hoursUntilReset}h</div>
          <Link href="/games" className="font-bold text-sm no-underline mt-4" style={{ color:"#A78BFA" }}>Back to games</Link>
        </div>
      )}
      {canPlay && (<>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div className="flex items-center justify-center font-black text-white rounded-xl" style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>Word Chain</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm" style={{ color:"#64748b" }}>Chain: {chain.length - 1}</span>
          {record > 0 && <span className="font-bold text-xs px-2 py-0.5 rounded-lg" style={{ background:"rgba(167,139,250,0.1)", color:"#7c3aed" }}>Best: {record}</span>}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 max-w-lg mx-auto w-full">
        {/* Timer bar */}
        <div className="w-full">
          <div className="h-3 rounded-full overflow-hidden" style={{ background:"rgba(167,139,250,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: timeLeft > 15 ? "linear-gradient(90deg,#C4B5FD,#5EEAD4)"
                  : timeLeft > 7 ? "linear-gradient(90deg,#A78BFA,#FBBF24)"
                  : "linear-gradient(90deg,#EF4444,#F97316)",
                width: `${(timeLeft/30)*100}%`,
              }}
              animate={{ width:`${(timeLeft/30)*100}%` }}
              transition={{ duration:0.3 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-bold text-xs" style={{ color:"#94a3b8" }}>Next letter: <span style={{ color:"#A78BFA" }}>{nextLetter}</span></span>
            <span className="font-bold text-sm" style={{ color: timeLeft <= 7 ? "#EF4444" : "#64748b" }}>{timeLeft}s</span>
          </div>
        </div>

        {/* Chain display */}
        <div ref={chainRef} className="w-full flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth:"none" }}>
          {chain.map((word, i) => (
            <motion.div
              key={i}
              initial={i > 0 ? { scale:0.8, opacity:0 } : {}}
              animate={{ scale:1, opacity:1 }}
              className="shrink-0 px-3 py-2 rounded-2xl font-black text-sm whitespace-nowrap"
              style={{
                background: i === chain.length - 1 ? "linear-gradient(135deg,#C4B5FD,#A78BFA)" : "rgba(255,255,255,0.7)",
                color: i === chain.length - 1 ? "#fff" : "#1e1b4b",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: i === chain.length - 1 ? "0 4px 12px rgba(167,139,250,0.3)" : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {word}
              {i < chain.length - 1 && <span className="ml-2" style={{ color:"#94a3b8", fontSize:10 }}>-&gt;</span>}
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="w-full p-5 rounded-[28px]" style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.8)", boxShadow:"0 12px 32px rgba(0,0,0,0.05)" }}>
          <div className="flex flex-col gap-3">
            <div className="font-bold text-sm" style={{ color:"#64748b" }}>
              Enter a word starting with <span className="font-black text-xl px-2 py-0.5 rounded-lg" style={{ color:"#A78BFA", background:"rgba(167,139,250,0.1)" }}>{nextLetter}</span>
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={`${nextLetter}...`}
                autoFocus
                className="flex-1 px-4 py-3 rounded-2xl font-black text-base outline-none"
                style={{ background:"rgba(240,235,255,0.5)", border:"2px solid rgba(167,139,250,0.3)", color:"#1e1b4b" }}
                disabled={gameState !== "playing"}
              />
              <motion.button onClick={handleSubmit} whileTap={{ scale:0.95 }} disabled={gameState !== "playing"} className="px-5 py-3 rounded-2xl font-black text-white active:scale-95" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)", boxShadow:"0 4px 12px rgba(167,139,250,0.3)" }}>
                Add
              </motion.button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="font-bold text-sm" style={{ color:"#ef4444" }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {gameState === "lost" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(240,235,255,0.88)", backdropFilter:"blur(20px)" }}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} className="p-8 rounded-[32px] flex flex-col items-center gap-5" style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 24px 60px rgba(0,0,0,0.1)", maxWidth:300, width:"90%" }}>
              <div className="font-black text-3xl" style={{ color:"#1e1b4b" }}>Time Up!</div>
              <div className="flex gap-6">
                <div className="text-center"><div className="font-black text-2xl" style={{ color:"#A78BFA" }}>{chain.length - 1}</div><div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Chain</div></div>
                <div className="text-center"><div className="font-black text-2xl" style={{ color:"#7c3aed" }}>{record}</div><div className="font-bold text-xs uppercase tracking-widest" style={{ color:"#94a3b8" }}>Record</div></div>
              </div>
              <motion.button onClick={resetGame} whileTap={{ scale:0.95 }} className="w-full py-3 rounded-2xl font-black text-white" style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)" }}>Play Again</motion.button>
              <Link href="/games" className="font-bold text-sm no-underline" style={{ color:"#94a3b8" }}>Back to games</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          </>)}
    </div>
  );
}