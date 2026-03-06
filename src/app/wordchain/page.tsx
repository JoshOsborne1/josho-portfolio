import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'word-chain | josho.pro',
  description: 'Play word-chain on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/wordchain.html"
      className="w-full h-screen border-0"
      title="word-chain"
    />
  )
}
