import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'math-challenge | josho.pro',
  description: 'Play math-challenge on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/math.html"
      className="w-full h-screen border-0"
      title="math-challenge"
    />
  )
}
