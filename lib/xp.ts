export const XP_REWARDS = {
  COMPLETE_LESSON: 50,
  QUIZ_PERFECT: 30,
  QUIZ_PASS: 15,
  VOCAB_REVIEW: 5,
  DAILY_LOGIN: 10,
  STREAK_BONUS_MULTIPLIER: 2, // after 7-day streak
} as const;

export function calculateLevel(totalXp: number): {
  level: string;
  title_en: string;
  title_lt: string;
  title_bn: string;
  nextLevelXp: number;
} {
  if (totalXp < 200)
    return { level: "1", title_en: "Beginner", title_lt: "Pradedantysis", title_bn: "শিক্ষানবিশ", nextLevelXp: 200 };
  if (totalXp < 500)
    return { level: "2", title_en: "A1 Candidate", title_lt: "A1 Kandidatas", title_bn: "A1 প্রার্থী", nextLevelXp: 500 };
  if (totalXp < 1000)
    return { level: "3", title_en: "A1 Ready", title_lt: "A1 Pasiruošęs", title_bn: "A1 প্রস্তুত", nextLevelXp: 1000 };
  return { level: "4", title_en: "A1 Graduate", title_lt: "A1 Absolventas", title_bn: "A1 উত্তীর্ণ", nextLevelXp: Infinity };
}

export function formatXP(xp: number): string {
  return xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp.toString();
}

export function getStreakMultiplier(streak: number): number {
  return streak >= 7 ? 2 : 1;
}
