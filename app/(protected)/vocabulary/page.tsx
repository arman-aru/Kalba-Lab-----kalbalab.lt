"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Volume2, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Grid, List } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn, getPosColor, getPosLabel, getGenderLabel, getLevelColor } from "@/lib/utils";
import { vocabularyData, TOPICS, PARTS_OF_SPEECH } from "@/data/vocabulary";
import type { VocabularyItem } from "@/types";

const LEVELS = ["All", "A1", "A2", "B1"] as const;
const PAGE_SIZE = 50;

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

function VocabRow({ word, saved, onToggleSave }: { word: VocabularyItem; saved: boolean; onToggleSave: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const gender = getGenderLabel(word.gender);

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
            {word.plural_form && word.plural_form !== "—" && (
              <span className="text-xs text-gray-600">pl: {word.plural_form}</span>
            )}
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
        <td className="px-3 py-3">
          <span className="bn-text font-bengali text-sm">{word.bengali}</span>
        </td>
        <td className="px-3 py-3 w-12">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(word.id); }}
            className={cn(
              "p-1 rounded transition-colors",
              saved ? "text-amber-400" : "text-gray-600 hover:text-gray-400"
            )}
            aria-label="Save to deck"
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
          <td colSpan={7} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Example Sentence</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="lt-text text-sm font-medium">{word.example_sentence_lt}</span>
                    <AudioButton text={word.example_sentence_lt} size="sm" />
                  </div>
                  <p className="en-text text-sm">{word.example_sentence_en}</p>
                  <p className="bn-text font-bengali text-sm">{word.example_sentence_bn}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Details</p>
                <div className="flex flex-wrap gap-2">
                  <LevelBadge level={word.level} />
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">{word.topic}</span>
                  {word.gender && <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">Gender: {word.gender}</span>}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function VocabCard({ word, saved, onToggleSave }: { word: VocabularyItem; saved: boolean; onToggleSave: (id: string) => void }) {
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
            {word.gender && <span className="text-xs text-gray-600">({getGenderLabel(word.gender)})</span>}
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
        <p className="text-gray-200 font-medium text-sm mb-0.5">{word.english}</p>
        <p className="bn-text font-bengali text-base">{word.bengali}</p>
      </div>

      <div className="bg-[var(--background)] rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="lt-text font-medium">{word.example_sentence_lt}</span>
          <AudioButton text={word.example_sentence_lt} size="sm" />
        </div>
        <p className="en-text">{word.example_sentence_en}</p>
        <p className="bn-text font-bengali">{word.example_sentence_bn}</p>
      </div>

      <div className="text-xs text-gray-600">{word.topic}</div>
    </div>
  );
}

export default function VocabularyPage() {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">
          Lithuanian Vocabulary
          <span className="text-gray-500 font-normal text-lg ml-2">/ </span>
          <span className="text-amber-400 font-bengali text-xl">লিথুয়ানিয়ান শব্দভাণ্ডার</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {filtered.length} of {vocabularyData.length} entries · A1–B1 Lithuanian vocabulary with Bengali translations
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Search + view toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search vocabulary... / শব্দ খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none text-sm"
            />
          </div>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={cn("px-3 py-2 text-sm transition-colors", view === "table" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}
              aria-label="Table view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView("card")}
              className={cn("px-3 py-2 text-sm transition-colors", view === "card" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}
              aria-label="Card view"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Level */}
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-sm">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => { setLevel(l); setPage(1); }}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  level === l ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200"
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Topic */}
          <select
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-300 text-sm focus:border-amber-500/50 focus:outline-none"
          >
            <option value="all">All Topics</option>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Part of Speech */}
          <select
            value={pos}
            onChange={(e) => { setPos(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-300 text-sm focus:border-amber-500/50 focus:outline-none"
          >
            <option value="all">All Parts of Speech</option>
            {PARTS_OF_SPEECH.map((p) => <option key={p} value={p}>{getPosLabel(p)}</option>)}
          </select>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">PoS</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Word</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Meaning</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Sentence</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-400/70 uppercase tracking-wider font-bengali">বাংলা</th>
                  <th className="px-3 py-2.5 w-12"></th>
                  <th className="px-3 py-2.5 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((word) => (
                  <VocabRow key={word.id} word={word} saved={saved.has(word.id)} onToggleSave={toggleSave} />
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-400 font-bengali">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-gray-600 text-sm mt-1">No results found</p>
            </div>
          )}
        </div>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((word) => (
            <VocabCard key={word.id} word={word} saved={saved.has(word.id)} onToggleSave={toggleSave} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-12 text-center">
              <p className="text-gray-400 font-bengali">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-gray-600 text-sm mt-1">No results found</p>
            </div>
          )}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 rounded-lg border border-[var(--border)] text-gray-300 hover:text-gray-100 hover:border-amber-500/30 text-sm transition-all"
          >
            আরও দেখুন / Load More ({filtered.length - paginated.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
