"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProGateProps {
  onClose: () => void;
}

async function startCheckout(priceId: string, email: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, email }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

export function ProGate({ onClose }: ProGateProps) {
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem("games-user-email") || ""; } catch { return ""; }
  });
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (annual: boolean) => {
    const trimmed = email.trim();
    if (trimmed) {
      try { localStorage.setItem("games-user-email", trimmed); } catch {}
    }
    setLoading(true);
    const priceId = annual
      ? (process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || "price_1TAeyZ4C761DH1sqcam6krV0")
      : (process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_1TAeyZ4C761DH1sqXCUs4KzJ");
    await startCheckout(priceId, trimmed);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(240,235,255,0.85)", backdropFilter: "blur(20px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm rounded-[28px] p-6 flex flex-col gap-4"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 60px rgba(167,139,250,0.25)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-black text-xl" style={{ color: "#1e1b4b" }}>Daily limit reached</div>
            <div className="font-bold text-sm mt-1" style={{ color: "#64748b" }}>
              Free: 5 games/day. Go Pro for unlimited.
            </div>
          </div>
          <button onClick={onClose} className="font-bold text-sm" style={{ color: "#94a3b8" }}>Done</button>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs" style={{ color: "#7c3aed" }}>Email (keeps Pro access across devices)</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="px-4 py-2.5 rounded-xl font-bold text-sm outline-none"
            style={{
              background: "rgba(167,139,250,0.08)",
              border: "2px solid rgba(167,139,250,0.2)",
              color: "#1e1b4b",
            }}
          />
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-2">
          <motion.button
            onClick={() => handleCheckout(false)}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-black text-white text-base"
            style={{
              background: loading ? "#c4b5fd" : "linear-gradient(180deg,#C4B5FD,#A78BFA)",
              boxShadow: "0 8px 20px rgba(167,139,250,0.35)",
            }}
          >
            {loading ? "Loading..." : "Go Pro - £2.99/month"}
          </motion.button>

          <motion.button
            onClick={() => handleCheckout(true)}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-black text-sm"
            style={{
              background: "rgba(167,139,250,0.1)",
              border: "2px solid rgba(167,139,250,0.3)",
              color: "#7c3aed",
            }}
          >
            £19.99/year - save 44%
          </motion.button>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-1.5">
          {["Unlimited games daily", "No ads", "Streak protection", "Stats dashboard"].map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#A78BFA" }} />
              <span className="font-bold text-xs" style={{ color: "#475569" }}>{f}</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="font-bold text-xs text-center" style={{ color: "#94a3b8" }}>
          Maybe tomorrow
        </button>
      </motion.div>
    </div>
  );
}
