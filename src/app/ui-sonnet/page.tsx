"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

﻿function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{background:"#fff"}} className={"sticky top-0 z-50 transition-shadow duration-200 " + (scrolled ? "shadow-sm border-b border-[#E8E6E1]" : "border-b border-transparent")}>
      <div className="max-w-[960px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-semibold text-[#1C1C1A]">josho.pro</a>
        <div className="flex items-center gap-6 text-sm text-[#6B6B67]">
          <a href="#work" className="hover:text-[#1C1C1A] transition-colors">Work</a>
          <a href="#pricing" className="hover:text-[#1C1C1A] transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-[#1C1C1A] transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
}


﻿function Hero() {
  return (
    <section className="min-h-[100dvh] flex items-center justify-center px-6 py-20">
      <motion.div className="max-w-[680px] mx-auto text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <p className="text-sm font-medium uppercase tracking-wide text-[#B85C38] mb-4">Based in Bristol, BS16</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1C1C1A] mb-6">Websites for Bristol businesses.</h1>
        <p className="text-base leading-relaxed text-[#6B6B67] mb-10 max-w-[520px] mx-auto">
          I build a working demo of your site before you pay anything. If you like it, we go ahead. If not, no hard feelings.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a href="#work" className="inline-block bg-[#B85C38] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#a24d2e] transition-colors">See example work</a>
          <a href="mailto:contact@josho.pro?subject=Free%2015-min%20call" className="text-sm text-[#6B6B67] hover:text-[#1C1C1A] transition-colors">Book a free 15-min call</a>
        </div>
        <p className="text-sm text-[#6B6B67]">Fixed prices. You own everything. Delivered in 3 days.</p>
      </motion.div>
    </section>
  );
}


﻿function WhatIDo() {
  return (
    <section className="py-16 px-6 border-t border-[#E8E6E1]">
      <div className="max-w-[680px] mx-auto">
        <p className="text-sm font-medium uppercase tracking-wide text-[#B85C38] mb-4">What I do</p>
        <h2 className="text-3xl font-semibold text-[#1C1C1A] tracking-tight mb-4">A proper website. Built for your customers.</h2>
        <p className="text-base leading-relaxed text-[#6B6B67] mb-6">
          I work with sole traders, small businesses, and independents across Bristol. You get a clean, fast site that shows up on Google, works on any phone, and tells your customers exactly what you do.
        </p>
        <p className="text-base leading-relaxed text-[#6B6B67]">No templates. No page builders. No monthly fees. Just a website that does its job.</p>
      </div>
    </section>
  );
}


﻿const steps = [
  { number: "01", title: "I research your business and build a demo", body: "I look at your competitors, your area, and what customers search for. Then I build a working version of your new site - properly designed, not a wireframe." },
  { number: "02", title: "You see the demo - for free", body: "No commitment. No deposit. You see exactly what your new site would look like before spending a penny. If you do not love it, that is fine." },
  { number: "03", title: "If you love it, we go ahead", body: "You pay, I deploy. Done in 3 days. You own the domain, the code, everything. No lock-in, no ongoing fees unless you want them." },
];

function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white border-t border-[#E8E6E1]">
      <div className="max-w-[960px] mx-auto">
        <p className="text-sm font-medium uppercase tracking-wide text-[#B85C38] mb-4 text-center">How it works</p>
        <h2 className="text-3xl font-semibold text-[#1C1C1A] tracking-tight mb-12 text-center">Simple. No surprises.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <p className="text-3xl font-semibold text-[#E8E6E1] mb-4">{step.number}</p>
              <h3 className="text-lg font-semibold text-[#1C1C1A] mb-3">{step.title}</h3>
              <p className="text-base leading-relaxed text-[#6B6B67]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


﻿const projects = [
  { category: "Plumbing & Heating", gradient: "bg-gradient-to-br from-orange-50 to-amber-100", title: "Bristol Heating Co.", description: "Emergency call-out plumber. Built around local search and click-to-call." },
  { category: "Hair & Beauty", gradient: "bg-gradient-to-br from-rose-50 to-pink-100", title: "Redland Hair Studio", description: "Independent salon. Online booking, pricing, and team profiles." },
  { category: "Food & Hospitality", gradient: "bg-gradient-to-br from-emerald-50 to-teal-100", title: "The Anchor, Clifton", description: "Local pub and kitchen. Menu, events, and table enquiry form." },
  { category: "Professional Services", gradient: "bg-gradient-to-br from-sky-50 to-blue-100", title: "Hartley Accounts", description: "Small business accountant. Clean credibility site with a contact funnel." },
];

function Portfolio() {
  return (
    <section id="work" className="py-20 px-6 border-t border-[#E8E6E1]">
      <div className="max-w-[960px] mx-auto">
        <p className="text-sm font-medium uppercase tracking-wide text-[#B85C38] mb-4">Example work</p>
        <h2 className="text-3xl font-semibold text-[#1C1C1A] tracking-tight mb-12">Sites built for Bristol businesses.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="bg-white border border-[#E8E6E1] rounded-2xl overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <p className="text-xs text-[#6B6B67] uppercase tracking-wide font-medium">{p.category}</p>
              </div>
              <div className={p.gradient + " h-48 mx-5 rounded-xl mb-4"} />
              <div className="px-5 pb-5">
                <h3 className="font-semibold text-[#1C1C1A] mb-1">{p.title}</h3>
                <p className="text-sm text-[#6B6B67] mb-3">{p.description}</p>
                <a href="mailto:contact@josho.pro?subject=Demo%20request" className="text-sm font-medium text-[#B85C38] hover:underline">View demo</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


﻿const tiers = [
  { name: "Website", price: "From £350", timeline: "3 days", description: "Up to 5 pages. Mobile-first design. Fast hosting setup. Contact form. You own the domain and code.", highlight: false },
  { name: "Automation", price: "From £400", timeline: "3 days", description: "Booking forms, enquiry routing, follow-up emails, quote calculators. Reduces manual admin.", highlight: true },
  { name: "Website + Automation", price: "From £650", timeline: "5 days", description: "Everything in both packages. Full site plus the automation built in from day one.", highlight: false },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-white border-t border-[#E8E6E1]">
      <div className="max-w-[960px] mx-auto">
        <p className="text-sm font-medium uppercase tracking-wide text-[#B85C38] mb-4">Pricing</p>
        <h2 className="text-3xl font-semibold text-[#1C1C1A] tracking-tight mb-4">Fixed prices. No surprises.</h2>
        <p className="text-base leading-relaxed text-[#6B6B67] mb-12 max-w-[520px]">You know the cost upfront. No hidden extras, no scope creep fees, no monthly invoices.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {tiers.map((tier) => (
            <div key={tier.name} className={["rounded-2xl p-6 border", tier.highlight ? "border-[#B85C38] bg-[#FFF8F5]" : "border-[#E8E6E1] bg-white"].join(" ")}>
              {tier.highlight && <p className="text-xs font-medium uppercase tracking-wide text-[#B85C38] mb-3">Most popular</p>}
              <h3 className="font-semibold text-[#1C1C1A] mb-1">{tier.name}</h3>
              <p className="text-2xl font-semibold text-[#1C1C1A] mb-1">{tier.price}</p>
              <p className="text-sm text-[#6B6B67] mb-4">Delivered in {tier.timeline}</p>
              <p className="text-sm leading-relaxed text-[#6B6B67]">{tier.description}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-[#6B6B67] max-w-[520px]">No monthly fees. No retainers. You own the code, the domain, everything. I do not lock you in.</p>
      </div>
    </section>
  );
}


﻿

function Contact() {
  const [name, setName] = useState("");
  const [bizType, setBizType] = useState("");
  const [need, setNeed] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Website enquiry from " + name);
    const body = encodeURIComponent("Name: " + name + "\nBusiness type: " + bizType + "\nWhat they need: " + need);
    window.location.href = "mailto:contact@josho.pro?subject=" + subject + "&body=" + body;
  };
  return (
    <section id="contact" className="py-20 px-6 border-t border-[#E8E6E1]">
      <div className="max-w-[680px] mx-auto">
        <p className="text-sm font-medium uppercase tracking-wide text-[#B85C38] mb-4">Get in touch</p>
        <h2 className="text-3xl font-semibold text-[#1C1C1A] tracking-tight mb-4">Lets talk about your website.</h2>
        <p className="text-base leading-relaxed text-[#6B6B67] mb-4">Based in BS16, Emersons Green. Working across Bristol and the UK.</p>
        <p className="text-sm text-[#6B6B67] mb-10">Email: <a href="mailto:contact@josho.pro" className="text-[#B85C38] hover:underline">contact@josho.pro</a></p>
        <a href="mailto:contact@josho.pro?subject=Free%2015-min%20call" className="inline-block bg-[#B85C38] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#a24d2e] transition-colors mb-12">Book a free 15-minute call</a>
        <div className="border-t border-[#E8E6E1] pt-12">
          <h3 className="text-lg font-semibold text-[#1C1C1A] mb-6">Or send a quick message</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1C1C1A] mb-2">Your name</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className="w-full border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#1C1C1A] bg-white placeholder:text-[#6B6B67] focus:outline-none focus:border-[#B85C38] transition-colors" />
            </div>
            <div>
              <label htmlFor="biztype" className="block text-sm font-medium text-[#1C1C1A] mb-2">Type of business</label>
              <input id="biztype" type="text" required value={bizType} onChange={(e) => setBizType(e.target.value)} placeholder="e.g. Plumber, salon, accountant" className="w-full border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#1C1C1A] bg-white placeholder:text-[#6B6B67] focus:outline-none focus:border-[#B85C38] transition-colors" />
            </div>
            <div>
              <label htmlFor="need" className="block text-sm font-medium text-[#1C1C1A] mb-2">What do you need?</label>
              <textarea id="need" required rows={4} value={need} onChange={(e) => setNeed(e.target.value)} placeholder="Tell me a bit about what you are after" className="w-full border border-[#E8E6E1] rounded-lg px-4 py-3 text-sm text-[#1C1C1A] bg-white placeholder:text-[#6B6B67] focus:outline-none focus:border-[#B85C38] transition-colors resize-none" />
            </div>
            <button type="submit" className="bg-[#1C1C1A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#333330] transition-colors">Send message</button>
          </form>
        </div>
      </div>
    </section>
  );
}


﻿function Footer() {
  return (
    <footer style={{borderTop:"1px solid #E8E6E1", padding:"24px", textAlign:"center", fontSize:"13px", color:"#6B6B67"}}>
      2025 josho.pro - Based in Bristol, BS16
    </footer>
  );
}


export default function Page() {
  return (
    <div style={{ background: "#FAFAF8", color: "#1C1C1A", minHeight: "100vh" }}>
      <div style={{background:"#f0f0f0", padding:"8px 16px", fontSize:"12px", fontFamily:"monospace", borderBottom:"1px solid #ddd"}}>
        josho.pro UI test - Sonnet 4.6 build - <a href="/ui-sonnet">Sonnet</a> | <a href="/ui-gemini">Gemini</a> | <a href="/ui-minimax">MiniMax</a> | <a href="/ui-best">Best</a>
      </div>
      <Nav />
      <main>
        <Hero />
        <WhatIDo />
        <HowItWorks />
        <Portfolio />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}