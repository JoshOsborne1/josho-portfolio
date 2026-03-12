"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  timeLeft: number;
  maxTime: number;
  size?: number;
}

export default function Timer({ timeLeft, maxTime, size = 80 }: TimerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;
    const progress = timeLeft / maxTime;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + progress * 2 * Math.PI;

    ctx.clearRect(0, 0, size, size);

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(167,139,250,0.15)";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Progress ring
    if (progress > 0) {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      const pct = timeLeft / maxTime;
      if (pct > 0.5) {
        gradient.addColorStop(0, "#C4B5FD");
        gradient.addColorStop(1, "#5EEAD4");
      } else if (pct > 0.25) {
        gradient.addColorStop(0, "#A78BFA");
        gradient.addColorStop(1, "#F59E0B");
      } else {
        gradient.addColorStop(0, "#EF4444");
        gradient.addColorStop(1, "#F97316");
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Number
    ctx.fillStyle = "#1e1b4b";
    ctx.font = `900 ${size * 0.3}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.ceil(timeLeft)), cx, cy);
  }, [timeLeft, maxTime, size]);

  return (
    <motion.canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      animate={timeLeft <= 5 ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3, repeat: timeLeft <= 5 ? Infinity : 0 }}
    />
  );
}
