import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Bell } from "lucide-react";
import { InfoPageShell, ContentCard } from "@/components/ui/InfoPageShell";

export const metadata: Metadata = {
  title: "Blog",
  description: "KalbaLab blog — guides, exam tips, and stories from the international Lithuanian-learning community.",
};

const PLANNED_POSTS = [
  {
    title: "Complete A1 exam guide: what to expect on test day",
    excerpt: "Walk through every section of the integration exam — what the examiner is looking for, common traps, and how to budget your time.",
    tag: "Exam prep",
  },
  {
    title: "10 Lithuanian sounds that don't exist in your language",
    excerpt: "Why š, ž, ė, ą, ų, č, and the long/short vowel distinction trip up most learners — and the trick that fixes each one.",
    tag: "Pronunciation",
  },
  {
    title: "How to use your daily commute to learn 200 words a month",
    excerpt: "A spaced-repetition routine that fits in 15 minutes a day. Tested with the KalbaLab community in Vilnius and Kaunas.",
    tag: "Study habits",
  },
  {
    title: "Lithuanian noun gender: a survival guide",
    excerpt: "Most -as, -is, -ys nouns are masculine. Most -a, -ė nouns are feminine. The exceptions you actually need to memorise.",
    tag: "Grammar",
  },
  {
    title: "Cultural shortcuts: 20 phrases Lithuanians actually use",
    excerpt: "Beyond Labas and Ačiū — the everyday phrases that make you sound like you live here, not like you swallowed a textbook.",
    tag: "Conversation",
  },
];

export default function BlogPage() {
  return (
    <InfoPageShell
      eyebrow="Blog"
      title="Articles & study guides"
      lead="Practical guides for learning Lithuanian and passing the A1 exam — written for the international community living in Lithuania."
    >
      {/* Coming soon banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-transparent p-6 sm:p-8 mb-10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-1">First posts dropping soon</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We&apos;re writing the first batch right now. Want to be notified when articles go live?
              Subscribe to the newsletter at the bottom of this page — no spam, just the post.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-gray-100 mb-4 flex items-center gap-2">
        <BookOpen size={18} className="text-amber-400" /> What&apos;s coming
      </h2>

      <div className="space-y-3 anim-stagger mb-10">
        {PLANNED_POSTS.map((p) => (
          <ContentCard key={p.title} className="!p-5 sm:!p-6 hover:border-amber-500/30 transition-all">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="inline-flex text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                {p.tag}
              </span>
              <span className="text-xs text-gray-500 italic">Coming soon</span>
            </div>
            <h3 className="font-bold text-gray-100 text-base sm:text-lg mb-1.5">{p.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{p.excerpt}</p>
          </ContentCard>
        ))}
      </div>

      <ContentCard className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-3">
          <Bell size={20} />
        </div>
        <h3 className="font-bold text-gray-100 mb-1">Want article suggestions?</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md mx-auto">
          What would help you most? Tell us what to write next and we&apos;ll prioritise it.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-amber-500/30 hover:bg-white/[0.06] text-amber-300 font-semibold text-sm transition-all"
        >
          Suggest a topic <ArrowRight size={14} />
        </Link>
      </ContentCard>
    </InfoPageShell>
  );
}
