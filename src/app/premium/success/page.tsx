"use client";
import { useEffect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Set premium expiry to 32 days (buffer)
      const expires = Date.now() + 32 * 24 * 60 * 60 * 1000;
      localStorage.setItem("josho_premium_expires", String(expires));
    }
  }, [sessionId]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#f5f5f5", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>You&apos;re premium now.</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32, textAlign: "center" }}>No ads. Hard mode. All yours.</p>
      <a href="/games" style={{ background: "#7c3aed", color: "#fff", padding: "14px 28px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
        Start playing →
      </a>
    </div>
  );
}

export default function PremiumSuccess() {
  return <Suspense><SuccessContent /></Suspense>;
}
