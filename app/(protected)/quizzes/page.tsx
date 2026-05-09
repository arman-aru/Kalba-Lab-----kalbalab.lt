"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { vocabularyData } from "@/data/vocabulary";
import { AudioButton } from "@/components/audio/AudioButton";
import { useTranslation } from "@/hooks/useTranslation";
import type { UILanguage } from "@/lib/i18n";

type Multi = Partial<Record<UILanguage, string>> & { en: string };

const QUIZ_TYPES: { id: string; icon: string; title: Multi; desc: Multi; color: string }[] = [
  { id: "vocab",      icon: "🔤", color: "text-amber-400 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15",
    title: { en: "Vocabulary Quiz",    bn: "শব্দ ভাণ্ডার কুইজ",     az: "Lüğət testi",         hi: "शब्दावली क्विज़",     ky: "Сөздүк тести",         tg: "Тести луғат",          uz: "Lugʻat testi" },
    desc:  { en: "LT ↔ native translation", bn: "LT↔BN অনুবাদ",      az: "LT ↔ ana dil tərcüməsi", hi: "लिथुआनियाई ↔ मातृभाषा अनुवाद", ky: "LT ↔ эне тил котормосу", tg: "LT ↔ тарҷумаи модарӣ", uz: "LT ↔ ona tili tarjimasi" } },
  { id: "listening",  icon: "🎧", color: "text-blue-400 border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/15",
    title: { en: "Listening Quiz",     bn: "শোনার কুইজ",            az: "Dinləmə testi",       hi: "श्रवण क्विज़",        ky: "Угуу тести",           tg: "Тести гӯш кардан",     uz: "Tinglash testi" },
    desc:  { en: "Hear a word and pick the meaning", bn: "শব্দ শুনে অর্থ বেছে নিন", az: "Sözü dinləyin və mənasını seçin", hi: "शब्द सुनें और अर्थ चुनें", ky: "Сөздү угуп, маанисин тандаңыз", tg: "Калимаро гӯш карда, маъноро интихоб кунед", uz: "Soʻzni eshitib, maʼnoni tanlang" } },
  { id: "fill-blank", icon: "📝", color: "text-purple-400 border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/15",
    title: { en: "Fill in the Blank",  bn: "শূন্যস্থান পূরণ",       az: "Boşluğu doldur",      hi: "रिक्त स्थान भरें",   ky: "Бош жерди толтуруу",   tg: "Холиро пур кунед",     uz: "Boʻsh joyni toʻldiring" },
    desc:  { en: "Pick the right word for the sentence", bn: "বাক্যে সঠিক শব্দ বসান",  az: "Cümlə üçün düzgün sözü seçin", hi: "वाक्य के लिए सही शब्द चुनें", ky: "Сүйлөмгө туура сөздү тандаңыз", tg: "Барои ҷумла калимаи дуруст интихоб кунед", uz: "Jumla uchun toʻgʻri soʻzni tanlang" } },
  { id: "speed",      icon: "⏱️", color: "text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/15",
    title: { en: "Speed Round",        bn: "দ্রুত রাউন্ড",          az: "Sürət raundu",        hi: "स्पीड राउंड",         ky: "Тездик раунду",         tg: "Раунди суръатнок",      uz: "Tezkor raund" },
    desc:  { en: "As many as you can in 60 seconds", bn: "৬০ সেকেন্ডে যত পারেন",     az: "60 saniyədə nə qədər bacarırsınız", hi: "60 सेकंड में जितने हो सकें", ky: "60 секунда ичинде канча мүмкүн", tg: "Дар 60 сония ҳарчи бештар", uz: "60 soniyada qancha imkoni bor" } },
  { id: "topic",      icon: "🏆", color: "text-green-400 border-green-500/20 bg-green-500/10 hover:bg-green-500/15",
    title: { en: "Topic Quiz",         bn: "বিষয়ভিত্তিক কুইজ",     az: "Mövzu testi",         hi: "विषय क्विज़",          ky: "Темалык тест",         tg: "Тести мавзӯъ",          uz: "Mavzu testi" },
    desc:  { en: "Quiz on a specific topic", bn: "নির্দিষ্ট বিষয়ে কুইজ", az: "Müəyyən mövzuda test", hi: "विशिष्ट विषय पर क्विज़", ky: "Белгилүү бир темадагы тест", tg: "Тест дар мавзӯи муайян", uz: "Maʼlum mavzudagi test" } },
  { id: "flashcard",  icon: "🃏", color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/15",
    title: { en: "Flashcard Quiz",     bn: "ফ্ল্যাশকার্ড কুইজ",     az: "Flaşkart testi",      hi: "फ्लैशकार्ड क्विज़",   ky: "Карточкалар тести",    tg: "Тести кортҳои хотиравӣ", uz: "Flashkarta testi" },
    desc:  { en: "Quick card review",  bn: "দ্রুত কার্ড পর্যালোচনা", az: "Sürətli kart təkrarı", hi: "त्वरित कार्ड समीक्षा", ky: "Тез карточка кайталоо", tg: "Такрори тези кортҳо",   uz: "Tez kartalarni takrorlash" } },
];

