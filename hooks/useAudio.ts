"use client";

import { useState, useCallback } from "react";
import { speakLithuanian, stopSpeaking } from "@/lib/audio";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(async (text: string, rate = 1) => {
    try {
      setError(null);
      setIsPlaying(true);
      await speakLithuanian(text, rate);
    } catch {
      setError("Audio unavailable");
    } finally {
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    stopSpeaking();
    setIsPlaying(false);
  }, []);

  return { play, stop, isPlaying, error };
}
