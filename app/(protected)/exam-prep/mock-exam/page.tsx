"use client";

import { useMemo, useState } from "react";
import { ExamTimerBar } from "@/components/shared/ExamTimerBar";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

type Phase = "intro" | "listening" | "reading" | "writing" | "results";

interface MCQ {
  audio?: string;
  q_en: string;
  q_bn: string;
  options_en: string[];
  options_bn: string[];
  correct: number;
}

const MOCK_LISTENING_QUESTIONS: MCQ[] = [
  {
    audio: "Autobusas į Kauną išvyksta aštuonioliktą valandą.",
    q_en: "When does the bus depart?",
    q_bn: "বাসটি কখন ছাড়বে?",
    options_en: ["17:00", "18:00", "19:00", "20:00"],
    options_bn: ["১৭:০০", "১৮:০০", "১৯:০০", "২০:০০"],
    correct: 1,
  },
  {
    audio: "Parduotuvė sekmadienį atidaryta nuo dešimtos iki šešioliktos.",
    q_en: "How long is the shop open on Sunday?",
    q_bn: "রবিবার দোকান কতক্ষণ খোলা?",
    options_en: ["8:00–16:00", "10:00–16:00", "10:00–18:00", "9:00–17:00"],
    options_bn: ["৮:০০-১৬:০০", "১০:০০-১৬:০০", "১০:০০-১৮:০০", "৯:০০-১৭:০০"],
    correct: 1,
  },
];

const MOCK_READING_TEXT = "KAVOS PARDUOTUVĖ. Atidaryta kasdien 7:00-22:00. Kava: 2€. Arbata: 1.5€. Vanduo: 1€. Wi-Fi nemokamas.";
const MOCK_READING_QUESTIONS: MCQ[] = [
  { q_en: "When does the shop close?",   q_bn: "দোকানটি কখন বন্ধ হয়?",       options_en: ["20:00", "21:00", "22:00", "23:00"],                    options_bn: ["২০:০০", "২১:০০", "২২:০০", "২৩:০০"],            correct: 2 },
  { q_en: "What is the price of coffee?", q_bn: "কফির দাম কত?",                  options_en: ["1€", "1.5€", "2€", "2.5€"],                            options_bn: ["১€", "১.৫€", "২€", "২.৫€"],                       correct: 2 },
  { q_en: "What does it say about Wi-Fi?", q_bn: "Wi-Fi সম্পর্কে কী বলা হয়েছে?", options_en: ["Not available", "Free", "5€/hour", "Password required"], options_bn: ["নেই", "বিনামূল্যে", "৫€/ঘন্টা", "পাসওয়ার্ড লাগে"], correct: 1 },
];

const MOCK_WRITING_PROMPT_EN = "Write a message to your friend Roma: you can't go to the park on Saturday afternoon because you have work. Suggest meeting next week. (50–80 words)";
const MOCK_WRITING_PROMPT_BN = "আপনার বন্ধু Roma কে একটি বার্তা লিখুন: আপনি শনিবার বিকেলে পার্কে যেতে পারবেন না কারণ আপনার কাজ আছে। পরের সপ্তাহে দেখা করার প্রস্তাব দিন। (৫০-৮০ শব্দ)";

const SECTION_LABEL_EN = ["Listening", "Reading", "Writing"];
const SECTION_LABEL_BN = ["শোনা", "পড়া", "লেখা"];

