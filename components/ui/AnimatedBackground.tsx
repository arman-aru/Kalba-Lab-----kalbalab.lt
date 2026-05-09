"use client";

import { useEffect, useRef } from "react";

/**
 * Layered animated background:
 *  - Particle network canvas (connected dots, follows pointer)
 *  - Drifting gradient orbs
 *  - Parallax grid
 *  - Diagonal light beam
 *
 * Designed to sit at z-[-10] behind page content.
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0, height = 0;
    let raf = 0;

    type P = { x: number; y: number; vx: number; vy: number };
    let particles: P[] = [];
    const pointer = { x: -9999, y: -9999 };

    const reset = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(110, Math.floor((width * height) / 14000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // gentle pull toward pointer
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const f = 0.0008;
          p.vx += dx * f;
          p.vy += dy * f;
        }
        // soft damping
        p.vx *= 0.995;
        p.vy *= 0.995;
      }

      // edges
      const linkDist = 130;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const op = (1 - dist / linkDist) * 0.18;
            ctx.strokeStyle = `rgba(245, 158, 11, ${op})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // dots
      for (const p of particles) {
        ctx.fillStyle = "rgba(245, 158, 11, 0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };

    const ro = new ResizeObserver(reset);
    ro.observe(canvas);

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);
    reset();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Parallax grid */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(245,158,11,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      {/* Diagonal light beam */}
      <div className="absolute -top-1/3 left-1/2 h-[140%] w-[40%] -translate-x-1/2 rotate-12 bg-gradient-to-b from-amber-500/10 via-amber-500/[0.02] to-transparent blur-3xl" />

      {/* Drifting gradient orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl animate-orb-1" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl animate-orb-2" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/[0.07] blur-3xl animate-orb-3" />

      {/* Particle network canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
