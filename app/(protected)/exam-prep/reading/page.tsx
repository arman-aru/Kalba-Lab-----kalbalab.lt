"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

interface MCQ {
  q_en: string;
  q_bn: string;
  options_en: string[];
  options_bn: string[];
  correct: number;
  exp_en: string;
  exp_bn: string;
}

const READING_EXERCISES: {
  id: string; title_en: string; title_bn: string; type: string; level: "Easy" | "Medium";
  text_lt: string; text_en: string; text_bn: string; questions: MCQ[];
}[] = [
  {
    id: "r1", title_en: "Shop Sign", title_bn: "দোকানের সাইন", type: "Sign", level: "Easy",
    text_lt: "Parduotuvė atidaryta: Pirmadienį–Penktadienį 8:00–20:00, Šeštadienį 9:00–18:00, Sekmadienį uždaryta.",
    text_en: "Shop open: Monday–Friday 8:00–20:00, Saturday 9:00–18:00, Sunday closed.",
    text_bn: "দোকান খোলা: সোমবার-শুক্রবার ৮:০০-২০:০০, শনিবার ৯:০০-১৮:০০, রবিবার বন্ধ।",
    questions: [
      { q_en: "Is the shop open on Sunday?",            q_bn: "রবিবার দোকান কি খোলা?",       options_en: ["Yes, opens at 8", "Yes, opens at 9", "No, closed", "Unknown"],   options_bn: ["হ্যাঁ, ৮টায় খোলে", "হ্যাঁ, ৯টায় খোলে", "না, বন্ধ", "অজানা"], correct: 2, exp_en: "'Sekmadienį uždaryta' = Sunday closed.",     exp_bn: "'Sekmadienį uždaryta' = রবিবার বন্ধ।" },
      { q_en: "When does the shop close on Saturday?",  q_bn: "শনিবার দোকান কখন বন্ধ হয়?",   options_en: ["18:00", "20:00", "17:00", "21:00"],                              options_bn: ["১৮:০০", "২০:০০", "১৭:০০", "২১:০০"],                          correct: 0, exp_en: "Saturday 9:00–18:00 — closes at 18:00.", exp_bn: "শনিবার '9:00–18:00' — বন্ধ হয় ১৮:০০তে।" },
    ],
  },
  {
    id: "r2", title_en: "Short Message", title_bn: "ছোট বার্তা", type: "Message", level: "Medium",
    text_lt: "Sveika, Roma! Rytoj negaliu ateiti į darbą, nes sergu. Einu pas gydytoją. Grįšiu poryt. Atsiprašau. Arman",
    text_en: "Hello Roma! Tomorrow I cannot come to work because I am sick. I'm going to the doctor. I'll return the day after tomorrow. Sorry. Arman",
    text_bn: "হ্যালো, রোমা! আগামীকাল আমি কাজে আসতে পারব না কারণ অসুস্থ আছি। ডাক্তারের কাছে যাচ্ছি। পরশু ফিরব। দুঃখিত। আরমান",
    questions: [
      { q_en: "Why can't Arman come to work?", q_bn: "আরমান কাজে কেন আসতে পারবে না?", options_en: ["On vacation", "Sick", "Travelling abroad", "Transport problem"], options_bn: ["ছুটিতে আছে", "অসুস্থ", "বিদেশে গেছে", "পরিবহন সমস্যা"], correct: 1, exp_en: "'nes sergu' = because (I am) sick.", exp_bn: "'nes sergu' = কারণ অসুস্থ।" },
      { q_en: "When will Arman return?",        q_bn: "আরমান কখন ফিরবে?",          options_en: ["Today", "Tomorrow", "The day after tomorrow", "Next week"],   options_bn: ["আজ", "আগামীকাল", "পরশু", "পরের সপ্তাহে"],                    correct: 2, exp_en: "'Grįšiu poryt' = I'll return the day after tomorrow.", exp_bn: "'Grįšiu poryt' = পরশু ফিরব।" },
    ],
  },
];