const RESULT_PASSED_EN = "Congratulations! You're ready for the A1 exam. Keep practicing and register for the test.";
const RESULT_PASSED_BN = "অভিনন্দন! আপনি A1 পরীক্ষার জন্য প্রস্তুত। আরো অনুশীলন করুন এবং পরীক্ষার জন্য নিবন্ধন করুন।";
const RESULT_FAIL_EN = "Don't give up! Practice more, especially the weaker sections.";
const RESULT_FAIL_BN = "হতাশ হবেন না! আরো অনুশীলন করুন। দুর্বল অংশগুলোতে বেশি মনোযোগ দিন।";

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-24 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function MockExamPage() {
  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;

  const [phase, setPhase] = useState<Phase>("intro");
  const [listeningAnswers, setListeningAnswers] = useState<number[]>([]);
  const [readingAnswers, setReadingAnswers] = useState<number[]>([]);
  const [writingText, setWritingText] = useState("");
  const [currentQ, setCurrentQ] = useState(0);

  const translatable = useMemo(() => {
    if (!showOther) return [];
    const set = new Set<string>();
    [...MOCK_LISTENING_QUESTIONS, ...MOCK_READING_QUESTIONS].forEach((q) => {
      set.add(q.q_en);
      q.options_en.forEach((o) => set.add(o));
    });
    set.add(MOCK_WRITING_PROMPT_EN);
    set.add(RESULT_PASSED_EN);
    set.add(RESULT_FAIL_EN);
    SECTION_LABEL_EN.forEach((s) => set.add(s));
    return Array.from(set);
  }, [showOther]);
  const translated = useNativeTranslations(translatable, lang);

  const sectionLabel = (i: number): string => {
    const en = SECTION_LABEL_EN[i];
    if (isEn) return en;
    if (isBn) return SECTION_LABEL_BN[i];
    return translated.get(en) ?? en;
  };

  const handleListeningAnswer = (idx: number) => {
    if (listeningAnswers[currentQ] !== undefined) return;
    const arr = [...listeningAnswers];
    arr[currentQ] = idx;
    setListeningAnswers(arr);
    setTimeout(() => {
      if (currentQ + 1 < MOCK_LISTENING_QUESTIONS.length) setCurrentQ((q) => q + 1);
      else { setCurrentQ(0); setPhase("reading"); }
    }, 800);
  };

  const handleReadingAnswer = (idx: number) => {
    if (readingAnswers[currentQ] !== undefined) return;
    const arr = [...readingAnswers];
    arr[currentQ] = idx;
    setReadingAnswers(arr);
    setTimeout(() => {
      if (currentQ + 1 < MOCK_READING_QUESTIONS.length) setCurrentQ((q) => q + 1);
      else { setCurrentQ(0); setPhase("writing"); }
    }, 800);
  };

  const calcScore = () => {
    const lScore = listeningAnswers.filter((a, i) => a === MOCK_LISTENING_QUESTIONS[i]?.correct).length;
    const rScore = readingAnswers.filter((a, i) => a === MOCK_READING_QUESTIONS[i]?.correct).length;
    const wScore = writingText.trim().split(/\s+/).filter(Boolean).length >= 40 ? 1 : 0;
    return {
      listening: { score: lScore, total: MOCK_LISTENING_QUESTIONS.length, pct: Math.round((lScore / MOCK_LISTENING_QUESTIONS.length) * 100) },
      reading:   { score: rScore, total: MOCK_READING_QUESTIONS.length,   pct: Math.round((rScore / MOCK_READING_QUESTIONS.length) * 100) },
      writing:   { score: wScore, total: 1, pct: wScore * 100 },
    };
  };

  const renderMCQQuestion = (q: MCQ) => {
    if (isEn) return q.q_en;
    if (isBn) return q.q_bn;
    return <NativeText value={translated.get(q.q_en)} />;
  };
  const renderOption = (q: MCQ, oi: number): React.ReactNode => {
    const en = q.options_en[oi];
    if (isEn) return en;
    if (isBn) return q.options_bn[oi];
    return <NativeText value={translated.get(en)} />;
  };

  if (phase === "intro") {
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 text-center anim-fade-up">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("mockExam")}</h1>
          <p className="text-amber-400 font-bold text-lg mb-1">A1 Integration Test Simulation</p>
          <p className="text-gray-400 mb-8">{t("examSubLong")}</p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-left mb-6">
            <h2 className="font-bold text-gray-100 mb-3">Exam Rules</h2>
            <div className="space-y-2 text-sm">
              {[
                { lt: "Klausymas", time_en: "15 min", time_bn: "১৫ মিনিট", q_en: "2 questions", q_bn: "২টি প্রশ্ন", section: 0 },
                { lt: "Skaitymas", time_en: "20 min", time_bn: "২০ মিনিট", q_en: "3 questions", q_bn: "৩টি প্রশ্ন", section: 1 },
                { lt: "Rašymas",   time_en: "20 min", time_bn: "২০ মিনিট", q_en: "1 task",      q_bn: "১টি লেখার কাজ", section: 2 },
              ].map((s) => (
                <div key={s.lt} className="flex items-center gap-3 p-3 rounded-lg bg-black/30 flex-wrap">
                  <span className="lt-text font-bold text-amber-400">{s.lt}</span>
                  <span className={cn("text-sm text-gray-300", isBn && "font-bengali")}>{sectionLabel(s.section)}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {isBn ? `${s.time_bn} · ${s.q_bn}` : `${s.time_en} · ${s.q_en}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/20">
              <p className={cn("text-amber-300 text-sm", isBn && "font-bengali")}>
                ⚠️ {isBn
                  ? "একবার শুরু করলে বিরতি নেওয়া যাবে না। প্রস্তুত হয়ে শুরু করুন।"
                  : "Once started you cannot pause. Be ready before you begin."}
              </p>
            </div>
          </div>

          <button onClick={() => setPhase("listening")} className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all hover:scale-[1.03] shadow-lg shadow-amber-500/25">
            {t("startNow")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "listening") {
    const q = MOCK_LISTENING_QUESTIONS[currentQ];
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <span className="text-xs text-blue-300 font-bold uppercase">Klausymas · {sectionLabel(0)}</span>
              <p className="text-gray-400 text-sm">Question {currentQ + 1} of {MOCK_LISTENING_QUESTIONS.length}</p>
            </div>
            <ExamTimerBar totalSeconds={900} onExpire={() => setPhase("reading")} className="w-40" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎧</span>
            </div>
            <AudioButton text={q.audio!} size="lg" className="mx-auto" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
            <p className={cn("font-medium text-gray-100 mb-1", isBn && "font-bengali")}>{renderMCQQuestion(q)}</p>
            {!isEn && <p className="text-xs text-gray-500 mb-3">{q.q_en}</p>}
            <div className="space-y-2">
              {q.options_en.map((_, oi) => {
                const answered = listeningAnswers[currentQ] !== undefined;
                let style = "border-white/10 bg-white/[0.02] text-gray-300 hover:border-blue-500/30 hover:bg-white/[0.05]";
                if (answered) {
                  if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                  else if (oi === listeningAnswers[currentQ]) style = "border-red-500 bg-red-500/10 text-red-300";
                  else style = "border-white/10 text-gray-600 opacity-50";
                }
                return (
                  <button key={oi} onClick={() => handleListeningAnswer(oi)}
                    className={cn("w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all", isBn && "font-bengali", style)}>
                    {String.fromCharCode(65 + oi)}. {renderOption(q, oi)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "reading") {
    const q = MOCK_READING_QUESTIONS[currentQ];
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <span className="text-xs text-green-300 font-bold uppercase">Skaitymas · {sectionLabel(1)}</span>
              <p className="text-gray-400 text-sm">Question {currentQ + 1} of {MOCK_READING_QUESTIONS.length}</p>
            </div>
            <ExamTimerBar totalSeconds={1200} onExpire={() => setPhase("writing")} className="w-40" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AudioButton text={MOCK_READING_TEXT} size="sm" />
            </div>
            <p className="lt-text font-bold text-sm leading-relaxed">{MOCK_READING_TEXT}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
            <p className={cn("font-medium text-gray-100 mb-1", isBn && "font-bengali")}>{renderMCQQuestion(q)}</p>
            {!isEn && <p className="text-xs text-gray-500 mb-3">{q.q_en}</p>}
            <div className="space-y-2">
              {q.options_en.map((_, oi) => {
                const answered = readingAnswers[currentQ] !== undefined;
                let style = "border-white/10 bg-white/[0.02] text-gray-300 hover:border-green-500/30 hover:bg-white/[0.05]";
                if (answered) {
                  if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                  else if (oi === readingAnswers[currentQ]) style = "border-red-500 bg-red-500/10 text-red-300";
                  else style = "border-white/10 text-gray-600 opacity-50";
                }
                return (
                  <button key={oi} onClick={() => handleReadingAnswer(oi)}
                    className={cn("w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all", isBn && "font-bengali", style)}>
                    {String.fromCharCode(65 + oi)}. {renderOption(q, oi)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "writing") {
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <span className="text-xs text-amber-300 font-bold uppercase">Rašymas · {sectionLabel(2)}</span>
            <ExamTimerBar totalSeconds={1200} onExpire={() => setPhase("results")} className="w-40" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4">
            <p className={cn("text-emerald-200", isBn && "font-bengali")}>
              {isEn ? MOCK_WRITING_PROMPT_EN : isBn ? MOCK_WRITING_PROMPT_BN : <NativeText value={translated.get(MOCK_WRITING_PROMPT_EN)} />}
            </p>
            {!isEn && <p className="text-xs text-gray-500 mt-2">{MOCK_WRITING_PROMPT_EN}</p>}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
            <textarea
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              rows={8}
              placeholder="Write your message in Lithuanian…"
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className={cn("text-xs", wc < 50 ? "text-red-400" : wc <= 80 ? "text-emerald-400" : "text-amber-400")}>
                {wc} {isBn ? "শব্দ" : "words"} {wc < 50 ? "— add more" : "✓"}
              </span>
              <button onClick={() => setPhase("results")} className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all">
                {t("submit")} →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const scores = calcScore();
    const totalPct = Math.round((
      scores.listening.score + scores.reading.score + scores.writing.score
    ) / (scores.listening.total + scores.reading.total + scores.writing.total) * 100);
    const passed = totalPct >= 50 && scores.listening.pct >= 25 && scores.reading.pct >= 25;

    return (
      <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
        <PageBackdrop />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-12 text-center anim-fade-up">
          <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-1">Mock Exam Results</h2>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-6 mt-4">
            <div className={cn("text-4xl font-bold mb-1", passed ? "text-emerald-400" : "text-red-400")}>{totalPct}%</div>
            <p className={cn("text-lg font-bold mb-4", passed ? "text-emerald-400" : "text-red-400")}>
              {passed ? "✓ Passed" : "✗ Did not pass"}
            </p>

            <div className="space-y-3 text-left">
              {[
                { label: `Klausymas (${sectionLabel(0)})`, ...scores.listening },
                { label: `Skaitymas (${sectionLabel(1)})`, ...scores.reading },
                { label: `Rašymas (${sectionLabel(2)})`,   ...scores.writing },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{s.label}</span>
                    <span className={s.pct >= 25 ? "text-emerald-400" : "text-red-400"}>{s.score}/{s.total} ({s.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div className={cn("h-full rounded-full", s.pct >= 50 ? "bg-emerald-500" : s.pct >= 25 ? "bg-amber-500" : "bg-red-500")}
                      style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
              <p className={cn("text-sm text-emerald-200", isBn && "font-bengali")}>
                {passed
                  ? (isEn ? RESULT_PASSED_EN : isBn ? RESULT_PASSED_BN : <NativeText value={translated.get(RESULT_PASSED_EN)} />)
                  : (isEn ? RESULT_FAIL_EN : isBn ? RESULT_FAIL_BN : <NativeText value={translated.get(RESULT_FAIL_EN)} />)}
              </p>
            </div>
          </div>

          <button onClick={() => { setPhase("intro"); setListeningAnswers([]); setReadingAnswers([]); setWritingText(""); setCurrentQ(0); }}
            className="px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold transition-all">
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
