"use client";

import { useState } from "react";
import { ExamTimerBar } from "@/components/shared/ExamTimerBar";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn } from "@/lib/utils";

type Phase = "intro" | "listening" | "reading" | "writing" | "results";

const MOCK_LISTENING_QUESTIONS = [
  {
    audio: "Autobusas į Kauną išvyksta aštuonioliktą valandą.",
    q_bn: "বাসটি কখন ছাড়বে?",
    options_bn: ["১৭:০০", "১৮:০০", "১৯:০০", "২০:০০"],
    correct: 1,
  },
  {
    audio: "Parduotuvė sekmadienį atidaryta nuo dešimtos iki šešioliktos.",
    q_bn: "রবিবার দোকান কতক্ষণ খোলা?",
    options_bn: ["৮:০০-১৬:০০", "১০:০০-১৬:০০", "১০:০০-১৮:০০", "৯:০০-১৭:০০"],
    correct: 1,
  },
];

const MOCK_READING_TEXT = "KAVOS PARDUOTUVĖ. Atidaryta kasdien 7:00-22:00. Kava: 2€. Arbata: 1.5€. Vanduo: 1€. Wi-Fi nemokamas.";
const MOCK_READING_QUESTIONS = [
  { q_bn: "দোকানটি কখন বন্ধ হয়?", options_bn: ["২০:০০", "২১:০০", "২২:০০", "২৩:০০"], correct: 2 },
  { q_bn: "কফির দাম কত?", options_bn: ["১€", "১.৫€", "২€", "২.৫€"], correct: 2 },
  { q_bn: "Wi-Fi সম্পর্কে কী বলা হয়েছে?", options_bn: ["নেই", "বিনামূল্যে", "৫€/ঘন্টা", "পাসওয়ার্ড লাগে"], correct: 1 },
];

const MOCK_WRITING_PROMPT = "আপনার বন্ধু Roma কে একটি বার্তা লিখুন: আপনি শনিবার বিকেলে পার্কে যেতে পারবেন না কারণ আপনার কাজ আছে। পরের সপ্তাহে দেখা করার প্রস্তাব দিন। (৫০-৮০ শব্দ)";

