"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, Volume2, GraduationCap, Globe2, Headphones, BookOpenCheck, BarChart3 } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { TestimonialSlider } from "@/components/shared/TestimonialSlider";
import { GlobeHero } from "@/components/home/GlobeHero";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey, UILanguage } from "@/lib/i18n";

type Multi = Partial<Record<UILanguage, string>> & { en: string };

function formatLearners(n: number): string {
  return n.toLocaleString("en-US");
}

const SAMPLE_PHRASES: { lt: string; key: "phLabas" | "phAciu" | "phStotis" | "phFromBD" }[] = [
  { lt: "Labas!",                 key: "phLabas" },
  { lt: "Ačiū labai!",            key: "phAciu" },
  { lt: "Kur yra stotis?",        key: "phStotis" },
  { lt: "Aš esu iš užsienio.",    key: "phFromBD" },
];

const PHRASE_TRANSLATIONS: Record<typeof SAMPLE_PHRASES[number]["key"], Multi> = {
  phLabas:  { en: "Hello!",                bn: "হ্যালো!",                az: "Salam!",            hi: "नमस्ते!",                ky: "Салам!",            tg: "Салом!",                  uz: "Salom!" },
  phAciu:   { en: "Thank you very much!",  bn: "অনেক ধন্যবাদ!",          az: "Çox sağ olun!",      hi: "बहुत धन्यवाद!",            ky: "Чоң рахмат!",        tg: "Ташаккури зиёд!",         uz: "Katta rahmat!" },
  phStotis: { en: "Where is the station?", bn: "স্টেশন কোথায়?",         az: "Stansiya haradadır?", hi: "स्टेशन कहाँ है?",         ky: "Бекет кайда?",       tg: "Истгоҳ дар куҷост?",       uz: "Bekat qayerda?" },
  phFromBD: { en: "I'm from abroad.",      bn: "আমি বিদেশ থেকে।",         az: "Mən xaricdənəm.",   hi: "मैं विदेश से हूँ।",         ky: "Мен чет өлкөдөнмүн.", tg: "Ман аз хориҷа ҳастам.",     uz: "Men chet eldanman." },
};

// Stats bar values are derived from the actual data modules so they never lie.
// The "learners" stat is filled in at runtime from /api/stats (live Supabase count).
type StaticStat = { icon: typeof Globe2; key: TranslationKey; value: string };

