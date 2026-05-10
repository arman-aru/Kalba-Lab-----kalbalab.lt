"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey, UILanguage } from "@/lib/i18n";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

type Multi = Partial<Record<UILanguage, string>> & { en: string };

const EXAM_SECTIONS: { id: string; icon: string; lt: string; titleKey: TranslationKey; desc: Multi; href: string; color: string }[] = [
  { id: "listening",  icon: "🎧", lt: "Klausymas",            titleKey: "listening", desc: { en: "Listen to recorded announcements and dialogues, then answer questions.", bn: "রেকর্ড করা ঘোষণা ও সংলাপ শুনে প্রশ্নের উত্তর দিন", az: "Səs yazılı elan və dialoqları dinləyib suallara cavab verin.", hi: "रिकॉर्ड की गई घोषणाएँ और संवाद सुनें और प्रश्नों के उत्तर दें।", ky: "Жазылган жарыяларды жана диалогдорду угуп, суроолорго жооп бериңиз.", tg: "Эълонҳо ва муколамаҳои сабтшударо гӯш карда, ҷавоб диҳед.", uz: "Yozib olingan eʼlonlar va dialoglarni tinglab, savollarga javob bering." }, href: "/exam-prep/listening", color: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
  { id: "reading",    icon: "📖", lt: "Skaitymas",            titleKey: "reading",   desc: { en: "Read signs, menus, schedules and short messages, then answer questions.", bn: "সাইন, মেনু, সময়সূচি ও ছোট বার্তা পড়ে প্রশ্নের উত্তর দিন", az: "Lövhələr, menyular, cədvəllər və qısa mesajları oxuyub suallara cavab verin.", hi: "साइन, मेनू, समय-सारणी और लघु संदेश पढ़ें।", ky: "Белгилерди, менюларды, графиктерди жана кыска билдирүүлөрдү окуңуз.", tg: "Аломатҳо, меню, ҷадвалҳо ва паёмҳои кӯтоҳро хонед.", uz: "Belgilar, menyular, jadval va qisqa xabarlarni oʻqing." }, href: "/exam-prep/reading", color: "text-green-400 border-green-500/20 bg-green-500/10" },
  { id: "writing",    icon: "✍️", lt: "Rašymas",              titleKey: "writing",   desc: { en: "Fill out forms and write 50–80 word messages.", bn: "ফর্ম পূরণ করুন এবং ৫০–৮০ শব্দের বার্তা লিখুন", az: "Formaları doldurun və 50–80 sözlük mesaj yazın.", hi: "फ़ॉर्म भरें और 50–80 शब्दों का संदेश लिखें।", ky: "Формаларды толтуруп, 50–80 сөздүк билдирүү жазыңыз.", tg: "Шаклҳоро пур кунед ва паёми 50–80 калима нависед.", uz: "Shakllarni toʻldiring va 50–80 soʻzli xabar yozing." }, href: "/exam-prep/writing", color: "text-amber-400 border-amber-500/20 bg-amber-500/10" },
  { id: "speaking",   icon: "🎤", lt: "Kalbėjimas",           titleKey: "speaking",  desc: { en: "Practice the oral exam — record yourself.", bn: "মৌখিক পরীক্ষার অনুশীলন করুন — নিজেকে রেকর্ড করুন", az: "Şifahi imtahanı məşq edin — özünüzü səs yazın.", hi: "मौखिक परीक्षा का अभ्यास करें — स्वयं को रिकॉर्ड करें।", ky: "Оозеки сынакты машыктырыңыз — өзүңүздү жазыңыз.", tg: "Имтиҳони шифоҳиро машқ кунед — худро сабт кунед.", uz: "Ogʻzaki imtihonni mashq qiling — oʻzingizni yozib oling." }, href: "/exam-prep/speaking", color: "text-purple-400 border-purple-500/20 bg-purple-500/10" },
  { id: "mock",       icon: "📋", lt: "Bandomasis egzaminas", titleKey: "mockExam",  desc: { en: "Take a full timed mock exam, just like the real test.", bn: "আসল পরীক্ষার মতো সম্পূর্ণ অনুশীলন করুন সময়সীমাসহ", az: "Real test kimi tam vaxtlı sınaq imtahanı verin.", hi: "वास्तविक परीक्षा की तरह पूरा समयबद्ध मॉक परीक्षा दें।", ky: "Реалдуу сынак сыяктуу толук убакыт менен мок сынак тапшырыңыз.", tg: "Имтиҳони омӯзишии пурраи бо вақт диҳед.", uz: "Haqiqiy testdek toʻliq vaqt bilan sinov imtihonini topshiring." }, href: "/exam-prep/mock-exam", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
];

const EXAM_FACTS: { label: Multi; value: string; note: Multi }[] = [
  {
    value: "€52",
    label: { en: "Fee",      bn: "ফি",       az: "Ödəniş",  hi: "शुल्क",   ky: "Төлөм",   tg: "Пардохт", uz: "Toʻlov" },
    note:  { en: "(2026)",   bn: "(২০২৬)",  az: "(2026)",  hi: "(2026)",  ky: "(2026)",  tg: "(2026)",   uz: "(2026)" },
  },
  {
    value: "50%",
    label: { en: "Pass mark", bn: "উত্তীর্ণ", az: "Keçid balı", hi: "पास अंक", ky: "Өтүү упайы", tg: "Ҳадди гузар", uz: "Oʻtish bali" },
    note:  { en: "overall",   bn: "সামগ্রিক", az: "ümumi",      hi: "कुल",      ky: "жалпы",       tg: "умумӣ",       uz: "umumiy" },
  },
  {
    value: "25%",
    label: { en: "Pass mark", bn: "উত্তীর্ণ", az: "Keçid balı", hi: "पास अंक", ky: "Өтүү упайы", tg: "Ҳадди гузар", uz: "Oʻtish bali" },
    note:  { en: "min. per section", bn: "প্রতিটি অংশে ন্যূনতম", az: "hər bölmədə minimum", hi: "प्रत्येक अनुभाग में न्यूनतम", ky: "ар бир бөлүмдө минимум", tg: "ҳадди ақал дар ҳар бахш", uz: "har bir boʻlimda kamida" },
  },
  {
    value: "~2.5 h",
    label: { en: "Duration", bn: "সময়কাল", az: "Müddət", hi: "अवधि",  ky: "Узактык", tg: "Давомнокӣ", uz: "Davomiyligi" },
    note:  { en: "total",    bn: "মোট",     az: "ümumi",  hi: "कुल",    ky: "жалпы",   tg: "ҳамагӣ",     uz: "jami" },
  },
];

export default function ExamPrepPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-emerald-500/[0.04] to-transparent p-8 sm:p-12 mb-8 text-center anim-fade-up">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-4 animate-float">
              <GraduationCap size={26} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-100 mb-3 leading-tight">{t("examTitleFull")}</h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">{t("examSubLong")}</p>
          </div>
        </div>

        {/* Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 anim-stagger">
          {EXAM_FACTS.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 text-center hover:border-amber-500/30 hover:bg-white/[0.05] transition-all">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{f.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{f.note[lang] ?? f.note.en}</p>
              <p className="text-xs text-gray-300 mt-1.5 font-medium">{f.label[lang] ?? f.label.en}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <h2 className="font-extrabold text-gray-100 text-xl sm:text-2xl mb-4 anim-fade-up">{t("startSection")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 anim-stagger">
          {EXAM_SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className={`group relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-sm hover:-translate-y-0.5 transition-all border ${s.color}`}
            >
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-current opacity-[0.08] blur-2xl group-hover:opacity-[0.18] transition-opacity" />
              <div className="relative text-3xl group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
              <div className="relative">
                <p className="text-lg font-extrabold text-amber-400">{s.lt}</p>
                <p className="text-gray-100 font-semibold">{t(s.titleKey)}</p>
              </div>
              <p className="relative text-gray-400 text-sm leading-relaxed flex-1">{s.desc[lang] ?? s.desc.en}</p>
              <div className="relative flex items-center gap-1 text-current text-sm font-semibold group-hover:gap-2 transition-all">
                {t("startSection")} <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
