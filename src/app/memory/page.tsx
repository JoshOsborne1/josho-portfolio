import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'memory-match | josho.pro',
  description: 'Play memory-match on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/memory.html"
      className="w-full h-screen border-0"
      title="memory-match"
    />
  )
}
