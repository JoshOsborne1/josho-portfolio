"use client";

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        background: "linear-gradient(135deg,#C4B5FD,#A78BFA)",
        fontSize: 11,
        fontWeight: 900,
        color: "white",
        letterSpacing: "0.04em",
        boxShadow: "0 2px 8px rgba(167,139,250,0.4)",
      }}
    >
      PRO
    </div>
  );
}
