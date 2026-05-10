"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";

// The 3D globe pulls in three / @react-three/fiber / drei (~200 KB gzipped)
// and runs a heavy init loop. To protect Lighthouse / Core Web Vitals we:
//   1. Lazy-load it (SSR off so it doesn't run during pre-render).
//   2. Only mount it AFTER first paint AND when the slot is on-screen.
//   3. Wait for `requestIdleCallback` so we don't fight the page becoming
//      interactive (this is what was driving the 14 s mobile TBT).
const InteractiveGlobe = dynamic(() => import("./InteractiveGlobe"), {
  ssr: false,
  loading: () => null,
});

const BUBBLES: { lt: string; en: string; pos: string }[] = [
  { lt: "Ačiū!",              en: "Thank you!",            pos: "top-2 left-1 sm:top-4 sm:left-2" },
  { lt: "Labas!",             en: "Hello!",                pos: "top-2 right-1 sm:top-4 sm:right-2" },
  { lt: "Kur yra stotis?",    en: "Where is the station?", pos: "bottom-2 left-1 sm:bottom-6 sm:left-2" },
  { lt: "Aš esu iš užsienio.",en: "I'm from abroad.",      pos: "bottom-2 right-1 sm:bottom-6 sm:right-2" },
];

export function GlobeHero() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (!slotRef.current) return;
    let cancelled = false;
    let idleHandle: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (cancelled || !entries[0]?.isIntersecting) return;
        observer.disconnect();
        // Wait until the browser is idle so we don't fight Time-To-Interactive.
        const ric =
          typeof window.requestIdleCallback === "function"
            ? window.requestIdleCallback
            : (cb: () => void) => window.setTimeout(cb, 800);
        idleHandle = ric(() => { if (!cancelled) setShouldMount(true); }) as number;
      },
      { rootMargin: "200px" },
    );
    observer.observe(slotRef.current);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (idleHandle !== null && typeof window.cancelIdleCallback === "function") {
        try { window.cancelIdleCallback(idleHandle); } catch { /* noop */ }
      }
    };
  }, []);

  return (
    <div ref={slotRef} className="relative w-full max-w-xl mx-auto aspect-square">
      {/* Reserved slot — keeps layout stable whether or not the globe mounts. */}
      <div className="absolute inset-0 grid place-items-center">
        {shouldMount ? (
          <div className="absolute inset-0">
            <InteractiveGlobe />
          </div>
        ) : (
          // Cheap CSS placeholder so there's something to look at while the
          // user is reading the headline. Zero JS, no layout shift, no TBT.
          <div className="h-3/4 w-3/4 rounded-full bg-radial from-amber-500/15 via-amber-500/5 to-transparent" />
        )}
      </div>

      {/* Speech bubble overlays — HTML, render immediately, no 3D dependency. */}
      {BUBBLES.map((b) => (
        <div
          key={b.lt}
          className={`absolute ${b.pos} max-w-[44%] sm:max-w-[40%] z-10`}
        >
          <div className="rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg shadow-black/40">
            <div className="flex items-center gap-2">
              <p className="font-bold text-amber-300 text-sm sm:text-base">{b.lt}</p>
              <AudioButton text={b.lt} size="sm" />
            </div>
            <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">{b.en}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
