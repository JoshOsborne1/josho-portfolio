"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GameCardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
}

export default function GameCard({ children, className = "", padding = "p-6" }: GameCardProps) {
  return (
    <motion.div
      className={`${padding} ${className}`}
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 32,
        boxShadow: "0 16px 40px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.8)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {children}
    </motion.div>
  );
}
