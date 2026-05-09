"use client";

import { useState, useMemo } from "react";
import { Search, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Grid, List } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn, getPosColor, getPosLabel, getGenderLabel, getLevelColor } from "@/lib/utils";
import { vocabularyData, TOPICS, PARTS_OF_SPEECH } from "@/data/vocabulary";
import type { VocabularyItem } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import type { UILanguage } from "@/lib/i18n";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

const LEVELS = ["All", "A1", "A2", "B1"] as const;
const PAGE_SIZE = 50;

// Native column header text per UI language.
const NATIVE_COL_LABEL: Partial<Record<UILanguage, string>> & { en: string } = {
  en: "Meaning",
  bn: "বাংলা",
  az: "Azərbaycanca",
  hi: "हिन्दी",
  ky: "Кыргызча",
  tg: "Тоҷикӣ",
  uz: "Oʻzbekcha",
  ur: "اُردُو",
  ar: "العربية",
  tr: "Türkçe",
};

// Lightweight loader pip while a translation is being fetched.
function NativeText({ value }: { value: string | undefined }) {
  if (value === undefined) return <span className="inline-block w-12 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

function PosBadge({ pos }: { pos: string }) {
  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", getPosColor(pos))}>
      {getPosLabel(pos)}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", getLevelColor(level))}>
      {level}
    </span>
  );
}

