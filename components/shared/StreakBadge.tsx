"use client";

import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  count: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakBadge({ count, showLabel = true, size = "md", className }: StreakBadgeProps) {
  const sizeClass = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1.5",
  }[size];

  const emojiSize = { sm: "text-sm", md: "text-lg", lg: "text-2xl" }[size];
  const countSize = { sm: "text-xs", md: "text-sm font-bold", lg: "text-lg font-bold" }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5",
        "bg-orange-500/10 border border-orange-500/20",
        sizeClass,
        className
      )}
      title={`${count}-day streak / ${count} দিনের ধারাবাহিকতা`}
    >
      <span className={emojiSize}>🔥</span>
      <span className={cn("text-orange-400", countSize)}>{count}</span>
      {showLabel && <span className="text-orange-400/70 text-xs">days</span>}
    </span>
  );
}
