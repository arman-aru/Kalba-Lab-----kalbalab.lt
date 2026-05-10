"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ExamTimerBarProps {
  totalSeconds: number;
  onExpire?: () => void;
  className?: string;
}

export function ExamTimerBar({ totalSeconds, onExpire, className }: ExamTimerBarProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  // Hold onExpire in a ref so unstable inline arrows from the parent don't
  // re-trigger the tick effect. Otherwise frequent parent re-renders (e.g. a
  // textarea keystroke during the writing phase) would reschedule the
  // 1-second timeout indefinitely and the clock would never advance.
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const pct = (remaining / totalSeconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const label = `${mins}:${secs.toString().padStart(2, "0")}`;

  const barColor = pct > 50 ? "bg-emerald-500" : pct > 25 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "text-sm font-mono font-bold min-w-[3rem]",
          pct > 50 ? "text-emerald-400" : pct > 25 ? "text-amber-400" : "text-red-400"
        )}
      >
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
