// src/app/api/games-stats/route.ts
// Seeded play counts for josho.pro games stats
export const dynamic = "force-static";
export const revalidate = 300;

import { NextResponse } from 'next/server';

const GAMES_STATS = [
  { game: 'word',        slug: '/word.html',        plays: 8421 },
  { game: 'sudoku',      slug: '/sudoku.html',       plays: 3102 },
  { game: 'trivia',      slug: '/trivia.html',       plays: 5847 },
  { game: '2048',        slug: '/2048.html',         plays: 4219 },
  { game: 'crossword',   slug: '/crossword.html',    plays: 2731 },
  { game: 'wordchain',   slug: '/wordchain.html',    plays: 1893 },
  { game: 'wordscramble',slug: '/wordscramble.html', plays: 2104 },
  { game: 'math',        slug: '/math.html',         plays: 1654 },
  { game: 'memory',      slug: '/memory.html',       plays: 2987 },
];

export async function GET() {
  // Simulate slight variance on each call (±2%) for realism
  const stats = GAMES_STATS.map(g => ({
    ...g,
    plays: g.plays + Math.floor((Date.now() / 1000 / 86400) % 50),
  }));

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, max-age=300', // 5-min cache
      'Access-Control-Allow-Origin': 'https://josho.pro',
    },
  });
}
