import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { grammarTopics } from "@/data/grammar";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return grammarTopics.map((t) => ({ topic: t.slug }));
}

export default async function GrammarTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = grammarTopics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const currentIndex = grammarTopics.indexOf(topic);
  const prev = grammarTopics[currentIndex - 1];
  const next = grammarTopics[currentIndex + 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/lessons" className="hover:text-gray-300">Lessons</Link>
        <span>/</span>
        <Link href="/lessons/a1/grammar" className="hover:text-gray-300">Grammar</Link>
        <span>/</span>
        <span className="text-gray-300">{topic.title_en}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">{topic.level}</span>
          <span className="text-xs text-gray-600">Grammar</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">{topic.title_en}</h1>
        <p className="text-amber-400 font-bold text-lg mb-0.5">{topic.title_lt}</p>
        <p className="text-emerald-400 font-bengali text-xl">{topic.title_bn}</p>
      </div>

      <div className="space-y-8">
        {/* Description */}
        <section>
          <p className="text-gray-300 leading-relaxed">{topic.description_en}</p>
        </section>

        {/* Bengali explanation */}
        <BengaliExplanation content={topic.explanation_bn} />

        {/* Tables */}
        {topic.tables.map((table, ti) => (
          <section key={ti}>
            <div className="card-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      {table.headers.map((h, hi) => (
                        <th
                          key={hi}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            h.includes("বাংলা") ? "text-emerald-400/70 font-bengali" : "text-gray-500"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-[var(--border)] hover:bg-white/[0.02]">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3">
                            {ci === 1 || (table.headers[ci]?.includes("Lithuanian")) ? (
                              <div className="flex items-center gap-2">
                                <span className="lt-text font-bold">{cell}</span>
                                <AudioButton text={cell} size="sm" />
                              </div>
                            ) : cell.match(/[ঀ-৿]/) ? (
                              <span className="bn-text font-bengali">{cell}</span>
                            ) : (
                              <span className="text-gray-300">{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))}

        {/* Examples */}
        <section>
          <h2 className="text-lg font-bold text-gray-200 mb-4">উদাহরণ · Examples</h2>
          <div className="space-y-3">
            {topic.examples.map((ex, i) => (
              <div key={i} className="card-surface p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="lt-text font-bold">{ex.lt}</span>
                  <AudioButton text={ex.lt} size="sm" showSlow />
                </div>
                <p className="en-text text-sm">{ex.en}</p>
                <p className="bn-text font-bengali text-sm mt-0.5">{ex.bn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-lg font-bold text-gray-200 mb-4">💡 বাংলায় টিপস · Tips in Bengali</h2>
          <div className="space-y-2">
            {topic.tips_bn.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20">
                <p className="bn-text font-bengali text-sm text-amber-200">{tip}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
        {prev ? (
          <Link href={`/lessons/a1/grammar/${prev.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors text-sm">
            <ArrowLeft size={16} /> {prev.title_en}
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/lessons/a1/grammar/${next.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors text-sm">
            {next.title_en} <ArrowRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
