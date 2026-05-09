import type { UILanguage } from "@/lib/i18n";

export const XP_REWARDS = {
  COMPLETE_LESSON: 50,
  QUIZ_PERFECT: 30,
  QUIZ_PASS: 15,
  VOCAB_REVIEW: 5,
  DAILY_LOGIN: 10,
  STREAK_BONUS_MULTIPLIER: 2,
} as const;

type Multi = Partial<Record<UILanguage, string>> & { en: string };

export interface UserLevel {
  level: string;
  title_lt: string;
  title: Multi;
  nextLevelXp: number;
}

export function calculateLevel(totalXp: number): UserLevel {
  if (totalXp < 200)
    return {
      level: "1",
      title_lt: "Pradedantysis",
      nextLevelXp: 200,
      title: { en: "Beginner", bn: "শিক্ষানবিশ", az: "Başlanğıc", hi: "शुरुआती", ky: "Башталгыч", tg: "Сатҳи ибтидоӣ", uz: "Boshlangʻich" },
    };
  if (totalXp < 500)
    return {
      level: "2",
      title_lt: "A1 Kandidatas",
      nextLevelXp: 500,
      title: { en: "A1 Candidate", bn: "A1 প্রার্থী", az: "A1 Namizədi", hi: "A1 उम्मीदवार", ky: "A1 Талапкер", tg: "Номзади A1", uz: "A1 Nomzodi" },
    };
  if (totalXp < 1000)
    return {
      level: "3",
      title_lt: "A1 Pasiruošęs",
      nextLevelXp: 1000,
      title: { en: "A1 Ready", bn: "A1 প্রস্তুত", az: "A1 Hazır", hi: "A1 तैयार", ky: "A1 Даяр", tg: "Омодаи A1", uz: "A1 Tayyor" },
    };
  return {
    level: "4",
    title_lt: "A1 Absolventas",
    nextLevelXp: Infinity,
    title: { en: "A1 Graduate", bn: "A1 উত্তীর্ণ", az: "A1 Məzunu", hi: "A1 स्नातक", ky: "A1 Бүтүрүүчү", tg: "Хатмкунандаи A1", uz: "A1 Bitiruvchi" },
  };
}

export function formatXP(xp: number): string {
  return xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp.toString();
}

export function getStreakMultiplier(streak: number): number {
  return streak >= 7 ? 2 : 1;
}
