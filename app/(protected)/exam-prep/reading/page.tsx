"use client";

import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";

const READING_EXERCISES = [
  {
    id: "r1",
    title_en: "Shop Sign",
    title_bn: "দোকানের সাইন",
    type: "Sign",
    level: "Easy",
    text_lt: "Parduotuvė atidaryta: Pirmadienį–Penktadienį 8:00–20:00, Šeštadienį 9:00–18:00, Sekmadienį uždaryta.",
    text_en: "Shop open: Monday–Friday 8:00–20:00, Saturday 9:00–18:00, Sunday closed.",
    text_bn: "দোকান খোলা: সোমবার-শুক্রবার ৮:০০-২০:০০, শনিবার ৯:০০-১৮:০০, রবিবার বন্ধ।",
    questions: [
      { q_bn: "রবিবার দোকান কি খোলা?", q_en: "Is the shop open on Sunday?", options_bn: ["হ্যাঁ, ৮টায় খোলে", "হ্যাঁ, ৯টায় খোলে", "না, বন্ধ", "অজানা"], correct: 2, exp_bn: "'Sekmadienį uždaryta' = রবিবার বন্ধ।" },
      { q_bn: "শনিবার দোকান কখন বন্ধ হয়?", q_en: "When does the shop close on Saturday?", options_bn: ["১৮:০০", "২০:০০", "১৭:০০", "২১:০০"], correct: 0, exp_bn: "শনিবার '9:00–18:00' — বন্ধ হয় ১৮:০০তে।" },
    ],
  },
  {
    id: "r2",
    title_en: "Short Message",
    title_bn: "ছোট বার্তা",
    type: "Message",
    level: "Medium",
    text_lt: "Sveika, Roma! Rytoj negaliu ateiti į darbą, nes sergu. Einu pas gydytoją. Grįšiu poryt. Atsiprašau. Anika",
    text_en: "Hello Roma! Tomorrow I cannot come to work because I am sick. I'm going to the doctor. I'll return the day after tomorrow. Sorry. Anika",
    text_bn: "হ্যালো, রোমা! আগামীকাল আমি কাজে আসতে পারব না কারণ অসুস্থ আছি। ডাক্তারের কাছে যাচ্ছি। পরশু ফিরব। দুঃখিত। আনিকা",
    questions: [
      { q_bn: "আনিকা কাজে কেন আসতে পারবে না?", q_en: "Why can't Anika come to work?", options_bn: ["ছুটিতে আছে", "অসুস্থ", "বিদেশে গেছে", "পরিবহন সমস্যা"], correct: 1, exp_bn: "'nes sergu' = কারণ অসুস্থ।" },
      { q_bn: "আনিকা কখন ফিরবে?", q_en: "When will Anika return?", options_bn: ["আজ", "আগামীকাল", "পরশু", "পরের সপ্তাহে"], correct: 2, exp_bn: "'Grįšiu poryt' = পরশু ফিরব।" },
    ],
  },
];

export default function ReadingPracticePage() {
  const [exercise, setExercise] = useState(READING_EXERCISES[0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showBN, setShowBN] = useState(false);

  const answer = (qIdx: number, optIdx: number) => {
    const key = `${exercise.id}-${qIdx}`;
    if (answers[key] !== undefined) return;
    setAnswers({ ...answers, [key]: optIdx });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Exam Prep / Reading</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Reading Practice <span className="text-amber-400 font-bengali text-xl">· পড়ার অনুশীলন</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Skaitymas — A1 exam reading comprehension exercises</p>
      </div>

      <BengaliExplanation
        content="পড়ার পরীক্ষায় আপনাকে দোকানের সাইন, বিজ্ঞপ্তি, মেনু ও ছোট বার্তা পড়ে MCQ প্রশ্নের উত্তর দিতে হবে। প্রতিটি শব্দের অর্থ না বুঝলেও মূল তথ্য বুঝতে চেষ্টা করুন।"
        englishContent="In the reading exam, you'll read signs, menus, timetables, and short messages, then answer multiple-choice questions. Focus on key information."
        className="mb-6"
      />

      {/* Exercise selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {READING_EXERCISES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => { setExercise(ex); setAnswers({}); setShowBN(false); }}
            className={cn("px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition-all", exercise.id === ex.id ? "bg-green-500/10 border-green-500/20 text-green-400" : "border-[var(--border)] text-gray-400 hover:text-gray-200")}
          >
            {ex.title_en} <span className={cn("ml-1 text-xs px-1.5 py-0.5 rounded", ex.level === "Easy" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400")}>{ex.level}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading text */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs px-2 py-0.5 rounded bg-green-900/40 text-green-400">{exercise.type}</span>
              <h2 className="font-bold text-gray-200 mt-1">{exercise.title_en}</h2>
              <p className="text-emerald-400 font-bengali text-sm">{exercise.title_bn}</p>
            </div>
            <AudioButton text={exercise.text_lt} size="md" showSlow />
          </div>

          <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] mb-4">
            <p className="lt-text font-bold text-base leading-relaxed">{exercise.text_lt}</p>
          </div>

          <button
            onClick={() => setShowBN(!showBN)}
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            {showBN ? "অনুবাদ লুকান" : "বাংলা অনুবাদ দেখুন (প্রশ্নের পরে)"}
          </button>
          {showBN && (
            <div className="mt-3 space-y-2">
              <p className="en-text text-sm">{exercise.text_en}</p>
              <p className="bn-text font-bengali text-sm">{exercise.text_bn}</p>
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
              <div key={qi} className="card-surface p-5">
                <p className="text-sm text-gray-500 mb-0.5">Question {qi + 1}</p>
                <p className="bn-text font-bengali font-medium mb-0.5">{q.q_bn}</p>
                <p className="en-text text-xs mb-3">{q.q_en}</p>
                <div className="space-y-2">
                  {q.options_bn.map((opt, oi) => {
                    let style = "border-[var(--border)] text-gray-300 hover:border-green-500/30";
                    if (answered) {
                      if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                      else if (oi === userAnswer) style = "border-red-500 bg-red-500/10 text-red-300";
                      else style = "border-[var(--border)] text-gray-600 opacity-50";
                    }
                    return (
                      <button key={oi} onClick={() => answer(qi, oi)}
                        className={cn("w-full text-left px-3 py-2 rounded-lg border text-sm font-bengali transition-all", style)}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <p className="bn-text font-bengali text-sm text-emerald-200">💡 {q.exp_bn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
