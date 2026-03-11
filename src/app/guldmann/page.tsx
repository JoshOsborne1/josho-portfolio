'use client'

import Link from 'next/link'

export default function GuldmannHome() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', background: '#F0F2F5', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1B2B4B', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, background: '#C8102E', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 18 }}>G</span>
          </div>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>Guldmann <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 400, marginLeft: 8 }}>Internal Portal</span></span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/guldmann" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>Home</Link>
          <Link href="/guldmann/tender" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>Tender</Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#1B2B4B', marginBottom: 6 }}>Guldmann Tools</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 40 }}>Internal portal for UK operations - tools, materials, and tender documents.</div>

        {/* Tender section */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            Tender and Compliance
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
            <Link href="/guldmann/tender" style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: 24, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 0.15s' }}>
              <div style={{ width: 44, height: 44, background: '#FEF2F2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                📋
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2B4B' }}>NHS SBS Tender Materials</div>
              <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>Prepared responses for all MOS/JOSH questions. GDPR, H&S, ISO 13485, BCP, Account Management, Social Value.</div>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#EEF2FF', color: '#4338CA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>NHS SBS Framework</span>
            </Link>
          </div>
        </div>

        {/* Operational tools */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            Operational Tools
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
            {[
              { icon: '📄', name: 'Quote Builder', desc: 'Build and export professional service proposals.', badge: 'Coming Soon' },
              { icon: '📋', name: 'Service Agreement Manager', desc: 'Track active service agreements and renewal dates.', badge: 'Coming Soon' },
            ].map(t => (
              <div key={t.name} style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.55 }}>
                <div style={{ width: 44, height: 44, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2B4B' }}>{t.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>{t.desc}</div>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#FEF9C3', color: '#854D0E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
