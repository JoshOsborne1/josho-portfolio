"use client";
import { useRef, useEffect, useCallback } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  color: string;
}

interface GlobeViewProps {
  guesses: MarkerData[];
  answerLat?: number;
  answerLng?: number;
}

function latLngToXYZ(lat: number, lng: number, rotY: number): { x: number; y: number; visible: boolean } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180) + rotY;
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return { x, y, visible: z > -0.1 };
}

export default function GlobeView({ guesses, answerLat, answerLng }: GlobeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotY = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const R = Math.min(W, H) * 0.42;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Globe fill
    const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.05, cx, cy, R);
    grad.addColorStop(0, "#4F46E5");
    grad.addColorStop(0.5, "#1E1B4B");
    grad.addColorStop(1, "#0F0E2A");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 0.8;
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const ry = Math.cos(phi);
      const rx = Math.sin(phi);
      const screenY = cy + ry * R;
      const ellipseW = rx * R;
      if (ellipseW > 1) {
        ctx.beginPath();
        ctx.ellipse(cx, screenY, ellipseW, ellipseW * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // Longitude lines
    for (let lng = 0; lng < 180; lng += 30) {
      const theta = (lng * Math.PI / 180) + rotY.current;
      const cosT = Math.cos(theta);
      ctx.beginPath();
      ctx.ellipse(cx + cosT * 0, cy, Math.abs(Math.sin(theta)) * R, R, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Globe border
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(167,139,250,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Markers
    const allMarkers = [
      ...guesses.map(g => ({ ...g })),
      ...(answerLat !== undefined && answerLng !== undefined ? [{ lat: answerLat, lng: answerLng, color: "#F59E0B" }] : []),
    ];

    for (const m of allMarkers) {
      const { x, y, visible } = latLngToXYZ(m.lat, m.lng, rotY.current);
      if (!visible) continue;
      const px = cx + x * R;
      const py = cy - y * R;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = m.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [guesses, answerLat, answerLng]);

  useEffect(() => {
    let last = 0;
    const animate = (t: number) => {
      if (!dragging.current) rotY.current += 0.003;
      if (t - last > 16) { draw(); last = t; }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; lastX.current = e.clientX; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    rotY.current += (e.clientX - lastX.current) * 0.01;
    lastX.current = e.clientX;
  };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchStart = (e: React.TouchEvent) => { dragging.current = true; lastX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    rotY.current += (e.touches[0].clientX - lastX.current) * 0.01;
    lastX.current = e.touches[0].clientX;
  };

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      style={{ width: "100%", height: "100%", cursor: "grab", borderRadius: "inherit", display: "block" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    />
  );
}