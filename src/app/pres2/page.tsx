'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'

const GOLD = '#F4B626'

const tools = [
  { title: 'Time Logger', desc: 'Mobile-first clock in/out, syncs to SyncroTeam' },
  { title: 'Job Lookup', desc: 'Instant job search on-site, phone-optimised' },
  { title: 'Manual Search', desc: 'Full technical manual on your phone' },
  { title: 'Excel UI', desc: 'Multi-sheet interfaces, one clean view' },
  { title: 'Glenigan', desc: 'Construction pipeline from CSV upload' },
  { title: 'HubSpot CRM', desc: 'Deal pipeline and contact management' },
]

const agents = [
  {
    role: 'Engineer',
    chats: [
      { user: 'Log 2.5 hours on job 4521', ai: 'Done. Activity logged to SyncroTeam. Job 4521 updated.' },
      { user: 'LOLER requirements for a 500kg ceiling hoist?', ai: 'LOLER 1998 requires thorough examination every 6 months for lifting equipment used to lift persons...' },
    ],
  },
  {
    role: 'Sales',
    chats: [
      { user: 'Hospital projects over Â£500k in South West this week', ai: 'Found 12 matches in Glenigan. Top result: Royal Cornwall Hospital - Â£1.2M, planning approved.' },
    ],
  },
  {
    role: 'Management',
    chats: [
      { user: 'Which jobs are overrunning on hours?', ai: '3 flagged: Job 4822 (+4 hrs), Job 4910 (+2.5 hrs), Job 4901 (+1 hr). View details.' },
    ],
  },
  {
    role: 'Admin',
    chats: [
      { user: "Update compliance tracker - Addenbrooke's, inspection done 10 March", ai: 'Excel updated via Graph API. Next inspection: 10 September. Certificate recorded.' },
    ],
  },
]

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1200
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(t => step(t, startTime))
      else setCount(target)
    }
    requestAnimationFrame(t => step(t, t))
  }, [inView, target])

  return (
    <div ref={ref} className="text-7xl md:text-8xl font-bold tabular-nums" style={{ color: GOLD }}>
      {count}{suffix}
    </div>
  )
}

function Section({ children, id, dark = false }: { children: React.ReactNode; id?: string; dark?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="py-28 px-6"
      style={{ background: dark ? '#161616' : '#111111' }}
    >
      {children}
    </motion.section>
  )
}

function GoldHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div className="relative inline-block mb-6">
      <h2 ref={ref} className="text-4xl md:text-6xl font-bold tracking-tight text-white">
        {children}
      </h2>
      <motion.div
        className="absolute -bottom-2 left-0 h-[3px] rounded-full"
        style={{ background: GOLD }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.4 }}
      />
    </div>
  )
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Pres2Page() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 160])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const unsub = scrollY.on('change', v => setNavScrolled(v > 50))
    return unsub
  }, [scrollY])

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#111111', fontFamily: "system-ui, 'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300"
        style={{
          background: navScrolled ? 'rgba(17,17,17,0.85)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(20px)' : 'none',
          borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <Image src="/guldmann-logo-stacked-white.png" alt="Guldmann" width={80} height={40} className="object-contain" />
        <div className="hidden md:flex gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {['Problem', 'Platform', 'AI Agents', 'ROI', 'Go Live'].map(s => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(' ', '-')}`}
              className="hover:text-white transition-colors"
              onClick={e => {
                e.preventDefault()
                document.getElementById(s.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#111111' }}>
        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: GOLD,
                opacity: 0.15 + Math.random() * 0.25,
              }}
              animate={{ y: [0, -(80 + Math.random() * 120)], opacity: [0.2, 0.5, 0] }}
              transition={{ duration: 8 + Math.random() * 12, repeat: Infinity, delay: Math.random() * 8, ease: 'linear' }}
            />
          ))}
        </div>

        <motion.div
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <Image src="/guldmann-logo-stacked-white.png" alt="Guldmann" width={140} height={70} className="object-contain" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-bold tracking-tight leading-[1.05] mb-8"
            style={{ fontSize: 'clamp(3rem,8vw,6.5rem)' }}
          >
            One Platform.<br />
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Every System.</span><br />
            <span style={{ color: GOLD }}>Every Person.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Guldmann runs on SyncroTeam, HubSpot, Glenigan, and SharePoint. Right now, none of them talk to each other.
          </motion.p>

          <motion.a
            href="#problem"
            onClick={e => { e.preventDefault(); document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' }) }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-10 py-4 rounded-full font-bold text-lg cursor-pointer"
            style={{ background: GOLD, color: '#111111', boxShadow: `0 0 40px rgba(244,182,38,0.35)` }}
          >
            See What&apos;s Possible
          </motion.a>
        </motion.div>
      </section>

      {/* Section 2 - Problem */}
      <Section id="problem" dark>
        <div className="max-w-7xl mx-auto">
          <GoldHeading>Four Systems. Zero Integration.</GoldHeading>
          <p className="text-xl md:text-2xl mb-16 max-w-3xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Every engineer, every admin, every manager - switching tabs, copying data, losing time. Every single day.
          </p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { target: 4, suffix: '', label: 'Disconnected Systems' },
              { target: 100, suffix: '%', label: 'Manual Entry' },
              { target: 0, suffix: '%', label: 'Automated Today' },
            ].map(({ target, suffix, label }) => (
              <motion.div
                key={label}
                variants={cardVariant}
                className="p-8 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,182,38,0.15)' }}
              >
                <Counter target={target} suffix={suffix} />
                <div className="text-lg mt-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Section 3 - Platform */}
      <Section id="platform">
        <div className="max-w-7xl mx-auto">
          <GoldHeading>Connected. Unified. Role-Gated.</GoldHeading>
          <p className="text-xl md:text-2xl mb-16 max-w-3xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            One Microsoft login. Every tool they need. Nothing they don&apos;t.
          </p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
          >
            {tools.map(({ title, desc }) => (
              <motion.div
                key={title}
                variants={cardVariant}
                whileHover={{ borderColor: 'rgba(244,182,38,0.5)', scale: 1.02 }}
                className="p-7 rounded-2xl cursor-default transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,182,38,0.15)' }}
              >
                <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ~Â£5/month hosting. Microsoft login from day one.
          </p>
        </div>
      </Section>

      {/* Section 4 - AI Agents */}
      <Section id="ai-agents" dark>
        <div className="max-w-7xl mx-auto">
          <GoldHeading>An AI Agent for Every Role.</GoldHeading>
          <p className="text-xl md:text-2xl mb-16 max-w-3xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Knows their job. Reads their data. Never needs training.
          </p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {agents.map(({ role, chats }) => (
              <motion.div
                key={role}
                variants={cardVariant}
                className="p-7 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,182,38,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
                  <h3 className="text-xl font-bold" style={{ color: GOLD }}>{role}</h3>
                </div>
                <div className="space-y-4">
                  {chats.map(({ user, ai }, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {user}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm" style={{ background: 'rgba(244,182,38,0.08)', border: '1px solid rgba(244,182,38,0.2)', color: 'rgba(255,255,255,0.85)' }}>
                          {ai}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Section 5 - ROI */}
      <Section id="roi">
        <div className="max-w-7xl mx-auto text-center">
          <GoldHeading>The Maths.</GoldHeading>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center mt-16 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-10 rounded-3xl"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-xl mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Hiring a Senior AI Engineer</div>
              <div className="text-4xl md:text-5xl font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>Â£70k - Â£85k<span className="text-2xl">/year</span></div>
            </motion.div>

            <div className="text-3xl font-bold hidden md:block" style={{ color: 'rgba(255,255,255,0.2)' }}>VS</div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-10 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${GOLD}`, boxShadow: `0 0 60px rgba(244,182,38,0.15)` }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(244,182,38,0.08) 0%, transparent 70%)' }} />
              <div className="relative text-xl font-bold mb-3" style={{ color: GOLD }}>This Platform</div>
              <div className="relative text-5xl md:text-6xl font-bold text-white">Â£5<span className="text-2xl" style={{ color: 'rgba(255,255,255,0.5)' }}>/month + Josh</span></div>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl font-medium"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            The work of a Â£75k hire.{' '}
            <span style={{ color: GOLD }}>Already built. Working now.</span>
          </motion.p>
        </div>
      </Section>

      {/* Section 6 - CTA */}
      <Section id="go-live" dark>
        <div className="max-w-3xl mx-auto text-center">
          <GoldHeading>Three Things to Go Live.</GoldHeading>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 my-14 text-left"
          >
            {[
              { num: '01', text: 'Internal approval' },
              { num: '02', text: 'Azure credentials + M365 access' },
              { num: '03', text: 'SyncroTeam API key' },
            ].map(({ num, text }) => (
              <motion.div
                key={num}
                variants={cardVariant}
                className="flex items-center gap-6 p-7 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="text-4xl font-bold tabular-nums flex-shrink-0" style={{ color: 'rgba(255,255,255,0.1)' }}>{num}</div>
                <div className="text-xl font-medium text-white">{text}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 80px rgba(244,182,38,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-14 py-5 rounded-full font-bold text-2xl"
            style={{ background: GOLD, color: '#111111', boxShadow: '0 0 50px rgba(244,182,38,0.35)' }}
          >
            Let&apos;s Build This
          </motion.button>
        </div>
      </Section>
    </div>
  )
}


