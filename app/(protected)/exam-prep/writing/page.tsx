"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

const FORM_FIELDS = [
  { label_lt: "Vardas",          label_en: "First Name",   label_bn: "প্রথম নাম",   hint_en: "Enter your first name",          hint_bn: "আপনার প্রথম নাম লিখুন" },
  { label_lt: "Pavardė",         label_en: "Last Name",    label_bn: "পদবি",       hint_en: "Your surname / family name",     hint_bn: "আপনার পদবি/পারিবারিক নাম" },
  { label_lt: "Gimimo data",     label_en: "Date of Birth", label_bn: "জন্ম তারিখ", hint_en: "dd/mm/yyyy",                     hint_bn: "দিন/মাস/বছর (dd/mm/yyyy)" },
  { label_lt: "Adresas",         label_en: "Address",      label_bn: "ঠিকানা",     hint_en: "Your current address",           hint_bn: "আপনার বর্তমান ঠিকানা" },
  { label_lt: "Telefono numeris", label_en: "Phone Number", label_bn: "ফোন নম্বর",   hint_en: "+370 xxx xxxxx",                hint_bn: "+370 xxx xxxxx" },
  { label_lt: "El. paštas",      label_en: "Email",        label_bn: "ইমেইল",      hint_en: "example@email.com",             hint_bn: "example@email.com" },
];

const WRITING_PROMPTS = [
  {
    id: "1",
    prompt_en: "Write a message to your friend saying you cannot meet at the park on Saturday.",
    prompt_bn: "আপনার বন্ধুকে একটি বার্তা লিখুন যে আপনি শনিবার পার্কে দেখা করতে পারবেন না।",
    keywords_en: ["sorry", "Saturday", "can't", "another day", "because"],
    keywords_bn: ["দুঃখিত", "শনিবার", "পারব না", "অন্য দিন", "কারণ"],
    model_lt: "Labas! Atsiprašau, bet šeštadienį negaliu ateiti į parką. Dirbu iki vakaro. Gal kitą savaitę? Ačiū už supratimą!",
    model_en: "Hello! Sorry, but I cannot come to the park on Saturday. I work until evening. Maybe next week? Thank you for understanding!",
    model_bn: "হ্যালো! দুঃখিত, কিন্তু শনিবার আমি পার্কে আসতে পারব না। আমি সন্ধ্যা পর্যন্ত কাজ করব। হয়তো পরের সপ্তাহে? বোঝার জন্য ধন্যবাদ!",
  },
  {
    id: "2",
    prompt_en: "Write a message to your colleague that you are sick and cannot come to work today.",
    prompt_bn: "আপনার সহকর্মীকে একটি বার্তা লিখুন যে আপনি অসুস্থ এবং আজ কাজে আসতে পারবেন না।",
    keywords_en: ["sick", "today", "can't", "doctor", "hopefully"],
    keywords_bn: ["অসুস্থ", "আজ", "পারব না", "ডাক্তার", "আশা করি"],
    model_lt: "Sveiki! Šiandien sergu ir negaliu ateiti į darbą. Einu pas gydytoją. Grįšiu rytoj. Atsiprašau dėl nepatogumų.",
    model_en: "Hello! Today I am sick and cannot come to work. I'm going to the doctor. I'll be back tomorrow. Sorry for the inconvenience.",
    model_bn: "হ্যালো! আজ আমি অসুস্থ এবং কাজে আসতে পারব না। ডাক্তারের কাছে যাচ্ছি। আগামীকাল ফিরব। অসুবিধার জন্য দুঃখিত।",
  },
];

const CONNECTORS = [
  { lt: "ir",         en: "and",        bn: "এবং" },
  { lt: "bet",        en: "but",        bn: "কিন্তু" },
  { lt: "nes",        en: "because",    bn: "কারণ" },
  { lt: "todėl",      en: "therefore",  bn: "তাই" },
  { lt: "taip pat",   en: "also",       bn: "এছাড়াও" },
  { lt: "gal",        en: "maybe",      bn: "হয়তো" },
  { lt: "Atsiprašau", en: "Sorry",      bn: "দুঃখিত" },
  { lt: "Ačiū",       en: "Thank you",  bn: "ধন্যবাদ" },
];

