import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const EXAM_SECTIONS = [
  {
    id: "listening",
    icon: "🎧",
    title_lt: "Klausymas",
    title_en: "Listening",
    title_bn: "শোনা",
    desc_bn: "রেকর্ড করা ঘোষণা ও সংলাপ শুনে প্রশ্নের উত্তর দিন",
    href: "/exam-prep/listening",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  },
  {
    id: "reading",
    icon: "📖",
    title_lt: "Skaitymas",
    title_en: "Reading",
    title_bn: "পড়া",
    desc_bn: "সাইন, মেনু, সময়সূচি ও ছোট চিঠি পড়ে প্রশ্নের উত্তর দিন",
    href: "/exam-prep/reading",
    color: "text-green-400 border-green-500/20 bg-green-500/10",
  },
  {
    id: "writing",
    icon: "✍️",
    title_lt: "Rašymas",
    title_en: "Writing",
    title_bn: "লেখা",
    desc_bn: "ফর্ম পূরণ করুন এবং ৫০-৮০ শব্দের বার্তা লিখুন",
    href: "/exam-prep/writing",
    color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  },
  {
    id: "speaking",
    icon: "🎤",
    title_lt: "Kalbėjimas",
    title_en: "Speaking",
    title_bn: "বলা",
    desc_bn: "মৌখিক পরীক্ষার অনুশীলন করুন — নিজেকে রেকর্ড করুন",
    href: "/exam-prep/speaking",
    color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  },
  {
    id: "mock-exam",
    icon: "📋",
    title_lt: "Bandomasis egzaminas",
    title_en: "Full Mock Exam",
    title_bn: "পূর্ণ মক পরীক্ষা",
    desc_bn: "আসল পরীক্ষার মতো সম্পূর্ণ অনুশীলন করুন সময়সীমাসহ",
    href: "/exam-prep/mock-exam",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
];

const EXAM_FACTS = [
  { label_bn: "পরীক্ষার ফি", value: "€52", note: "(2026)" },
  { label_bn: "পাস নম্বর", value: "50%", note: "সামগ্রিক" },
  { label_bn: "প্রতিটি অংশে ন্যূনতম", value: "25%", note: "পাস করতে হবে" },
  { label_bn: "পরীক্ষার সময়", value: "~2.5", note: "ঘন্টা" },
];

const EXAM_SKILLS = [
  {
    key: "Klausymas (Listening)",
    bn: "শোনা",
    format_bn: "রেকর্ড করা ঘোষণা ও সংলাপ — হেডফোনে শুনে MCQ উত্তর",
    tips_bn: "সংখ্যা, সময়, এবং স্থানের নাম ভালো করে শিখুন।",
  },
  {
    key: "Skaitymas (Reading)",
    bn: "পড়া",
    format_bn: "সাইন, বিজ্ঞাপন, সংক্ষিপ্ত বার্তা পড়ে MCQ উত্তর",
    tips_bn: "প্রতিদিন লিথুয়ানিয়ান সাইন ও মেনু পড়ার অনুশীলন করুন।",
  },
  {
    key: "Rašymas (Writing)",
    bn: "লেখা",
    format_bn: "ফর্ম পূরণ + ৫০-৮০ শব্দের অনানুষ্ঠানিক বার্তা লেখা",
    tips_bn: "সংযোজক শব্দ ব্যবহার করুন: ir (এবং), bet (কিন্তু), nes (কারণ)।",
  },
  {
    key: "Kalbėjimas (Speaking)",
    bn: "বলা",
    format_bn: "পরীক্ষকের সাথে ব্যক্তিগত তথ্য ও দৈনন্দিন বিষয়ে কথা বলা",
    tips_bn: "নিজেকে পরিচয় করিয়ে দেওয়া ও পরিবার সম্পর্কে কথা বলার অভ্যাস করুন।",
  },
];

export default function ExamPrepPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="card-surface p-8 mb-8 border-amber-500/20 text-center">
        <div className="text-4xl mb-3">🎓</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
          A1 পরীক্ষার জন্য প্রস্তুত হন
        </h1>
        <p className="text-amber-400 font-bengali text-xl mb-1">লিথুয়ানিয়ান ভাষার সমন্বয় পরীক্ষা</p>
        <p className="text-gray-400">Lithuanian Language Integration Test (A1 Level)</p>
      </div>

      {/* Exam facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {EXAM_FACTS.map((f) => (
          <div key={f.label_bn} className="card-surface p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{f.value}</p>
            <p className="text-xs text-gray-500">{f.note}</p>
            <p className="text-xs text-gray-400 font-bengali mt-0.5">{f.label_bn}</p>
          </div>
        ))}
      </div>

      {/* Exam format explanation */}
      <div className="card-surface p-6 mb-8">
        <h2 className="font-bold text-gray-100 text-lg mb-4">পরীক্ষার ফরম্যাট · Exam Format</h2>
        <div className="space-y-4">
          {EXAM_SKILLS.map((s) => (
            <div key={s.key} className="border-l-2 border-amber-500/40 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-amber-400 text-sm">{s.key}</span>
                <span className="text-emerald-400 font-bengali text-sm">({s.bn})</span>
              </div>
              <p className="text-gray-300 text-sm font-bengali mb-1">{s.format_bn}</p>
              <p className="text-gray-500 text-xs font-bengali">💡 {s.tips_bn}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-lg bg-blue-950/20 border border-blue-500/20">
          <p className="text-blue-300 text-sm font-bengali">
            📌 রেজিস্ট্রেশন করুন NŠA পোর্টালে: <strong>eksternams.nsa.smm.lt</strong>
          </p>
          <p className="text-blue-400/60 text-xs mt-0.5">Register at the official NŠA portal for exam booking.</p>
        </div>
      </div>

      {/* Practice sections */}
      <h2 className="font-bold text-gray-200 text-lg mb-4">অনুশীলন শুরু করুন · Start Practicing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAM_SECTIONS.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className={`card-surface p-6 flex flex-col gap-3 hover:scale-[1.02] transition-all border ${s.color}`}
          >
            <div className="text-3xl">{s.icon}</div>
            <div>
              <p className="text-lg font-bold text-amber-400">{s.title_lt}</p>
              <p className="text-gray-200 font-semibold">{s.title_en}</p>
              <p className="text-emerald-400 font-bengali text-sm">{s.title_bn}</p>
            </div>
            <p className="text-gray-400 text-sm font-bengali leading-relaxed flex-1">{s.desc_bn}</p>
            <div className="flex items-center gap-1 text-current text-sm font-medium">
              অনুশীলন করুন <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
