"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { grammarTopics } from "@/data/grammar";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ topic: string }>;
}

const BENGALI_RE = /[ঀ-৿]/;

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-24 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function GrammarTopicPage({ params }: Props) {
  const { topic: slug } = use(params);
  const topic = grammarTopics.find((tt) => tt.slug === slug);
  if (!topic) notFound();

  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";

  // Collect translatable English source strings for non-en/non-bn languages.
  const translatable = useMemo(() => {
    if (isEn || isBn || !topic) return [];
    const set = new Set<string>();
    set.add(topic.description_en);
    topic.examples.forEach((ex) => set.add(ex.en));
    return Array.from(set);
  }, [isEn, isBn, topic]);
  const translated = useNativeTranslations(translatable, lang);

  // We only have Bengali for `explanation_bn` and `tips_bn` — for non-bn
  // users we translate the description as a fallback explanation, and skip tips.
  const explanationEnFallback = topic!.description_en;

  const currentIndex = grammarTopics.indexOf(topic!);
  const prev = grammarTopics[currentIndex - 1];
  const next = grammarTopics[currentIndex + 1];

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 anim-fade-up">
          <Link href="/lessons" className="hover:text-amber-300">{t("lessons")}</Link>
          <span>/</span>
          <Link href="/lessons/a1/grammar" className="hover:text-amber-300">{t("grammar")}</Link>
          <span>/</span>
          <span className="text-gray-300">{topic!.title_en}</span>
        </div>

        <div className="mb-8 anim-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300">{topic!.level}</span>
            <span className="text-xs text-gray-500">{t("grammar")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-2">{topic!.title_en}</h1>
          <p className="text-amber-400 font-bold text-lg mb-1">{topic!.title_lt}</p>
          {isBn && <p className="text-emerald-400 font-bengali text-xl">{topic!.title_bn}</p>}
        </div>

        <div className="space-y-8">
          <section>
            <p className="text-gray-300 leading-relaxed">{topic!.description_en}</p>
            {!isEn && !isBn && (
              <p className="text-gray-400 leading-relaxed mt-2 text-sm">
                <NativeText value={translated.get(topic!.description_en)} />
              </p>
            )}
          </section>

          {/* Native explanation: Bengali users get the curated explanation_bn;
              other languages see the description as a translated explanation. */}
          {isBn ? (
            <BengaliExplanation content={topic!.explanation_bn} />
          ) : !isEn ? (
            <BengaliExplanation
              content={translated.get(explanationEnFallback) ?? ""}
              englishContent={explanationEnFallback}
            />
          ) : null}

          {topic!.tables.map((table, ti) => {
            // Filter columns: Bengali columns only show for bn users.
            const visibleColIdx = table.headers
              .map((h, i) => ({ h, i }))
              .filter(({ h }) => isBn || !h.includes("বাংলা"));
            return (
              <section key={ti}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                          {visibleColIdx.map(({ h, i }) => (
                            <th
                              key={i}
                              className={cn(
                                "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                                h.includes("বাংলা") ? "text-emerald-400/70 font-bengali" : "text-gray-500"
                              )}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02]">
                            {visibleColIdx.map(({ h, i }) => {
                              const cell = row[i] ?? "";
                              const isLT = h.includes("Lithuanian") || h.toLowerCase().includes("lit") || /^[A-Za-zĀ-žąčęėįšųūž\s'!?.-]+$/.test(cell.trim()) && i === 1;
                              if (h.includes("Lithuanian") || (i === 1 && cell.length < 30 && !BENGALI_RE.test(cell))) {
                                return (
                                  <td key={i} className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="lt-text font-bold">{cell}</span>
                                      <AudioButton text={cell} size="sm" />
                                    </div>
                                  </td>
                                );
                              }
                              if (BENGALI_RE.test(cell)) {
                                return (
                                  <td key={i} className="px-4 py-3">
                                    <span className="bn-text font-bengali">{cell}</span>
                                  </td>
                                );
                              }
                              return (
                                <td key={i} className="px-4 py-3">
                                  <span className="text-gray-300">{cell}</span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            );
          })}

          <section>
            <h2 className="text-lg font-bold text-gray-100 mb-4">{t("example")} · Examples</h2>
            <div className="space-y-3 anim-stagger">
              {topic!.examples.map((ex, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="lt-text font-bold text-amber-400">{ex.lt}</span>
                    <AudioButton text={ex.lt} size="sm" showSlow />
                  </div>
                  <p className="en-text text-sm text-gray-300">{ex.en}</p>
                  {isBn ? (
                    <p className="bn-text font-bengali text-sm mt-0.5">{ex.bn}</p>
                  ) : !isEn ? (
                    <p className="text-sm text-emerald-300/80 mt-0.5">
                      <NativeText value={translated.get(ex.en)} />
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Tips are only available curated in Bengali — show only for bn users. */}
          {isBn && topic!.tips_bn.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-100 mb-4">💡 টিপস</h2>
              <div className="space-y-2">
                {topic!.tips_bn.map((tip, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                    <p className="bn-text font-bengali text-sm text-amber-200">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
          {prev ? (
            <Link href={`/lessons/a1/grammar/${prev.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-amber-300 transition-colors text-sm">
              <ArrowLeft size={16} /> {prev.title_en}
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/lessons/a1/grammar/${next.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-amber-300 transition-colors text-sm">
              {next.title_en} <ArrowRight size={16} />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
