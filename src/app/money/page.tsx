import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Money Map | Rox',
  description: 'Revenue streams dashboard',
}

export default function MoneyPage() {
  return (
    <iframe
      src="/money.html"
      className="w-full h-screen border-0"
      title="Money Map"
    />
  )
}