const RESULT_PHRASES: Partial<Record<UILanguage, { excellent: string; good: string; keepGoing: string; quizComplete: string; question: string; correctLabel: string }>> & { en: { excellent: string; good: string; keepGoing: string; quizComplete: string; question: string; correctLabel: string } } = {
  en: { excellent: "Excellent! You did great!",       good: "Nice! Keep practicing.",         keepGoing: "Keep practicing — you'll get there!", quizComplete: "Quiz complete!",     question: "Question",     correctLabel: "correct" },
  bn: { excellent: "চমৎকার! অনেক ভালো করেছেন!",       good: "ভালো! আরেকটু চেষ্টা করুন।",     keepGoing: "আরো অনুশীলন করুন। আপনি পারবেন!",      quizComplete: "কুইজ শেষ!",         question: "প্রশ্ন",         correctLabel: "সঠিক" },
  az: { excellent: "Möhtəşəm! Çox yaxşı etdin!",      good: "Yaxşı! Məşqə davam et.",          keepGoing: "Məşq etməyə davam edin — bacaracaqsınız!", quizComplete: "Test bitdi!",      question: "Sual",          correctLabel: "düzgün" },
  hi: { excellent: "उत्कृष्ट! आपने शानदार किया!",       good: "अच्छा! अभ्यास जारी रखें।",        keepGoing: "अभ्यास करते रहें — आप कर लेंगे!",        quizComplete: "क्विज़ पूर्ण!",     question: "प्रश्न",        correctLabel: "सही" },
  ky: { excellent: "Эң сонун! Мыкты иштедиңиз!",      good: "Жакшы! Машыктырып туруңуз.",      keepGoing: "Машыгуу улантыңыз — жетесиз!",         quizComplete: "Тест аякталды!",  question: "Суроо",         correctLabel: "туура" },
  tg: { excellent: "Аъло! Хеле хуб иҷро кардед!",     good: "Хуб! Машқро идома диҳед.",         keepGoing: "Машқро идома диҳед — мерасед!",         quizComplete: "Тест ба итмом расид!", question: "Савол",   correctLabel: "дуруст" },
  uz: { excellent: "Aʼlo! Ajoyib bajardingiz!",       good: "Yaxshi! Mashq qilishda davom eting.", keepGoing: "Mashqqa davom eting — erishasiz!",     quizComplete: "Test tugadi!",      question: "Savol",         correctLabel: "toʻgʻri" },
};

interface QuizQuestion {
  id: string;
  question: string;
  audio_text?: string;
  options: { lt: string; native: string }[];
  correct: number;
  explanationLt: string;
  explanationNative: string;
}

function nativeMeaning(word: { english: string; bengali: string }, lang: UILanguage): string {
  return lang === "bn" ? word.bengali : word.english;
}
function nativeExample(word: { example_sentence_en: string; example_sentence_bn: string }, lang: UILanguage): string {
  return lang === "bn" ? word.example_sentence_bn : word.example_sentence_en;
}

const QUIZ_QUESTION_TEMPLATE: Partial<Record<UILanguage, (en: string) => string>> & { en: (en: string) => string } = {
  en: (en) => `What is the Lithuanian word for "${en}"?`,
  bn: (en) => `"${en}" — এর লিথুয়ানিয়ান শব্দটি কী?`,
  az: (en) => `"${en}" sözünün Litvaca qarşılığı nədir?`,
  hi: (en) => `"${en}" का लिथुआनियाई शब्द क्या है?`,
  ky: (en) => `"${en}" — литвача сөзү кандай?`,
  tg: (en) => `Калимаи литвагии "${en}" кадом аст?`,
  uz: (en) => `"${en}" soʻzining litva tilidagi tarjimasi nima?`,
};

