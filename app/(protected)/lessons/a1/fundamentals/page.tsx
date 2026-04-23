"use client";

import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { lithuanianAlphabet, specialCharacters } from "@/data/alphabet";

const NUMBERS = [
  { n: 0, lt: "nulis", en: "zero", bn: "শূন্য" },
  { n: 1, lt: "vienas", en: "one", bn: "এক" },
  { n: 2, lt: "du", en: "two", bn: "দুই" },
  { n: 3, lt: "trys", en: "three", bn: "তিন" },
  { n: 4, lt: "keturi", en: "four", bn: "চার" },
  { n: 5, lt: "penki", en: "five", bn: "পাঁচ" },
  { n: 6, lt: "šeši", en: "six", bn: "ছয়" },
  { n: 7, lt: "septyni", en: "seven", bn: "সাত" },
  { n: 8, lt: "aštuoni", en: "eight", bn: "আট" },
  { n: 9, lt: "devyni", en: "nine", bn: "নয়" },
  { n: 10, lt: "dešimt", en: "ten", bn: "দশ" },
  { n: 11, lt: "vienuolika", en: "eleven", bn: "এগারো" },
  { n: 12, lt: "dvylika", en: "twelve", bn: "বারো" },
  { n: 20, lt: "dvidešimt", en: "twenty", bn: "বিশ" },
  { n: 30, lt: "trisdešimt", en: "thirty", bn: "ত্রিশ" },
  { n: 40, lt: "keturiasdešimt", en: "forty", bn: "চল্লিশ" },
  { n: 50, lt: "penkiasdešimt", en: "fifty", bn: "পঞ্চাশ" },
  { n: 100, lt: "šimtas", en: "one hundred", bn: "একশত" },
];

const DAYS = [
  { lt: "pirmadienis", en: "Monday", bn: "সোমবার" },
  { lt: "antradienis", en: "Tuesday", bn: "মঙ্গলবার" },
  { lt: "trečiadienis", en: "Wednesday", bn: "বুধবার" },
  { lt: "ketvirtadienis", en: "Thursday", bn: "বৃহস্পতিবার" },
  { lt: "penktadienis", en: "Friday", bn: "শুক্রবার" },
  { lt: "šeštadienis", en: "Saturday", bn: "শনিবার" },
  { lt: "sekmadienis", en: "Sunday", bn: "রবিবার" },
];

const MONTHS = [
  { lt: "sausis", en: "January", bn: "জানুয়ারি" },
  { lt: "vasaris", en: "February", bn: "ফেব্রুয়ারি" },
  { lt: "kovas", en: "March", bn: "মার্চ" },
  { lt: "balandis", en: "April", bn: "এপ্রিল" },
  { lt: "gegužė", en: "May", bn: "মে" },
  { lt: "birželis", en: "June", bn: "জুন" },
  { lt: "liepa", en: "July", bn: "জুলাই" },
  { lt: "rugpjūtis", en: "August", bn: "আগস্ট" },
  { lt: "rugsėjis", en: "September", bn: "সেপ্টেম্বর" },
  { lt: "spalis", en: "October", bn: "অক্টোবর" },
  { lt: "lapkritis", en: "November", bn: "নভেম্বর" },
  { lt: "gruodis", en: "December", bn: "ডিসেম্বর" },
];

type Tab = "alphabet" | "numbers" | "days";

