"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import type { UILanguage } from "@/lib/i18n";

interface BengaliExplanationProps {
  content: string;
  title?: string;
  englishContent?: string;
  variant?: "default" | "tip" | "warning";
  className?: string;
}

const DEFAULT_TITLE: Partial<Record<UILanguage, string>> & { en: string } = {
  en: "💡 Explanation",
  bn: "💡 বাংলায় ব্যাখ্যা",
  az: "💡 İzah",
  hi: "💡 व्याख्या",
  ky: "💡 Түшүндүрмө",
  tg: "💡 Шарҳ",
  uz: "💡 Izoh",
};

// Kept name for backwards-compat, but now language-aware: shows Bengali only to bn users.
export function BengaliExplanation({
  content,
  title,
  englishContent,
  variant = "default",
  className,
}: BengaliExplanationProps) {
  const lang = useAppStore((s) => s.uiLanguage);
  const variantStyles = {
    default: "border-emerald-500/20 bg-emerald-950/20",
    tip: "border-amber-500/20 bg-amber-950/20",
    warning: "border-red-500/20 bg-red-950/20",
  };
  const titleStyles = {
    default: "text-emerald-400",
    tip: "text-amber-400",
    warning: "text-red-400",
  };

  // For non-Bengali users, prefer English content if provided; otherwise still show Bengali.
  const showBn = lang === "bn";
  const displayTitle = title ?? DEFAULT_TITLE[lang] ?? DEFAULT_TITLE.en;
  const primary = showBn ? content : (englishContent ?? content);
  const secondary = showBn ? englishContent : null;

  return (
    <div className={cn("rounded-xl border p-4", variantStyles[variant], className)}>
      <p className={cn("text-xs font-semibold uppercase tracking-wider mb-2", titleStyles[variant])}>
        {displayTitle}
      </p>
      <p className={cn("text-emerald-200 text-sm leading-relaxed", showBn && "font-bengali")}>{primary}</p>
      {secondary && (
        <p className="text-gray-400 text-xs mt-2 leading-relaxed">{secondary}</p>
      )}
    </div>
  );
}
