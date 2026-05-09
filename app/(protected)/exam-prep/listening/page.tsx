"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

interface Question {
  q_en: string;
  q_bn: string;
  options_en: string[];
  options_bn: string[];
  correct: number;
  explanation_en: string;
  explanation_bn: string;
}

interface Exercise {
  id: string;
  title_en: string;
  title_bn: string;
  level: "Easy" | "Medium" | "Hard";
  audio_text: string;
  transcript_en: string;
  transcript_bn: string;
  questions: Question[];
}

const LISTENING_EXERCISES: Exercise[] = [
  {
    id: "l1",
    title_en: "Announcement: Bus Departure",
    title_bn: "ঘোষণা: বাস ছাড়ার সময়",
    level: "Easy",
    audio_text: "Autobusas į Vilnių išvyksta devynioliktą valandą penkiolika minučių nuo trečiojo perano.",
    transcript_en: "The bus to Vilnius departs at 19:15 from platform 3.",
    transcript_bn: "ভিলনিউসের বাস ৩ নম্বর প্ল্যাটফর্ম থেকে ১৯:১৫ এ ছাড়বে।",
    questions: [
      {
        q_en: "When does the bus depart?",
        q_bn: "বাসটি কখন ছাড়বে?",
        options_en: ["18:15", "19:15", "19:50", "20:15"],
        options_bn: ["১৮:১৫", "১৯:১৫", "১৯:৫০", "২০:১৫"],
        correct: 1,
        explanation_en: "The announcement says 'devynioliktą valandą penkiolika minučių' = 19:15.",
        explanation_bn: "ঘোষণায় বলা হয়েছে 'devynioliktą valandą penkiolika minučių' = ১৯:১৫।",
      },
      {
        q_en: "From which platform does the bus depart?",
        q_bn: "বাসটি কোন প্ল্যাটফর্ম থেকে ছাড়বে?",
        options_en: ["Platform 1", "Platform 2", "Platform 3", "Platform 4"],
        options_bn: ["১ নম্বর", "২ নম্বর", "৩ নম্বর", "৪ নম্বর"],
        correct: 2,
        explanation_en: "'trečiojo perano' means platform 3.",
        explanation_bn: "'trečiojo perano' মানে ৩ নম্বর প্ল্যাটফর্ম।",
      },
    ],
  },
  {
    id: "l2",
    title_en: "Short Dialogue: At the Doctor",
    title_bn: "সংলাপ: ডাক্তারের কাছে",
    level: "Medium",
    audio_text: "Labas rytas. Kas jus skauda? Man skauda galva ir gerklė nuo vakar. Suprantu. Išrašysiu vaistų.",
    transcript_en: "Good morning. What hurts you? My head and throat hurt since yesterday. I understand. I will prescribe medicine.",
    transcript_bn: "শুভ সকাল। আপনার কোথায় ব্যথা? গতকাল থেকে মাথা ও গলা ব্যথা করছে। বুঝলাম। ওষুধ লিখে দেব।",
    questions: [
      {
        q_en: "What are the patient's problems?",
        q_bn: "রোগীর কী কী সমস্যা?",
        options_en: ["Only headache", "Headache and sore throat", "Fever and cold", "Stomach ache"],
        options_bn: ["শুধু মাথা ব্যথা", "মাথা ও গলা ব্যথা", "জ্বর ও সর্দি", "পেট ব্যথা"],
        correct: 1,
        explanation_en: "'galva' = head, 'gerklė' = throat — the patient has a headache and sore throat.",
        explanation_bn: "'galva' = মাথা, 'gerklė' = গলা — রোগীর মাথা ও গলা ব্যথা।",
      },
      {
        q_en: "What will the doctor do?",
        q_bn: "ডাক্তার কী করবেন?",
        options_en: ["Send to hospital", "Run tests", "Prescribe medicine", "Recommend rest"],
        options_bn: ["হাসপাতালে পাঠাবেন", "পরীক্ষা করবেন", "ওষুধ লিখে দেবেন", "বিশ্রামের পরামর্শ দেবেন"],
        correct: 2,
        explanation_en: "'Išrašysiu vaistų' = I will prescribe medicine.",
        explanation_bn: "'Išrašysiu vaistų' = ওষুধ লিখে দেব।",
      },
    ],
  },
];

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-32 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

const HERO_EXPLAIN = {
  en: "In the listening exam, you'll hear recorded announcements and dialogues through headphones and answer multiple-choice questions. Listen first, then answer.",
  bn: "শোনার পরীক্ষায় আপনাকে হেডফোনে রেকর্ড করা ঘোষণা ও সংলাপ শুনতে হবে এবং MCQ প্রশ্নের উত্তর দিতে হবে। প্রথমে শুনুন, তারপর প্রশ্নের উত্তর দিন।",
};

