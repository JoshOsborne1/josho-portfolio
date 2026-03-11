'use client'

import Link from 'next/link'

export default function GuldmannHome() {
  return (
    <div style={{ paddingTop: '60px' }}>
      {/* Hero Section */}
      <section style={{ padding: '8rem 2rem', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: 20, border: '1px solid rgba(244,182,38,0.35)', background: 'rgba(244,182,38,0.1)', color: '#F4B626', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', opacity: 1, transform: 'none' }}>UK Operations</div>
          <h1 style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em', opacity: 1, transform: 'none' }}>Guldmann UK Internal Portal</h1>
          <div style={{ width: 48, height: 3, borderRadius: 2, background: '#F4B626', marginBottom: '1.5rem', opacity: 1, transform: 'none' }}></div>
          <p style={{ fontSize: '1.2rem', color: '#888888', marginBottom: '3rem', maxWidth: 760, opacity: 1, transform: 'none' }}>
            Internal portal for UK operations - access tools, tender materials, and platform resources.
          </p>
          
          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Card 1 */}
            <Link href="/guldmann/tender" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '2rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)', transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease', willChange: 'transform', height: '100%', opacity: 1, transform: 'none' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(244,182,38,0.35)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 16px 40px rgba(0,0,0,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block', color: '#888888' }}>Tender & Compliance</div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1rem', color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>NHS SBS Tender Responses</h3>
                <p style={{ color: '#888888', fontSize: '1rem' }}>Prepared responses for all MOS/JOSH questions. GDPR, H&S, ISO 13485, BCP, Account Management, Social Value.</p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/form" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '2rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)', transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease', willChange: 'transform', height: '100%', opacity: 1, transform: 'none' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(244,182,38,0.35)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 16px 40px rgba(0,0,0,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block', color: '#888888' }}>Discovery</div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1rem', color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Team Discovery Form</h3>
                <p style={{ color: '#888888', fontSize: '1rem' }}>Collect inputs and requirements from the team for new internal projects and initiatives.</p>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/pres" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '2rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)', transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease', willChange: 'transform', height: '100%', opacity: 1, transform: 'none' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(244,182,38,0.35)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 16px 40px rgba(0,0,0,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block', color: '#888888' }}>Vision</div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1rem', color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>AI Platform Presentation</h3>
                <p style={{ color: '#888888', fontSize: '1rem' }}>Strategic overview of the upcoming AI-driven tools and capabilities for the Guldmann UK team.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
