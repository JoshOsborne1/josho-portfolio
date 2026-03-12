"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({ score, label = "Score", size = "md" }: ScoreDisplayProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));

  useEffect(() => {
    const controls = animate(count, score, { duration: 0.4, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  const sizes = {
    sm: { num: "text-2xl", lbl: "text-xs" },
    md: { num: "text-4xl", lbl: "text-sm" },
    lg: { num: "text-6xl", lbl: "text-base" },
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={`font-black ${sizes[size].num}`}
        style={{ color: "#1e1b4b", letterSpacing: "-0.03em" }}
      >
        {rounded}
      </motion.div>
      {label && (
        <span
          className={`font-bold ${sizes[size].lbl} uppercase tracking-widest`}
          style={{ color: "#7c3aed" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
