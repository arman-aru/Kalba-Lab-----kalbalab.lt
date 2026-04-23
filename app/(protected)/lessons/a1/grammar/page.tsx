import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { grammarTopics } from "@/data/grammar";

export default function GrammarHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Lessons / A1 / Grammar</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Grammar <span className="text-amber-400 font-bengali text-xl">· ব্যাকরণ</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Essential A1 grammar with Bengali explanations — সহজ বাংলায় লিথুয়ানিয়ান ব্যাকরণ</p>
      </div>

      <div className="space-y-3">
        {grammarTopics.map((topic, i) => (
          <Link
            key={topic.slug}
            href={`/lessons/a1/grammar/${topic.slug}`}
            className="card-surface p-5 flex items-start gap-4 hover:border-amber-500/20 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-gray-100">{topic.title_en}</h3>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400">{topic.level}</span>
              </div>
              <p className="text-amber-400 text-sm font-bold mb-0.5">{topic.title_lt}</p>
              <p className="text-emerald-400 font-bengali text-sm mb-1">{topic.title_bn}</p>
              <p className="text-gray-400 text-sm font-bengali leading-relaxed">{topic.description_bn}</p>
            </div>
            <ArrowRight size={16} className="text-gray-600 group-hover:text-amber-400 flex-shrink-0 mt-1 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
