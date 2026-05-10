"use client";

import { useEffect, useMemo, useState } from "react";
import { ExamTimerBar } from "@/components/shared/ExamTimerBar";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { buildPaper, variantCount, type ExamPaper } from "@/lib/exam/buildPaper";
import type { MCQ } from "@/data/exams/pool";
import { AlertTriangle, Clock, ChevronLeft, ChevronRight, Headphones, BookOpen, PenLine, Mic, Lock, Pencil, Check } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/stores/useAppStore";

type Phase = "intro" | "listening" | "reading" | "writing" | "speaking" | "confirm" | "results";

// Real-exam timing (matches official A1 integration test budgets, scaled).
const SECTION_TIME = {
  listening: 15 * 60,   // 15 min
  reading:   20 * 60,   // 20 min
  writing:   25 * 60,   // 25 min
  speaking:  10 * 60,   // 10 min
} as const;

const SECTION_LABEL_LT = { listening: "Klausymas", reading: "Skaitymas", writing: "Rašymas", speaking: "Kalbėjimas" } as const;
const SECTION_LABEL_EN = { listening: "Listening", reading: "Reading",   writing: "Writing", speaking: "Speaking"  } as const;
const SECTION_LABEL_BN = { listening: "শোনা",      reading: "পড়া",       writing: "লেখা",    speaking: "কথা বলা"   } as const;

const SEED_KEY = "klb-mock-seed";

/**
 * Hoisted to module scope so its component identity is stable across parent
 * re-renders. If this lived inside MockExamPage, every state change (e.g.
 * navigating to the next question) would create a new function reference —
 * React would unmount/remount the header and reset the ExamTimerBar's state.
 * The whole point of this component is its persistence across questions.
 */
function ExamHeader({
  examId,
  candidateName,
  sectionKey,
  sectionLabel,
  sectionTime,
  onExpire,
  progress,
}: {
  examId: string;
  candidateName: string;
  sectionKey: keyof typeof SECTION_LABEL_EN;
  sectionLabel: string;
  sectionTime: number;
  onExpire: () => void;
  progress?: { current: number; total: number };
}) {
  return (
    <header className="sticky top-14 md:top-0 z-20 -mx-4 px-4 py-3 bg-[var(--background)]/85 backdrop-blur border-b border-white/10 mb-5">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            {examId}{candidateName && ` · ${candidateName}`}
          </p>
          <h2 className="text-sm font-bold text-gray-100 leading-tight">
            <span className="lt-text text-amber-400">{SECTION_LABEL_LT[sectionKey]}</span>
            <span className="text-gray-400"> · {sectionLabel}</span>
            {progress && <span className="text-gray-500 font-normal text-xs ml-2">Q{progress.current}/{progress.total}</span>}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <ExamTimerBar totalSeconds={sectionTime} onExpire={onExpire} className="w-32 sm:w-40" />
        </div>
      </div>
    </header>
  );
}

function NativeText({ value, fallback }: { value: string | undefined; fallback: string }) {
  if (!value) return <span className="inline-block w-24 h-3 rounded bg-white/5 animate-pulse" aria-label={fallback} />;
  return <span>{value}</span>;
}

