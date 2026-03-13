"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDaily } from "../components/useDaily";

const WaveMobile = dynamic(() => import("../../wave/WaveMobile"), { ssr: false });
const WaveDesktop = dynamic(() => import("../../wave/WaveDesktop"), { ssr: false });

export default function WaveGamePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { markPlayed, ready } = useDaily('wave');

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mark wave as played after 2 minutes of engagement
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => markPlayed({ result: 'played' }), 120000);
    return () => clearTimeout(t);
  }, [mounted, markPlayed]);

  if (!mounted || !ready) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal back nav - doesn't interfere with Wave UI */}
      <div
        className="absolute top-3 left-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-xl no-underline"
        style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}
      >
        <Link href="/games" className="no-underline flex items-center gap-1.5">
          <span className="font-black text-white text-xs">Games</span>
        </Link>
      </div>
      {isMobile ? <WaveMobile /> : <WaveDesktop />}
    </div>
  );
}
