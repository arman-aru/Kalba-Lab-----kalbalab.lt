"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, Check, Loader2, Pencil, X, Star, Flame, BookOpen, GraduationCap,
  Sparkles, Trophy, Settings as SettingsIcon, Calendar, FlipHorizontal, MessageSquare,
  FileText, HelpCircle, ArrowRight, RotateCcw, TrendingUp,
} from "lucide-react";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { AudioButton } from "@/components/audio/AudioButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { LiveXP } from "@/components/shared/LiveXP";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { VoicePicker } from "@/components/shared/VoicePicker";
import { formatXP, calculateLevel } from "@/lib/xp";
import { getGreeting } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { LANGUAGES, type UILanguage, type TranslationKey } from "@/lib/i18n";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { UserProfile } from "@/types";

// ----------------------------- constants -----------------------------

type Multi = Partial<Record<UILanguage, string>> & { en: string };

const WORD_OF_DAY: {
  lt: string;
  part_of_speech: TranslationKey;
  example_lt: string;
  meaning: Multi;
  example: Multi;
} = {
  lt: "gerai",
  part_of_speech: "adverb",
  example_lt: "Gerai, supratau.",
  meaning: { en: "okay / good",        bn: "ঠিক আছে / ভালো", az: "yaxşı / oldu",   hi: "ठीक है / अच्छा", ky: "макул / жакшы",  tg: "хуб / маъқул",   uz: "yaxshi / mayli" },
  example: { en: "Okay, I understood.", bn: "ঠিক আছে, আমি বুঝেছি।", az: "Yaxşı, başa düşdüm.", hi: "ठीक है, मैं समझ गया।", ky: "Макул, түшүндүм.", tg: "Хуб, фаҳмидам.", uz: "Yaxshi, tushundim." },
};

