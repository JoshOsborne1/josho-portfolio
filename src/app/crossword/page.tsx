import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'crossword | josho.pro',
  description: 'Play crossword on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/crossword.html"
      className="w-full h-screen border-0"
      title="crossword"
    />
  )
}
