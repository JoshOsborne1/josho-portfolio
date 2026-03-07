"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a]" />

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-zinc-100 selection:bg-violet-500/30' : 'bg-[#f9f9fb] text-[#0a0a0a] selection:bg-violet-500/20'}`}>
      {/* Premium Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-white/[0.07]' : 'bg-[#f9f9fb]/80 border-black/[0.07]'}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className={`text-sm tracking-wide flex items-center gap-2 group transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            josho.pro
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 hidden sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Free · No Sign Up
              </span>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-zinc-400' : 'bg-black/5 hover:bg-black/10 text-zinc-500'}`}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32">
        {/* Editorial Hero */}
        <div className="max-w-2xl mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 ${theme === 'dark' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-violet-100 border-violet-200 text-violet-700'}`}
          >
            <span className="text-lg leading-none">🎮</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
              Daily Games Collection
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-6 ${theme === 'dark' ? 'bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent' : 'text-[#0a0a0a]'}`}
          >
            Pick a game.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className={`text-lg md:text-xl leading-relaxed max-w-xl ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            A curated selection of 9 logic, word, and math puzzles. Built for the browser. Ad-free forever.
          </motion.p>
        </div>

        {/* Arcade Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((g, i) => (
            <Link key={g.slug} href={`/games/${g.slug}`} className="group outline-none block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`relative h-full p-6 rounded-2xl border transition-all duration-300 flex flex-col items-start overflow-hidden focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 ${
                  theme === 'dark' 
                    ? 'bg-zinc-900/50 border-white/[0.05] hover:bg-zinc-900 hover:border-violet-500/40 focus-visible:ring-offset-zinc-950' 
                    : 'bg-[#f2f2f5] border-black/[0.04] hover:bg-white hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 focus-visible:ring-offset-[#f9f9fb]'
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-violet-500/15' : 'bg-violet-400/20'}`} />
                </div>

                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out ${
                  theme === 'dark' ? 'bg-zinc-800/50 border-white/[0.05]' : 'bg-white border-black/[0.05]'
                }`}>
                  {g.emoji}
                </div>
                
                <h3 className={`text-lg font-bold mb-2 transition-colors ${
                  theme === 'dark' ? 'text-zinc-100 group-hover:text-violet-300' : 'text-zinc-900 group-hover:text-violet-600'
                }`}>
                  {g.title}
                </h3>
                
                <p className={`text-sm leading-relaxed transition-colors ${
                  theme === 'dark' ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-500 group-hover:text-zinc-600'
                }`}>
                  {g.desc}
                </p>

                <div className="mt-auto pt-6 w-full flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
                  }`}>Play Now</span>
                  <span className={`transition-transform group-hover:translate-x-1 ${
                    theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
                  }`}>→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
