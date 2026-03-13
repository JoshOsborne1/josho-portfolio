'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_1TAeyZ4C761DH1sqXCUs4KzJ';
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || 'price_1TAeyZ4C761DH1sqcam6krV0';

const FEATURES = [
  { icon: '∞', label: 'Unlimited games daily', desc: 'Play every game every day, no cap' },
  { icon: '🔥', label: 'Streak protection', desc: 'Miss a day? Your streak is safe' },
  { icon: '📊', label: 'Full stats dashboard', desc: 'Win rates, history, personal bests' },
  { icon: '⚡', label: 'Early access', desc: 'New games before everyone else' },
  { icon: '◎', label: 'No interruptions', desc: 'Clean experience, no upgrade prompts' },
];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes - cancel from your account settings at any time. You keep Pro until the end of your billing period.',
  },
  {
    q: 'What happens to my streak if I cancel?',
    a: 'Your streak is preserved. If you re-subscribe, streak protection kicks back in.',
  },
  {
    q: 'Does Pro work on all my devices?',
    a: 'Yes. Log in on any device and your Pro status follows you.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The free tier gives you 5 games a day - plenty to try everything. No credit card needed.',
  },
];

export default function ProPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleCheckout(priceId: string, plan: string) {
    const e = email.trim();
    if (!e || !e.includes('@')) {
      setError('Enter a valid email to continue.');
      return;
    }
    setError('');
    setLoading(plan);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('games-user-email', e);
      }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email: e, successUrl: `${window.location.origin}/games?pro=1`, cancelUrl: `${window.location.origin}/games/pro` }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong. Try again.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: 'linear-gradient(135deg, #F0EBFF 0%, #E8F4FF 50%, #F0FFF8 100%)' }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 h-14"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(167,139,250,0.15)' }}
      >
        <Link href="/games" className="flex items-center gap-2 no-underline">
          <span className="text-lg font-black" style={{ color: '#7c3aed' }}>←</span>
          <span className="font-bold text-sm" style={{ color: '#7c3aed' }}>Games</span>
        </Link>
        <span
          className="font-black text-xs px-3 py-1 rounded-full"
          style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', color: '#fff' }}
        >
          PRO
        </span>
      </div>

      {/* Hero */}
      <div className="px-4 pt-10 pb-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div
            className="inline-block font-black text-4xl mb-3"
            style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Go Pro
          </div>
          <p className="text-base font-medium max-w-xs mx-auto" style={{ color: '#475569' }}>
            Unlimited games. Full stats. Streak protection. Everything, every day.
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-4 mb-8">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.8)' }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3"
              style={{ borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(167,139,250,0.1)' : 'none' }}
            >
              <span className="text-xl mt-0.5">{f.icon}</span>
              <div>
                <div className="font-black text-sm" style={{ color: '#1e1b4b' }}>{f.label}</div>
                <div className="text-xs font-medium" style={{ color: '#64748b' }}>{f.desc}</div>
              </div>
              <div className="ml-auto text-green-500 font-black text-sm mt-0.5">✓</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email input */}
      <div className="px-4 mb-6">
        <label className="block text-xs font-bold mb-2" style={{ color: '#7c3aed' }}>Your email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: '1.5px solid rgba(167,139,250,0.3)',
            color: '#1e1b4b',
          }}
        />
        {error && <p className="text-xs font-bold mt-1.5" style={{ color: '#ef4444' }}>{error}</p>}
      </div>

      {/* Pricing cards */}
      <div className="px-4 mb-8 space-y-3">
        {/* Annual - highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative rounded-2xl p-4"
          style={{
            background: 'linear-gradient(135deg,rgba(167,139,250,0.18),rgba(124,58,237,0.12))',
            border: '2px solid rgba(167,139,250,0.5)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="absolute -top-3 right-4 text-xs font-black px-3 py-1 rounded-full"
            style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', color: '#fff' }}
          >
            Best Value
          </div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="font-black text-xl" style={{ color: '#1e1b4b' }}>£19.99</div>
              <div className="text-xs font-bold" style={{ color: '#64748b' }}>per year · saves 44%</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold" style={{ color: '#7c3aed' }}>Annual</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>≈ £1.67/month</div>
            </div>
          </div>
          <button
            onClick={() => handleCheckout(ANNUAL_PRICE_ID, 'annual')}
            disabled={loading !== null}
            className="w-full py-3 rounded-xl font-black text-sm text-white"
            style={{
              background: loading === 'annual' ? '#a78bfa' : 'linear-gradient(135deg,#A78BFA,#7C3AED)',
              boxShadow: '0 4px 16px rgba(167,139,250,0.4)',
            }}
          >
            {loading === 'annual' ? 'Redirecting...' : 'Go Pro Annual →'}
          </button>
        </motion.div>

        {/* Monthly */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.8)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="font-black text-xl" style={{ color: '#1e1b4b' }}>£2.99</div>
              <div className="text-xs font-bold" style={{ color: '#64748b' }}>per month</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold" style={{ color: '#64748b' }}>Monthly</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Cancel anytime</div>
            </div>
          </div>
          <button
            onClick={() => handleCheckout(MONTHLY_PRICE_ID, 'monthly')}
            disabled={loading !== null}
            className="w-full py-3 rounded-xl font-black text-sm"
            style={{
              background: loading === 'monthly' ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.12)',
              border: '1.5px solid rgba(167,139,250,0.3)',
              color: '#7c3aed',
            }}
          >
            {loading === 'monthly' ? 'Redirecting...' : 'Go Pro Monthly'}
          </button>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="px-4 mb-8">
        <h3 className="font-black text-sm mb-3" style={{ color: '#1e1b4b' }}>FAQ</h3>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.8)' }}
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: i < FAQS.length - 1 ? '1px solid rgba(167,139,250,0.1)' : 'none' }}
            >
              <button
                className="w-full text-left flex items-center justify-between px-4 py-3"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-bold text-sm" style={{ color: '#1e1b4b' }}>{faq.q}</span>
                <span className="text-lg font-bold" style={{ color: '#a78bfa' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-xs font-medium" style={{ color: '#64748b' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs px-4" style={{ color: '#94a3b8' }}>
        Secure checkout via Stripe. Cancel anytime from your account.
      </p>
    </div>
  );
}
