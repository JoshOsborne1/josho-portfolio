import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guldmann AI Platform - Josh Osborne',
  description: 'Connected tooling and AI agents for Guldmann UK. Built by Josh Osborne.',
}

export default function Pres2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
