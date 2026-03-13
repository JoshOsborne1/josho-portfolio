// Extended valid 5-letter words for guess validation
// These are valid English words accepted as guesses but not used as answers
export const VALID_GUESSES = new Set([
  // A
  "aahed","aalii","aargh","abaci","aback","abaft","abash","abate","abbey","abbot",
  "abhor","abide","abiit","abjad","abler","abode","abort","abris","absit","abuts",
  "abuzz","abyss","ached","aches","acids","acned","acnes","acorn","acred","acres",
  "acted","actin","acton","actos","addax","added","adder","adieu","adlib","adobe",
  "adore","adorn","adsum","adust","aegis","aeons","aeons","aerie","afore","afoul",
  "agave","agene","agile","aging","aglow","agone","agons","agony","agora","agouti",
  "agued","agued","ahead","aided","aider","aimer","aioli","aired","airts","aitch",
  "algae","algal","algin","algor","allay","aloft","aloof","altho","alums","alway",
  "amass","amaze","amber","ambry","amide","amigo","amino","amiss","amity","among",
  "amour","ample","amply","amuse","anear","anent","anew","angel","annex","annoy",
  "antes","antsy","anura","aphid","aport","appal","appel","apron","aptly","arbor",
  "ardor","areal","arete","argon","argot","argue","argus","ariel","ariel","arils",
  "arked","armer","armor","arpen","arras","arret","arris","arses","arson","ashen",
  "ashed","asker","askew","atoll","atone","atony","atopy","attic","audio","audit",
  "augur","aural","aurax","aurae","aurar","aurar","auras","avail","avens","avian",
  "avion","aviso","avoid","avows","awash","awful","awing","awoke","axial","axion",
  "ayahs","ayelp","azine","azote","azoth","azure",
  // B
  "babka","bacon","badge","badly","bagel","baggy","bairn","baked","balmy","balsa",
  "banal","bandy","baned","bangs","banjo","barbs","bared","baron","baste","batch",
  "bathe","batik","baton","batty","bawdy","bawls","bayou","beady","began","begat",
  "beige","belch","belle","below","bench","bevel","bidet","bigot","bilge","binge",
  "biome","biota","birch","bison","bizzy","bleak","bleat","bleed","blimp","blimy",
  "bliss","bloat","bloke","blood","blown","blurb","blurt","blush","boded","boggy",
  "bolts","bongo","bonny","booze","boozy","borax","boron","botch","bough","bound",
  "boxer","brace","brash","brawn","bream","bribe","brisk","broil","brook","brood",
  "brunt","brute","bumpy","burly","burps","busts","butch","bylaw",
  // C
  "cabal","cacti","cagey","calve","cameo","camel","canal","candy","caped","caper",
  "caret","carol","caste","catty","cauld","cause","cavil","cedar","celeb","chafe",
  "champ","chant","chard","chasm","cheat","cheek","cheep","cheer","chelp","chess",
  "chide","chill","chimp","chive","chock","chord","chore","chump","churn","cipher",
  "civic","civil","clack","clasp","cleft","clerk","click","cliff","clink","cloak",
  "coaxe","cobra","cocoa","colon","comet","comic","comma","commy","condo","conic",
  "copal","copse","coral","corny","couch","cough","covet","coway","cozen","cramp",
  "crane","creak","creed","creep","crepe","crest","crimp","crisp","croak","crone",
  "crook","cross","crowd","crown","cruft","crush","crust","crypt","cubic","cubit",
  "cuing","cupid","curly","curry","curve","cynic",
  // D
  "dagga","daffy","dandy","datum","daubs","daunt","davit","dealt","decoy","decry",
  "defer","delta","depot","depth","derby","dhoti","digit","dimly","dingy","dirge",
  "disco","ditty","divan","dodge","dolly","dowdy","dowel","dowry","doxie","drank",
  "drawl","dread","drove","droit","drool","droop","drove","drown","druid","duchy",
  "dusky","dusty","dwelt",
  // E
  "easel","ebook","edema","edict","edify","egret","eject","emcee","emend","emote",
  "empower","enact","endow","ensue","envoy","epoch","equip","erode","erupt","etude",
  "evade","evict","evoke","exact","exalt","excel","exert","exile","expel","extol",
  "exude","exult",
  // F
  "fable","facet","faery","fakir","fauna","ferry","fetch","fiche","fiend","fiery",
  "filmy","finch","fjord","flack","flail","flake","flame","flank","flare","flask",
  "fleck","flecy","flick","flung","flute","flyby","flyer","foamy","focal","folio",
  "folly","foray","forgo","forte","forum","freak","friar","frisk","fritz","frizz",
  "frond","frost","froth","frown","froze","fungi","funky","futon",
  // G
  "gadget","gamut","gaudy","gauze","gawky","giddy","gimpy","girth","gizmo","glare",
  "glint","gloat","gloom","gloss","glove","glyph","gnash","gnarl","gnome","goose",
  "gouge","gourd","greed","greet","grimy","gripe","groan","groin","groom","grout",
  "grove","growl","gruel","gruff","guile","guise","gusto","gutsy","gypsy",
  // H
  "haiku","halve","hanky","hardy","harpy","haste","hatch","haunt","haven","havoc",
  "heady","heist","hence","herby","hertz","hilum","hippo","hitch","hobby","hodge",
  "holly","homer","honey","horny","hotel","hotly","hound","hovel","howdy","hussy",
  "hutch","hydra","hyena","hyper",
  // I
  "icily","idiom","idyll","igloo","image","imbue","imply","inane","incur","inept",
  "inert","infer","ingot","inlay","innit","inter","inure","irate","irony","itchy",
  "ivory",
  // J
  "jaunt","jelly","jerky","jiffy","jocky","joust","juicy","julep","jumbo","knave",
  // K
  "kaput","karma","kayak","kebab","khaki","kinky","kiwis","knack","kneel","knelt",
  "knoll","knave","koala",
  // L
  "lathe","latte","laughs","leach","leafy","leaky","ledge","legal","lemma","lemur",
  "letup","levee","linen","liner","liver","livid","llama","loath","lobby","lofty",
  "logic","loopy","lousy","lucid","lumpy","lusty","lying",
  // M
  "mafia","mangy","mania","manor","maple","maxim","mealy","meaty","medic","mince",
  "miser","mitre","mocha","mogul","moist","moldy","mommy","moose","moron","morph",
  "mossy","motif","mousy","mucky","muddy","mulch","mulch","murky","musty","myrrh",
  // N
  "nabob","naive","nanny","narco","needy","nerdy","nifty","ninny","nippy","noble",
  "notch","nubby","numby","nymph",
  // O
  "oddly","ofray","often","olive","onion","ozone",
  // P
  "paddy","pansy","panty","papal","parka","patsy","patty","perch","pesky","petty",
  "phony","piggy","pilot","pinky","pithy","pixel","plaid","plank","plash","playa",
  "pluck","plumb","plume","plump","plunk","plush","poach","podgy","poppy","porch",
  "porky","pouty","prawn","prism","privy","probe","prone","prong","prowl","prude",
  "prune","psalm","pubic","pudgy","pulpy","puny","puppy","pushy","putty",
  // Q
  "quaff","qualm","qualm","quash","queue","quirk","quota","quote",
  // R
  "rabid","radon","raspy","ratty","rave","razen","rebel","reedy","regal","repay",
  "repel","rerun","retch","risky","rival","rivet","robin","rogue","roomy","roost",
  "rusty",
  // S
  "sadly","saggy","sahib","sassy","satyr","sauce","saucy","savor","savvy","scald",
  "scalp","scaly","scant","scone","scoop","scour","scout","scowl","scram","scrap",
  "scrub","seedy","seize","servo","shack","shady","shaky","sheen","sheer","shelf",
  "shim","shirk","shoal","shrug","shuck","shrub","shunt","siege","silky","skull",
  "skunk","slain","slant","slash","sleek","sleet","slept","slick","slimy","sloop",
  "slosh","sloth","slump","slunk","smack","smear","smirk","smolt","snack","snafu",
  "snaky","snare","snarl","sneak","sneer","sniff","snore","snort","snout","snowy",
  "snuck","snuff","soggy","solar","sooty","sorry","sower","spank","spasm","spawn",
  "speck","spied","spiel","spire","spite","splat","spook","spoon","spray","spree",
  "sprig","spunk","squab","squat","squib","staid","stale","stalk","stall","stark",
  "startle","stash","stave","stead","stern","stiff","stoic","stolid","stomp","stony",
  "stood","stoop","storey","stout","strap","stray","strep","strew","strut","stump",
  "stung","stunt","suave","sulky","sullen","sumac","sunny","surly","sushi","swamp",
  "swath","swear","sweat","swept","swill","swipe","swirl","swoop",
  // T
  "tabby","tacky","taffy","tangy","tapir","taunt","tawny","tepid","terse","thane",
  "thong","thorn","those","throb","throb","throw","thrum","thud","tiara","tidal",
  "timid","tipsy","toffy","topaz","torso","toxic","tramp","trawl","tread","treed",
  "trend","trice","trove","truce","truly","trump","tryst","tuber","tummy","turbo",
  "twang","tweed","twirl","twitch","tying","tyke",
  // U
  "udder","ulcer","ultra","uncut","unfit","unify","unity","unruly","unzip","upend",
  "usurp","utmost",
  // V
  "vapid","vault","vaunt","verge","verve","vicar","viper","viral","vivid","vixen",
  "vodka","voila","volley","vouch","vowed","vulva",
  // W
  "waltz","wanton","wring","wrath","wrest","wring","wrist","writhe","wrong","wrung",
  "wimpy","windy","wispy","witty","wobbly","woozy","wormy","wrath","wryly",
  // X Y Z
  "yacht","yeast","yeoman","yodel","yokel","yucky","yummy","zappy","zesty","zilch",
  "zingy","zippy","zomby","zonal",
]);
