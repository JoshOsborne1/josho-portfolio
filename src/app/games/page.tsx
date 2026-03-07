"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm tracking-wide flex items-center gap-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            josho.pro
          </Link>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Free · No Sign Up
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-32">
        {/* Editorial Hero */}
        <div className="max-w-2xl mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-8"
          >
            <span className="text-lg leading-none">🎮</span>
            <span className="text-[10px] font-mono font-medium uppercase tracking-widest">
              Daily Games Collection
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent"
          >
            Pick a game.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl"
          >
            A curated selection of 9 logic, word, and math puzzles. Built for the browser. Ad-free forever.
          </motion.p>
        </div>

        {/* Arcade Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((g, i) => (
            <Link key={g.slug} href={`/games/${g.slug}`} className="group outline-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative h-full p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.05] hover:bg-zinc-900 hover:border-violet-500/30 transition-all duration-300 flex flex-col items-start overflow-hidden focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="w-14 h-14 rounded-xl bg-zinc-800/50 border border-white/[0.05] flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out">
                  {g.emoji}
                </div>
                
                <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-violet-300 transition-colors">
                  {g.title}
                </h3>
                
                <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                  {g.desc}
                </p>

                <div className="mt-auto pt-6 w-full flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400">Play Now</span>
                  <span className="text-violet-400 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
