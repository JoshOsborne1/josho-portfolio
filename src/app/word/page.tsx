import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'word-guess | josho.pro',
  description: 'Play word-guess on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/word.html"
      className="w-full h-screen border-0"
      title="word-guess"
    />
  )
}
