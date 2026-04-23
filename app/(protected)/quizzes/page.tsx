"use client";

import { useState } from "react";
import { ArrowRight, Volume2, Clock, Zap, BookOpen, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { vocabularyData } from "@/data/vocabulary";
import { AudioButton } from "@/components/audio/AudioButton";

const QUIZ_TYPES = [
  { id: "vocab", icon: "🔤", title_en: "Vocabulary Quiz", title_bn: "শব্দভাণ্ডার কুইজ", desc_bn: "LT→BN, BN→LT অনুবাদ", color: "text-amber-400 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15" },
  { id: "listening", icon: "🎧", title_en: "Listening Quiz", title_bn: "শোনার কুইজ", desc_bn: "লিথুয়ানিয়ান শুনে বাংলায় বেছে নিন", color: "text-blue-400 border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/15" },
  { id: "fill-blank", icon: "📝", title_en: "Fill in the Blank", title_bn: "শূন্যস্থান পূরণ", desc_bn: "বাক্যে সঠিক শব্দ বসান", color: "text-purple-400 border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/15" },
  { id: "speed", icon: "⏱️", title_en: "Speed Round", title_bn: "দ্রুত রাউন্ড", desc_bn: "৬০ সেকেন্ডে যত পারেন", color: "text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/15" },
  { id: "topic", icon: "🏆", title_en: "Topic Quiz", title_bn: "বিষয়ভিত্তিক কুইজ", desc_bn: "নির্দিষ্ট বিষয়ে কুইজ দিন", color: "text-green-400 border-green-500/20 bg-green-500/10 hover:bg-green-500/15" },
  { id: "flashcard", icon: "🃏", title_en: "Flashcard Quiz", title_bn: "ফ্ল্যাশকার্ড কুইজ", desc_bn: "দ্রুত কার্ড পর্যালোচনা", color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/15" },
];

interface QuizQuestion {
  id: string;
  question_bn: string;
  question_en: string;
  audio_text?: string;
  options: { lt: string; bn: string }[];
  correct: number;
  explanation_bn: string;
}

function generateQuizQuestions(count = 10): QuizQuestion[] {
  const pool = vocabularyData.filter((w) => w.level === "A1");
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((w, i) => {
    const wrongOptions = pool
      .filter((x) => x.id !== w.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => ({ lt: x.lithuanian, bn: x.bengali }));
    const correct = Math.floor(Math.random() * 4);
    const options = [...wrongOptions];
    options.splice(correct, 0, { lt: w.lithuanian, bn: w.bengali });
    return {
      id: w.id,
      question_bn: `"${w.english}" — এর লিথুয়ানিয়ান শব্দটি কী?`,
      question_en: `What is the Lithuanian word for "${w.english}"?`,
      audio_text: w.lithuanian,
      options,
      correct,
      explanation_bn: `সঠিক উত্তর: "${w.lithuanian}" = "${w.bengali}"। উদাহরণ: ${w.example_sentence_bn}`,
    };
  });
}

type Phase = "hub" | "settings" | "quiz" | "results";

export default function QuizzesPage() {
  const [phase, setPhase] = useState<Phase>("hub");
  const [selectedType, setSelectedType] = useState("vocab");
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const startQuiz = () => {
    const qs = generateQuizQuestions(numQuestions);
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setResults([]);
    setPhase("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[currentQ].correct;
    if (correct) setScore((s) => s + 1);
    setResults((r) => [...r, correct]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const q = questions[currentQ];

  if (phase === "hub") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">
            Quizzes <span className="text-amber-400 font-bengali text-xl">· কুইজ</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Test your Lithuanian knowledge with Bengali-friendly quizzes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUIZ_TYPES.map((qt) => (
            <button
              key={qt.id}
              onClick={() => { setSelectedType(qt.id); setPhase("settings"); }}
              className={cn("card-surface p-6 text-left transition-all hover:scale-[1.02] border", qt.color)}
            >
              <div className="text-3xl mb-3">{qt.icon}</div>
              <h3 className="font-bold text-gray-100 mb-1">{qt.title_en}</h3>
              <p className="text-emerald-400 font-bengali text-sm mb-1">{qt.title_bn}</p>
              <p className="text-gray-400 text-sm font-bengali">{qt.desc_bn}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "settings") {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-100 mb-6">কুইজ সেটিংস · Quiz Settings</h2>
        <div className="card-surface p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">প্রশ্ন সংখ্যা · Number of Questions</label>
            <div className="flex gap-2">
              {[10, 20, 30].map((n) => (
                <button key={n} onClick={() => setNumQuestions(n)}
                  className={cn("flex-1 py-2 rounded-lg border text-sm font-medium transition-all", numQuestions === n ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "border-[var(--border)] text-gray-400 hover:text-gray-200")}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startQuiz} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all flex items-center justify-center gap-2">
            কুইজ শুরু করুন <ArrowRight size={18} />
          </button>
          <button onClick={() => setPhase("hub")} className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Quiz Hub
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz" && q) {
    const pct = ((currentQ) / questions.length) * 100;
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
          <span>Question {currentQ + 1} / {questions.length}</span>
          <span className="text-emerald-400">{score} correct</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 mb-6 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="card-surface p-6 mb-4">
          <p className="text-gray-300 text-sm mb-1">{q.question_en}</p>
          <p className="bn-text font-bengali text-lg font-medium mb-3">{q.question_bn}</p>
          {q.audio_text && (
            <div className="flex items-center gap-2 mb-1">
              <AudioButton text={q.audio_text} size="md" showSlow />
              <span className="text-xs text-gray-500">Click to hear the word</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.options.map((opt, idx) => {
            let style = "border-[var(--border)] text-gray-300 hover:border-amber-500/30 hover:bg-white/5";
            if (answered) {
              if (idx === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
              else if (idx === selected && idx !== q.correct) style = "border-red-500 bg-red-500/10 text-red-300";
              else style = "border-[var(--border)] text-gray-500 opacity-50";
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={cn("card-surface p-4 text-left transition-all border flex items-center gap-3", style)}
              >
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div>
                  <span className="lt-text font-bold text-sm">{opt.lt}</span>
                  <span className="bn-text font-bengali text-sm ml-2">{opt.bn}</span>
                </div>
                {answered && idx === q.correct && <span className="ml-auto text-emerald-400">✓</span>}
                {answered && idx === selected && idx !== q.correct && <span className="ml-auto text-red-400">✗</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <p className="bn-text font-bengali text-sm text-emerald-200">{q.explanation_bn}</p>
          </div>
        )}

        {answered && (
          <button onClick={nextQuestion} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all">
            {currentQ + 1 >= questions.length ? "ফলাফল দেখুন" : "পরের প্রশ্ন →"}
          </button>
        )}
      </div>
    );
  }

  if (phase === "results") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"}</div>
        <h2 className="text-2xl font-bold text-gray-100 mb-1">কুইজ শেষ!</h2>
        <p className="text-gray-400 mb-6">Quiz Complete!</p>

        <div className="card-surface p-6 mb-6">
          <div className="text-5xl font-bold text-amber-400 mb-1">{score}/{questions.length}</div>
          <div className="text-2xl font-bold text-gray-200 mb-3">{pct}%</div>
          <div className="flex justify-center gap-1 mb-4">
            {results.map((r, i) => (
              <div key={i} className={cn("w-3 h-3 rounded-full", r ? "bg-emerald-500" : "bg-red-500")} />
            ))}
          </div>
          <p className="bn-text font-bengali text-emerald-400">
            {pct >= 80 ? "চমৎকার! আপনি অনেক ভালো করেছেন!" : pct >= 50 ? "ভালো! আরেকটু চেষ্টা করুন।" : "আরো অনুশীলন করুন। আপনি পারবেন!"}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => { setPhase("settings"); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-semibold transition-all">
            <RotateCcw size={15} /> আবার খেলুন
          </button>
          <button onClick={() => setPhase("hub")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-gray-300 hover:text-gray-100 transition-all">
            Quiz Hub
          </button>
        </div>
      </div>
    );
  }

  return null;
}
