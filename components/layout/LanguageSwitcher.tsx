"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { LANGUAGES, T } from "@/lib/i18n";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { uiLanguage, setUiLanguage } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === uiLanguage) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={T.language[uiLanguage]}
        className="inline-flex items-center gap-1.5 h-9 text-xs border border-white/10 bg-white/3 rounded-xl px-2.5 text-gray-300 hover:text-gray-100 hover:border-amber-500/40 hover:bg-white/6 transition-all"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline font-medium">{current.nativeName}</span>
        <ChevronDown size={12} className={cn("opacity-60 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={T.language[uiLanguage]}
          className="absolute right-0 top-[calc(100%+6px)] w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl py-1 z-50 max-h-[70vh] overflow-y-auto"
        >
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              {T.language[uiLanguage]}
            </span>
          </div>
          {LANGUAGES.map((lang) => {
            const selected = lang.code === uiLanguage;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setUiLanguage(lang.code);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                  selected
                    ? "bg-amber-500/10 text-amber-300"
                    : "text-gray-200 hover:bg-white/5"
                )}
              >
                <span className="text-xl leading-none flex-shrink-0">{lang.flag}</span>
                <span className="flex-1 text-left">
                  <span className="block font-medium leading-tight">{lang.nativeName}</span>
                  <span className="block text-[11px] text-gray-500 leading-tight">
                    {lang.englishName} · {lang.country}
                  </span>
                </span>
                {selected && <Check size={14} className="text-amber-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
