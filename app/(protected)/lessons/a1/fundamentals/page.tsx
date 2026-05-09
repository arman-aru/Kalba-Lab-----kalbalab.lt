"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { lithuanianAlphabet, specialCharacters } from "@/data/alphabet";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { LANGUAGES, type TranslationKey, type UILanguage } from "@/lib/i18n";

// Loader pip while a translation is fetching.
function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-16 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

const LANG_NATIVE_NAME: Record<UILanguage, string> = LANGUAGES.reduce((acc, l) => {
  acc[l.code] = l.nativeName;
  return acc;
}, {} as Record<UILanguage, string>);

const NUMBERS = [
  { n: 0, lt: "nulis", en: "zero", bn: "শূন্য" },
  { n: 1, lt: "vienas", en: "one", bn: "এক" },
  { n: 2, lt: "du", en: "two", bn: "দুই" },
  { n: 3, lt: "trys", en: "three", bn: "তিন" },
  { n: 4, lt: "keturi", en: "four", bn: "চার" },
  { n: 5, lt: "penki", en: "five", bn: "পাঁচ" },
  { n: 6, lt: "šeši", en: "six", bn: "ছয়" },
  { n: 7, lt: "septyni", en: "seven", bn: "সাত" },
  { n: 8, lt: "aštuoni", en: "eight", bn: "আট" },
  { n: 9, lt: "devyni", en: "nine", bn: "নয়" },
  { n: 10, lt: "dešimt", en: "ten", bn: "দশ" },
  { n: 11, lt: "vienuolika", en: "eleven", bn: "এগারো" },
  { n: 12, lt: "dvylika", en: "twelve", bn: "বারো" },
  { n: 20, lt: "dvidešimt", en: "twenty", bn: "বিশ" },
  { n: 30, lt: "trisdešimt", en: "thirty", bn: "ত্রিশ" },
  { n: 40, lt: "keturiasdešimt", en: "forty", bn: "চল্লিশ" },
  { n: 50, lt: "penkiasdešimt", en: "fifty", bn: "পঞ্চাশ" },
  { n: 100, lt: "šimtas", en: "one hundred", bn: "একশত" },
];

const DAYS = [
  { lt: "pirmadienis", en: "Monday", bn: "সোমবার" },
  { lt: "antradienis", en: "Tuesday", bn: "মঙ্গলবার" },
  { lt: "trečiadienis", en: "Wednesday", bn: "বুধবার" },
  { lt: "ketvirtadienis", en: "Thursday", bn: "বৃহস্পতিবার" },
  { lt: "penktadienis", en: "Friday", bn: "শুক্রবার" },
  { lt: "šeštadienis", en: "Saturday", bn: "শনিবার" },
  { lt: "sekmadienis", en: "Sunday", bn: "রবিবার" },
];

const MONTHS = [
  { lt: "sausis", en: "January", bn: "জানুয়ারি" },
  { lt: "vasaris", en: "February", bn: "ফেব্রুয়ারি" },
  { lt: "kovas", en: "March", bn: "মার্চ" },
  { lt: "balandis", en: "April", bn: "এপ্রিল" },
  { lt: "gegužė", en: "May", bn: "মে" },
  { lt: "birželis", en: "June", bn: "জুন" },
  { lt: "liepa", en: "July", bn: "জুলাই" },
  { lt: "rugpjūtis", en: "August", bn: "আগস্ট" },
  { lt: "rugsėjis", en: "September", bn: "সেপ্টেম্বর" },
  { lt: "spalis", en: "October", bn: "অক্টোবর" },
  { lt: "lapkritis", en: "November", bn: "নভেম্বর" },
  { lt: "gruodis", en: "December", bn: "ডিসেম্বর" },
];

type Tab = "alphabet" | "numbers" | "days";