function VocabRow({ word, saved, onToggleSave, lang, native, exampleNative }: {
  word: VocabularyItem;
  saved: boolean;
  onToggleSave: (id: string) => void;
  lang: UILanguage;
  native: string | undefined;
  exampleNative: string | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const gender = getGenderLabel(word.gender);
  // The native column is always shown for non-English UI languages.
  const showNative = lang !== "en";
  const isFontBengali = lang === "bn";

  return (
    <>
      <tr
        className="border-b border-[var(--border)] hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 w-20">
          <PosBadge pos={word.part_of_speech} />
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="lt-text font-bold text-sm">{word.lithuanian}</span>
            <AudioButton text={word.lithuanian} size="sm" />
            {gender && <span className="text-xs text-gray-600">({gender})</span>}
          </div>
        </td>
        <td className="px-3 py-3 hidden md:table-cell">
          <span className="en-text text-sm">{word.english}</span>
        </td>
        <td className="px-3 py-3 hidden lg:table-cell">
          <div className="flex items-center gap-1.5">
            <span className="lt-text text-xs">{word.example_sentence_lt}</span>
            <AudioButton text={word.example_sentence_lt} size="sm" />
          </div>
        </td>
        {showNative && (
          <td className="px-3 py-3">
            <span className={cn("text-sm", isFontBengali && "font-bengali")}>
              <NativeText value={native} />
            </span>
          </td>
        )}
        <td className="px-3 py-3 w-12">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(word.id); }}
            className={cn("p-1 rounded transition-colors", saved ? "text-amber-400" : "text-gray-600 hover:text-gray-400")}
          >
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        </td>
        <td className="px-3 py-3 w-8">
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-[var(--border)] bg-emerald-950/10">
          <td colSpan={showNative ? 7 : 6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{word.example_sentence_lt}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="lt-text text-sm font-medium">{word.example_sentence_lt}</span>
                    <AudioButton text={word.example_sentence_lt} size="sm" />
                  </div>
                  <p className="en-text text-sm">{word.example_sentence_en}</p>
                  {showNative && (
                    <p className={cn("text-sm", isFontBengali && "font-bengali")}>
                      <NativeText value={exampleNative} />
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <LevelBadge level={word.level} />
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">{word.topic}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function VocabCard({ word, saved, onToggleSave, lang, native, exampleNative }: {
  word: VocabularyItem;
  saved: boolean;
  onToggleSave: (id: string) => void;
  lang: UILanguage;
  native: string | undefined;
  exampleNative: string | undefined;
}) {
  const showNative = lang !== "en";
  const isFontBengali = lang === "bn";
  return (
    <div className="card-surface p-4 flex flex-col gap-3 hover:border-amber-500/20 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="lt-text font-bold text-lg">{word.lithuanian}</span>
            <AudioButton text={word.lithuanian} size="sm" showSlow />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <PosBadge pos={word.part_of_speech} />
            <LevelBadge level={word.level} />
          </div>
        </div>
        <button
          onClick={() => onToggleSave(word.id)}
          className={cn("p-1.5 rounded-lg transition-colors flex-shrink-0", saved ? "text-amber-400 bg-amber-500/10" : "text-gray-600 hover:text-gray-400")}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <p className="text-gray-200 font-medium text-sm">{word.english}</p>
        {showNative && (
          <p className={cn("text-base", isFontBengali && "font-bengali")}>
            <NativeText value={native} />
          </p>
        )}
      </div>

      <div className="bg-[var(--background)] rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="lt-text font-medium">{word.example_sentence_lt}</span>
          <AudioButton text={word.example_sentence_lt} size="sm" />
        </div>
        <p className="en-text">{word.example_sentence_en}</p>
        {showNative && (
          <p className={cn(isFontBengali && "font-bengali")}>
            <NativeText value={exampleNative} />
          </p>
        )}
      </div>

      <div className="text-xs text-gray-600">{word.topic}</div>
    </div>
  );
}

export default function VocabularyPage() {
  const { t, lang } = useTranslation();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [topic, setTopic] = useState("all");
  const [pos, setPos] = useState("all");
  const [view, setView] = useState<"table" | "card">("table");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return vocabularyData.filter((w) => {
      if (level !== "All" && w.level !== level) return false;
      if (topic !== "all" && w.topic !== topic) return false;
      if (pos !== "all" && w.part_of_speech !== pos) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          w.lithuanian.toLowerCase().includes(q) ||
          w.english.toLowerCase().includes(q) ||
          w.bengali.includes(search)
        );
      }
      return true;
    });
  }, [search, level, topic, pos]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;
  const showNative = lang !== "en";

  // Collect every English string we want translated for the current view.
  // For bn we already have translations baked in; the hook short-circuits.
  const wordsToTranslate = useMemo(() => {
    if (lang === "en" || lang === "bn") return [];
    const set = new Set<string>();
    for (const w of paginated) {
      set.add(w.english);
      set.add(w.example_sentence_en);
    }
    return Array.from(set);
  }, [paginated, lang]);

  const translated = useNativeTranslations(wordsToTranslate, lang);
  const nativeFor = (word: VocabularyItem) =>
    lang === "en" ? word.english : lang === "bn" ? word.bengali : translated.get(word.english);
  const exampleNativeFor = (word: VocabularyItem) =>
    lang === "en" ? word.example_sentence_en : lang === "bn" ? word.example_sentence_bn : translated.get(word.example_sentence_en);

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-6 anim-fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("vocabTitle")}</h1>
        <p className="text-gray-400 text-sm">
          <span className="text-amber-400 font-semibold">{filtered.length}</span> {t("of")} {vocabularyData.length} · {t("vocabSub")}
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t("searchVocab")}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none text-sm"
            />
          </div>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button onClick={() => setView("table")} className={cn("px-3 py-2 text-sm transition-colors", view === "table" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}><List size={16} /></button>
            <button onClick={() => setView("card")} className={cn("px-3 py-2 text-sm transition-colors", view === "card" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}><Grid size={16} /></button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-sm">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => { setLevel(l); setPage(1); }}
                className={cn("px-3 py-1.5 transition-colors", level === l ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}
              >
                {l === "All" ? t("all") : l}
              </button>
            ))}
          </div>

          <select
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-300 text-sm focus:border-amber-500/50 focus:outline-none"
          >
            <option value="all">{t("all")} ({t("topic")})</option>
            {TOPICS.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
          </select>

          <select
            value={pos}
            onChange={(e) => { setPos(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-300 text-sm focus:border-amber-500/50 focus:outline-none"
          >
            <option value="all">{t("all")} ({t("partOfSpeech")})</option>
            {PARTS_OF_SPEECH.map((p) => <option key={p} value={p}>{getPosLabel(p)}</option>)}
          </select>
        </div>
      </div>

      {view === "table" && (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed min-w-[720px]">
              {/* Fixed column widths so layout doesn't shift with translation length. */}
              <colgroup>
                <col className="w-[88px]" />
                <col className={cn(showNative ? "w-[18%]" : "w-[24%]")} />
                <col className={cn(showNative ? "w-[16%]" : "w-[22%]", "hidden md:table-column")} />
                <col className={cn(showNative ? "w-[26%]" : "w-[34%]", "hidden lg:table-column")} />
                {showNative && <col className="w-[22%]" />}
                <col className="w-[44px]" />
                <col className="w-[36px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("partOfSpeech")}</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("sectionLT")}</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t("meaning")}</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t("example")}</th>
                  {showNative && <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-400/70 uppercase tracking-wider">{NATIVE_COL_LABEL[lang]}</th>}
                  <th className="px-3 py-2.5"></th>
                  <th className="px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((word) => (
                  <VocabRow
                    key={word.id}
                    word={word}
                    saved={saved.has(word.id)}
                    onToggleSave={toggleSave}
                    lang={lang}
                    native={nativeFor(word)}
                    exampleNative={exampleNativeFor(word)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-400">{t("noResults")}</p>
            </div>
          )}
        </div>
      )}

      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((word) => (
            <VocabCard
              key={word.id}
              word={word}
              saved={saved.has(word.id)}
              onToggleSave={toggleSave}
              lang={lang}
              native={nativeFor(word)}
              exampleNative={exampleNativeFor(word)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-12 text-center">
              <p className="text-gray-400">{t("noResults")}</p>
            </div>
          )}
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-gray-200 hover:text-gray-100 hover:border-amber-500/30 hover:bg-white/[0.06] text-sm font-medium transition-all"
          >
            {t("viewAll")} ({filtered.length - paginated.length})
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
