"use client";

import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";

const LISTENING_EXERCISES = [
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
        q_bn: "বাসটি কখন ছাড়বে?",
        q_en: "When does the bus depart?",
        options_bn: ["১৮:১৫", "১৯:১৫", "১৯:৫০", "২০:১৫"],
        correct: 1,
        explanation_bn: "ঘোষণায় বলা হয়েছে 'devynioliktą valandą penkiolika minučių' = ১৯:১৫।",
      },
      {
        q_bn: "বাসটি কোন প্ল্যাটফর্ম থেকে ছাড়বে?",
        q_en: "From which platform does the bus depart?",
        options_bn: ["১ নম্বর", "২ নম্বর", "৩ নম্বর", "৪ নম্বর"],
        correct: 2,
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
        q_bn: "রোগীর কী কী সমস্যা?",
        q_en: "What are the patient's problems?",
        options_bn: ["শুধু মাথা ব্যথা", "মাথা ও গলা ব্যথা", "জ্বর ও সর্দি", "পেট ব্যথা"],
        correct: 1,
        explanation_bn: "'galva' = মাথা, 'gerklė' = গলা — রোগীর মাথা ও গলা ব্যথা।",
      },
      {
        q_bn: "ডাক্তার কী করবেন?",
        q_en: "What will the doctor do?",
        options_bn: ["হাসপাতালে পাঠাবেন", "পরীক্ষা করবেন", "ওষুধ লিখে দেবেন", "বিশ্রামের পরামর্শ দেবেন"],
        correct: 2,
        explanation_bn: "'Išrašysiu vaistų' = ওষুধ লিখে দেব।",
      },
    ],
  },
];

export default function ListeningPracticePage() {
  const [exercise, setExercise] = useState(LISTENING_EXERCISES[0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showTranscript, setShowTranscript] = useState(false);

  const answer = (qIdx: number, optIdx: number) => {
    const key = `${exercise.id}-${qIdx}`;
    if (answers[key] !== undefined) return;
    setAnswers({ ...answers, [key]: optIdx });
    setTimeout(() => setRevealed({ ...revealed, [key]: true }), 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Exam Prep / Listening</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Listening Practice <span className="text-amber-400 font-bengali text-xl">· শোনার অনুশীলন</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Klausymas — A1 exam listening exercises with Bengali explanations</p>
      </div>

      <BengaliExplanation
        content="শোনার পরীক্ষায় আপনাকে হেডফোনে রেকর্ড করা ঘোষণা ও সংলাপ শুনতে হবে এবং MCQ প্রশ্নের উত্তর দিতে হবে। প্রথমে শুনুন, তারপর প্রশ্নের উত্তর দিন।"
        englishContent="In the listening exam, you will hear recorded announcements and dialogues via headphones and answer multiple-choice questions."
        className="mb-6"
      />

      {/* Exercise selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {LISTENING_EXERCISES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => { setExercise(ex); setAnswers({}); setRevealed({}); setShowTranscript(false); }}
            className={cn("px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition-all", exercise.id === ex.id ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "border-[var(--border)] text-gray-400 hover:text-gray-200")}
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
          <div className="card-surface p-6 mb-4">
            <h2 className="font-bold text-gray-200 mb-1">{exercise.title_en}</h2>
            <p className="text-emerald-400 font-bengali text-sm mb-4">{exercise.title_bn}</p>

            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <span className="text-3xl">🎧</span>
              </div>
              <AudioButton text={exercise.audio_text} size="lg" showSlow />
              <p className="text-xs text-gray-500 text-center">Click to play the recording · ক্লিক করুন রেকর্ডিং শুনতে</p>
            </div>
          </div>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full py-2 rounded-lg border border-[var(--border)] text-sm text-gray-400 hover:text-gray-200 hover:border-amber-500/30 transition-all mb-2"
          >
            {showTranscript ? "ট্রান্সক্রিপ্ট লুকান" : "ট্রান্সক্রিপ্ট দেখুন (উত্তর দেওয়ার পরে)"}
          </button>
          {showTranscript && (
            <div className="card-surface p-4 text-sm space-y-2">
              <p className="lt-text font-medium">{exercise.audio_text}</p>
              <p className="en-text">{exercise.transcript_en}</p>
              <p className="bn-text font-bengali">{exercise.transcript_bn}</p>
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
              <div key={qi} className="card-surface p-5">
                <p className="text-sm text-gray-400 mb-0.5">Question {qi + 1}</p>
                <p className="bn-text font-bengali font-medium mb-0.5">{q.q_bn}</p>
                <p className="en-text text-sm mb-3">{q.q_en}</p>
                <div className="space-y-2">
                  {q.options_bn.map((opt, oi) => {
                    let style = "border-[var(--border)] text-gray-300 hover:border-amber-500/30";
                    if (isRevealed) {
                      if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                      else if (oi === userAnswer) style = "border-red-500 bg-red-500/10 text-red-300";
                      else style = "border-[var(--border)] text-gray-600 opacity-50";
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() => answer(qi, oi)}
                        className={cn("w-full text-left px-3 py-2 rounded-lg border text-sm font-bengali transition-all", style)}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
                {isRevealed && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <p className="bn-text font-bengali text-sm text-emerald-200">💡 {q.explanation_bn}</p>
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