const FEATURES: { icon: typeof Volume2; title: TranslationKey; desc: TranslationKey; tint: string }[] = [
  { icon: Volume2,        title: "feat1Title", desc: "feat1Desc", tint: "from-amber-500/20 to-amber-500/5 text-amber-300" },
  { icon: Globe2,         title: "feat2Title", desc: "feat2Desc", tint: "from-emerald-500/20 to-emerald-500/5 text-emerald-300" },
  { icon: GraduationCap,  title: "feat3Title", desc: "feat3Desc", tint: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-300" },
  { icon: BookOpenCheck,  title: "feat4Title", desc: "feat4Desc", tint: "from-blue-500/20 to-blue-500/5 text-blue-300" },
  { icon: Headphones,     title: "feat5Title", desc: "feat5Desc", tint: "from-cyan-500/20 to-cyan-500/5 text-cyan-300" },
  { icon: BarChart3,      title: "feat6Title", desc: "feat6Desc", tint: "from-rose-500/20 to-rose-500/5 text-rose-300" },
];

const STEPS: { n: string; title: TranslationKey; desc: TranslationKey }[] = [
  { n: "01", title: "step1Title", desc: "step1Desc" },
  { n: "02", title: "step2Title", desc: "step2Desc" },
  { n: "03", title: "step3Title", desc: "step3Desc" },
];

export default function HomeClient({
  counts,
}: {
  counts: { words: number; lessons: number; languages: number };
}) {
  const STATIC_STATS: StaticStat[] = [
    { icon: Globe2,        key: "statLanguages", value: String(counts.languages) },
    { icon: BookOpenCheck, key: "statWords",     value: String(counts.words) },
    { icon: Sparkles,      key: "statLessons",   value: String(counts.lessons) },
  ];

  const { t, lang } = useTranslation();
  const [learners, setLearners] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!cancelled && data && typeof data.learners === "number") {
            setLearners(data.learners);
          }
        })
        .catch(() => {});

    load();
    // Re-fetch every 20 s while the tab is open so a new signup appears in
    // near-real-time. Pause when the tab is hidden to save bandwidth.
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, 20_000);
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const stats = [
    ...STATIC_STATS,
    {
      icon: BarChart3,
      key: "statLearners" as TranslationKey,
      // While loading we show a soft em-dash so the layout doesn't shift
      // and we never display a fake number.
      value: learners === null ? "—" : formatLearners(learners),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden isolate">
      <AnimatedBackground />
      <div className="relative z-10">

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm mb-6 backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <span>🇱🇹 {t("homeBadge")}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-5">
              <span className="text-shimmer">{t("homeHero1")}</span>
              <br />
              <span className="text-gray-100">{t("homeHero2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-emerald-300/90 font-medium mb-3">{t("homeSubtitle1")}</p>
            <p className="text-gray-400 text-base md:text-lg mb-8 lg:max-w-xl leading-relaxed">{t("homeSubtitle2")}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-base transition-all hover:scale-[1.03] shadow-lg shadow-amber-500/25"
              >
                <span>{t("start")}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/vocabulary"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 hover:border-amber-500/40 bg-white/[0.02] hover:bg-white/[0.05] text-gray-200 font-semibold text-base backdrop-blur-sm transition-all"
              >
                {t("viewDemo")}
              </Link>
            </div>

            <p className="text-xs text-gray-500 inline-flex items-center gap-2">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {t("trustedBy")} · {t("freeForever")}
            </p>
          </div>

          {/* Right: interactive globe + speech bubbles */}
          <div className="relative">
            <GlobeHero />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative py-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.key} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
                <s.icon size={18} />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-gray-100 tabular-nums">{s.value}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">{t(s.key)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-3">
              {t("homeWhy")} <span className="text-amber-400">KalbaLab</span>?
            </h2>
            <p className="text-gray-400">{t("homeWhySub")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all overflow-hidden"
              >
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${f.tint} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className={`relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${f.tint} mb-4`}>
                  <f.icon size={20} />
                </div>
                <h3 className="relative font-bold text-gray-100 text-lg mb-1.5">{t(f.title)}</h3>
                <p className="relative text-gray-400 text-sm leading-relaxed">{t(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 text-center mb-12">{t("howItWorks")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] right-[-40%] h-px bg-gradient-to-r from-amber-500/40 to-transparent" />
                )}
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-amber-500/30 transition-all">
                  <div className="text-5xl font-black text-amber-500/30 mb-1 leading-none">{s.n}</div>
                  <h3 className="font-bold text-gray-100 text-lg mb-1">{t(s.title)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t(s.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO FLASHCARD */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-2">{t("trySample")}</h2>
          <p className="text-gray-400 text-sm mb-10">{t("trySampleSub")}</p>

          <div className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-md p-8 max-w-sm mx-auto shadow-2xl shadow-amber-500/5 animate-float">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl font-bold text-amber-400">vanduo</span>
              <AudioButton text="vanduo" size="lg" showSlow />
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-xs mb-4">
              {t("noun")} · {t("masc")}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <p className="text-gray-100 text-lg font-medium">
                {({ en: "water", bn: "পানি", az: "su", hi: "पानी", ky: "суу", tg: "об", uz: "suv" } as Multi)[lang] ?? "water"}
              </p>
              <div className="mt-4 p-3 rounded-xl bg-black/30 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 text-sm font-medium">Prašau vandens.</span>
                  <AudioButton text="Prašau vandens." size="sm" />
                </div>
                <p className="text-gray-400 text-xs">
                  {({ en: "Water, please.", bn: "একটু পানি দিন, দয়া করে।", az: "Zəhmət olmasa, su.", hi: "कृपया पानी दीजिए।", ky: "Сураныч, суу.", tg: "Лутфан, об.", uz: "Iltimos, suv." } as Multi)[lang] ?? "Water, please."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/flashcards" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              {t("viewAllFlash")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* A1 EXAM */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-3">{t("examTitle")}</h2>
            <p className="text-gray-400 mb-3">{t("examSubtitle")}</p>
            <div className="inline-flex items-center gap-4 mt-2 flex-wrap justify-center text-sm">
              <span className="text-gray-400">{t("examFee")} <span className="text-amber-400 font-bold">€52</span></span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-400">{t("examPass")} <span className="text-emerald-400 font-bold">50%</span> {t("overall")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { lt: "Skaitymas",  k: "reading"   as TranslationKey, d: "examReadingD" as TranslationKey },
              { lt: "Rašymas",    k: "writing"   as TranslationKey, d: "examWritingD" as TranslationKey },
              { lt: "Klausymas",  k: "listening" as TranslationKey, d: "examListenD"  as TranslationKey },
              { lt: "Kalbėjimas", k: "speaking"  as TranslationKey, d: "examSpeakD"   as TranslationKey },
            ].map((s) => (
              <div key={s.lt} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all">
                <div className="text-base font-bold text-amber-400 mb-1">{s.lt}</div>
                <div className="text-gray-100 font-semibold text-sm mb-2">{t(s.k)}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{t(s.d)}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/exam-prep"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold transition-all"
            >
              {t("startExamPrep")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 text-center mb-10">{t("testimonials")}</h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-gray-400 mb-10">{t("ctaSub")}</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xl transition-all hover:scale-[1.03] shadow-2xl shadow-amber-500/30"
          >
            <span>{t("start")}</span>
            <ArrowRight size={22} />
          </Link>
          <p className="text-gray-600 text-sm mt-5">{t("noCard")}</p>
        </div>
      </section>
      </div>
    </div>
  );
}
