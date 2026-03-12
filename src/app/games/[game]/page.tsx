import { Metadata } from "next";
import { notFound } from "next/navigation";

const GAMES: Record<string, { title: string; description: string }> = {
  word: { title: "Word Guess - Daily Word Puzzle", description: "Guess the 5-letter word in 6 tries." },
  sudoku: { title: "Sudoku - Classic Number Puzzle", description: "Play Sudoku. Three difficulties." },
  "2048": { title: "2048 - Sliding Number Puzzle", description: "Slide tiles, combine numbers, reach 2048." },
  trivia: { title: "Trivia Quiz - Test Your Knowledge", description: "50+ trivia questions." },
  memory: { title: "Memory Match - Card Flip Game", description: "Flip cards, find pairs." },
  wordchain: { title: "Word Chain - Vocabulary Challenge", description: "Chain words together." },
  math: { title: "Math Sprint - Mental Arithmetic Game", description: "60 seconds of maths." },
  crossword: { title: "Mini Crossword - Word Puzzle", description: "Themed 5x5 crossword puzzles." },
  wordscramble: { title: "Word Scramble - Unscramble the Letters", description: "Unscramble jumbled letters." },
};

export async function generateStaticParams() {
  return Object.keys(GAMES).map((game) => ({ game }));
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game } = await params;
  const info = GAMES[game];
  if (!info) return { title: "Game Not Found" };
  return {
    title: `${info.title} | josho.pro`,
    description: info.description,
    openGraph: { title: info.title, description: info.description, url: `https://josho.pro/games/${game}`, type: "website" },
    twitter: { card: "summary", title: info.title, description: info.description },
  };
}

// This route should NOT be hit for the 9 named games because static routes take priority.
// It serves as a metadata provider + fallback for any unknown game slug.
export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  if (!GAMES[game]) return notFound();
  // Named games have their own static pages - this component won't render for them.
  // If somehow we end up here, show a fallback.
  return notFound();
}
