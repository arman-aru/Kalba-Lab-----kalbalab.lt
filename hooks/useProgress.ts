"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { vocabularyData } from "@/data/vocabulary";
import { XP_REWARDS, calculateLevel } from "@/lib/xp";

export function useProgress() {
  const { savedWords } = useAppStore();

  const stats = useMemo(() => {
    const totalWords = vocabularyData.length;
    const savedCount = savedWords.size;
    const totalXP = savedCount * XP_REWARDS.VOCAB_REVIEW;
    const level = calculateLevel(totalXP);
    const progressToNext = totalXP > 0 && level.nextLevelXp > 0
      ? Math.round((totalXP / level.nextLevelXp) * 100)
      : 0;

    return {
      totalXP,
      savedCount,
      totalWords,
      level,
      progressToNext: Math.min(progressToNext, 100),
    };
  }, [savedWords]);

  return stats;
}