export default function MockExamPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [listeningAnswers, setListeningAnswers] = useState<number[]>([]);
  const [readingAnswers, setReadingAnswers] = useState<number[]>([]);
  const [writingText, setWritingText] = useState("");
  const [currentQ, setCurrentQ] = useState(0);

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
      reading: { score: rScore, total: MOCK_READING_QUESTIONS.length, pct: Math.round((rScore / MOCK_READING_QUESTIONS.length) * 100) },
      writing: { score: wScore, total: 1, pct: wScore * 100 },
    };
  };

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">পূর্ণ মক পরীক্ষা</h1>
        <p className="text-amber-400 font-bengali text-xl mb-1">A1 বাংলাদেশ ইন্টিগ্রেশন টেস্ট সিমুলেশন</p>
        <p className="text-gray-400 mb-6">Full A1 Mock Exam Simulation</p>

        <div className="card-surface p-6 text-left mb-6">
          <h2 className="font-bold text-gray-200 mb-3">পরীক্ষার নিয়মাবলী · Exam Rules</h2>
          <div className="space-y-2 text-sm">
            {[
              { lt: "Klausymas", bn: "শোনা", time: "১৫ মিনিট", q: "২টি প্রশ্ন" },
              { lt: "Skaitymas", bn: "পড়া", time: "২০ মিনিট", q: "৩টি প্রশ্ন" },
              { lt: "Rašymas", bn: "লেখা", time: "২০ মিনিট", q: "১টি লেখার কাজ" },
            ].map((s) => (
              <div key={s.lt} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)]">
                <span className="lt-text font-bold">{s.lt}</span>
                <span className="bn-text font-bengali text-sm">{s.bn}</span>
                <span className="text-gray-500 text-xs ml-auto">{s.time} · {s.q}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/20">
            <p className="text-amber-400 text-sm font-bengali">⚠️ একবার শুরু করলে বিরতি নেওয়া যাবে না। প্রস্তুত হয়ে শুরু করুন।</p>
          </div>
        </div>

        <button onClick={() => setPhase("listening")} className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all">
          পরীক্ষা শুরু করুন
        </button>
      </div>
    );
  }

  if (phase === "listening") {
    const q = MOCK_LISTENING_QUESTIONS[currentQ];
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-blue-400 font-bold uppercase">Klausymas · শোনা</span>
            <p className="text-gray-400 text-sm">Question {currentQ + 1} of {MOCK_LISTENING_QUESTIONS.length}</p>
          </div>
          <ExamTimerBar totalSeconds={900} onExpire={() => setPhase("reading")} className="w-40" />
        </div>

        <div className="card-surface p-6 mb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎧</span>
          </div>
          <AudioButton text={q.audio} size="lg" className="mx-auto" />
          <p className="text-xs text-gray-500 mt-2">শুনুন এবং প্রশ্নের উত্তর দিন</p>
        </div>

        <div className="card-surface p-5">
          <p className="bn-text font-bengali font-medium mb-4">{q.q_bn}</p>
          <div className="space-y-2">
            {q.options_bn.map((opt, oi) => {
              const answered = listeningAnswers[currentQ] !== undefined;
              let style = "border-[var(--border)] text-gray-300 hover:border-blue-500/30";
              if (answered) {
                if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                else if (oi === listeningAnswers[currentQ]) style = "border-red-500 bg-red-500/10 text-red-300";
                else style = "border-[var(--border)] text-gray-600 opacity-50";
              }
              return (
                <button key={oi} onClick={() => handleListeningAnswer(oi)}
                  className={cn("w-full text-left px-3 py-2.5 rounded-lg border text-sm font-bengali transition-all", style)}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "reading") {
    const q = MOCK_READING_QUESTIONS[currentQ];
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-green-400 font-bold uppercase">Skaitymas · পড়া</span>
            <p className="text-gray-400 text-sm">Question {currentQ + 1} of {MOCK_READING_QUESTIONS.length}</p>
          </div>
          <ExamTimerBar totalSeconds={1200} onExpire={() => setPhase("writing")} className="w-40" />
        </div>

        <div className="card-surface p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AudioButton text={MOCK_READING_TEXT} size="sm" />
          </div>
          <p className="lt-text font-bold text-sm leading-relaxed">{MOCK_READING_TEXT}</p>
        </div>

        <div className="card-surface p-5">
          <p className="bn-text font-bengali font-medium mb-4">{q.q_bn}</p>
          <div className="space-y-2">
            {q.options_bn.map((opt, oi) => {
              const answered = readingAnswers[currentQ] !== undefined;
              let style = "border-[var(--border)] text-gray-300 hover:border-green-500/30";
              if (answered) {
                if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                else if (oi === readingAnswers[currentQ]) style = "border-red-500 bg-red-500/10 text-red-300";
                else style = "border-[var(--border)] text-gray-600 opacity-50";
              }
              return (
                <button key={oi} onClick={() => handleReadingAnswer(oi)}
                  className={cn("w-full text-left px-3 py-2.5 rounded-lg border text-sm font-bengali transition-all", style)}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "writing") {
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase">Rašymas · লেখা</span>
          </div>
          <ExamTimerBar totalSeconds={1200} onExpire={() => setPhase("results")} className="w-40" />
        </div>

        <div className="card-surface p-5 mb-4">
          <p className="bn-text font-bengali text-emerald-200">{MOCK_WRITING_PROMPT}</p>
        </div>

        <div className="card-surface p-5">
          <textarea
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            rows={8}
            placeholder="লিথুয়ানিয়ানে আপনার বার্তা লিখুন..."
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none text-sm resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className={cn("text-xs", wc < 50 ? "text-red-400" : wc <= 80 ? "text-emerald-400" : "text-amber-400")}>
              {wc} শব্দ {wc < 50 ? "(আরো লিখুন)" : "✓"}
            </span>
            <button onClick={() => setPhase("results")} className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all">
              জমা দিন →
            </button>
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
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
        <h2 className="text-2xl font-bold text-gray-100 mb-1">মক পরীক্ষার ফলাফল</h2>
        <p className="text-gray-400 mb-6">Mock Exam Results</p>

        <div className="card-surface p-6 mb-6">
          <div className={cn("text-4xl font-bold mb-1", passed ? "text-emerald-400" : "text-red-400")}>{totalPct}%</div>
          <p className={cn("text-lg font-bengali font-bold mb-4", passed ? "text-emerald-400" : "text-red-400")}>
            {passed ? "পাস! ✓" : "পাস হয়নি ✗"}
          </p>

          <div className="space-y-3 text-left">
            {[
              { label: "Klausymas (শোনা)", ...scores.listening },
              { label: "Skaitymas (পড়া)", ...scores.reading },
              { label: "Rašymas (লেখা)", ...scores.writing },
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
            <p className="bn-text font-bengali text-sm text-emerald-200">
              {passed
                ? "অভিনন্দন! আপনি A1 পরীক্ষার জন্য প্রস্তুত। আরো অনুশীলন করুন এবং পরীক্ষার জন্য নিবন্ধন করুন।"
                : "হতাশ হবেন না! আরো অনুশীলন করুন। দুর্বল অংশগুলোতে বেশি মনোযোগ দিন।"}
            </p>
          </div>
        </div>

        <button onClick={() => { setPhase("intro"); setListeningAnswers([]); setReadingAnswers([]); setWritingText(""); setCurrentQ(0); }}
          className="px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-semibold transition-all">
          আবার চেষ্টা করুন / Try Again
        </button>
      </div>
    );
  }

  return null;
}
