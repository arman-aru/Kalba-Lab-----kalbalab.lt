"use client";

import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { speakLithuanian, stopSpeaking } from "@/lib/audio";

interface AudioButtonProps {
  text: string;
  lang?: string;
  showSlow?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onPlay?: () => void;
}

export function AudioButton({
  text,
  lang = "lt-LT",
  showSlow = false,
  size = "md",
  className,
  onPlay,
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);

  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size];

  const iconSize = { sm: 12, md: 15, lg: 18 }[size];

  const play = useCallback(
    async (rate: number = 1) => {
      if (isPlaying) {
        stopSpeaking();
        setIsPlaying(false);
        return;
      }
      setIsError(false);
      setIsPlaying(true);
      onPlay?.();
      try {
        await speakLithuanian(text, rate);
      } catch {
        setIsError(true);
        setTimeout(() => setIsError(false), 3000);
      } finally {
        setIsPlaying(false);
      }
    },
    [text, isPlaying, onPlay]
  );

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => play(1)}
        className={cn(
          "inline-flex items-center justify-center rounded-full border transition-all",
          "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20",
          "focus-visible:outline-2 focus-visible:outline-amber-500",
          sizeClass,
          isPlaying && "audio-playing border-amber-400 bg-amber-500/30",
          isError && "border-red-500/50 bg-red-500/10"
        )}
        aria-label={`শুনুন: ${text} / Listen: ${text}`}
        title={`Play: ${text}`}
      >
        {isError ? (
          <VolumeX size={iconSize} className="text-red-400" />
        ) : (
          <Volume2 size={iconSize} className={isPlaying ? "text-amber-300" : "text-amber-400"} />
        )}
      </button>
      {showSlow && (
        <button
          type="button"
          onClick={() => play(0.7)}
          className={cn(
            "inline-flex items-center justify-center rounded-full border transition-all text-xs font-medium",
            "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15",
            "focus-visible:outline-2 focus-visible:outline-amber-500",
            sizeClass
          )}
          aria-label={`ধীরে শুনুন: ${text} / Listen slowly: ${text}`}
          title={`Play slowly: ${text}`}
        >
          <span className="text-amber-500/70 text-[9px] leading-none">🐢</span>
        </button>
      )}
    </span>
  );
}
