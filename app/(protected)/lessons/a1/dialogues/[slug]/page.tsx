"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Eye, EyeOff } from "lucide-react";
import { notFound } from "next/navigation";
import { dialoguesData } from "@/data/dialogues";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DialoguePage({ params }: Props) {
  const { slug } = use(params);
  const dialogue = dialoguesData.find((d) => d.slug === slug);
  if (!dialogue) notFound();

  const [showEN, setShowEN] = useState(true);
  const [showBN, setShowBN] = useState(true);
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());

  const toggleLine = (id: string) => {
    setExpandedLines((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const playAll = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    let i = 0;
    const playNext = () => {
      if (i >= dialogue.lines.length) return;
      const line = dialogue.lines[i];
      const u = new SpeechSynthesisUtterance(line.lithuanian);
      u.lang = "lt-LT";
      u.rate = 0.9;
      u.onend = () => { i++; setTimeout(playNext, 500); };
      window.speechSynthesis.speak(u);
    };
    playNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/lessons/a1/dialogues" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-6 transition-colors">
        <ArrowLeft size={14} /> All Dialogues
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">{dialogue.level}</span>
          <span className="text-xs text-gray-600">Dialogue</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-100 mb-0.5">{dialogue.title_en}</h1>
        <p className="text-amber-400 font-bold text-lg mb-0.5">{dialogue.title_lt}</p>
        <p className="text-emerald-400 font-bengali text-xl mb-3">{dialogue.title_bn}</p>
        <p className="text-gray-400 text-sm font-bengali">{dialogue.scenario_bn}</p>
        <p className="text-gray-500 text-sm mt-0.5">{dialogue.scenario_en}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <button
          onClick={playAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-medium transition-all"
        >
          <Play size={13} /> Play All
        </button>
        <button
          onClick={() => setShowEN(!showEN)}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all", showEN ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "border-[var(--border)] text-gray-500")}
        >
          {showEN ? <Eye size={13} /> : <EyeOff size={13} />} English
        </button>
        <button
          onClick={() => setShowBN(!showBN)}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bengali transition-all", showBN ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "border-[var(--border)] text-gray-500")}
        >
          {showBN ? <Eye size={13} /> : <EyeOff size={13} />} বাংলা
        </button>
        <p className="text-xs text-gray-600 ml-auto">Click any bubble for translation</p>
      </div>

      {/* Dialogue bubbles */}
      <div className="space-y-4 mb-8">
        {dialogue.lines.map((line) => {
          const isA = line.speaker === "A";
          const expanded = expandedLines.has(line.id);
          return (
            <div key={line.id} className={cn("flex gap-3", isA ? "flex-row" : "flex-row-reverse")}>
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1",
                isA ? "bg-blue-500/20 text-blue-400 border border-blue-500/20" : "bg-amber-500/20 text-amber-400 border border-amber-500/20"
              )}>
                {line.speaker_name[0]}
              </div>

              <div className={cn("max-w-[75%]", !isA && "items-end flex flex-col")}>
                <p className={cn("text-xs text-gray-600 mb-1", !isA && "text-right")}>{line.speaker_name}</p>

                <div
                  onClick={() => toggleLine(line.id)}
                  className={cn(
                    "rounded-2xl p-3 cursor-pointer transition-all",
                    isA
                      ? "rounded-tl-sm bg-blue-900/30 border border-blue-500/20 hover:border-blue-400/30"
                      : "rounded-tr-sm bg-amber-900/30 border border-amber-500/20 hover:border-amber-400/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="lt-text font-bold text-sm">{line.lithuanian}</span>
                    <AudioButton text={line.lithuanian} size="sm" showSlow />
                  </div>

                  {expanded && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                      {showEN && <p className="en-text text-xs">{line.english}</p>}
                      {showBN && <p className="bn-text font-bengali text-sm">{line.bengali}</p>}
                    </div>
                  )}
                  {!expanded && (showEN || showBN) && (
                    <div className="mt-1 space-y-0.5">
                      {showEN && <p className="en-text text-xs">{line.english}</p>}
                      {showBN && <p className="bn-text font-bengali text-sm">{line.bengali}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick vocab from dialogue */}
      <div className="card-surface p-5">
        <h2 className="font-bold text-gray-200 mb-1">এই সংলাপের মূল শব্দ · Key Vocabulary</h2>
        <p className="text-gray-400 text-sm mb-4">Key words from this dialogue</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { lt: "labas", en: "hello", bn: "হ্যালো" },
            { lt: "vardas", en: "name", bn: "নাম" },
            { lt: "iš kur", en: "from where", bn: "কোথা থেকে" },
            { lt: "gyventi", en: "to live", bn: "বাস করা" },
            { lt: "šeima", en: "family", bn: "পরিবার" },
            { lt: "ačiū", en: "thank you", bn: "ধন্যবাদ" },
          ].map((w) => (
            <div key={w.lt} className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="lt-text font-bold text-sm">{w.lt}</span>
                <AudioButton text={w.lt} size="sm" />
              </div>
              <p className="en-text text-xs">{w.en}</p>
              <p className="bn-text font-bengali text-xs">{w.bn}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