export default function ListeningPracticePage() {
  const { t, lang } = useTranslation();
  const [exercise, setExercise] = useState(LISTENING_EXERCISES[0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showTranscript, setShowTranscript] = useState(false);

  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showNative = !isEn && !isBn;

  // Collect every English string that needs translation for non-bn/non-en languages.
  const translatableTexts = useMemo(() => {
    if (!showNative) return [];
    const set = new Set<string>();
    LISTENING_EXERCISES.forEach((ex) => {
      set.add(ex.title_en);
      set.add(ex.transcript_en);
      ex.questions.forEach((q) => {
        set.add(q.q_en);
        set.add(q.explanation_en);
        q.options_en.forEach((o) => set.add(o));
      });
    });
    set.add(HERO_EXPLAIN.en);
    return Array.from(set);
  }, [showNative]);

  const translated = useNativeTranslations(translatableTexts, lang);

  // Pick the right localized string for each (en, bn) pair.
  const native = (en: string, bn: string): string | undefined => {
    if (isEn) return en;
    if (isBn) return bn;
    return translated.get(en);
  };

  const answer = (qIdx: number, optIdx: number) => {
    const key = `${exercise.id}-${qIdx}`;
    if (answers[key] !== undefined) return;
    setAnswers({ ...answers, [key]: optIdx });
    setTimeout(() => setRevealed({ ...revealed, [key]: true }), 300);
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="text-xs text-gray-500 mb-1">{t("examPrep")} / {t("listening")}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("listening")}</h1>
          <p className="text-gray-400 text-sm sm:text-base">Klausymas — {t("examSubLong")}</p>
        </div>

        <BengaliExplanation
          content={isBn ? HERO_EXPLAIN.bn : (translated.get(HERO_EXPLAIN.en) ?? HERO_EXPLAIN.en)}
          englishContent={isEn ? undefined : HERO_EXPLAIN.en}
          className="mb-6"
        />

        {/* Exercise selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto anim-fade-up">
          {LISTENING_EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => { setExercise(ex); setAnswers({}); setRevealed({}); setShowTranscript(false); }}
              className={cn(
                "px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all",
                exercise.id === ex.id
                  ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:border-amber-500/30"
              )}
            >
              {ex.title_en}
              <span className={cn("ml-2 text-xs px-1.5 py-0.5 rounded", ex.level === "Easy" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400")}>
                {ex.level}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio panel */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-4">
              <h2 className="font-bold text-gray-100 mb-1">{exercise.title_en}</h2>
              {!isEn && (
                <p className={cn("text-emerald-400 text-sm mb-4", isBn && "font-bengali")}>
                  <NativeText value={native(exercise.title_en, exercise.title_bn)} />
                </p>
              )}

              <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-black/30 border border-white/5">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-3xl">🎧</span>
                </div>
                <AudioButton text={exercise.audio_text} size="lg" showSlow />
                <p className="text-xs text-gray-500 text-center">{t("clickToReveal")}</p>
              </div>
            </div>

            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full py-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-300 hover:text-gray-100 hover:border-amber-500/30 transition-all mb-2"
            >
              {showTranscript ? t("hideAnswer") : t("showAnswer")}
            </button>
            {showTranscript && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 text-sm space-y-2">
                <p className="lt-text font-medium">{exercise.audio_text}</p>
                <p className="en-text text-gray-300">{exercise.transcript_en}</p>
                {!isEn && (
                  <p className={cn("text-emerald-300/80", isBn && "font-bengali")}>
                    <NativeText value={native(exercise.transcript_en, exercise.transcript_bn)} />
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Questions panel */}
          <div className="space-y-4">
            {exercise.questions.map((q, qi) => {
              const key = `${exercise.id}-${qi}`;
              const userAnswer = answers[key];
              const isRevealed = revealed[key];
              return (
                <div key={qi} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
                  <p className="text-sm text-gray-500 mb-1">Question {qi + 1}</p>
                  <p className={cn("font-medium text-gray-100 mb-1", isBn && "font-bengali")}>
                    {isEn ? q.q_en : isBn ? q.q_bn : <NativeText value={translated.get(q.q_en)} />}
                  </p>
                  {!isEn && <p className="text-xs text-gray-500 mb-3">{q.q_en}</p>}
                  <div className="space-y-2">
                    {q.options_en.map((optEn, oi) => {
                      const optBn = q.options_bn[oi];
                      const display = isEn ? optEn : isBn ? optBn : translated.get(optEn);
                      let style = "border-white/10 bg-white/[0.02] text-gray-300 hover:border-amber-500/30 hover:bg-white/[0.05]";
                      if (isRevealed) {
                        if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                        else if (oi === userAnswer) style = "border-red-500 bg-red-500/10 text-red-300";
                        else style = "border-white/10 text-gray-600 opacity-50";
                      }
                      return (
                        <button
                          key={oi}
                          onClick={() => answer(qi, oi)}
                          className={cn("w-full text-left px-3 py-2 rounded-lg border text-sm transition-all", isBn && "font-bengali", style)}
                        >
                          {String.fromCharCode(65 + oi)}. {display ?? <NativeText value={undefined} />}
                        </button>
                      );
                    })}
                  </div>
                  {isRevealed && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <p className={cn("text-sm text-emerald-200", isBn && "font-bengali")}>
                        💡 {isEn ? q.explanation_en : isBn ? q.explanation_bn : <NativeText value={translated.get(q.explanation_en)} />}
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
