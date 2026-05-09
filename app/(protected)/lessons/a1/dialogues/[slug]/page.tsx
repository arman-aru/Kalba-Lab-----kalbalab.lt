"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Eye, EyeOff } from "lucide-react";
import { notFound } from "next/navigation";
import { dialoguesData } from "@/data/dialogues";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { speakLithuanian } from "@/lib/audio";
import { LANGUAGES } from "@/lib/i18n";

interface Props {
  params: Promise<{ slug: string }>;
}

const KEY_VOCAB = [
  { lt: "labas",  en: "hello",      bn: "হ্যালো" },
  { lt: "vardas", en: "name",       bn: "নাম" },
  { lt: "iš kur", en: "from where", bn: "কোথা থেকে" },
  { lt: "gyventi", en: "to live",   bn: "বাস করা" },
  { lt: "šeima", en: "family",      bn: "পরিবার" },
  { lt: "ačiū",  en: "thank you",   bn: "ধন্যবাদ" },
];

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-20 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function DialoguePage({ params }: Props) {
  const { slug } = use(params);
  const dialogue = dialoguesData.find((d) => d.slug === slug);
  if (!dialogue) notFound();

  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;
  const langName = LANGUAGES.find((l) => l.code === lang)?.nativeName ?? "";

  const [showEN, setShowEN] = useState(true);
  const [showOtherLang, setShowOtherLang] = useState(true);
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());

  // Collect translatable English source strings
  const translatable = useMemo(() => {
    if (!showOther || !dialogue) return [];
    const set = new Set<string>();
    set.add(dialogue.scenario_en);
    dialogue.lines.forEach((l) => set.add(l.english));
    KEY_VOCAB.forEach((w) => set.add(w.en));
    return Array.from(set);
  }, [showOther, dialogue]);
  const translated = useNativeTranslations(translatable, lang);

  const toggleLine = (id: string) => {
    setExpandedLines((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const playAll = () => {
    let i = 0;
    const playNext = async () => {
      if (i >= dialogue!.lines.length) return;
      try {
        await speakLithuanian(dialogue!.lines[i].lithuanian, 0.9);
      } catch { /* swallow */ }
      i++;
      setTimeout(playNext, 500);
    };
    playNext();
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Link href="/lessons/a1/dialogues" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-300 mb-6 transition-colors">
          <ArrowLeft size={14} /> {t("dialogues")}
        </Link>

        <div className="mb-6 anim-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300">{dialogue!.level}</span>
            <span className="text-xs text-gray-500">{t("dialogueWord")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-1">{dialogue!.title_en}</h1>
          <p className="text-amber-400 font-bold text-lg mb-1">{dialogue!.title_lt}</p>
          {isBn && <p className="text-emerald-400 font-bengali text-xl mb-3">{dialogue!.title_bn}</p>}
          <p className="text-gray-400 text-sm">{dialogue!.scenario_en}</p>
          {isBn && <p className="text-gray-400 text-sm font-bengali mt-1">{dialogue!.scenario_bn}</p>}
          {showOther && (
            <p className="text-gray-400 text-sm mt-1">
              <NativeText value={translated.get(dialogue!.scenario_en)} />
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10">
          <button
            onClick={playAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium transition-all"
          >
            <Play size={13} /> Play All
          </button>
          <button
            onClick={() => setShowEN(!showEN)}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all", showEN ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "border-white/10 text-gray-500")}
          >
            {showEN ? <Eye size={13} /> : <EyeOff size={13} />} English
          </button>
          {!isEn && (
            <button
              onClick={() => setShowOtherLang(!showOtherLang)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all",
                isBn && "font-bengali",
                showOtherLang ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "border-white/10 text-gray-500"
              )}
            >
              {showOtherLang ? <Eye size={13} /> : <EyeOff size={13} />} {isBn ? "বাংলা" : langName}
            </button>
          )}
          <p className="text-xs text-gray-500 ml-auto hidden sm:block">{t("clickToReveal")}</p>
        </div>

        {/* Dialogue bubbles */}
        <div className="space-y-4 mb-8">
          {dialogue!.lines.map((line) => {
            const isA = line.speaker === "A";
            const expanded = expandedLines.has(line.id);
            const showAlways = showEN || showOtherLang;
            return (
              <div key={line.id} className={cn("flex gap-3", isA ? "flex-row" : "flex-row-reverse")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1",
                  isA ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                )}>
                  {line.speaker_name[0]}
                </div>

                <div className={cn("max-w-[80%]", !isA && "items-end flex flex-col")}>
                  <p className={cn("text-xs text-gray-500 mb-1", !isA && "text-right")}>{line.speaker_name}</p>
                  <div
                    onClick={() => toggleLine(line.id)}
                    className={cn(
                      "rounded-2xl p-3 cursor-pointer transition-all",
                      isA
                        ? "rounded-tl-sm bg-blue-900/30 border border-blue-500/20 hover:border-blue-400/40"
                        : "rounded-tr-sm bg-amber-900/30 border border-amber-500/20 hover:border-amber-400/40"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="lt-text font-bold text-sm">{line.lithuanian}</span>
                      <AudioButton text={line.lithuanian} size="sm" showSlow />
                    </div>

                    {(expanded || showAlways) && (
                      <div className="mt-1 space-y-0.5 pt-1 border-t border-white/10">
                        {showEN && <p className="en-text text-xs text-gray-300">{line.english}</p>}
                        {showOtherLang && isBn && <p className="bn-text font-bengali text-sm">{line.bengali}</p>}
                        {showOtherLang && showOther && (
                          <p className="text-sm text-emerald-300/90">
                            <NativeText value={translated.get(line.english)} />
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key vocabulary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
          <h2 className="font-bold text-gray-100 mb-1">Key Vocabulary</h2>
          <p className="text-gray-400 text-sm mb-4">Key words from this dialogue.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {KEY_VOCAB.map((w) => (
              <div key={w.lt} className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="lt-text font-bold text-sm text-amber-400">{w.lt}</span>
                  <AudioButton text={w.lt} size="sm" />
                </div>
                <p className="en-text text-xs text-gray-300">{w.en}</p>
                {isBn ? (
                  <p className="bn-text font-bengali text-xs">{w.bn}</p>
                ) : showOther ? (
                  <p className="text-xs text-emerald-300/80">
                    <NativeText value={translated.get(w.en)} />
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