export default function FundamentalsPage() {
  const { t, lang } = useTranslation();
  const [tab, setTab] = useState<Tab>("alphabet");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const isBn = lang === "bn";
  const showNative = lang !== "en";

  // Collect every English string we need translated for the current view.
  // Bengali is already in the data; English UI doesn't need translations.
  const allTranslatableTexts = useMemo(() => {
    if (lang === "en" || lang === "bn") return [];
    const set = new Set<string>();
    lithuanianAlphabet.forEach((l) => {
      set.add(l.sound_en);
      set.add(l.example_meaning_en);
    });
    specialCharacters.forEach((l) => {
      set.add(l.sound_en);
      set.add(l.example_meaning_en);
    });
    NUMBERS.forEach((n) => set.add(n.en));
    DAYS.forEach((d) => set.add(d.en));
    MONTHS.forEach((m) => set.add(m.en));
    return Array.from(set);
  }, [lang]);

  const translated = useNativeTranslations(allTranslatableTexts, lang);

  // Helper: pick the right native string for a given English source.
  const native = (en: string, bn: string): string | undefined => {
    if (lang === "en") return en;
    if (lang === "bn") return bn;
    return translated.get(en);
  };

  const tabs: { key: Tab; labelKey: TranslationKey }[] = [
    { key: "alphabet", labelKey: "alphabetTab" },
    { key: "numbers",  labelKey: "numbersTab" },
    { key: "days",     labelKey: "daysMonthsTab" },
  ];

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="text-xs text-gray-500 mb-1">{t("lessons")} / A1 / {t("fundamentals")}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("fundamentals")}</h1>
          <p className="text-gray-400 text-sm sm:text-base">{t("fundamentalsHero")}</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 mb-6 overflow-x-auto anim-fade-up">
          {tabs.map((tt) => (
            <button
              key={tt.key}
              onClick={() => setTab(tt.key)}
              className={cn(
                "flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === tt.key
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {t(tt.labelKey)}
            </button>
          ))}
        </div>

        {/* ALPHABET TAB */}
        {tab === "alphabet" && (
          <div className="space-y-6">
            <BengaliExplanation
              content={t("fundamentalsAlphabetExplain")}
            />

            {/* Special chars */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
              <h2 className="font-bold text-gray-100 mb-1">{t("specialChars")}</h2>
              <p className="text-gray-400 text-sm mb-4">{t("specialCharsDesc")}</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {specialCharacters.map((l) => (
                  <div
                    key={l.letter}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedLetter(selectedLetter === l.letter ? null : l.letter)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedLetter(selectedLetter === l.letter ? null : l.letter)}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-center cursor-pointer",
                      selectedLetter === l.letter
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 hover:border-amber-500/30"
                    )}
                  >
                    <span className="text-2xl font-bold text-amber-400 block">{l.letter}</span>
                    <AudioButton text={l.letter} size="sm" className="mx-auto mt-1" />
                  </div>
                ))}
              </div>
              {selectedLetter && (() => {
                const l = specialCharacters.find((x) => x.letter === selectedLetter);
                if (!l) return null;
                return (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-amber-400">{l.letter}</span>
                      <AudioButton text={l.letter} size="md" showSlow />
                    </div>
                    <p className="text-gray-300 text-sm mb-1">{l.sound_en}</p>
                    {showNative && (
                      <p className={cn("text-sm mb-3 text-amber-300/80", isBn && "font-bengali")}>
                        <NativeText value={native(l.sound_en, l.sound_bn)} />
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="text-xs text-gray-500">{t("example")}:</span>
                      <span className="lt-text font-bold">{l.example_word}</span>
                      <AudioButton text={l.example_word} size="sm" />
                      <span className="text-gray-400 text-sm">= {l.example_meaning_en}</span>
                      {showNative && (
                        <span className={cn("text-sm text-emerald-300/80", isBn && "font-bengali")}>
                          / <NativeText value={native(l.example_meaning_en, l.example_meaning_bn)} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Full alphabet table */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 bg-black/20">
                <h2 className="font-bold text-gray-100">{t("fullAlphabet")}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">{t("letter")}</th>
                      <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">{t("audio")}</th>
                      <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">{t("sound")}</th>
                      {showNative && (
                        <th className="px-4 py-2.5 text-left text-xs text-amber-400/70 uppercase">
                          {t("pronunciation")} ({LANG_NATIVE_NAME[lang]})
                        </th>
                      )}
                      <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">{t("example")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lithuanianAlphabet.map((l) => (
                      <tr key={l.letter} className={cn("border-b border-white/5 hover:bg-white/[0.02]", l.is_special && "bg-amber-500/[0.03]")}>
                        <td className="px-4 py-2.5">
                          <span className={cn("text-lg font-bold", l.is_special ? "text-amber-400" : "text-gray-100")}>{l.letter}</span>
                          {l.is_special && <span className="ml-1 text-xs text-amber-500/50">★</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          <AudioButton text={l.letter} size="sm" />
                        </td>
                        <td className="px-4 py-2.5 text-gray-300 text-xs">{l.sound_en}</td>
                        {showNative && (
                          <td className={cn("px-4 py-2.5 text-sm text-amber-200/90", isBn && "font-bengali")}>
                            <NativeText value={native(l.sound_en, l.sound_bn)} />
                          </td>
                        )}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="lt-text font-bold text-sm">{l.example_word}</span>
                            <AudioButton text={l.example_word} size="sm" />
                            <span className="text-gray-500 text-xs">= {l.example_meaning_en}</span>
                            {showNative && (
                              <span className={cn("text-xs text-emerald-300/80", isBn && "font-bengali")}>
                                / <NativeText value={native(l.example_meaning_en, l.example_meaning_bn)} />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NUMBERS TAB */}
        {tab === "numbers" && (
          <div className="space-y-6">
            <BengaliExplanation content={t("fundamentalsNumbersExplain")} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 anim-stagger">
              {NUMBERS.map((num) => (
                <div key={num.n} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 text-center hover:border-amber-500/30 hover:bg-white/[0.06] transition-all">
                  <p className="text-3xl font-bold text-amber-400 mb-1">{num.n}</p>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="lt-text font-bold text-sm">{num.lt}</span>
                    <AudioButton text={num.lt} size="sm" />
                  </div>
                  <p className="en-text text-xs text-gray-300">{num.en}</p>
                  {showNative && (
                    <p className={cn("text-sm text-amber-300/90", isBn && "font-bengali")}>
                      <NativeText value={native(num.en, num.bn)} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAYS & MONTHS TAB */}
        {tab === "days" && (
          <div className="space-y-6">
            <BengaliExplanation content={t("fundamentalsDaysExplain")} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-bold text-gray-100 mb-3">{t("daysOfWeek")}</h2>
                <div className="space-y-2">
                  {DAYS.map((d, i) => (
                    <div key={d.lt} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3 flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="lt-text font-bold text-sm truncate">{d.lt}</span>
                        <AudioButton text={d.lt} size="sm" />
                      </div>
                      <span className="en-text text-sm text-gray-300">{d.en}</span>
                      {showNative && (
                        <span className={cn("text-sm text-amber-300/90", isBn && "font-bengali")}>
                          <NativeText value={native(d.en, d.bn)} />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-bold text-gray-100 mb-3">{t("monthsOfYear")}</h2>
                <div className="space-y-2">
                  {MONTHS.map((m, i) => (
                    <div key={m.lt} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3 flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="lt-text font-bold text-sm truncate">{m.lt}</span>
                        <AudioButton text={m.lt} size="sm" />
                      </div>
                      <span className="en-text text-sm text-gray-300">{m.en}</span>
                      {showNative && (
                        <span className={cn("text-sm text-amber-300/90", isBn && "font-bengali")}>
                          <NativeText value={native(m.en, m.bn)} />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
