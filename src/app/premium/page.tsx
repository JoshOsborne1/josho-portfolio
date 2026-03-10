"use client";
import { useState } from "react";

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "£2.99",
    period: "/month",
    priceId: "STRIPE_MONTHLY_PRICE_ID",
    badge: null,
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "£19.99",
    period: "/year",
    priceId: "STRIPE_YEARLY_PRICE_ID",
    badge: "Save 44%",
  },
];

const FEATURES = [
  { icon: "🚫", label: "No ads — ever" },
  { icon: "🔥", label: "Hard mode on all games" },
  { icon: "📅", label: "Full puzzle archive" },
  { icon: "💡", label: "Unlimited hints" },
  { icon: "🏆", label: "Streak freeze protection" },
  { icon: "✨", label: "New games first" },
];

export default function PremiumPage() {
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const plan = PLANS.find(p => p.id === selected)!;
    // Redirect to Stripe Checkout — server-side session creation
    try {
      const res = await fetch("/api/checkout/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0b", color: "#f5f5f5", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/games" style={{ color: "#f5f5f5", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>
          josho<span style={{ color: "#7c3aed" }}>.pro</span>
        </a>
        <a href="/games" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14 }}>← Back to games</a>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 999, padding: "4px 12px", marginBottom: 24 }}>
          <span style={{ fontSize: 14 }}>✨</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>josho.pro Premium</span>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
          Play more.<br /><span style={{ color: "#7c3aed" }}>Ads: gone.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 36, fontSize: 16, lineHeight: 1.6 }}>
          One pass. All 9 games. No interruptions.
        </p>

        {/* Plan toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id as "monthly" | "yearly")}
              style={{
                flex: 1, padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all 0.15s",
                border: selected === plan.id ? "2px solid #7c3aed" : "2px solid rgba(255,255,255,0.08)",
                background: selected === plan.id ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                color: "#f5f5f5", position: "relative",
              }}
            >
              {plan.badge && (
                <div style={{ position: "absolute", top: -10, right: 8, background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 18 }}>{plan.price}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{plan.period}</div>
              <div style={{ fontSize: 12, marginTop: 4, fontWeight: 600, color: selected === plan.id ? "#a78bfa" : "rgba(255,255,255,0.4)" }}>{plan.label}</div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 20px", marginBottom: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < FEATURES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span style={{ fontSize: 16 }}>{f.icon}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{f.label}</span>
              <span style={{ marginLeft: "auto", color: "#7c3aed", fontWeight: 700 }}>✓</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: "100%", padding: "16px", borderRadius: 12, background: "#7c3aed", color: "#fff",
            fontWeight: 800, fontSize: 16, border: "none", cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1, transition: "all 0.15s", letterSpacing: "-0.01em",
          }}
        >
          {loading ? "Redirecting..." : `Get Premium ${selected === "yearly" ? "— £19.99/year" : "— £2.99/month"}`}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
}
