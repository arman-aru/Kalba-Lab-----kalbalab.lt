"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.min(100, Math.max(0, (el.scrollTop / total) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[55] h-0.5 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
