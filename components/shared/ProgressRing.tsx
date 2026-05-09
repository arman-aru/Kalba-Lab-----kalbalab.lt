"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;        // 0-100
  size?: number;        // px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

/** Smoothly count up from previous to next number. */
function useCountUp(target: number, durationMs = 700) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return display;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const numericLabel = label != null && /^\d+$/.test(label) ? Number(label) : null;
  const counted = useCountUp(numericLabel ?? 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)",
            filter: value > 0 ? "drop-shadow(0 0 6px rgba(245,158,11,0.55))" : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-xl font-extrabold text-amber-300 tabular-nums leading-none">
            {numericLabel !== null ? counted : label}
          </span>
        )}
        {sublabel && <span className="mt-0.5 text-[10px] text-gray-400 tabular-nums">{sublabel}</span>}
      </div>
    </div>
  );
}
