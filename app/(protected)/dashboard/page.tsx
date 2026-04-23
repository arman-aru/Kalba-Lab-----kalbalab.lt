"use client";

import Link from "next/link";
import { FlipHorizontal, BookOpen, GraduationCap, MessageSquare, FileText, HelpCircle, Star, RotateCcw, ArrowRight, Mic } from "lucide-react";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { AudioButton } from "@/components/audio/AudioButton";
import { getGreeting, formatXP } from "@/lib/utils";

const WORD_OF_DAY = {
  lt: "gerai",
  en: "okay / good",
  bn: "ঠিক আছে / ভালো",
  part_of_speech: "adverb",
  example_lt: "Gerai, supratau.",
  example_en: "Okay, I understood.",
  example_bn: "ঠিক আছে, আমি বুঝেছি।",
};

const QUICK_ACTIONS = [
  { icon: FlipHorizontal, title_lt: "Blykstė korteles", title_en: "Flashcards", title_bn: "ফ্ল্যাশকার্ড", desc_bn: "শব্দ পর্যালোচনা করুন", href: "/flashcards", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { icon: BookOpen, title_lt: "Žodynas", title_en: "Vocabulary", title_bn: "শব্দভাণ্ডার", desc_bn: "সব শব্দ দেখুন", href: "/vocabulary", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { icon: Star, title_lt: "Pagrindai", title_en: "Fundamentals", title_bn: "মূল বিষয়", desc_bn: "বর্ণমালা ও সংখ্যা", href: "/lessons/a1/fundamentals", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { icon: FileText, title_lt: "Gramatika", title_en: "Grammar", title_bn: "ব্যাকরণ", desc_bn: "ব্যাকরণ শিখুন", href: "/lessons/a1/grammar", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  { icon: MessageSquare, title_lt: "Dialogai", title_en: "Dialogues", title_bn: "কথোপকথন", desc_bn: "বাস্তব সংলাপ", href: "/lessons/a1/dialogues", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { icon: BookOpen, title_lt: "Skaitymas", title_en: "Reading", title_bn: "পড়া", desc_bn: "পাঠ বোঝার অনুশীলন", href: "/lessons/a1/reading", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { icon: HelpCircle, title_lt: "Testai", title_en: "Quizzes", title_bn: "কুইজ", desc_bn: "জ্ঞান যাচাই করুন", href: "/quizzes", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { icon: GraduationCap, title_lt: "Egzaminų paruošimas", title_en: "Exam Prep", title_bn: "পরীক্ষার প্রস্তুতি", desc_bn: "A1 পরীক্ষার প্রস্তুতি", href: "/exam-prep", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
];

const CONTINUE_LESSONS = [
  { title_en: "Verb 'Būti' (To Be)", title_bn: "ক্রিয়া 'থাকা' (Būti)", progress: 60, href: "/lessons/a1/grammar/to-be", type: "Grammar" },
  { title_en: "First Meeting Dialogue", title_bn: "প্রথম সাক্ষাৎ সংলাপ", progress: 30, href: "/lessons/a1/dialogues/first-meeting", type: "Dialogue" },
  { title_en: "Numbers 0-100", title_bn: "সংখ্যা ০-১০০", progress: 80, href: "/lessons/a1/fundamentals", type: "Fundamentals" },
];

const STATS = [
  { label_en: "Words Learned", label_bn: "শেখা শব্দ", value: "47", total: "500", color: "text-amber-400" },
  { label_en: "Lessons Done", label_bn: "সম্পন্ন পাঠ", value: "8", total: "45", color: "text-blue-400" },
  { label_en: "Quiz Average", label_bn: "কুইজ গড়", value: "73%", total: "", color: "text-green-400" },
  { label_en: "Days Active", label_bn: "সক্রিয় দিন", value: "12", total: "", color: "text-purple-400" },
];

export default function DashboardPage() {
  const greeting = getGreeting("Anika");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 font-bengali">{greeting.bn}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{greeting.en}</p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge count={12} size="lg" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-400 font-bold text-sm">{formatXP(1240)} XP</span>
          </div>
        </div>
      </div>

      {/* Word of the Day */}
      <div className="card-surface p-5 mb-6 border-amber-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">আজকের শব্দ · Word of the Day</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-amber-400">{WORD_OF_DAY.lt}</span>
              <AudioButton text={WORD_OF_DAY.lt} size="md" showSlow />
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300">{WORD_OF_DAY.part_of_speech}</span>
            </div>
            <p className="text-gray-300 mb-0.5">{WORD_OF_DAY.en}</p>
            <p className="bn-text font-bengali text-base">{WORD_OF_DAY.bn}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm min-w-0 sm:max-w-xs">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-amber-400 font-medium">{WORD_OF_DAY.example_lt}</span>
              <AudioButton text={WORD_OF_DAY.example_lt} size="sm" />
            </div>
            <p className="text-gray-400 text-xs">{WORD_OF_DAY.example_en}</p>
            <p className="bn-text font-bengali text-xs mt-0.5">{WORD_OF_DAY.example_bn}</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {STATS.map((s) => (
          <div key={s.label_en} className="card-surface p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}{s.total && <span className="text-gray-600 text-sm font-normal">/{s.total}</span>}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label_en}</p>
            <p className="text-xs text-gray-600 font-bengali">{s.label_bn}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-200 mb-4">দ্রুত শুরু করুন · Quick Start</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`card-surface p-4 flex flex-col gap-2 hover:scale-[1.02] transition-all border ${action.color.split(' ')[2]}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${action.color}`}>
                <action.icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-200 text-sm">{action.title_en}</p>
                <p className="text-xs text-gray-500 font-bengali">{action.title_bn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Continue where you left off */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold text-gray-200 mb-4">যেখানে থামিয়েছিলেন · Continue Learning</h2>
          <div className="space-y-3">
            {CONTINUE_LESSONS.map((lesson) => (
              <Link key={lesson.href} href={lesson.href} className="card-surface p-4 flex items-center gap-4 hover:border-amber-500/20 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{lesson.type}</span>
                  </div>
                  <p className="font-medium text-gray-200 text-sm">{lesson.title_en}</p>
                  <p className="text-xs text-gray-500 font-bengali">{lesson.title_bn}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${lesson.progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{lesson.progress}% complete</p>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-amber-400 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right column: Daily goal + vocab due */}
        <div className="space-y-4">
          {/* Daily goal */}
          <div className="card-surface p-5">
            <h3 className="font-bold text-gray-200 mb-4 text-sm">আজকের লক্ষ্য · Daily Goal</h3>
            <div className="flex items-center gap-4">
              <ProgressRing value={48} size={72} label="24" sublabel="XP" />
              <div>
                <p className="text-sm text-gray-300 font-bengali">২৪/৫০ XP অর্জিত</p>
                <p className="text-xs text-gray-500">24 of 50 XP earned today</p>
                <div className="mt-2 space-y-1">
                  {[
                    { done: true, label: "Daily login +10 XP" },
                    { done: true, label: "Vocab review +10 XP" },
                    { done: false, label: "Complete a lesson" },
                  ].map((a) => (
                    <div key={a.label} className="flex items-center gap-1.5 text-xs">
                      <span className={a.done ? "text-emerald-400" : "text-gray-600"}>
                        {a.done ? "✓" : "○"}
                      </span>
                      <span className={a.done ? "text-gray-400" : "text-gray-600"}>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vocab due */}
          <div className="card-surface p-5">
            <h3 className="font-bold text-gray-200 mb-2 text-sm flex items-center gap-2">
              <RotateCcw size={14} className="text-amber-400" />
              পর্যালোচনার সময় · Due for Review
            </h3>
            <p className="text-2xl font-bold text-amber-400 mb-0.5">14</p>
            <p className="text-xs text-gray-500 mb-3">words due today</p>
            <Link
              href="/flashcards"
              className="block w-full text-center py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-medium transition-all"
            >
              এখনই পর্যালোচনা করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
