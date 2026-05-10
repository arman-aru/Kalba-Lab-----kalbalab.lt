"use client";

import { useEffect, useState } from "react";
import { Focus } from "lucide-react";

const CLASS = "blog-focus-mode";

export function FocusModeToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(CLASS, on);
    return () => document.documentElement.classList.remove(CLASS);
  }, [on]);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      className={[
        "inline-flex items-center gap-1.5 px-2.5 h-7 rounded-lg border text-xs font-semibold transition-colors",
        on
          ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
          : "bg-white/[0.03] text-gray-400 border-white/10 hover:text-gray-200",
      ].join(" ")}
    >
      <Focus size={12} />
      Focus
    </button>
  );
}
