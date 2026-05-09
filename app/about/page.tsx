import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Globe2, Sparkles } from "lucide-react";
import { InfoPageShell, ContentCard } from "@/components/ui/InfoPageShell";

export const metadata: Metadata = {
  title: "About",
  description: "About KalbaLab — a free Lithuanian language learning platform built for international communities living in Lithuania.",
};

export default function AboutPage() {
  return (
    <InfoPageShell
      eyebrow="About"
      title="Built for the international community in Lithuania"
      lead="KalbaLab is a free, multilingual Lithuanian language learning platform designed for the thousands of immigrants, students, and workers who call Lithuania their new home."
    >
      <div className="space-y-6">
        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-3">Why we built this</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Lithuania is home to a fast-growing international community — people from Bangladesh, India,
            Uzbekistan, Tajikistan, Kyrgyzstan, Azerbaijan, and dozens of other countries. Almost all of
            them eventually need to pass the A1 Lithuanian language exam to renew their residency.
          </p>
          <p className="text-gray-300 leading-relaxed">
            But most learning resources teach Lithuanian <em>through English</em>. If English isn&apos;t your
            first language, you&apos;re translating twice — making an already hard language even harder.
            KalbaLab fixes that by giving you explanations in your <strong>own native language</strong>,
            with native audio on every word, and complete A1 exam preparation. Free to use.
          </p>
        </ContentCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ContentCard className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-3">
              <Heart size={22} />
            </div>
            <h3 className="font-bold text-gray-100 mb-1">Free to use</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Open access for the community — no paywall standing between you and learning.</p>
          </ContentCard>
          <ContentCard className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-3">
              <Globe2 size={22} />
            </div>
            <h3 className="font-bold text-gray-100 mb-1">Native explanations</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Learn in the language you think in — Bengali, Hindi, Uzbek, Tajik, Kyrgyz, Azerbaijani or English.</p>
          </ContentCard>
          <ContentCard className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 mb-3">
              <Sparkles size={22} />
            </div>
            <h3 className="font-bold text-gray-100 mb-1">A1 exam ready</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Every section practiced: listening, reading, writing, speaking + a full mock exam.</p>
          </ContentCard>
        </div>

        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-3">Who&apos;s behind it</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            KalbaLab was founded by <a href="https://www.facebook.com/arman.salek.88/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-medium">Arman</a>,
            a member of the Bangladeshi community in Lithuania, after watching friends struggle to find quality study materials in their native language.
            What started as a personal project for the Bangladeshi community has expanded to support seven languages,
            and we&apos;re continuing to add more as our community grows.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We&apos;re not a company. We&apos;re a small group of contributors and translators who believe the language test
            shouldn&apos;t be the thing standing between you and your future in Lithuania.
          </p>
        </ContentCard>

        <div className="text-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all hover:scale-[1.03] shadow-lg shadow-amber-500/25"
          >
            Get started — it&apos;s free <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </InfoPageShell>
  );
}
