import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquare, FileText, GraduationCap, Star } from "lucide-react";

const LESSON_SECTIONS = [
  {
    icon: Star,
    title_en: "Fundamentals",
    title_lt: "Pagrindai",
    title_bn: "মূল বিষয়",
    desc_bn: "বর্ণমালা, সংখ্যা, দিন-মাস শিখুন",
    href: "/lessons/a1/fundamentals",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    lessons: ["Alphabet & Pronunciation", "Numbers 0-100", "Days & Months", "Colors"],
  },
  {
    icon: FileText,
    title_en: "Grammar",
    title_lt: "Gramatika",
    title_bn: "ব্যাকরণ",
    desc_bn: "ক্রিয়া, বিশেষ্য, বিভক্তি শিখুন",
    href: "/lessons/a1/grammar",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    lessons: ["Verb 'Būti' (To be)", "Present Tense", "Noun Gender", "Question Words"],
  },
  {
    icon: MessageSquare,
    title_en: "Dialogues",
    title_lt: "Dialogai",
    title_bn: "কথোপকথন",
    desc_bn: "বাস্তব পরিস্থিতিতে কথা বলুন",
    href: "/lessons/a1/dialogues",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    lessons: ["First Meeting", "At the Shop", "At the Doctor", "Asking Directions"],
  },
  {
    icon: BookOpen,
    title_en: "Reading",
    title_lt: "Skaitymas",
    title_bn: "পড়া",
    desc_bn: "লিথুয়ানিয়ান টেক্সট বোঝার অভ্যাস",
    href: "/lessons/a1/reading",
    color: "text-green-400 bg-green-500/10 border-green-500/20",
    lessons: ["My Family", "My City", "A Working Day", "Lithuanian Nature"],
  },
  {
    icon: GraduationCap,
    title_en: "Exam Prep",
    title_lt: "Egzaminų paruošimas",
    title_bn: "পরীক্ষার প্রস্তুতি",
    desc_bn: "A1 পরীক্ষার সম্পূর্ণ প্রস্তুতি",
    href: "/exam-prep",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    lessons: ["Listening Practice", "Reading Practice", "Writing Practice", "Mock Exam"],
  },
];

export default function LessonsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">
          Lessons <span className="text-amber-400 font-bengali text-xl">· পাঠ</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          A1 Lithuanian — complete course with Bengali explanations
        </p>
      </div>

      {/* Level badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm mb-8">
        🎯 A1 Level — Integration Exam Preparation
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LESSON_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="card-surface p-6 hover:border-amber-500/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${section.color}`}>
                <section.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-100 text-lg mb-0.5">{section.title_en}</h3>
                <p className="text-amber-400 font-bold text-sm mb-0.5">{section.title_lt}</p>
                <p className="text-emerald-400 font-bengali text-sm mb-3">{section.title_bn}</p>
                <p className="text-gray-400 text-sm font-bengali mb-3">{section.desc_bn}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {section.lessons.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all mt-2">
              Start Learning <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
