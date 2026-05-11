"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

setWasmUrl("/dotlottie-player.wasm");

export function GlobeHero() {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square">
      <DotLottieReact
        src="/language-translator.lottie"
        autoplay
        loop
        className="w-full h-full"
      />
    </div>
  );
}
