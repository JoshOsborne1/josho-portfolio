"use client"

import Link from 'next/link'

  title: 'Games | josho.pro',
  description: 'Free daily games — word, puzzle, logic and more',
}

const games = [
  { slug: 'word',        title: 'Word Guess',    emoji: '🔤', desc: 'Guess the 5-letter word in 6 tries' },
  { slug: 'sudoku',      title: 'Sudoku',         emoji: '🔢', desc: 'Classic 9x9 number puzzle' },
  { slug: '2048',        title: '2048',           emoji: '🟨', desc: 'Slide and merge to reach 2048' },
  { slug: 'trivia',      title: 'Trivia',         emoji: '🧠', desc: 'Test your general knowledge' },
  { slug: 'memory',      title: 'Memory Match',   emoji: '🃏', desc: 'Flip and match the pairs' },
  { slug: 'wordchain',   title: 'Word Chain',     emoji: '🔗', desc: 'Chain words together as fast as you can' },
  { slug: 'math',        title: 'Math Challenge', emoji: '➕', desc: 'Speed maths — beat the clock' },
  { slug: 'crossword',   title: 'Crossword',      emoji: '📰', desc: 'Daily mini crossword puzzle' },
  { slug: 'wordscramble',title: 'Word Scramble',  emoji: '🔀', desc: 'Unscramble the jumbled letters' },
]

export default function GamesPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0b',
      color: '#f4f4f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', letterSpacing: '0.05em' }}>
          ← josho.pro
        </Link>
        <span style={{ fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>
          Free · No sign up
        </span>
      </div>

      {/* Hero */}
      <div style={{ padding: '48px 24px 32px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          fontSize: 10,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: '#7c3aed',
          background: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 4,
          padding: '3px 9px',
          marginBottom: 16,
        }}>Daily Games</div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
          lineHeight: 1.1,
        }}>Pick a game.</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, margin: 0, lineHeight: 1.5 }}>
          9 free games. No account. No ads. Play in your browser.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        padding: '0 24px 60px',
        maxWidth: 640,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {games.map(g => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '18px 16px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(124,58,237,0.5)';
              (e.currentTarget as HTMLDivElement).style.background = '#18181b';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLDivElement).style.background = '#111113';
            }}
            >
              <div style={{ fontSize: 28 }}>{g.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5' }}>{g.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{g.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
