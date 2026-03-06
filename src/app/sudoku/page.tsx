import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'sudoku | josho.pro',
  description: 'Play sudoku on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/sudoku.html"
      className="w-full h-screen border-0"
      title="sudoku"
    />
  )
}
