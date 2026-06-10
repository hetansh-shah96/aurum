"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  alpha: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  glow: string;
}

const PALETTE = [
  { fill: "#C9A84C", glow: "#C9A84C" },
  { fill: "#E8D5A3", glow: "#E8D5A3" },
  { fill: "#00d4c8", glow: "#00d4c8" },
  { fill: "#ffffff", glow: "#C9A84C" },
];

function spawnBurst(particles: Particle[], x: number, y: number, count: number, speed: number) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const v = speed * (0.5 + Math.random() * 0.8);
    const swatch = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      alpha: 0.8 + Math.random() * 0.2,
      size: 1.5 + Math.random() * 3,
      vx: Math.cos(angle) * v,
      vy: Math.sin(angle) * v,
      color: swatch.fill,
      glow: swatch.glow,
    });
  }
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const prev = useRef({ x: -1000, y: -1000 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Desktop: comet trail ──────────────────────────────────────────────
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    const onMouseMove = (e: MouseEvent) => {
      if (isCoarse) return;
      const dx = e.clientX - prev.current.x;
      const dy = e.clientY - prev.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      prev.current = { x: e.clientX, y: e.clientY };

      const count = Math.min(8, Math.ceil(speed * 0.3) + 2);
      for (let i = 0; i < count; i++) {
        const swatch = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 3,
          y: e.clientY + (Math.random() - 0.5) * 3,
          alpha: 0.7 + Math.random() * 0.3,
          size: 1.8 + Math.random() * 2.8,
          vx: -(dx * 0.08) + (Math.random() - 0.5) * 0.6,
          vy: -(dy * 0.08) + (Math.random() - 0.5) * 0.6 + 0.2,
          color: swatch.fill,
          glow: swatch.glow,
        });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Mobile: radial burst on tap ───────────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      for (let t = 0; t < e.changedTouches.length; t++) {
        const touch = e.changedTouches[t];
        spawnBurst(particles.current, touch.clientX, touch.clientY, 18, 3.5);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.glow;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha *= 0.87;
        p.size  *= 0.96;

        if (p.alpha < 0.015) particles.current.splice(i, 1);
      }

      raf.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998, mixBlendMode: "screen" }}
    />
  );
}
