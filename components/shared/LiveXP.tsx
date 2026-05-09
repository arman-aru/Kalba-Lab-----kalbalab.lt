"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { formatXP } from "@/lib/utils";

export function LiveXP() {
  const userXP = useAppStore((s) => s.user?.total_xp ?? 0);
  const lastXPGain = useAppStore((s) => s.lastXPGain);

  const [displayed, setDisplayed] = useState(userXP);
  const fromRef = useRef(userXP);
  const [floatGain, setFloatGain] = useState<{ amount: number; key: number } | null>(null);

  // Count-up animation when userXP changes
  useEffect(() => {
    const from = fromRef.current;
    const to = userXP;
    if (from === to) return;
    const duration = 800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [userXP]);

  // Float-up "+X" indicator (fires when something elsewhere calls addXP)
  useEffect(() => {
    if (!lastXPGain) return;
    setFloatGain({ amount: lastXPGain.amount, key: lastXPGain.at });
    const id = setTimeout(() => setFloatGain(null), 1400);
    return () => clearTimeout(id);
  }, [lastXPGain]);

  return (
    <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_20px_-6px_rgba(245,158,11,0.5)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      <Star size={14} className="text-amber-300 fill-amber-300" />
      <span className="text-amber-300 font-bold text-sm tabular-nums">
        {formatXP(displayed)} XP
      </span>
      {floatGain && (
        <span
          key={floatGain.key}
          className="pointer-events-none absolute -top-1 right-2 text-[11px] font-bold text-emerald-300"
          style={{ animation: "xpFloat 1.4s ease-out forwards" }}
        >
          +{floatGain.amount}
        </span>
      )}
    </div>
  );
}