const HERO_EXPLAIN_EN = "Practice form filling and message writing — these are the two writing tasks in the A1 exam.";
const HERO_EXPLAIN_BN = "ফর্ম পূরণ ও বার্তা লেখার অনুশীলন করুন — A1 পরীক্ষায় লেখার দুটি প্রধান কাজ।";

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-20 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function WritingPracticePage() {
  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [activePrompt, setActivePrompt] = useState(WRITING_PROMPTS[0]);
  const [message, setMessage] = useState("");
  const [showModel, setShowModel] = useState(false);

  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;

  const translatable = useMemo(() => {
    if (!showOther) return [];
    const set = new Set<string>();
    set.add(HERO_EXPLAIN_EN);
    FORM_FIELDS.forEach((f) => set.add(f.hint_en));
    WRITING_PROMPTS.forEach((p) => {
      set.add(p.prompt_en);
      set.add(p.model_en);
      p.keywords_en.forEach((k) => set.add(k));
    });
    CONNECTORS.forEach((c) => set.add(c.en));
    return Array.from(set);
  }, [showOther]);
  const translated = useNativeTranslations(translatable, lang);

  const hint = (en: string, bn: string): string =>
    isEn ? en : isBn ? bn : (translated.get(en) ?? en);

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="text-xs text-gray-500 mb-1">{t("examPrep")} / {t("writing")}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("writing")}</h1>
          <p className="text-gray-400 text-sm">Rašymas — Practice form filling and message writing.</p>
        </div>

        <BengaliExplanation
          content={isBn ? HERO_EXPLAIN_BN : (translated.get(HERO_EXPLAIN_EN) ?? HERO_EXPLAIN_EN)}
          englishContent={isEn ? undefined : HERO_EXPLAIN_EN}
          className="mb-6"
        />

        {/* Exercise 1: Form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-6">
          <h2 className="font-bold text-gray-100 text-lg mb-1">Exercise 1: Form Filling</h2>
          <p className="text-gray-400 text-sm mb-4">
            {isBn ? "নিচের ফর্মটি পূরণ করুন — লিথুয়ানিয়ান ক্ষেত্রগুলো পড়ে তথ্য দিন।" : "Fill in the form below — read the Lithuanian field labels and enter the right information."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORM_FIELDS.map((field) => (
              <div key={field.label_lt}>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <label className="lt-text font-bold text-sm text-amber-400">{field.label_lt}</label>
                  <AudioButton text={field.label_lt} size="sm" />
                  <span className="text-gray-400 text-xs">({field.label_en})</span>
                </div>
                <p className={cn("text-xs text-gray-500 mb-1", isBn && "font-bengali")}>
                  {isBn ? `${field.label_bn}: ${field.hint_bn}` : hint(field.hint_en, field.hint_bn)}
                </p>
                <input
                  type="text"
                  value={formValues[field.label_lt] ?? ""}
                  onChange={(e) => setFormValues({ ...formValues, [field.label_lt]: e.target.value })}
                  placeholder={hint(field.hint_en, field.hint_bn)}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Exercise 2: Message */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-6">
          <h2 className="font-bold text-gray-100 text-lg mb-1">Exercise 2: Message Writing</h2>
          <p className="text-gray-400 text-sm mb-4">{isBn ? "লক্ষ্য: ৫০-৮০ শব্দ" : "Target: 50–80 words"}</p>

          <div className="flex gap-2 mb-4 flex-wrap">
            {WRITING_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePrompt(p); setMessage(""); setShowModel(false); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-sm transition-all",
                  activePrompt.id === p.id
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:text-gray-200"
                )}
              >
                Prompt {p.id}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 mb-4">
            <p className={cn("text-emerald-200", isBn && "font-bengali")}>
              {isEn ? activePrompt.prompt_en : isBn ? activePrompt.prompt_bn : <NativeText value={translated.get(activePrompt.prompt_en)} />}
            </p>
            {!isEn && <p className="text-gray-400 text-sm mt-1">{activePrompt.prompt_en}</p>}
          </div>

          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-2">{isBn ? "মূল শব্দ যা ব্যবহার করতে পারেন:" : "Useful words you can use:"}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activePrompt.keywords_en.map((kEn, i) => {
                const display = isEn ? kEn : isBn ? activePrompt.keywords_bn[i] : translated.get(kEn);
                return (
                  <span key={kEn} className={cn("text-xs px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-400", isBn && "font-bengali")}>
                    {display ?? <NativeText value={undefined} />}
                  </span>
                );
              })}
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message in Lithuanian here…"
            rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm resize-none"
          />
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <span className={cn("text-xs", wordCount < 50 ? "text-red-400" : wordCount <= 80 ? "text-emerald-400" : "text-amber-400")}>
              {wordCount} {isBn ? "শব্দ" : "words"} {wordCount < 50 ? "— write more" : wordCount <= 80 ? "✓" : "— a bit shorter"}
            </span>
            <button
              onClick={() => setShowModel(!showModel)}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              {showModel ? t("hideAnswer") : t("showAnswer")}
            </button>
          </div>

          {showModel && (
            <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/10">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Model Answer</p>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="lt-text font-medium text-sm text-amber-400">{activePrompt.model_lt}</p>
                <AudioButton text={activePrompt.model_lt} size="sm" />
              </div>
              <p className="en-text text-xs mb-1 text-gray-300">{activePrompt.model_en}</p>
              {isBn ? (
                <p className="bn-text font-bengali text-sm text-emerald-300/90">{activePrompt.model_bn}</p>
              ) : showOther ? (
                <p className="text-sm text-emerald-300/90"><NativeText value={translated.get(activePrompt.model_en)} /></p>
              ) : null}
            </div>
          )}
        </div>

        {/* Connectors */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
          <h2 className="font-bold text-gray-100 mb-3">Useful Connectors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONNECTORS.map((c) => (
              <div key={c.lt} className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="lt-text font-bold text-sm text-amber-400">{c.lt}</span>
                  <AudioButton text={c.lt} size="sm" />
                </div>
                <p className="en-text text-xs text-gray-300">{c.en}</p>
                {isBn ? (
                  <p className="bn-text font-bengali text-xs text-emerald-400">{c.bn}</p>
                ) : showOther ? (
                  <p className="text-xs text-emerald-300/80"><NativeText value={translated.get(c.en)} /></p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
