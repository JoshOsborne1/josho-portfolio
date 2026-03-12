"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface WinScreenProps {
  score: number;
  message?: string;
  onReplay: () => void;
  onHome?: () => void;
}

export default function WinScreen({ score, message = "You won!", onReplay, onHome }: WinScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }[] = [];
    const colors = ["#A78BFA", "#5EEAD4", "#C4B5FD", "#34D399", "#F59E0B", "#FB7185"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -12 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        life: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.01;
        if (p.life <= 0) continue;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (particles.some((p) => p.life > 0)) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(240,235,255,0.85)", backdropFilter: "blur(20px)" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div
        className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-[32px]"
        style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 24px 60px rgba(167,139,250,0.2), inset 0 2px 4px rgba(255,255,255,0.9)",
          maxWidth: 320,
          width: "90%",
        }}
      >
        <div className="text-5xl font-black" style={{ color: "#A78BFA" }}>Win</div>
        <div className="text-center">
          <div className="font-black text-2xl" style={{ color: "#1e1b4b" }}>{message}</div>
          <div className="font-bold text-5xl mt-2" style={{ color: "#7c3aed" }}>{score}</div>
          <div className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: "#94a3b8" }}>points</div>
        </div>
        <div className="flex gap-3 w-full">
          <motion.button
            onClick={onReplay}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 rounded-2xl font-black text-white active:scale-95"
            style={{
              background: "linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)",
              boxShadow: "0 12px 24px rgba(167,139,250,0.3), inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            Play Again
          </motion.button>
          {onHome && (
            <motion.button
              onClick={onHome}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 rounded-2xl font-black active:scale-95"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.04), inset 0 4px 8px rgba(255,255,255,1), inset 0 -4px 8px rgba(0,0,0,0.04)",
                border: "1px solid rgba(255,255,255,0.9)",
                color: "#475569",
              }}
            >
              Home
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
