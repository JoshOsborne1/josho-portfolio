"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WaveMobile = dynamic(() => import("./WaveMobile"), { ssr: false });
const WaveDesktop = dynamic(() => import("./WaveDesktop"), { ssr: false });

export default function WavePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  return isMobile ? <WaveMobile /> : <WaveDesktop />;
}
