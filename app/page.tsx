import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";

const SAMPLE_PHRASES = [
  { lt: "Labas!", en: "Hello!", bn: "হ্যালো!" },
  { lt: "Ačiū labai!", en: "Thank you very much!", bn: "অনেক ধন্যবাদ!" },
  { lt: "Kur yra stotis?", en: "Where is the station?", bn: "স্টেশন কোথায়?" },
  { lt: "Aš esu iš Bangladešo.", en: "I am from Bangladesh.", bn: "আমি বাংলাদেশ থেকে।" },
];

const FEATURES = [
  { icon: "🔊", title_en: "Audio on Everything", title_bn: "সব কিছুতে অডিও", desc_bn: "প্রতিটি শব্দ ও বাক্যে স্পিকার বাটন — লিথুয়ানিয়ান উচ্চারণ শুনুন" },
  { icon: "🇧🇩", title_en: "Bengali Explanations", title_bn: "বাংলায় ব্যাখ্যা", desc_bn: "সব ব্যাকরণ, শব্দ ও ব্যাখ্যা বাংলায় — মাতৃভাষায় শিখুন" },
  { icon: "🎓", title_en: "A1 Exam Prep", title_bn: "A1 পরীক্ষার প্রস্তুতি", desc_bn: "লিথুয়ানিয়ার আবাসিক পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি কোর্স" },
  { icon: "📚", title_en: "500+ Vocabulary", title_bn: "৫০০+ শব্দভাণ্ডার", desc_bn: "A1 স্তরের সমস্ত গুরুত্বপূর্ণ শব্দ অডিও ও বাংলা অর্থসহ" },
  { icon: "💬", title_en: "Real Dialogues", title_bn: "বাস্তব কথোপকথন", desc_bn: "দোকানে, হাসপাতালে, রাস্তায় — বাস্তব পরিস্থিতির কথোপকথন" },
  { icon: "📊", title_en: "Progress Tracking", title_bn: "অগ্রগতি ট্র্যাকিং", desc_bn: "স্পেসড রিপিটিশন + XP সিস্টেম + ধারাবাহিক স্ট্রিক" },
];

const EXAM_SECTIONS = [
  { key: "Skaitymas", en: "Reading", bn: "পড়া", desc_bn: "ছোট টেক্সট, বিজ্ঞপ্তি, ফর্ম পড়ে বুঝতে পারা" },
  { key: "Rašymas", en: "Writing", bn: "লেখা", desc_bn: "ফর্ম পূরণ ও ৫০-৮০ শব্দের বার্তা লেখা" },
  { key: "Klausymas", en: "Listening", bn: "শোনা", desc_bn: "সংলাপ ও ঘোষণা শুনে প্রশ্নের উত্তর দেওয়া" },
  { key: "Kalbėjimas", en: "Speaking", bn: "বলা", desc_bn: "পরীক্ষকের সাথে মৌখিক সাক্ষাৎকার" },
];

