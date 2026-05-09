"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InfoPageShell } from "@/components/ui/InfoPageShell";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is KalbaLab really free?",
    a: <>Yes — KalbaLab is free to use, with no ads. We rely on optional <a href="https://www.buymeacoffee.com/kalbalab" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-medium">Buy Me a Coffee</a> donations to keep the servers running.</>,
  },
  {
    q: "What is the A1 Lithuanian exam?",
    a: <>The A1 Lithuanian Language Integration Test is required by most foreigners renewing their Lithuanian residence permit. Fee is around <strong>€52</strong> (2026), and you need <strong>50% overall</strong> with a minimum of 25% in each section to pass. KalbaLab covers all four sections: reading, writing, listening, and speaking.</>,
  },
  {
    q: "Which languages do you support?",
    a: <>The interface is available in <strong>7 languages</strong>: English, Bengali (বাংলা), Azerbaijani (Azərbaycanca), Hindi (हिन्दी), Kyrgyz (Кыргызча), Tajik (Тоҷикӣ), and Uzbek (Oʻzbekcha). You can switch any time from the language picker in the header.</>,
  },
  {
    q: "How is the audio so accurate?",
    a: <>We use server-side text-to-speech with native Lithuanian voices instead of relying on whatever your browser has installed. That way you hear correct pronunciation of letters like <em>š</em>, <em>ž</em>, <em>ė</em>, <em>ą</em>, and <em>ų</em> regardless of your device.</>,
  },
  {
    q: "Do I need an account?",
    a: <>You can browse vocabulary, flashcards, and lessons without signing in. An account is only needed to save progress, track your streak, and earn XP. Sign up takes 30 seconds — name, email, password — or use your Google account.</>,
  },
  {
    q: "When will A2 and B1 levels be available?",
    a: <>We&apos;re focusing on making A1 perfect first since that&apos;s what most learners need for residency. A2 and B1 are on the roadmap and you&apos;ll see them light up automatically once content is ready.</>,
  },
  {
    q: "Is my data safe?",
    a: <>We only store what we need: your name, email, and learning progress. We don&apos;t sell or share data with third parties. See our <a href="/privacy" className="text-amber-400 hover:text-amber-300 font-medium">Privacy Policy</a> for the full breakdown.</>,
  },
  {
    q: "Can I contribute translations or report a mistake?",
    a: <>Yes! We&apos;d love that. Email us at <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300 font-medium">armansalekofficial@gmail.com</a> with the word, lesson, or feature you&apos;d like to improve.</>,
  },
  {
    q: "Does it work on mobile?",
    a: <>Yes — KalbaLab is fully responsive on phones and tablets. There&apos;s no app to install; just bookmark the site or add it to your home screen.</>,
  },
  {
    q: "I&apos;m stuck — how do I get help?",
    a: <>Reach out via the <a href="/contact" className="text-amber-400 hover:text-amber-300 font-medium">contact page</a> or email <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300 font-medium">armansalekofficial@gmail.com</a>. We try to respond within 1–2 days.</>,
  },
];

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-colors hover:border-amber-500/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-100 text-sm sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-amber-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5 text-gray-300 text-sm leading-relaxed">{a}</div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <InfoPageShell
      eyebrow="FAQ"
      title="Frequently asked questions"
      lead="Everything you might want to know about KalbaLab, the A1 Lithuanian exam, and how we work. Can&apos;t find your answer? Email us."
    >
      <div className="space-y-3 anim-stagger">
        {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
      </div>
    </InfoPageShell>
  );
}
