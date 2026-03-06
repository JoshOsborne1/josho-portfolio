import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'word-scramble | josho.pro',
  description: 'Play word-scramble on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/wordscramble.html"
      className="w-full h-screen border-0"
      title="word-scramble"
    />
  )
}
