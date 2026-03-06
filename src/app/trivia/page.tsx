import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'trivia | josho.pro',
  description: 'Play trivia on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/trivia.html"
      className="w-full h-screen border-0"
      title="trivia"
    />
  )
}