export default function MockExamPage() {
  const { t, lang } = useTranslation();
  const user = useAppStore((s) => s.user);
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;

  // Seed lifecycle: when the user clicks "Start Now" we mint a fresh seed and
  // persist it for the duration of the attempt. Refreshing during the exam
  // keeps the same paper. Submitting clears it so the next attempt is new.
  const [seed, setSeed] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(SEED_KEY);
    return stored ? Number(stored) : null;
  });

  const paper = useMemo<ExamPaper | null>(() => seed ? buildPaper(seed) : null, [seed]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [listeningAnswers, setListeningAnswers] = useState<(number | null)[]>([]);
  const [readingAnswers, setReadingAnswers] = useState<(number | null)[]>([]);
  const [writingText, setWritingText] = useState("");
  const [speakingDone, setSpeakingDone] = useState<boolean[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [editingName, setEditingName] = useState(false);

  // Default candidate name to the signed-in profile name. Re-runs when the
  // user object loads (auth is async) but only if the user hasn't typed yet.
  useEffect(() => {
    if (!candidateName && user?.full_name) setCandidateName(user.full_name);
  }, [user, candidateName]);

  // Reset per-attempt arrays when paper changes.
  useEffect(() => {
    if (!paper) return;
    setListeningAnswers(Array(paper.listening.length).fill(null));
    setReadingAnswers(Array(paper.reading.reduce((n, p) => n + p.questions.length, 0)).fill(null));
    setSpeakingDone(Array(paper.speaking.length).fill(false));
    setCurrentQ(0);
    setWritingText("");
  }, [paper]);

  /* ---------------- Translations for non-EN/BN UI languages ---------------- */
  const translatable = useMemo(() => {
    if (!showOther || !paper) return [];
    const set = new Set<string>();
    paper.listening.forEach((q) => { set.add(q.q_en); q.options_en.forEach((o) => set.add(o)); });
    paper.reading.forEach((p) => p.questions.forEach((q) => { set.add(q.q_en); q.options_en.forEach((o) => set.add(o)); }));
    set.add(paper.writing.prompt_en);
    paper.speaking.forEach((s) => set.add(s.prompt_en));
    return Array.from(set);
  }, [showOther, paper]);
  const translated = useNativeTranslations(translatable, lang);

  /* ----------------------------- Helpers ---------------------------------- */
  const sectionLabel = (k: keyof typeof SECTION_LABEL_EN): string => {
    if (isEn) return SECTION_LABEL_EN[k];
    if (isBn) return SECTION_LABEL_BN[k];
    return translated.get(SECTION_LABEL_EN[k]) ?? SECTION_LABEL_EN[k];
  };

  const renderQ = (q: MCQ): React.ReactNode => {
    if (isEn) return q.q_en;
    if (isBn) return q.q_bn;
    return <NativeText value={translated.get(q.q_en)} fallback={q.q_en} />;
  };
  const renderOpt = (q: MCQ, oi: number): React.ReactNode => {
    if (isEn) return q.options_en[oi];
    if (isBn) return q.options_bn[oi];
    return <NativeText value={translated.get(q.options_en[oi])} fallback={q.options_en[oi]} />;
  };

  const startExam = () => {
    const fresh = Date.now();
    sessionStorage.setItem(SEED_KEY, String(fresh));
    setSeed(fresh);
    setPhase("listening");
  };

  const finishAttempt = () => {
    sessionStorage.removeItem(SEED_KEY);
    setPhase("results");
  };

  const resetAll = () => {
    sessionStorage.removeItem(SEED_KEY);
    setSeed(null);
    setPhase("intro");
  };

  /* ========================== LOGIN GATE ================================= */
  // The middleware already redirects unauthenticated /exam-prep visits, but we
  // also render a gentle in-page gate in case the user lands here via client
  // navigation before AuthSync resolves, or signs out mid-attempt.
  if (phase === "intro" && user === null) {
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-md mx-auto px-4 py-16 text-center anim-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-4">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-2">Sign in to take the mock exam</h1>
          <p className="text-gray-400 text-sm mb-6">
            The A1 mock exam tracks your score and is tied to your account so you can review past attempts.
            It only takes 30 seconds to create one.
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              href={`/login?next=${encodeURIComponent("/exam-prep/mock-exam")}`}
              className="px-6 h-11 inline-flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors"
            >
              Sign in
            </Link>
            <Link
              href={`/register?next=${encodeURIComponent("/exam-prep/mock-exam")}`}
              className="px-6 h-11 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-gray-200 font-semibold transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ============================== INTRO ================================== */
  if (phase === "intro") {
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 anim-fade-up">
          <div className="text-center">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("mockExam")}</h1>
            <p className="text-amber-400 font-bold text-lg mb-1">A1 Integration Test Simulation</p>
            <p className="text-gray-400 mb-2">{t("examSubLong")}</p>
            <p className="text-xs text-gray-500 mb-8">
              {variantCount()}+ randomised question sets · different paper every attempt
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-6">
            <h2 className="font-bold text-gray-100 mb-3">Exam structure</h2>
            <div className="space-y-2 text-sm">
              {([
                { lt: "Klausymas", k: "listening", time: "15 min", count: "8 questions",  Icon: Headphones },
                { lt: "Skaitymas", k: "reading",   time: "20 min", count: "6 questions",  Icon: BookOpen },
                { lt: "Rašymas",   k: "writing",   time: "25 min", count: "1 task",        Icon: PenLine },
                { lt: "Kalbėjimas",k: "speaking",  time: "10 min", count: "2 prompts",     Icon: Mic },
              ] as const).map((s) => (
                <div key={s.lt} className="flex items-center gap-3 p-3 rounded-lg bg-black/30">
                  <s.Icon size={16} className="text-amber-400 shrink-0" />
                  <span className="lt-text font-bold text-amber-400">{s.lt}</span>
                  <span className={cn("text-sm text-gray-300", isBn && "font-bengali")}>{sectionLabel(s.k)}</span>
                  <span className="text-gray-500 text-xs ml-auto">{s.time} · {s.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/20">
              <p className="text-amber-300 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span className={cn(isBn && "font-bengali")}>
                  {isBn
                    ? "একবার শুরু করলে বিরতি নেওয়া যাবে না। সময় শেষ হলে পরবর্তী সেকশন স্বয়ংক্রিয়ভাবে চালু হবে। প্রস্তুত হয়ে শুরু করুন।"
                    : "Once started, the timer runs continuously. When time runs out the next section starts automatically. Be ready before you begin."}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Candidate name
              </label>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") setEditingName(false); }}
                    placeholder="Your name"
                    className="flex-1 px-3 h-10 rounded-lg border border-amber-500/40 bg-black/30 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                  <button
                    onClick={() => setEditingName(false)}
                    aria-label="Save name"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="group w-full flex items-center justify-between gap-2 px-3 h-10 rounded-lg border border-white/10 bg-black/30 text-sm text-gray-100 hover:border-amber-500/40 transition-colors text-left"
                >
                  <span className={cn(!candidateName && "text-gray-500")}>
                    {candidateName || "Sign in to auto-fill, or click to edit"}
                  </span>
                  <Pencil size={14} className="text-gray-500 group-hover:text-amber-300" />
                </button>
              )}
              {user && candidateName === user.full_name && (
                <p className="text-[10px] text-gray-500 mt-1">From your account · click to rename for this attempt.</p>
              )}
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full sm:w-auto sm:mx-auto block px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all hover:scale-[1.03] shadow-lg shadow-amber-500/25"
          >
            {t("startNow")}
          </button>
        </div>
      </div>
    );
  }

  if (!paper) return null;

  /* =========================== LISTENING ================================= */
  if (phase === "listening") {
    const q = paper.listening[currentQ];
    const total = paper.listening.length;

    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
          <ExamHeader
            examId={paper.id}
            candidateName={candidateName}
            sectionKey="listening"
            sectionLabel={sectionLabel("listening")}
            sectionTime={SECTION_TIME.listening}
            onExpire={() => { setCurrentQ(0); setPhase("reading"); }}
            progress={{ current: currentQ + 1, total }}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <Headphones size={22} className="text-blue-300" />
            </div>
            <p className="text-xs text-gray-500 mb-2">Click to play. You may listen up to 2 times.</p>
            <AudioButton text={q.audio!} size="lg" className="mx-auto" />
          </div>

          <Question
            q={q}
            answer={listeningAnswers[currentQ]}
            onAnswer={(idx) => {
              const arr = [...listeningAnswers];
              arr[currentQ] = idx;
              setListeningAnswers(arr);
            }}
            renderQ={renderQ}
            renderOpt={renderOpt}
            isBn={isBn}
            isEn={isEn}
            accent="blue"
          />

          <Navigator
            total={total}
            current={currentQ}
            answers={listeningAnswers}
            onJump={setCurrentQ}
            onPrev={() => setCurrentQ((i) => Math.max(0, i - 1))}
            onNext={() => {
              if (currentQ + 1 < total) setCurrentQ((i) => i + 1);
              else { setCurrentQ(0); setPhase("reading"); }
            }}
            isLast={currentQ + 1 === total}
            nextLabel="Next section: Skaitymas"
          />
        </div>
      </div>
    );
  }

  /* ============================= READING ================================= */
  if (phase === "reading") {
    const flat = paper.reading.flatMap((p, pi) =>
      p.questions.map((q) => ({ q, passage: p, passageIndex: pi })),
    );
    const total = flat.length;
    const item = flat[currentQ];

    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
          <ExamHeader
            examId={paper.id}
            candidateName={candidateName}
            sectionKey="reading"
            sectionLabel={sectionLabel("reading")}
            sectionTime={SECTION_TIME.reading}
            onExpire={() => { setCurrentQ(0); setPhase("writing"); }}
            progress={{ current: currentQ + 1, total }}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                Passage {item.passageIndex + 1} of {paper.reading.length}
              </span>
              <AudioButton text={item.passage.text_lt} size="sm" />
            </div>
            <p className="lt-text font-bold text-sm leading-relaxed whitespace-pre-line">{item.passage.text_lt}</p>
          </div>

          <Question
            q={item.q}
            answer={readingAnswers[currentQ]}
            onAnswer={(idx) => {
              const arr = [...readingAnswers];
              arr[currentQ] = idx;
              setReadingAnswers(arr);
            }}
            renderQ={renderQ}
            renderOpt={renderOpt}
            isBn={isBn}
            isEn={isEn}
            accent="green"
          />

          <Navigator
            total={total}
            current={currentQ}
            answers={readingAnswers}
            onJump={setCurrentQ}
            onPrev={() => setCurrentQ((i) => Math.max(0, i - 1))}
            onNext={() => {
              if (currentQ + 1 < total) setCurrentQ((i) => i + 1);
              else { setCurrentQ(0); setPhase("writing"); }
            }}
            isLast={currentQ + 1 === total}
            nextLabel="Next section: Rašymas"
          />
        </div>
      </div>
    );
  }

  /* ============================= WRITING ================================= */
  if (phase === "writing") {
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    const w = paper.writing;
    const inRange = wc >= w.minWords && wc <= w.maxWords;

    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
          <ExamHeader
            examId={paper.id}
            candidateName={candidateName}
            sectionKey="writing"
            sectionLabel={sectionLabel("writing")}
            sectionTime={SECTION_TIME.writing}
            onExpire={() => { setCurrentQ(0); setPhase("speaking"); }}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-2">Užduotis · Task</p>
            <p className={cn("text-emerald-200 leading-relaxed", isBn && "font-bengali")}>
              {isEn ? w.prompt_en : isBn ? w.prompt_bn : <NativeText value={translated.get(w.prompt_en)} fallback={w.prompt_en} />}
            </p>
            {!isEn && <p className="text-xs text-gray-500 mt-2">{w.prompt_en}</p>}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
            <textarea
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              rows={10}
              placeholder="Write your message in Lithuanian…"
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm resize-none"
            />
            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
              <span className={cn("text-xs", inRange ? "text-emerald-400" : wc < w.minWords ? "text-amber-400" : "text-red-400")}>
                {wc} {isBn ? "শব্দ" : "words"} · target {w.minWords}–{w.maxWords}
                {inRange && " ✓"}
              </span>
              <button
                onClick={() => { setCurrentQ(0); setPhase("speaking"); }}
                className="px-5 h-10 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
              >
                Continue to Kalbėjimas →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================= SPEAKING ================================ */
  if (phase === "speaking") {
    const total = paper.speaking.length;
    const s = paper.speaking[currentQ];
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
          <ExamHeader
            examId={paper.id}
            candidateName={candidateName}
            sectionKey="speaking"
            sectionLabel={sectionLabel("speaking")}
            sectionTime={SECTION_TIME.speaking}
            onExpire={() => setPhase("confirm")}
            progress={{ current: currentQ + 1, total }}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-fuchsia-300 font-bold mb-2">Užduotis · Speak aloud</p>
            <p className={cn("text-gray-100 text-base leading-relaxed", isBn && "font-bengali")}>
              {isEn ? s.prompt_en : isBn ? s.prompt_bn : <NativeText value={translated.get(s.prompt_en)} fallback={s.prompt_en} />}
            </p>
            {!isEn && <p className="text-xs text-gray-500 mt-2">{s.prompt_en}</p>}
          </div>

          {s.model_lt && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Model answer (review only)</span>
                <AudioButton text={s.model_lt} size="sm" />
              </div>
              <p className="lt-text text-sm leading-relaxed text-gray-300">{s.model_lt}</p>
            </div>
          )}

          <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/[0.04] p-5 text-center">
            <Mic size={28} className="text-fuchsia-300 mx-auto mb-2" />
            <p className="text-sm text-gray-200 mb-4">Speak your answer out loud, then mark it complete.</p>
            <button
              onClick={() => {
                const arr = [...speakingDone];
                arr[currentQ] = true;
                setSpeakingDone(arr);
                if (currentQ + 1 < total) setCurrentQ((i) => i + 1);
                else setPhase("confirm");
              }}
              className="px-6 h-11 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-bold transition-colors"
            >
              {speakingDone[currentQ] ? "Re-recorded ✓" : "I have spoken my answer"}
            </button>
          </div>

          <Navigator
            total={total}
            current={currentQ}
            answers={speakingDone.map((d) => (d ? 0 : null))}
            onJump={setCurrentQ}
            onPrev={() => setCurrentQ((i) => Math.max(0, i - 1))}
            onNext={() => {
              if (currentQ + 1 < total) setCurrentQ((i) => i + 1);
              else setPhase("confirm");
            }}
            isLast={currentQ + 1 === total}
            nextLabel="Submit exam"
          />
        </div>
      </div>
    );
  }

  /* ============================ CONFIRM SUBMIT =========================== */
  if (phase === "confirm") {
    const lUnanswered = listeningAnswers.filter((a) => a === null).length;
    const rUnanswered = readingAnswers.filter((a) => a === null).length;
    const totalReading = paper.reading.reduce((n, p) => n + p.questions.length, 0);
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    const speakingPending = speakingDone.filter((d) => !d).length;

    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-12 text-center anim-fade-up">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-extrabold text-gray-100 mb-2">Submit exam?</h2>
          <p className="text-gray-400 text-sm mb-6">Once you submit you cannot change your answers.</p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left space-y-2 mb-6 text-sm">
            <SummaryRow label="Klausymas (Listening)" detail={`${paper.listening.length - lUnanswered}/${paper.listening.length} answered`} warn={lUnanswered > 0} />
            <SummaryRow label="Skaitymas (Reading)"  detail={`${totalReading - rUnanswered}/${totalReading} answered`}  warn={rUnanswered > 0} />
            <SummaryRow label="Rašymas (Writing)"    detail={`${wc} words written`}                                     warn={wc < paper.writing.minWords} />
            <SummaryRow label="Kalbėjimas (Speaking)" detail={`${paper.speaking.length - speakingPending}/${paper.speaking.length} prompts done`} warn={speakingPending > 0} />
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setPhase("listening")}
              className="px-5 h-11 rounded-xl border border-white/10 bg-white/[0.03] text-gray-200 hover:bg-white/[0.06] text-sm font-semibold"
            >
              ← Back to exam
            </button>
            <button
              onClick={finishAttempt}
              className="px-6 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors"
            >
              Submit final
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================== RESULTS ================================ */
  if (phase === "results") {
    const lScore = listeningAnswers.filter((a, i) => a !== null && a === paper.listening[i].correct).length;
    const flatReading = paper.reading.flatMap((p) => p.questions);
    const rScore = readingAnswers.filter((a, i) => a !== null && a === flatReading[i].correct).length;
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    const wScore = wc >= paper.writing.minWords ? 1 : 0;
    const sScore = speakingDone.filter(Boolean).length;

    const sections = [
      { key: "listening" as const, score: lScore, total: paper.listening.length },
      { key: "reading"   as const, score: rScore, total: flatReading.length },
      { key: "writing"   as const, score: wScore, total: 1 },
      { key: "speaking"  as const, score: sScore, total: paper.speaking.length },
    ];

    const total = sections.reduce((n, s) => n + s.total, 0);
    const got = sections.reduce((n, s) => n + s.score, 0);
    const totalPct = Math.round((got / total) * 100);
    const allMin = sections.every((s) => Math.round((s.score / s.total) * 100) >= 25);
    const passed = totalPct >= 50 && allMin;

    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-12 anim-fade-up">
          <div className="text-center">
            <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-1">Mock Exam Results</h2>
            <p className="text-xs text-gray-500 font-mono">{paper.id}{candidateName && ` · ${candidateName}`}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 my-6">
            <div className={cn("text-4xl font-bold mb-1 text-center", passed ? "text-emerald-400" : "text-red-400")}>{totalPct}%</div>
            <p className={cn("text-lg font-bold text-center mb-4", passed ? "text-emerald-400" : "text-red-400")}>
              {passed ? "✓ Passed (≥50% with ≥25% per section)" : "✗ Did not pass"}
            </p>

            <div className="space-y-3">
              {sections.map((s) => {
                const pct = Math.round((s.score / s.total) * 100);
                return (
                  <div key={s.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        <span className="lt-text text-amber-400">{SECTION_LABEL_LT[s.key]}</span>{" "}
                        <span className="text-gray-500">({sectionLabel(s.key)})</span>
                      </span>
                      <span className={pct >= 25 ? "text-emerald-400" : "text-red-400"}>{s.score}/{s.total} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div className={cn("h-full rounded-full", pct >= 50 ? "bg-emerald-500" : pct >= 25 ? "bg-amber-500" : "bg-red-500")}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review answers */}
          <ReviewBlock title="Klausymas review" items={paper.listening} answers={listeningAnswers} />
          <ReviewBlock title="Skaitymas review" items={flatReading} answers={readingAnswers} />

          <button
            onClick={resetAll}
            className="mt-6 w-full px-6 h-12 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold transition-all"
          >
            {t("tryAgain")} (new paper)
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* ----------------------------- Sub-components ---------------------------- */

function Question({
  q,
  answer,
  onAnswer,
  renderQ,
  renderOpt,
  isBn,
  isEn,
  accent,
}: {
  q: MCQ;
  answer: number | null;
  onAnswer: (idx: number) => void;
  renderQ: (q: MCQ) => React.ReactNode;
  renderOpt: (q: MCQ, oi: number) => React.ReactNode;
  isBn: boolean;
  isEn: boolean;
  accent: "blue" | "green";
}) {
  const ringClass = accent === "blue" ? "border-blue-500 bg-blue-500/10 text-blue-200" : "border-emerald-500 bg-emerald-500/10 text-emerald-200";
  const hoverClass = accent === "blue" ? "hover:border-blue-500/30" : "hover:border-emerald-500/30";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
      <p className={cn("font-medium text-gray-100 mb-1", isBn && "font-bengali")}>{renderQ(q)}</p>
      {!isEn && <p className="text-xs text-gray-500 mb-3">{q.q_en}</p>}
      <div className="space-y-2">
        {q.options_en.map((_, oi) => {
          const selected = answer === oi;
          const cls = selected
            ? ringClass
            : `border-white/10 bg-white/[0.02] text-gray-300 ${hoverClass} hover:bg-white/[0.05]`;
          return (
            <button
              key={oi}
              onClick={() => onAnswer(oi)}
              className={cn("w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all", isBn && "font-bengali", cls)}
            >
              <span className="font-mono text-xs text-gray-500 mr-2">{String.fromCharCode(65 + oi)}.</span>
              {renderOpt(q, oi)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Navigator({
  total,
  current,
  answers,
  onJump,
  onPrev,
  onNext,
  isLast,
  nextLabel,
}: {
  total: number;
  current: number;
  answers: (number | null)[];
  onJump: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
  nextLabel: string;
}) {
  return (
    <div className="mt-5 flex items-center gap-2 flex-wrap">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="inline-flex items-center gap-1 px-3 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      <div className="flex flex-wrap gap-1.5 mx-1">
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === current;
          const answered = answers[i] !== null && answers[i] !== undefined;
          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              aria-label={`Question ${i + 1}`}
              className={cn(
                "w-7 h-7 inline-flex items-center justify-center rounded-md text-xs font-bold transition-colors",
                isCurrent
                  ? "bg-amber-500 text-black"
                  : answered
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/[0.04] text-gray-400 border border-white/10 hover:text-gray-200",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className={cn(
          "inline-flex items-center gap-1 px-4 h-9 rounded-lg text-sm font-bold ml-auto transition-colors",
          isLast
            ? "bg-amber-500 hover:bg-amber-400 text-black"
            : "bg-white/[0.05] hover:bg-white/[0.08] text-gray-100 border border-white/10",
        )}
      >
        {isLast ? nextLabel : "Next"} <ChevronRight size={14} />
      </button>
    </div>
  );
}

function SummaryRow({ label, detail, warn }: { label: string; detail: string; warn: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-gray-200">{label}</span>
      <span className={warn ? "text-amber-400 text-xs" : "text-emerald-400 text-xs"}>{detail}</span>
    </div>
  );
}

function ReviewBlock({ title, items, answers }: { title: string; items: MCQ[]; answers: (number | null)[] }) {
  return (
    <details className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mt-4">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-200">{title}</summary>
      <div className="px-4 py-3 border-t border-white/10 space-y-3">
        {items.map((q, i) => {
          const a = answers[i];
          const correct = a !== null && a === q.correct;
          return (
            <div key={q.id} className="text-xs">
              <p className="text-gray-300 mb-1">
                {i + 1}. {q.q_en}
              </p>
              <p className={cn(correct ? "text-emerald-400" : "text-red-400")}>
                Your answer: {a === null ? "— (skipped)" : `${String.fromCharCode(65 + a)}. ${q.options_en[a]}`}
              </p>
              {!correct && (
                <p className="text-emerald-300/80">Correct: {String.fromCharCode(65 + q.correct)}. {q.options_en[q.correct]}</p>
              )}
            </div>
          );
        })}
      </div>
    </details>
  );
}