const QUICK_ACTIONS: { icon: typeof BookOpen; key: TranslationKey; descKey: TranslationKey; href: string; tint: string; ring: string; iconBg: string }[] = [
  { icon: FlipHorizontal, key: "flashcards",   descKey: "reviewVocab",      href: "/flashcards",              tint: "from-amber-500/15 to-amber-500/0",   ring: "hover:ring-amber-500/40",   iconBg: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30" },
  { icon: BookOpen,       key: "vocabulary",   descKey: "seeAllWords",      href: "/vocabulary",              tint: "from-blue-500/15 to-blue-500/0",     ring: "hover:ring-blue-500/40",    iconBg: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30" },
  { icon: Star,           key: "fundamentals", descKey: "alphabetNumbers",  href: "/lessons/a1/fundamentals", tint: "from-purple-500/15 to-purple-500/0", ring: "hover:ring-purple-500/40",  iconBg: "bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30" },
  { icon: FileText,       key: "grammar",      descKey: "learnGrammar",     href: "/lessons/a1/grammar",      tint: "from-pink-500/15 to-pink-500/0",     ring: "hover:ring-pink-500/40",    iconBg: "bg-pink-500/15 text-pink-300 ring-1 ring-pink-500/30" },
  { icon: MessageSquare,  key: "dialogues",    descKey: "realDialogues",    href: "/lessons/a1/dialogues",    tint: "from-cyan-500/15 to-cyan-500/0",     ring: "hover:ring-cyan-500/40",    iconBg: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30" },
  { icon: BookOpen,       key: "reading",      descKey: "readingPractice",  href: "/lessons/a1/reading",      tint: "from-green-500/15 to-green-500/0",   ring: "hover:ring-green-500/40",   iconBg: "bg-green-500/15 text-green-300 ring-1 ring-green-500/30" },
  { icon: HelpCircle,     key: "quizzes",      descKey: "testKnowledge",    href: "/quizzes",                 tint: "from-orange-500/15 to-orange-500/0", ring: "hover:ring-orange-500/40",  iconBg: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30" },
  { icon: GraduationCap,  key: "examPrep",     descKey: "a1ExamPrepShort",  href: "/exam-prep",               tint: "from-emerald-500/15 to-emerald-500/0", ring: "hover:ring-emerald-500/40", iconBg: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30" },
];

const VOCAB_GOAL = 500;
const LESSONS_GOAL = 45;

const SETTINGS_LABELS: Partial<Record<UILanguage, { dailyGoal: string; audioAuto: string; audioAutoDesc: string; preferredLang: string; remove: string; }>> & { en: { dailyGoal: string; audioAuto: string; audioAutoDesc: string; preferredLang: string; remove: string; } } = {
  en: { dailyGoal: "Daily goal XP", audioAuto: "Audio autoplay", audioAutoDesc: "Plays automatically when a flashcard loads", preferredLang: "Interface language", remove: "Remove" },
  bn: { dailyGoal: "দৈনিক লক্ষ্য XP", audioAuto: "অটো অডিও", audioAutoDesc: "ফ্ল্যাশকার্ড লোড হলে স্বয়ংক্রিয়ভাবে বাজবে", preferredLang: "ইন্টারফেস ভাষা", remove: "সরান" },
  az: { dailyGoal: "Gündəlik XP hədəfi", audioAuto: "Avtomatik səs", audioAutoDesc: "Flaşkart yükləndikdə avtomatik ifa olunur", preferredLang: "İnterfeys dili", remove: "Sil" },
  hi: { dailyGoal: "दैनिक लक्ष्य XP", audioAuto: "ऑटो ऑडियो", audioAutoDesc: "फ्लैशकार्ड लोड होते ही स्वतः चलेगा", preferredLang: "इंटरफ़ेस भाषा", remove: "हटाएँ" },
  ky: { dailyGoal: "Күнүмдүк XP максаты", audioAuto: "Авто үн", audioAutoDesc: "Карточка жүктөлгөндө автоматтык түрдө ойнойт", preferredLang: "Интерфейс тили", remove: "Алып салуу" },
  tg: { dailyGoal: "Ҳадафи XP-и ҳаррӯза", audioAuto: "Автопахш", audioAutoDesc: "Ҳангоми боргузории корти хотиравӣ худкор пахш мешавад", preferredLang: "Забони интерфейс", remove: "Ҳазф" },
  uz: { dailyGoal: "Kunlik XP maqsadi", audioAuto: "Audio avtoijro", audioAutoDesc: "Flashkarta yuklanganda avtomatik ijro etiladi", preferredLang: "Interfeys tili", remove: "Olib tashlash" },
};

const DAILY_LABELS: Record<"dailyLogin" | "vocabReview" | "completeLesson", Partial<Record<UILanguage, string>> & { en: string }> = {
  dailyLogin:     { en: "Daily login +10 XP",    bn: "দৈনিক লগইন +১০ XP",   az: "Gündəlik giriş +10 XP",    hi: "दैनिक लॉगिन +10 XP",     ky: "Күнүмдүк кирүү +10 XP",     tg: "Воридшавии ҳаррӯза +10 XP",  uz: "Kunlik kirish +10 XP" },
  vocabReview:    { en: "Vocab review +10 XP",   bn: "শব্দ পর্যালোচনা +১০ XP", az: "Lüğət təkrarı +10 XP",     hi: "शब्द समीक्षा +10 XP",     ky: "Сөздүк кайталоо +10 XP",   tg: "Такрори луғат +10 XP",       uz: "Lugʻat takrori +10 XP" },
  completeLesson: { en: "Complete a lesson",     bn: "একটি পাঠ সম্পন্ন করুন", az: "Bir dərsi tamamla",        hi: "एक पाठ पूरा करें",         ky: "Бир сабакты аяктаңыз",     tg: "Як дарсро ба итмом расонед", uz: "Bir darsni tugating" },
};

function xpProgressLabel(earned: number, goal: number, lang: UILanguage): string {
  const map: Partial<Record<UILanguage, (e: number, g: number) => string>> & { en: (e: number, g: number) => string } = {
    en: (e, g) => `${e} of ${g} XP earned today`,
    bn: (e, g) => `আজ ${g} XP-এর মধ্যে ${e} অর্জিত`,
    az: (e, g) => `Bu gün ${g} XP-dən ${e} qazanıldı`,
    hi: (e, g) => `आज ${g} XP में से ${e} अर्जित`,
    ky: (e, g) => `Бүгүн ${g} XP'тин ${e}'ү алынды`,
    tg: (e, g) => `Имрӯз аз ${g} XP ${e} ба даст оварда шуд`,
    uz: (e, g) => `Bugun ${g} XPdan ${e} olindi`,
  };
  return (map[lang] ?? map.en)(earned, goal);
}

// --------------------------------------------------------------------

export default function ProfilePage() {
  const router = useRouter();
  const { t, lang } = useTranslation();

  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const setUiLanguage = useAppStore((s) => s.setUiLanguage);
  const savedWords = useAppStore((s) => s.savedWords);
  const audioAutoplay = useAppStore((s) => s.audioAutoplay);
  const setAudioAutoplay = useAppStore((s) => s.setAudioAutoplay);
  const dailyGoal = useAppStore((s) => s.dailyGoalXP);
  const setDailyGoal = useAppStore((s) => s.setDailyGoalXP);
  const todayXPStore = useAppStore((s) => s.todayXP);
  const todayDate = useAppStore((s) => s.todayDate);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-sm">{t("loading")}</p>
      </div>
    );
  }

  // Real activity-derived values
  const wordsLearned = savedWords.size;
  const lessonsDone  = 0;
  const quizCount    = 0;
  const quizAvg      = 0;
  const streak       = user.streak_count ?? 0;
  const totalXP      = user.total_xp ?? 0;
  // Today's XP — auto-resets at midnight (UTC). Stored in Zustand and persisted.
  const _today = new Date().toISOString().slice(0, 10);
  const todaysXP = todayDate === _today ? todayXPStore : 0;
  const dueReview    = savedWords.size;

  const firstName = user.full_name?.split(" ")[0]?.trim() ?? "";
  const greeting = getGreeting(firstName, lang);
  const level = calculateLevel(totalXP);
  const labels = SETTINGS_LABELS[lang] ?? SETTINGS_LABELS.en;
  const joinedAgoDays = user.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86_400_000))
    : 0;

  const stats = [
    { key: "wordsLearned" as TranslationKey, value: String(wordsLearned), total: String(VOCAB_GOAL),   pct: Math.round((wordsLearned / VOCAB_GOAL) * 100),   tint: "text-amber-300",   bar: "bg-linear-to-r from-amber-400 to-amber-500" },
    { key: "lessonsDone"  as TranslationKey, value: String(lessonsDone),  total: String(LESSONS_GOAL), pct: Math.round((lessonsDone  / LESSONS_GOAL) * 100), tint: "text-blue-300",    bar: "bg-linear-to-r from-blue-400 to-blue-500" },
    { key: "quizAvg"      as TranslationKey, value: quizCount ? `${quizAvg}%` : "—", total: "", pct: null as number | null, tint: "text-emerald-300", bar: "bg-linear-to-r from-emerald-400 to-emerald-500" },
    { key: "daysActive"   as TranslationKey, value: String(streak),       total: "",                   pct: null as number | null,                                            tint: "text-purple-300",  bar: "bg-linear-to-r from-purple-400 to-purple-500" },
  ];

  const dailyTasks: { done: boolean; key: keyof typeof DAILY_LABELS }[] = [
    { done: true,             key: "dailyLogin" },
    { done: wordsLearned > 0, key: "vocabReview" },
    { done: lessonsDone  > 0, key: "completeLesson" },
  ];

  // ----- handlers -----
  const startEditName = () => { setNameDraft(user.full_name ?? ""); setEditingName(true); setError(null); };
  const cancelEditName = () => { setEditingName(false); setError(null); };

  const saveName = async () => {
    const next = nameDraft.trim();
    if (!next || next === user.full_name) { setEditingName(false); return; }
    setSavingName(true); setError(null);
    try {
      const sb = getSupabaseBrowser();
      const { error: e } = await sb.from("profiles").update({ full_name: next }).eq("id", user.id);
      if (e) throw e;
      setUser({ ...user, full_name: next } as UserProfile);
      setEditingName(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally { setSavingName(false); }
  };

  const onAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please pick an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB"); return; }
    setAvatarBusy(true); setError(null);
    try {
      const sb = getSupabaseBrowser();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data: pub } = sb.storage.from("avatars").getPublicUrl(path);
      const url = pub.publicUrl;
      const { error: profErr } = await sb.from("profiles").update({ avatar_url: url }).eq("id", user.id);
      if (profErr) throw profErr;
      setUser({ ...user, avatar_url: url } as UserProfile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally { setAvatarBusy(false); }
  };

  const removeAvatar = async () => {
    setAvatarBusy(true); setError(null);
    try {
      const sb = getSupabaseBrowser();
      await sb.from("profiles").update({ avatar_url: null }).eq("id", user.id);
      setUser({ ...user, avatar_url: undefined } as UserProfile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove");
    } finally { setAvatarBusy(false); }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden isolate">
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* ============== HERO: identity + greeting + XP/streak ============== */}
        <section className="relative mb-8 anim-fade-up">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 md:p-8 backdrop-blur-sm">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarSelected} />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0 self-start">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-amber-500/20 ring-2 ring-amber-500/40 flex items-center justify-center shadow-[0_8px_30px_-8px_rgba(245,158,11,0.5)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar_url || "/default-avatar.svg"}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {avatarBusy && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 size={22} className="animate-spin text-amber-300" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarBusy}
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center ring-2 ring-[var(--background)] disabled:opacity-60 transition-colors"
                  aria-label="Upload photo"
                >
                  <Camera size={15} className="text-black" />
                </button>
              </div>

              {/* Text + actions */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-3">
                  <Sparkles size={12} />
                  {t("dashboard")} · {t("myProfile")}
                </div>

                {editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      autoFocus
                      maxLength={80}
                      className="flex-1 max-w-md px-3 py-2 rounded-lg border border-amber-500/40 bg-black/40 text-gray-100 text-2xl font-extrabold focus:border-amber-500/60 focus:outline-none"
                      onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelEditName(); }}
                    />
                    <button onClick={saveName} disabled={savingName} className="p-2 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50">
                      {savingName ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button onClick={cancelEditName} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-50">
                      {greeting}
                    </h1>
                    <button onClick={startEditName} aria-label="Edit name" className="p-1.5 rounded-md text-gray-500 hover:text-amber-300 hover:bg-white/5">
                      <Pencil size={14} />
                    </button>
                  </div>
                )}

                <p className="mt-1 text-sm text-gray-400 truncate">{user.email}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-500/30">
                    {level.title[lang] ?? level.title.en}
                  </span>
                  <span className="text-xs text-gray-500 inline-flex items-center gap-1.5">
                    <Calendar size={11} />
                    {joinedAgoDays > 0 ? `Joined ${joinedAgoDays} day${joinedAgoDays > 1 ? "s" : ""} ago` : "Welcome aboard"}
                  </span>
                  {user.avatar_url && !avatarBusy && (
                    <button onClick={removeAvatar} className="text-xs text-gray-500 hover:text-red-400 underline">
                      {labels.remove}
                    </button>
                  )}
                </div>
              </div>

              {/* Right pills */}
              <div className="flex items-center gap-2 shrink-0">
                <StreakBadge count={streak} size="lg" />
                <LiveXP />
              </div>
            </div>

            {error && (
              <p className="relative mt-4 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <p className="relative mt-4 text-sm text-gray-400">
              {xpProgressLabel(todaysXP, dailyGoal, lang)}
            </p>
          </div>
        </section>

        {/* ============== STATS ============== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 anim-stagger">
          {stats.map((s) => (
            <div key={s.key} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-4 transition-all hover:border-white/20 hover:-translate-y-0.5">
              <div className="flex items-baseline justify-between mb-1">
                <p className={`text-2xl md:text-3xl font-extrabold tabular-nums ${s.tint}`}>
                  {s.value}
                  {s.total && <span className="text-gray-600 text-sm font-normal">/{s.total}</span>}
                </p>
                <TrendingUp size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-xs text-gray-500">{t(s.key)}</p>
              {s.pct !== null && (
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.pct}%` }} />
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ============== QUICK ACTIONS ============== */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 anim-fade-up">
            <h2 className="text-lg md:text-xl font-bold text-gray-100">{t("quickStart")}</h2>
            <Sparkles size={16} className="text-amber-400/70" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-stagger">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-4 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] ring-1 ring-transparent ${a.ring}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${a.tint} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <a.icon size={18} />
                  </div>
                </div>
                <div className="relative">
                  <p className="font-semibold text-gray-100 text-sm flex items-center gap-1">
                    {t(a.key)}
                    <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{t(a.descKey)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============== WORD OF THE DAY ============== */}
        <section className="mb-10 anim-fade-up">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/8 via-[var(--surface)] to-[var(--surface)] p-5 md:p-6">
            <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300/80 mb-3">
                <Star size={12} className="fill-amber-300/80" /> {t("wordOfDay")}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">{WORD_OF_DAY.lt}</span>
                    <AudioButton text={WORD_OF_DAY.lt} size="md" showSlow />
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30">{t(WORD_OF_DAY.part_of_speech)}</span>
                  </div>
                  <p className="text-gray-200 text-base">{WORD_OF_DAY.meaning[lang] ?? WORD_OF_DAY.meaning.en}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-sm min-w-0 sm:max-w-xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-amber-300 font-medium">{WORD_OF_DAY.example_lt}</span>
                    <AudioButton text={WORD_OF_DAY.example_lt} size="sm" />
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{WORD_OF_DAY.example[lang] ?? WORD_OF_DAY.example.en}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== CONTINUE LEARNING + DAILY GOAL ============== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 anim-fade-up">
            <h2 className="text-lg md:text-xl font-bold text-gray-100 mb-4">{t("continueLearn")}</h2>
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/40 backdrop-blur-sm p-6 text-center">
              <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-amber-500/10 blur-3xl" />
              <p className="text-sm text-gray-300 font-semibold">No lessons in progress yet</p>
              <p className="text-xs text-gray-500 mt-1">Start a lesson and your progress will appear here.</p>
              <Link
                href="/lessons"
                className="inline-flex items-center gap-1.5 mt-4 px-3.5 h-9 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-sm font-bold transition-all"
              >
                Browse lessons <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {/* Daily goal */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-5 anim-fade-up">
              <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-amber-500/15 blur-2xl" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-100 text-sm flex items-center gap-2">
                  <Flame size={14} className="text-amber-400" />
                  {t("dailyGoal")}
                </h3>
                {todaysXP >= dailyGoal && dailyGoal > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <Check size={10} /> Goal hit!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <ProgressRing
                    value={Math.min(100, Math.round((todaysXP / dailyGoal) * 100))}
                    size={104}
                    strokeWidth={9}
                    label={String(todaysXP)}
                    sublabel={`/ ${dailyGoal}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-100">{xpProgressLabel(todaysXP, dailyGoal, lang)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dailyGoal - todaysXP > 0
                      ? `${dailyGoal - todaysXP} XP to go`
                      : "You crushed today's goal!"}
                  </p>
                  <div className="mt-3 space-y-1">
                    {dailyTasks.map((a) => (
                      <div key={a.key} className="flex items-center gap-1.5 text-xs">
                        <span className={a.done ? "text-emerald-400" : "text-gray-600"}>{a.done ? "✓" : "○"}</span>
                        <span className={a.done ? "text-gray-400" : "text-gray-600"}>{DAILY_LABELS[a.key][lang] ?? DAILY_LABELS[a.key].en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Due Review */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-[var(--surface)] to-[var(--surface)] p-5 anim-fade-up">
              <h3 className="font-bold text-gray-100 mb-2 text-sm flex items-center gap-2">
                <RotateCcw size={14} className="text-amber-400" />
                {t("dueReview")}
              </h3>
              <p className="text-3xl font-extrabold bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-0.5 tabular-nums">{dueReview}</p>
              <p className="text-xs text-gray-500 mb-3">{t("wordsDueToday")}</p>
              <Link
                href="/flashcards"
                className="block w-full text-center py-2.5 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-sm font-bold transition-all"
              >
                {t("reviewNow")}
              </Link>
            </div>
          </div>
        </div>

        {/* ============== REVIEW ============== */}
        <section className="mb-10">
          <ReviewForm />
        </section>

        {/* ============== SETTINGS + ACHIEVEMENTS ============== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-6 anim-fade-up">
            <h3 className="font-bold text-gray-100 mb-4 flex items-center gap-2">
              <SettingsIcon size={15} className="text-amber-300" />
              {t("settings")}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.preferredLang}</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((L) => (
                    <button key={L.code} onClick={() => setUiLanguage(L.code)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all flex items-center gap-1.5 ${lang === L.code ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "border-[var(--border)] text-gray-400 hover:text-gray-200"}`}>
                      <span>{L.flag}</span>
                      <span>{L.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.dailyGoal}</label>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((g) => (
                    <button key={g} onClick={() => setDailyGoal(g)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${dailyGoal === g ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "border-[var(--border)] text-gray-400"}`}>
                      {g} XP
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-medium text-gray-300">{labels.audioAuto}</p>
                  <p className="text-xs text-gray-500">{labels.audioAutoDesc}</p>
                </div>
                <button
                  onClick={() => setAudioAutoplay(!audioAutoplay)}
                  className={`shrink-0 w-11 h-6 rounded-full transition-all ${audioAutoplay ? "bg-amber-500" : "bg-gray-700"}`}
                  aria-pressed={audioAutoplay}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${audioAutoplay ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="pt-1">
                <VoicePicker />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-6 anim-fade-up">
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
            <h3 className="font-bold text-gray-100 mb-1 flex items-center gap-2">
              <Trophy size={15} className="text-amber-300" />
              {t("achievements")}
            </h3>
            <p className="text-sm text-gray-500 mb-4">Earn achievements by saving words, completing lessons, and keeping a streak.</p>
            {(() => {
              const achievements = [
                // ── Onboarding ─────────────────────────────────────────
                { icon: "🌅", title: "First Day",        desc: "Logged in for the first time",   earned: true },
                { icon: "🎯", title: "Daily Goal",       desc: "Hit your daily XP goal",         earned: todaysXP >= dailyGoal && dailyGoal > 0 },
                // ── Vocabulary tiers ──────────────────────────────────
                { icon: "📒", title: "Word Collector",   desc: "Save 10 vocabulary words",       earned: wordsLearned >= 10 },
                { icon: "📚", title: "Bookworm",         desc: "Save 50 vocabulary words",       earned: wordsLearned >= 50 },
                { icon: "📖", title: "100 Words",        desc: "Save 100 vocabulary words",      earned: wordsLearned >= 100 },
                // ── XP tiers ──────────────────────────────────────────
                { icon: "⭐", title: "First Steps",      desc: "Reach 10 XP",                    earned: totalXP >= 10 },
                { icon: "🌟", title: "Rising Learner",   desc: "Reach 100 XP",                   earned: totalXP >= 100 },
                { icon: "💫", title: "Dedicated",        desc: "Reach 500 XP",                   earned: totalXP >= 500 },
                // ── Streak tiers ──────────────────────────────────────
                { icon: "🔥", title: "One Week",         desc: "Keep a 7-day streak",            earned: streak >= 7 },
                { icon: "🌋", title: "One Month",        desc: "Keep a 30-day streak",           earned: streak >= 30 },
              ];
              const earnedCount = achievements.filter((a) => a.earned).length;
              return (
                <>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-amber-400 to-amber-500 transition-all duration-700"
                        style={{ width: `${(earnedCount / achievements.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums shrink-0">
                      {earnedCount}/{achievements.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 anim-stagger">
                    {achievements.map((a) => (
                <div
                  key={a.title}
                  className={`group relative overflow-hidden p-4 rounded-xl border flex items-start gap-3 transition-all hover:-translate-y-0.5 ${
                    a.earned
                      ? "border-amber-500/30 bg-linear-to-br from-amber-500/10 via-transparent to-transparent shadow-[0_8px_24px_-12px_rgba(245,158,11,0.5)]"
                      : "border-white/10 bg-black/20 opacity-70"
                  }`}
                >
                  <span className={`text-3xl ${a.earned ? "" : "grayscale"}`}>{a.icon}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-100 text-sm">{a.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
                    {a.earned ? (
                      <p className="text-[11px] text-emerald-400 mt-1.5 inline-flex items-center gap-1 font-semibold">
                        <Check size={11} /> Earned
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-600 mt-1.5">Locked</p>
                    )}
                  </div>
                </div>
              ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
