import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2048 | josho.pro',
  description: 'Play 2048 on josho.pro'
}

export default function GamePage() {
  return (
    <iframe
      src="/2048.html"
      className="w-full h-screen border-0"
      title="2048"
    />
  )
}
