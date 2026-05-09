"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquare, FileText, GraduationCap, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey, UILanguage } from "@/lib/i18n";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

type Multi = Partial<Record<UILanguage, string>> & { en: string };

const LESSON_SECTIONS: { icon: typeof BookOpen; titleKey: TranslationKey; lt: string; desc: Multi; sublessons: Multi[]; href: string; color: string }[] = [
  {
    icon: Star,
    titleKey: "fundamentals",
    lt: "Pagrindai",
    desc: { en: "Alphabet, numbers, days and months", bn: "বর্ণমালা, সংখ্যা, দিন-মাস শিখুন", az: "Əlifba, rəqəmlər, günlər və aylar", hi: "वर्णमाला, संख्याएँ, दिन और महीने", ky: "Алфавит, сандар, күндөр жана айлар", tg: "Алифбо, рақамҳо, рӯзҳо ва моҳҳо", uz: "Alifbo, raqamlar, kunlar va oylar" },
    sublessons: [
      { en: "Alphabet & Pronunciation", bn: "বর্ণমালা ও উচ্চারণ",  az: "Əlifba və tələffüz",  hi: "वर्णमाला और उच्चारण",   ky: "Алфавит жана айтылыш",   tg: "Алифбо ва талаффуз",  uz: "Alifbo va talaffuz" },
      { en: "Numbers 0–100",            bn: "সংখ্যা ০–১০০",       az: "Rəqəmlər 0–100",      hi: "संख्याएँ 0–100",         ky: "Сандар 0–100",          tg: "Рақамҳо 0–100",       uz: "Raqamlar 0–100" },
      { en: "Days & Months",            bn: "দিন ও মাস",          az: "Günlər və aylar",     hi: "दिन और महीने",          ky: "Күндөр жана айлар",     tg: "Рӯзҳо ва моҳҳо",      uz: "Kunlar va oylar" },
      { en: "Colors",                   bn: "রং",                 az: "Rənglər",             hi: "रंग",                  ky: "Түстөр",                tg: "Рангҳо",              uz: "Ranglar" },
    ],
    href: "/lessons/a1/fundamentals",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: FileText,
    titleKey: "grammar",
    lt: "Gramatika",
    desc: { en: "Verbs, nouns and case endings", bn: "ক্রিয়া, বিশেষ্য, বিভক্তি শিখুন", az: "Fellər, isimlər və hal şəkilçiləri", hi: "क्रिया, संज्ञा और कारक", ky: "Этиштер, зат атоочтор жана жөндөмөлөр", tg: "Феълҳо, исмҳо ва бандакҳо", uz: "Feʼllar, otlar va kelishiklar" },
    sublessons: [
      { en: "Verb 'Būti' (To be)", bn: "ক্রিয়া 'Būti' (থাকা)",   az: "'Olmaq' feli (Būti)",   hi: "क्रिया 'होना' (Būti)",     ky: "'Болуу' этиши (Būti)",   tg: "Феъли 'Будан' (Būti)",   uz: "'Boʻlmoq' feʼli (Būti)" },
      { en: "Present Tense",       bn: "বর্তমান কাল",            az: "İndiki zaman",          hi: "वर्तमान काल",              ky: "Учур чак",                tg: "Замони ҳозира",          uz: "Hozirgi zamon" },
      { en: "Noun Gender",         bn: "বিশেষ্যের লিঙ্গ",        az: "İsmin cinsi",           hi: "संज्ञा का लिंग",            ky: "Зат атоочтун жыныш",     tg: "Ҷинси исм",              uz: "Otning jinsi" },
      { en: "Question Words",      bn: "প্রশ্নবোধক শব্দ",         az: "Sual sözləri",          hi: "प्रश्नवाचक शब्द",           ky: "Суроо сөздөрү",          tg: "Калимаҳои саволӣ",       uz: "Soʻroq soʻzlari" },
    ],
    href: "/lessons/a1/grammar",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: MessageSquare,
    titleKey: "dialogues",
    lt: "Dialogai",
    desc: { en: "Speak in real-life situations", bn: "বাস্তব পরিস্থিতিতে কথা বলুন", az: "Real həyat vəziyyətlərində danışın", hi: "वास्तविक स्थितियों में बातचीत करें", ky: "Реалдуу кырдаалдарда сүйлөңүз", tg: "Дар вазъиятҳои воқеӣ сӯҳбат кунед", uz: "Hayotiy vaziyatlarda gaplashing" },
    sublessons: [
      { en: "First Meeting",       bn: "প্রথম সাক্ষাৎ",          az: "İlk görüş",             hi: "पहली मुलाकात",             ky: "Биринчи жолугушуу",      tg: "Мулоқоти аввал",         uz: "Birinchi uchrashuv" },
      { en: "At the Shop",         bn: "দোকানে",                 az: "Mağazada",              hi: "दुकान पर",                 ky: "Дүкөндө",                tg: "Дар дӯкон",              uz: "Doʻkonda" },
      { en: "At the Doctor",       bn: "ডাক্তারের কাছে",         az: "Həkimdə",               hi: "डॉक्टर के पास",            ky: "Дарыгерде",              tg: "Дар назди табиб",        uz: "Shifokorda" },
      { en: "Asking Directions",   bn: "দিকনির্দেশ চাওয়া",      az: "Yol soruşmaq",          hi: "रास्ता पूछना",             ky: "Жол сурап билүү",        tg: "Пурсиши роҳ",             uz: "Yoʻl soʻrash" },
    ],
    href: "/lessons/a1/dialogues",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: BookOpen,
    titleKey: "reading",
    lt: "Skaitymas",
    desc: { en: "Practice understanding Lithuanian texts", bn: "লিথুয়ানিয়ান টেক্সট বোঝার অভ্যাস", az: "Litva mətnlərini başa düşməyi məşq edin", hi: "लिथुआनियाई पाठ समझने का अभ्यास", ky: "Литва текстерин түшүнүүнү машыктырыңыз", tg: "Машқи фаҳмиши матнҳои литвагӣ", uz: "Litva matnlarini tushunish mashqi" },
    sublessons: [
      { en: "My Family",           bn: "আমার পরিবার",            az: "Mənim ailəm",           hi: "मेरा परिवार",              ky: "Менин үй-бүлөм",         tg: "Оилаи ман",              uz: "Mening oilam" },
      { en: "My City",             bn: "আমার শহর",                az: "Mənim şəhərim",         hi: "मेरा शहर",                 ky: "Менин шаарым",           tg: "Шаҳри ман",              uz: "Mening shahrim" },
      { en: "A Working Day",       bn: "কর্মব্যস্ত দিন",         az: "Bir iş günü",           hi: "कार्य दिवस",              ky: "Жумушчу күн",             tg: "Як рӯзи корӣ",           uz: "Ish kuni" },
      { en: "Lithuanian Nature",   bn: "লিথুয়ানিয়ার প্রকৃতি",   az: "Litva təbiəti",          hi: "लिथुआनियाई प्रकृति",       ky: "Литваның жаратылышы",   tg: "Табиати Литва",          uz: "Litva tabiati" },
    ],
    href: "/lessons/a1/reading",
    color: "text-green-400 bg-green-500/10 border-green-500/20",
  },
  {
    icon: GraduationCap,
    titleKey: "examPrep",
    lt: "Egzaminų paruošimas",
    desc: { en: "Complete A1 exam preparation", bn: "A1 পরীক্ষার সম্পূর্ণ প্রস্তুতি", az: "Tam A1 imtahan hazırlığı", hi: "पूर्ण A1 परीक्षा की तैयारी", ky: "Толук A1 сынак даярдыгы", tg: "Омодагии пурраи имтиҳони A1", uz: "Toʻliq A1 imtihon tayyorgarligi" },
    sublessons: [
      { en: "Listening Practice",  bn: "শোনার অনুশীলন",          az: "Dinləmə təcrübəsi",     hi: "श्रवण अभ्यास",            ky: "Угуу машыгуусу",         tg: "Машқи гӯш кардан",       uz: "Tinglash mashqi" },
      { en: "Reading Practice",    bn: "পড়ার অনুশীলন",            az: "Oxu təcrübəsi",         hi: "पठन अभ्यास",              ky: "Окуу машыгуусу",         tg: "Машқи хониш",            uz: "Oʻqish mashqi" },
      { en: "Writing Practice",    bn: "লেখার অনুশীলন",          az: "Yazı təcrübəsi",        hi: "लेखन अभ्यास",             ky: "Жазуу машыгуусу",        tg: "Машқи навиштан",         uz: "Yozish mashqi" },
      { en: "Mock Exam",           bn: "মক পরীক্ষা",              az: "Sınaq imtahanı",        hi: "मॉक परीक्षा",            ky: "Мок сынак",              tg: "Имтиҳони омӯзишӣ",       uz: "Sinov imtihoni" },
    ],
    href: "/exam-prep",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

export default function LessonsPage() {
  const { t, lang } = useTranslation();
  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-300/80 text-xs mb-4">
            🎯 A1 — {t("examTitleFull")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("lessonsTitle")}</h1>
          <p className="text-gray-400 text-sm sm:text-base">{t("lessonsSub")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 anim-stagger">
          {LESSON_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-amber-500/30 hover:bg-white/[0.06] transition-all hover:-translate-y-0.5"
            >
              <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-50 group-hover:opacity-90 transition-opacity ${section.color.split(' ').filter(c => c.startsWith('bg-')).join(' ')}`} />
              <div className="relative flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform group-hover:scale-110 ${section.color}`}>
                  <section.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-100 text-lg mb-0.5">{t(section.titleKey)}</h3>
                  <p className="text-amber-400 font-bold text-sm mb-2">{section.lt}</p>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">{section.desc[lang] ?? section.desc.en}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {section.sublessons.map((l) => (
                      <span key={l.en} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400">{l[lang] ?? l.en}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-1 text-amber-400 text-sm font-semibold group-hover:gap-2 transition-all mt-2">
                {t("startLesson")} <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
