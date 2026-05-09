"use client";

/**
 * Lightweight backdrop for app pages.
 * Drifting gradient orbs + subtle masked grid.
 * No canvas — keeps protected pages snappy with lots of data.
 */
export function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(245,158,11,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl animate-orb-1" />
      <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-3xl animate-orb-2" />
    </div>
  );
}
