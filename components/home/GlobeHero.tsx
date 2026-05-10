"use client";

import dynamic from "next/dynamic";
import { AudioButton } from "@/components/audio/AudioButton";

// The 3D globe imports three / @react-three/fiber / drei (~200 KB gzipped).
// Loading it eagerly would block first paint on the home page, so we lazy-
// load it client-side only and show a static fallback until the chunk lands.
const InteractiveGlobe = dynamic(() => import("./InteractiveGlobe"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-3/5 w-3/5 rounded-full bg-radial-[ellipse] from-amber-500/15 via-amber-500/5 to-transparent animate-pulse" />
    </div>
  ),
});

const BUBBLES: { lt: string; en: string; pos: string }[] = [
  // Positions are tuned to sit in each corner of the globe's square frame
  // without overlapping the sphere itself.
  { lt: "Ačiū!",              en: "Thank you!",            pos: "top-2 left-1 sm:top-4 sm:left-2" },
  { lt: "Labas!",             en: "Hello!",                pos: "top-2 right-1 sm:top-4 sm:right-2" },
  { lt: "Kur yra stotis?",    en: "Where is the station?", pos: "bottom-2 left-1 sm:bottom-6 sm:left-2" },
  { lt: "Aš esu iš užsienio.",en: "I'm from abroad.",      pos: "bottom-2 right-1 sm:bottom-6 sm:right-2" },
];

export function GlobeHero() {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square">
      {/* The interactive globe fills the square */}
      <div className="absolute inset-0">
        <InteractiveGlobe />
      </div>

      {/* Bubble overlays — HTML for crisp text rather than rendered in 3D */}
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
