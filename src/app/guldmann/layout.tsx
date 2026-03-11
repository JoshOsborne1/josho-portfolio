import Link from 'next/link'
import Image from 'next/image'

export default function GuldmannLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif', background: '#111111', minHeight: '100vh', color: '#F0F0F0', lineHeight: 1.7, fontSize: 17 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Image src="/guldmann-logo-stacked-white.png" alt="Guldmann" width={80} height={26} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: 13, letterSpacing: '3px', fontWeight: 800, color: '#F4B626', textTransform: 'uppercase', marginLeft: 16 }}>UK INTERNAL PORTAL</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/guldmann" style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#CCC', textDecoration: 'none', transition: 'color 200ms', whiteSpace: 'nowrap', paddingBottom: 2 }}>Home</Link>
          <Link href="/guldmann/tender" style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#CCC', textDecoration: 'none', transition: 'color 200ms', whiteSpace: 'nowrap', paddingBottom: 2 }}>Tender</Link>
          <Link href="/form" style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#CCC', textDecoration: 'none', transition: 'color 200ms', whiteSpace: 'nowrap', paddingBottom: 2 }}>Form</Link>
          <Link href="/pres" style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#CCC', textDecoration: 'none', transition: 'color 200ms', whiteSpace: 'nowrap', paddingBottom: 2 }}>Platform</Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
