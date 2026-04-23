"use client";

import { useState } from "react";
import { Camera, Star, BookOpen, FlipHorizontal, CheckCircle } from "lucide-react";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { formatXP, calculateLevel } from "@/lib/xp";

const ACHIEVEMENTS = [
  { id: "1", icon: "🌅", title_lt: "Pirma diena", title_en: "First Day", title_bn: "প্রথম দিন", desc_bn: "প্রথম লগইন করেছেন", earned: true },
  { id: "2", icon: "📚", title_lt: "100 žodžių", title_en: "100 Words", title_bn: "১০০ শব্দ", desc_bn: "১০০টি শব্দ শিখেছেন", earned: false },
  { id: "3", icon: "🔥", title_lt: "Savaitė", title_en: "One Week", title_bn: "এক সপ্তাহ", desc_bn: "৭ দিনের ধারাবাহিকতা", earned: true },
  { id: "4", icon: "🎓", title_lt: "Egzaminas", title_en: "Exam Ready", title_bn: "পরীক্ষার জন্য প্রস্তুত", desc_bn: "সব পরীক্ষার প্রস্তুতি সম্পন্ন", earned: false },
];

const RECENT_QUIZZES = [
  { type: "Vocabulary Quiz", score: 17, total: 20, date: "Today", pct: 85 },
  { type: "Listening Quiz", score: 8, total: 10, date: "Yesterday", pct: 80 },
  { type: "Fill in the Blank", score: 14, total: 20, date: "2 days ago", pct: 70 },
];

// GitHub-style activity grid (84 days)
function ActivityGrid() {
  const days = Array.from({ length: 84 }, (_, i) => ({
    active: Math.random() > 0.6,
    intensity: Math.floor(Math.random() * 4),
  }));
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {Array.from({ length: 12 }, (_, week) => (
          <div key={week} className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, day) => {
              const cell = days[week * 7 + day];
              return (
                <div
                  key={day}
                  className={`w-3 h-3 rounded-sm ${
                    !cell.active ? "bg-gray-800"
                    : cell.intensity === 0 ? "bg-amber-900/40"
                    : cell.intensity === 1 ? "bg-amber-700/60"
                    : cell.intensity === 2 ? "bg-amber-500/80"
                    : "bg-amber-400"
                  }`}
                  title={cell.active ? `${cell.intensity + 1} activities` : "No activity"}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [dailyGoal, setDailyGoal] = useState(50);
  const [preferredLang, setPreferredLang] = useState<"bn" | "en">("bn");
  const [audioAutoplay, setAudioAutoplay] = useState(false);

  const totalXP = 1240;
  const level = calculateLevel(totalXP);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-8">
        Profile <span className="text-amber-400 font-bengali text-xl">· প্রোফাইল</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: User info */}
        <div className="md:col-span-1 space-y-4">
          {/* Avatar */}
          <div className="card-surface p-6 text-center">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-3xl font-bold text-amber-400 mx-auto">
                A
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center border-2 border-[var(--surface)]">
                <Camera size={12} className="text-black" />
              </button>
            </div>
            <h2 className="font-bold text-gray-100 text-lg">Anika Rahman</h2>
            <p className="text-gray-400 text-sm">anika@example.com</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400">{level.title_en}</span>
              <span className="text-xs text-emerald-400 font-bengali">{level.title_bn}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="card-surface p-5">
            <h3 className="font-bold text-gray-200 mb-4 text-sm">পরিসংখ্যান · Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{formatXP(totalXP)}</p>
                <p className="text-xs text-gray-500">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">47</p>
                <p className="text-xs text-gray-500">Words</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">8</p>
                <p className="text-xs text-gray-500">Lessons</p>
              </div>
              <div className="text-center">
                <StreakBadge count={12} size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Settings + Achievements */}
        <div className="md:col-span-2 space-y-4">
          {/* Settings */}
          <div className="card-surface p-6">
            <h3 className="font-bold text-gray-200 mb-4">সেটিংস · Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ব্যাখ্যার ভাষা · Explanation Language</label>
                <div className="flex gap-2">
                  {(["bn", "en"] as const).map((l) => (
                    <button key={l} onClick={() => setPreferredLang(l)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${preferredLang === l ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "border-[var(--border)] text-gray-400"}`}>
                      {l === "bn" ? "বাংলা" : "English"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">দৈনিক লক্ষ্য · Daily Goal XP</label>
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
                <div>
                  <p className="text-sm font-medium text-gray-300">অটো অডিও · Audio Autoplay</p>
                  <p className="text-xs text-gray-500">ফ্ল্যাশকার্ড লোড হলে স্বয়ংক্রিয়ভাবে বাজবে</p>
                </div>
                <button
                  onClick={() => setAudioAutoplay(!audioAutoplay)}
                  className={`w-11 h-6 rounded-full transition-all ${audioAutoplay ? "bg-amber-500" : "bg-gray-700"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${audioAutoplay ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="card-surface p-6">
            <h3 className="font-bold text-gray-200 mb-4">সক্রিয়তা · Activity (Last 12 Weeks)</h3>
            <ActivityGrid />
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
              <span>কম</span>
              {["bg-gray-800", "bg-amber-900/40", "bg-amber-700/60", "bg-amber-500/80", "bg-amber-400"].map((c) => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span>বেশি</span>
            </div>
          </div>

          {/* Achievements */}
          <div className="card-surface p-6">
            <h3 className="font-bold text-gray-200 mb-4">অর্জন · Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className={`p-4 rounded-xl border flex items-start gap-3 ${a.earned ? "border-amber-500/20 bg-amber-500/5" : "border-[var(--border)] opacity-50"}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-bold text-gray-200 text-sm">{a.title_en}</p>
                    <p className="text-xs text-amber-400">{a.title_lt}</p>
                    <p className="text-xs text-gray-500 font-bengali">{a.desc_bn}</p>
                    {a.earned && <p className="text-xs text-emerald-400 mt-1">✓ অর্জিত</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz History */}
          <div className="card-surface p-6">
            <h3 className="font-bold text-gray-200 mb-4">কুইজ ইতিহাস · Recent Quizzes</h3>
            <div className="space-y-3">
              {RECENT_QUIZZES.map((q, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{q.type}</p>
                    <p className="text-xs text-gray-600">{q.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div className={`h-full rounded-full ${q.pct >= 80 ? "bg-emerald-500" : q.pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${q.pct}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${q.pct >= 80 ? "text-emerald-400" : q.pct >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {q.score}/{q.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
