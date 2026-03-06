import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const games: Record<string, { title: string; desc: string }> = {
  'word':         { title: 'Word Guess',     desc: 'Guess the 5-letter word in 6 tries' },
  'sudoku':       { title: 'Sudoku',          desc: 'Classic 9x9 number puzzle' },
  '2048':         { title: '2048',            desc: 'Slide and merge to reach 2048' },
  'trivia':       { title: 'Trivia',          desc: 'Test your general knowledge' },
  'memory':       { title: 'Memory Match',    desc: 'Flip and match the pairs' },
  'wordchain':    { title: 'Word Chain',      desc: 'Chain words together as fast as you can' },
  'math':         { title: 'Math Challenge',  desc: 'Speed maths — beat the clock' },
  'crossword':    { title: 'Crossword',       desc: 'Daily mini crossword puzzle' },
  'wordscramble': { title: 'Word Scramble',   desc: 'Unscramble the jumbled letters' },
}

export async function generateStaticParams() {
  return Object.keys(games).map(game => ({ game }))
}

export async function generateMetadata({ params }: { params: { game: string } }): Promise<Metadata> {
  const g = games[params.game]
  if (!g) return {}
  return {
    title: `${g.title} | josho.pro`,
    description: g.desc,
  }
}

export default function GamePage({ params }: { params: { game: string } }) {
  if (!games[params.game]) notFound()
  return (
    <iframe
      src={`/games/${params.game}.html`}
      className="w-full h-screen border-0"
      title={games[params.game].title}
    />
  )
}