export default function FundamentalsPage() {
  const [tab, setTab] = useState<Tab>("alphabet");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const tabs = [
    { key: "alphabet" as Tab, label_en: "Alphabet & Pronunciation", label_bn: "বর্ণমালা" },
    { key: "numbers" as Tab, label_en: "Numbers", label_bn: "সংখ্যা" },
    { key: "days" as Tab, label_en: "Days & Months", label_bn: "দিন ও মাস" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Lessons / A1 / Fundamentals</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Fundamentals <span className="text-amber-400 font-bengali text-xl">· মূল বিষয়</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">The essential building blocks of Lithuanian — বর্ণমালা, সংখ্যা, দিন-মাস</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t.key
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            <span>{t.label_en}</span>
            <span className="block text-xs text-current/60 font-bengali">{t.label_bn}</span>
          </button>
        ))}
      </div>

      {/* ALPHABET TAB */}
      {tab === "alphabet" && (
        <div className="space-y-6">
          <BengaliExplanation
            content="লিথুয়ানিয়ান বর্ণমালায় ৩২টি অক্ষর আছে। কিছু বিশেষ অক্ষর আছে যেগুলো বাংলায় পাওয়া যায় না — সেগুলো হলো: ą, č, ę, ė, į, š, ų, ū, ž। এই অক্ষরগুলো বিশেষ উচ্চারণ নির্দেশ করে।"
            englishContent="Lithuanian has 32 letters. Some special characters indicate unique sounds: ą, č, ę, ė, į, š, ų, ū, ž"
          />

          {/* Special chars highlight */}
          <div className="card-surface p-5">
            <h2 className="font-bold text-gray-200 mb-1">বিশেষ অক্ষর · Special Characters</h2>
            <p className="text-gray-400 text-sm mb-4">These unique Lithuanian letters need extra attention:</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {specialCharacters.map((l) => (
                <div
                  key={l.letter}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedLetter(selectedLetter === l.letter ? null : l.letter)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedLetter(selectedLetter === l.letter ? null : l.letter)}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-center cursor-pointer",
                    selectedLetter === l.letter
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-[var(--border)] hover:border-amber-500/30"
                  )}
                >
                  <span className="text-2xl font-bold text-amber-400 block">{l.letter}</span>
                  <AudioButton text={l.letter} size="sm" className="mx-auto mt-1" />
                </div>
              ))}
            </div>
            {selectedLetter && (() => {
              const l = specialCharacters.find((x) => x.letter === selectedLetter);
              if (!l) return null;
              return (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-amber-400">{l.letter}</span>
                    <AudioButton text={l.letter} size="md" showSlow />
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{l.sound_en}</p>
                  <p className="bn-text font-bengali text-sm mb-3">{l.sound_bn}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Example:</span>
                    <span className="lt-text font-bold">{l.example_word}</span>
                    <AudioButton text={l.example_word} size="sm" />
                    <span className="text-gray-400 text-sm">= {l.example_meaning_en}</span>
                    <span className="bn-text font-bengali text-sm">= {l.example_meaning_bn}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Full alphabet table */}
          <div className="card-surface overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
              <h2 className="font-bold text-gray-200">সম্পূর্ণ বর্ণমালা · Full Alphabet</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Letter</th>
                    <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Audio</th>
                    <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Sound (EN)</th>
                    <th className="px-4 py-2.5 text-left text-xs text-amber-400/70 uppercase font-bengali">উচ্চারণ (বাংলা)</th>
                    <th className="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {lithuanianAlphabet.map((l) => (
                    <tr key={l.letter} className={cn("border-b border-[var(--border)] hover:bg-white/[0.02]", l.is_special && "bg-amber-500/3")}>
                      <td className="px-4 py-2.5">
                        <span className={cn("text-lg font-bold", l.is_special ? "text-amber-400" : "text-gray-200")}>
                          {l.letter}
                        </span>
                        {l.is_special && <span className="ml-1 text-xs text-amber-500/50">★</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <AudioButton text={l.letter} size="sm" />
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{l.sound_en}</td>
                      <td className="px-4 py-2.5 bn-text font-bengali text-sm">{l.sound_bn}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="lt-text font-bold text-sm">{l.example_word}</span>
                          <AudioButton text={l.example_word} size="sm" />
                          <span className="text-gray-500 text-xs">= {l.example_meaning_en}</span>
                          <span className="bn-text font-bengali text-xs">/ {l.example_meaning_bn}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NUMBERS TAB */}
      {tab === "numbers" && (
        <div className="space-y-6">
          <BengaliExplanation
            content="লিথুয়ানিয়ান সংখ্যা শিখতে সহজ! ১-১০ মুখস্থ করুন, তারপর বাকিগুলো সহজে বুঝতে পারবেন। যেমন: dvidešimt = dvi (২) + dešimt (১০) = ২০।"
            englishContent="Lithuanian numbers follow a logical pattern. Learn 1-10 first, then numbers like dvidešimt (twenty) make sense: dvi (two) + dešimt (ten)."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {NUMBERS.map((num) => (
              <div key={num.n} className="card-surface p-4 text-center hover:border-amber-500/20 transition-all">
                <p className="text-3xl font-bold text-amber-400 mb-1">{num.n}</p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="lt-text font-bold text-sm">{num.lt}</span>
                  <AudioButton text={num.lt} size="sm" />
                </div>
                <p className="en-text text-xs">{num.en}</p>
                <p className="bn-text font-bengali text-sm">{num.bn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAYS & MONTHS TAB */}
      {tab === "days" && (
        <div className="space-y-6">
          <BengaliExplanation
            content="লিথুয়ানিয়ান দিনের নামগুলো সংখ্যা থেকে এসেছে: pirmadienis = pirma (প্রথম) + dienis (দিন) = সোমবার। শুক্রবার থেকে রবিবার ভিন্ন নিয়মে।"
            englishContent="Lithuanian days are based on numbers: pirmadienis = first day (Monday). The week starts on Monday in Lithuania."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-gray-200 mb-3">Days of the Week · সপ্তাহের দিন</h2>
              <div className="space-y-2">
                {DAYS.map((d, i) => (
                  <div key={d.lt} className="card-surface p-3 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="lt-text font-bold text-sm">{d.lt}</span>
                      <AudioButton text={d.lt} size="sm" />
                    </div>
                    <span className="en-text text-sm">{d.en}</span>
                    <span className="bn-text font-bengali text-sm">{d.bn}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-gray-200 mb-3">Months · মাসের নাম</h2>
              <div className="space-y-2">
                {MONTHS.map((m, i) => (
                  <div key={m.lt} className="card-surface p-3 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="lt-text font-bold text-sm">{m.lt}</span>
                      <AudioButton text={m.lt} size="sm" />
                    </div>
                    <span className="en-text text-sm">{m.en}</span>
                    <span className="bn-text font-bengali text-sm">{m.bn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