const HERO_EXPLAIN_EN = "In the reading exam, you'll read signs, menus, timetables, and short messages, then answer multiple-choice questions. Focus on key information — you don't need every word.";
const HERO_EXPLAIN_BN = "পড়ার পরীক্ষায় আপনাকে দোকানের সাইন, বিজ্ঞপ্তি, মেনু ও ছোট বার্তা পড়ে MCQ প্রশ্নের উত্তর দিতে হবে। প্রতিটি শব্দের অর্থ না বুঝলেও মূল তথ্য বুঝতে চেষ্টা করুন।";

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-24 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function ReadingPracticePage() {
  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;

  const [exercise, setExercise] = useState(READING_EXERCISES[0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showTranslation, setShowTranslation] = useState(false);

  const translatable = useMemo(() => {
    if (!showOther) return [];
    const set = new Set<string>();
    set.add(HERO_EXPLAIN_EN);
    READING_EXERCISES.forEach((ex) => {
      set.add(ex.title_en);
      set.add(ex.text_en);
      ex.questions.forEach((q) => {
        set.add(q.q_en);
        set.add(q.exp_en);
        q.options_en.forEach((o) => set.add(o));
      });
    });
    return Array.from(set);
  }, [showOther]);
  const translated = useNativeTranslations(translatable, lang);

  const answer = (qIdx: number, optIdx: number) => {
    const key = `${exercise.id}-${qIdx}`;
    if (answers[key] !== undefined) return;
    setAnswers({ ...answers, [key]: optIdx });
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="text-xs text-gray-500 mb-1">{t("examPrep")} / {t("reading")}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("reading")}</h1>
          <p className="text-gray-400 text-sm">Skaitymas — A1 exam reading comprehension exercises.</p>
        </div>

        <BengaliExplanation
          content={isBn ? HERO_EXPLAIN_BN : (translated.get(HERO_EXPLAIN_EN) ?? HERO_EXPLAIN_EN)}
          englishContent={isEn ? undefined : HERO_EXPLAIN_EN}
          className="mb-6"
        />

        {/* Exercise selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {READING_EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => { setExercise(ex); setAnswers({}); setShowTranslation(false); }}
              className={cn(
                "px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all",
                exercise.id === ex.id
                  ? "bg-green-500/15 border-green-500/40 text-green-300"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:border-amber-500/30"
              )}
            >
              {ex.title_en}
              <span className={cn("ml-2 text-xs px-1.5 py-0.5 rounded", ex.level === "Easy" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400")}>{ex.level}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading text */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300">{exercise.type}</span>
                <h2 className="font-bold text-gray-100 mt-1">{exercise.title_en}</h2>
                {isBn ? (
                  <p className="text-emerald-400 font-bengali text-sm">{exercise.title_bn}</p>
                ) : showOther ? (
                  <p className="text-emerald-300/90 text-sm"><NativeText value={translated.get(exercise.title_en)} /></p>
                ) : null}
              </div>
              <AudioButton text={exercise.text_lt} size="md" showSlow />
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 mb-4">
              <p className="lt-text font-bold text-base leading-relaxed">{exercise.text_lt}</p>
            </div>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              {showTranslation ? t("hideAnswer") : t("showAnswer")}
            </button>
            {showTranslation && (
              <div className="mt-3 space-y-2">
                <p className="en-text text-sm text-gray-300">{exercise.text_en}</p>
                {isBn && <p className="bn-text font-bengali text-sm">{exercise.text_bn}</p>}
                {showOther && <p className="text-sm text-emerald-300/90"><NativeText value={translated.get(exercise.text_en)} /></p>}
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {exercise.questions.map((q, qi) => {
              const key = `${exercise.id}-${qi}`;
              const userAnswer = answers[key];
              const answered = userAnswer !== undefined;
              return (
                <div key={qi} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
                  <p className="text-xs text-gray-500 mb-1">Question {qi + 1}</p>
                  <p className={cn("font-medium text-gray-100 mb-1", isBn && "font-bengali")}>
                    {isEn ? q.q_en : isBn ? q.q_bn : <NativeText value={translated.get(q.q_en)} />}
                  </p>
                  {!isEn && <p className="text-xs text-gray-500 mb-3">{q.q_en}</p>}
                  <div className="space-y-2">
                    {q.options_en.map((optEn, oi) => {
                      const optBn = q.options_bn[oi];
                      const display = isEn ? optEn : isBn ? optBn : translated.get(optEn);
                      let style = "border-white/10 bg-white/[0.02] text-gray-300 hover:border-green-500/30 hover:bg-white/[0.05]";
                      if (answered) {
                        if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                        else if (oi === userAnswer) style = "border-red-500 bg-red-500/10 text-red-300";
                        else style = "border-white/10 text-gray-600 opacity-50";
                      }
                      return (
                        <button key={oi} onClick={() => answer(qi, oi)}
                          className={cn("w-full text-left px-3 py-2 rounded-lg border text-sm transition-all", isBn && "font-bengali", style)}>
                          {String.fromCharCode(65 + oi)}. {display ?? <NativeText value={undefined} />}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <p className={cn("text-sm text-emerald-200", isBn && "font-bengali")}>
                        💡 {isEn ? q.exp_en : isBn ? q.exp_bn : <NativeText value={translated.get(q.exp_en)} />}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
