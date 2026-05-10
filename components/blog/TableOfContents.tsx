"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog/schema";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (!headings.length) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-bold mb-3">On this page</p>
      <ul className="space-y-1.5 border-l border-white/10">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
              <a
                href={`#${h.id}`}
                className={[
                  "block -ml-px pl-3 border-l py-1 transition-colors",
                  isActive
                    ? "border-amber-400 text-amber-300 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-200",
                ].join(" ")}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
