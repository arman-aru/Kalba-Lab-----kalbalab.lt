"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InfoPageShell } from "@/components/ui/InfoPageShell";
import { FAQS, type FaqEntry } from "./faqData";

function FaqItem({ q, a }: { q: string; a: FaqEntry["a"] }) {
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
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5 text-gray-300 text-sm leading-relaxed">{a}</div>
        </div>
      </div>
    </div>
  );
}

export function FaqClient() {
  return (
    <InfoPageShell
      eyebrow="FAQ"
      title="Frequently asked questions"
      lead="Everything you might want to know about KalbaLab, the A1 Lithuanian exam, and how we work. Can't find your answer? Email us."
    >
      <div className="space-y-3 anim-stagger">
        {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </div>
    </InfoPageShell>
  );
}
