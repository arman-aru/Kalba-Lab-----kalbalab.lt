import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { dialoguesData } from "@/data/dialogues";

export default function DialoguesHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Lessons / A1 / Dialogues</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Dialogues <span className="text-amber-400 font-bengali text-xl">· কথোপকথন</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Real-life Lithuanian conversations with Bengali translations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dialoguesData.map((d, i) => (
          <Link
            key={d.slug}
            href={`/lessons/a1/dialogues/${d.slug}`}
            className="card-surface p-5 hover:border-amber-500/20 transition-all group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} className="text-cyan-400" />
              </div>
              <div>
                <span className="text-xs text-gray-600">Dialogue {i + 1}</span>
                <h3 className="font-bold text-gray-100">{d.title_en}</h3>
                <p className="text-amber-400 text-sm font-bold">{d.title_lt}</p>
                <p className="text-emerald-400 font-bengali text-sm">{d.title_bn}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-bengali mb-3">{d.scenario_bn}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{d.lines.length} lines</span>
              <span className="flex items-center gap-1 text-amber-400 text-sm group-hover:gap-2 transition-all">
                Start <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