const TESTIMONIALS = [
  { name: "শাহজালাল রহমান", city: "Vilnius", text: "লিথুয়ানিয়ানBD ছাড়া A1 পরীক্ষা পাস করা সম্ভব হতো না। বাংলায় ব্যাখ্যা সবকিছু সহজ করে দিয়েছে।", rating: 5 },
  { name: "আরমান", city: "Kaunas", text: "অডিও বাটন দারুণ কাজের — উচ্চারণ শুনে শুনে শিখেছি। এখন দোকানে একা কথা বলতে পারি!", rating: 5 },
  { name: "হামিদ", city: "Klaipėda", text: "ফ্ল্যাশকার্ড সিস্টেম অসাধারণ। মেট্রোতে যেতে যেতে শব্দ শিখি। দারুণ অ্যাপ!", rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm mb-6">
            🇱🇹 🇧🇩 বাংলাদেশিদের জন্য লিথুয়ানিয়ান ভাষা শিক্ষা
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="text-amber-400">লিথুয়ানিয়ান শিখুন</span>
            <br />
            <span className="text-gray-200">সহজে, বাংলায়</span>
          </h1>
          <p className="text-xl md:text-2xl text-emerald-400 font-bengali mb-2">
            প্রতিটি শব্দ — বাংলা অর্থসহ, অডিওসহ
          </p>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Learn Lithuanian with Bengali explanations, native audio on every word, and complete A1 exam preparation — built specifically for Bangladeshis in Lithuania.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              <span className="font-bengali">শুরু করুন</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/vocabulary"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[var(--border)] hover:border-amber-500/30 text-gray-300 font-semibold text-lg transition-all hover:bg-white/5"
            >
              Demo দেখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {SAMPLE_PHRASES.map((phrase) => (
              <div key={phrase.lt} className="card-surface p-3 text-left flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="lt-text font-bold text-base">{phrase.lt}</span>
                  <AudioButton text={phrase.lt} size="sm" />
                </div>
                <span className="en-text text-sm">{phrase.en}</span>
                <span className="bn-text font-bengali text-sm">{phrase.bn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              কেন <span className="text-amber-400">LithuanianBD</span>?
            </h2>
            <p className="text-gray-400">Why choose LithuanianBD?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title_en} className="card-surface p-5 hover:border-amber-500/20 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-100 mb-1">{f.title_en}</h3>
                <p className="text-emerald-400 font-bengali text-sm mb-2">{f.title_bn}</p>
                <p className="text-gray-400 text-sm font-bengali leading-relaxed">{f.desc_bn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO FLASHCARD */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">একটি ফ্ল্যাশকার্ড দেখুন</h2>
          <p className="text-gray-400 text-sm mb-8">Try a sample flashcard — no login required</p>

          <div className="card-surface p-8 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl font-bold text-amber-400">vanduo</span>
              <AudioButton text="vanduo" size="lg" showSlow />
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-xs mb-4">
              noun · masc.
            </div>
            <div className="border-t border-[var(--border)] pt-4 space-y-2">
              <p className="text-gray-200 text-lg font-medium">water</p>
              <p className="bn-text font-bengali text-xl">পানি</p>
              <div className="mt-4 p-3 rounded-lg bg-[var(--background)] text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 text-sm font-medium">Prašau vandens.</span>
                  <AudioButton text="Prašau vandens." size="sm" />
                </div>
                <p className="text-gray-400 text-xs">Water, please.</p>
                <p className="bn-text font-bengali text-xs mt-0.5">একটু পানি দিন, দয়া করে।</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/flashcards" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              সব ফ্ল্যাশকার্ড দেখুন <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* A1 EXAM */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">🎓 A1 পরীক্ষার প্রস্তুতি</h2>
            <p className="text-gray-400 mb-1">A1 Lithuanian Language Exam (Integration Test)</p>
            <div className="inline-flex items-center gap-4 mt-3">
              <span className="text-sm text-gray-400">ফি: <span className="text-amber-400 font-bold">€52</span> (2026)</span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">পাস: <span className="text-emerald-400 font-bold">50%</span> সামগ্রিক</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {EXAM_SECTIONS.map((s) => (
              <div key={s.key} className="card-surface p-5 text-center hover:border-emerald-500/20 transition-all">
                <div className="text-xl font-bold text-amber-400 mb-1">{s.key}</div>
                <div className="text-gray-200 font-semibold mb-1">{s.en}</div>
                <div className="text-emerald-400 font-bengali text-sm mb-2">{s.bn}</div>
                <p className="text-gray-500 text-xs font-bengali leading-relaxed">{s.desc_bn}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/exam-prep"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold transition-all"
            >
              পরীক্ষার প্রস্তুতি শুরু করুন <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-8">বাংলাদেশি কমিউনিটির মতামত</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-surface p-5">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 font-bengali text-sm leading-relaxed mb-3">"{t.text}"</p>
                <div>
                  <p className="text-amber-400 font-semibold text-sm font-bengali">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.city}, Lithuania</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-3">আজই শুরু করুন — বিনামূল্যে</h2>
          <p className="text-gray-400 mb-8">Start learning Lithuanian today — it&apos;s completely free</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xl transition-all hover:scale-105 shadow-xl shadow-amber-500/20"
          >
            <span className="font-bengali">শুরু করুন</span>
            <ArrowRight size={22} />
          </Link>
          <p className="text-gray-600 text-sm mt-4">কোনো ক্রেডিট কার্ড লাগবে না · No credit card required</p>
        </div>
      </section>
    </div>
  );
}
