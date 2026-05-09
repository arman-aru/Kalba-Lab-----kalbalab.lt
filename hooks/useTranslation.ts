"use client";
import { useAppStore } from "@/stores/useAppStore";
import { T, type TranslationKey, type UILanguage } from "@/lib/i18n";

export function useTranslation() {
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const t = (key: TranslationKey): string => {
    const entry = T[key] as Partial<Record<UILanguage, string>> & { en: string };
    return entry[uiLanguage] ?? entry.en;
  };
  return { t, lang: uiLanguage as UILanguage };
}