function generateQuizQuestions(count: number, lang: UILanguage): QuizQuestion[] {
  const pool = vocabularyData.filter((w) => w.level === "A1");
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((w) => {
    const wrongOptions = pool
      .filter((x) => x.id !== w.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => ({ lt: x.lithuanian, native: nativeMeaning(x, lang) }));
    const correct = Math.floor(Math.random() * 4);
    const options = [...wrongOptions];
    options.splice(correct, 0, { lt: w.lithuanian, native: nativeMeaning(w, lang) });
    return {
      id: w.id,
      question: (QUIZ_QUESTION_TEMPLATE[lang] ?? QUIZ_QUESTION_TEMPLATE.en)(w.english),
      audio_text: w.lithuanian,
      options,
      correct,
      explanationLt: `"${w.lithuanian}" = "${nativeMeaning(w, lang)}"`,
      explanationNative: nativeExample(w, lang),
    };
  });
}

type Phase = "hub" | "settings" | "quiz" | "results";

export default function QuizzesPage() {
  const { t, lang } = useTranslation();
  const [phase, setPhase] = useState<Phase>("hub");
  const [, setSelectedType] = useState("vocab");
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const startQuiz = () => {
    setQuestions(generateQuizQuestions(numQuestions, lang));
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

  const phrases = RESULT_PHRASES[lang] ?? RESULT_PHRASES.en;
  const q = questions[currentQ];

  if (phase === "hub") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">{t("quizzesTitle")}</h1>
          <p className="text-gray-400 text-sm mt-1">{t("quizzesSub")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUIZ_TYPES.map((qt) => (
            <button
              key={qt.id}
              onClick={() => { setSelectedType(qt.id); setPhase("settings"); }}
              className={cn("card-surface p-6 text-left transition-all hover:scale-[1.02] border", qt.color)}
            >
              <div className="text-3xl mb-3">{qt.icon}</div>
              <h3 className="font-bold text-gray-100 mb-1">{qt.title[lang] ?? qt.title.en}</h3>
              <p className="text-gray-400 text-sm">{qt.desc[lang] ?? qt.desc.en}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "settings") {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-100 mb-6">{t("settings")}</h2>
        <div className="card-surface p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t("questions")}</label>
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
            {t("startQuiz")} <ArrowRight size={18} />
          </button>
          <button onClick={() => setPhase("hub")} className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← {t("cancel")}
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
          <span>{phrases.question} {currentQ + 1} / {questions.length}</span>
          <span className="text-emerald-400">{score} {phrases.correctLabel}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 mb-6 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="card-surface p-6 mb-4">
          <p className="text-gray-200 text-lg font-medium mb-3">{q.question}</p>
          {q.audio_text && (
            <div className="flex items-center gap-2 mb-1">
              <AudioButton text={q.audio_text} size="md" showSlow />
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
                  <span className="text-sm ml-2 text-gray-400">{opt.native}</span>
                </div>
                {answered && idx === q.correct && <span className="ml-auto text-emerald-400">✓</span>}
                {answered && idx === selected && idx !== q.correct && <span className="ml-auto text-red-400">✗</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <p className="text-sm text-emerald-200">{q.explanationLt}</p>
            <p className="text-xs text-emerald-300/70 mt-1">{q.explanationNative}</p>
          </div>
        )}

        {answered && (
          <button onClick={nextQuestion} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all">
            {currentQ + 1 >= questions.length ? t("finishQuiz") : t("next")}
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
        <h2 className="text-2xl font-bold text-gray-100 mb-1">{phrases.quizComplete}</h2>

        <div className="card-surface p-6 mb-6 mt-4">
          <div className="text-5xl font-bold text-amber-400 mb-1">{score}/{questions.length}</div>
          <div className="text-2xl font-bold text-gray-200 mb-3">{pct}%</div>
          <div className="flex justify-center gap-1 mb-4">
            {results.map((r, i) => (
              <div key={i} className={cn("w-3 h-3 rounded-full", r ? "bg-emerald-500" : "bg-red-500")} />
            ))}
          </div>
          <p className="text-emerald-400">
            {pct >= 80 ? phrases.excellent : pct >= 50 ? phrases.good : phrases.keepGoing}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => setPhase("settings")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-semibold transition-all">
            <RotateCcw size={15} /> {t("tryAgain")}
          </button>
          <button onClick={() => setPhase("hub")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-gray-300 hover:text-gray-100 transition-all">
            {t("quizzes")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
