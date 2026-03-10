import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

const GAMES: Record<string, { title: string; description: string; emoji: string }> = {
  word: {
    title: "Word Guess — Daily Word Puzzle",
    description: "Guess the 5-letter word in 6 tries. New puzzle every day. Share your streak.",
    emoji: "🔤",
  },
  sudoku: {
    title: "Sudoku — Classic Number Puzzle",
    description: "Play Sudoku daily. Easy, medium, and hard difficulties. Track your solve time.",
    emoji: "🔢",
  },
  "2048": {
    title: "2048 — Sliding Number Puzzle",
    description: "Slide tiles, combine numbers, reach 2048. Addictively simple.",
    emoji: "🔲",
  },
  trivia: {
    title: "Trivia Quiz — Test Your Knowledge",
    description: "100+ trivia questions across history, science, pop culture and more.",
    emoji: "🎯",
  },
  memory: {
    title: "Memory Match — Card Flip Game",
    description: "Flip cards, find pairs, beat your best time. Classic memory training.",
    emoji: "🃏",
  },
  wordchain: {
    title: "Word Chain — Vocabulary Challenge",
    description: "Chain words together. Each word must start with the last letter of the previous.",
    emoji: "⛓️",
  },
  math: {
    title: "Math Sprint — Mental Arithmetic Game",
    description: "Test your mental maths. How many can you solve in 60 seconds?",
    emoji: "➕",
  },
  crossword: {
    title: "Mini Crossword — Word Puzzle",
    description: "A compact daily crossword. Clues, grid, satisfaction.",
    emoji: "⬛",
  },
  wordscramble: {
    title: "Word Scramble — Unscramble the Letters",
    description: "Unscramble jumbled letters to form words. Race against the clock.",
    emoji: "🔀",
  },
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
    openGraph: {
      title: info.title,
      description: info.description,
      url: `https://josho.pro/games/${game}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: info.title,
      description: info.description,
    },
  };
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  if (!GAMES[game]) return notFound();

  return (
    <main style={{ width: "100%", height: "100dvh", overflow: "hidden", background: "#0a0a0b" }}>
      <iframe
        src={`/games/${game}.html`}
        style={{ width: "100%", height: "100%", border: "none" }}
        title={GAMES[game].title}
      />
    </main>
  );
}
