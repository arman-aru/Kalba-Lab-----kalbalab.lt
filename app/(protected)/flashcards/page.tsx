"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RotateCcw, Grid, CreditCard, Bookmark, BookmarkCheck } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn, getPosColor, getPosLabel, getGenderLabel, getLevelColor } from "@/lib/utils";
import { vocabularyData, TOPICS } from "@/data/vocabulary";
import type { VocabularyItem } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import type { UILanguage } from "@/lib/i18n";
import { speakLithuanian } from "@/lib/audio";
import { awardXP } from "@/lib/award-xp";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

const PAGE_SIZE = 30;

function showBn(lang: UILanguage) {
  return lang === "bn";
}

function FlashCardComponent({ word, onKnow, onDontKnow }: {
  word: VocabularyItem;
  onKnow: () => void;
  onDontKnow: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const { savedWords, toggleSavedWord, audioAutoplay } = useAppStore();
  const { t, lang } = useTranslation();

  useEffect(() => { setFlipped(false); }, [word.id]);

  useEffect(() => {
    if (audioAutoplay) {
      const tt = setTimeout(() => { speakLithuanian(word.lithuanian, 0.9).catch(() => {}); }, 400);
      return () => clearTimeout(tt);
    }
  }, [word.id, audioAutoplay, word.lithuanian]);

  const isSaved = savedWords.has(word.id);
  const bn = showBn(lang);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="flashcard-container w-full max-w-md h-72 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={cn("flashcard-inner w-full h-full", flipped && "flipped")}>
          <div className="flashcard-front card-surface border-amber-500/20 p-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-amber-400">{word.lithuanian}</span>
              <AudioButton text={word.lithuanian} size="lg" showSlow />
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", getPosColor(word.part_of_speech))}>
                {getPosLabel(word.part_of_speech)}
              </span>
              {word.gender && (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">{getGenderLabel(word.gender)}</span>
              )}
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", getLevelColor(word.level))}>{word.level}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">{t("clickToReveal")}</p>
          </div>

          <div className="flashcard-back card-surface border-emerald-500/20 p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-100 mb-1">{word.english}</p>
              {bn && <p className="bn-text font-bengali text-2xl">{word.bengali}</p>}
            </div>
            <div className="bg-[var(--background)] rounded-lg p-3 text-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="lt-text font-medium text-sm">{word.example_sentence_lt}</span>
                <AudioButton text={word.example_sentence_lt} size="sm" />
              </div>
              <p className="en-text text-xs">{word.example_sentence_en}</p>
              {bn && <p className="bn-text font-bengali text-xs">{word.example_sentence_bn}</p>}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{word.topic}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSavedWord(word.id); }}
                className={cn("flex items-center gap-1 transition-colors", isSaved ? "text-amber-400" : "text-gray-600 hover:text-gray-400")}
              >
                {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                {isSaved ? t("saved") : t("saveAction")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDontKnow}
          className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold text-sm transition-all flex items-center gap-2"
        >
          ✗ {t("dontKnow")}
        </button>
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-5 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-gray-300 font-semibold text-sm transition-all"
        >
          ↕ {t("flip")}
        </button>
        <button
          onClick={onKnow}
          className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold text-sm transition-all flex items-center gap-2"
        >
          ✓ {t("know")}
        </button>
      </div>
    </div>
  );
}

function GridCard({ word, saved, onToggleSave, lang, t }: { word: VocabularyItem; saved: boolean; onToggleSave: (id: string) => void; lang: UILanguage; t: (k: never) => string }) {
  const [expanded, setExpanded] = useState(false);
  const bn = showBn(lang);
  return (
    <div className="card-surface p-4 flex flex-col gap-3 hover:border-amber-500/20 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="lt-text font-bold text-lg">{word.lithuanian}</span>
          <AudioButton text={word.lithuanian} size="sm" showSlow />
        </div>
        <button
          onClick={() => onToggleSave(word.id)}
          className={cn("p-1.5 rounded-lg transition-colors flex-shrink-0", saved ? "text-amber-400" : "text-gray-600 hover:text-gray-400")}
        >
          {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", getPosColor(word.part_of_speech))}>{getPosLabel(word.part_of_speech)}</span>
        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", getLevelColor(word.level))}>{word.level}</span>
      </div>
      <div>
        <p className="text-gray-200 text-sm font-medium">{word.english}</p>
        {bn && <p className="bn-text font-bengali text-base">{word.bengali}</p>}
      </div>
      {expanded && (
        <div className="bg-[var(--background)] rounded-lg p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="lt-text font-medium">{word.example_sentence_lt}</span>
            <AudioButton text={word.example_sentence_lt} size="sm" />
          </div>
          <p className="en-text">{word.example_sentence_en}</p>
          {bn && <p className="bn-text font-bengali">{word.example_sentence_bn}</p>}
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors self-start"
      >
        {expanded ? `▲ ${(t as (k: string) => string)("hideExample")}` : `▼ ${(t as (k: string) => string)("showExample")}`}
      </button>
      <p className="text-xs text-gray-700">{word.topic}</p>
    </div>
  );
}

export default function FlashcardsPage() {
  const { t, lang } = useTranslation();
  const [view, setView] = useState<"card" | "grid">("card");
  const [level, setLevel] = useState("A1");
  const [topic, setTopic] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [dontKnowSet, setDontKnowSet] = useState<Set<string>>(new Set());
  const { savedWords, toggleSavedWord } = useAppStore();

  const filtered = useMemo(() => {
    return vocabularyData.filter((w) => {
      if (level !== "All" && w.level !== level) return false;
      if (topic !== "all" && w.topic !== topic) return false;
      return true;
    });
  }, [level, topic]);

  const currentWord = filtered[currentIndex];

  const handleKnow = useCallback(() => {
    if (!currentWord) return;
    setKnown((k) => {
      // Only award XP the first time this card is marked known.
      if (!k.has(currentWord.id)) {
        awardXP("flashcard_view", 1);
      }
      const next = new Set(k);
      next.add(currentWord.id);
      return next;
    });
    setCurrentIndex((i) => Math.min(i + 1, filtered.length));
  }, [currentWord, filtered.length]);

  const handleDontKnow = useCallback(() => {
    if (!currentWord) return;
    setDontKnowSet((k) => new Set(k).add(currentWord.id));
    setCurrentIndex((i) => Math.min(i + 1, filtered.length));
  }, [currentWord, filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (view !== "card" || !currentWord) return;
      if (e.key === "ArrowRight") handleKnow();
      if (e.key === "ArrowLeft") handleDontKnow();
      if (e.key === "s" || e.key === "S") {
        speakLithuanian(currentWord.lithuanian).catch(() => {});
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, currentWord, handleKnow, handleDontKnow]);

  const resetDeck = () => {
    setCurrentIndex(0);
    setKnown(new Set());
    setDontKnowSet(new Set());
  };

  const isFinished = view === "card" && currentIndex >= filtered.length;

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-6 anim-fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("flashTitle")}</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{filtered.length}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">✓ {known.size} {t("knownCount")}</span>
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">✗ {dontKnowSet.size} {t("toReview")}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 anim-fade-up">
        <div className="flex rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          {["A1", "A2", "B1", "All"].map((l) => {
            const wip = l === "A2" || l === "B1";
            return (
              <button key={l} onClick={() => { setLevel(l); setCurrentIndex(0); }}
                className={cn(
                  "relative px-3 py-1.5 text-sm transition-colors",
                  level === l ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200"
                )}>
                {l === "All" ? t("all") : l}
                {wip && <span aria-hidden className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--background)]" />}
              </button>
            );
          })}
        </div>
        <select
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setCurrentIndex(0); }}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-300 text-sm focus:outline-none"
        >
          <option value="all">{t("all")} ({t("topic")})</option>
          {TOPICS.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
        </select>
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden ml-auto">
          <button onClick={() => setView("card")} className={cn("px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors", view === "card" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}>
            <CreditCard size={14} /> {t("card")}
          </button>
          <button onClick={() => setView("grid")} className={cn("px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors", view === "grid" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}>
            <Grid size={14} /> {t("gridView")}
          </button>
        </div>
      </div>

      {view === "card" && (
        <div className="max-w-lg mx-auto">
          {filtered.length === 0 ? (
            <div className="card-surface p-10 text-center">
              <div className="text-5xl mb-4">🚧</div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">{t("comingSoon")}</h2>
              <p className="text-gray-400 text-sm mb-2 max-w-sm mx-auto">{t("comingSoonDesc")}</p>
              {(level === "A2" || level === "B1") && (
                <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                  No {level} flashcards yet — A1 has 220 cards ready to go.
                </p>
              )}
              <button
                onClick={() => { setLevel("A1"); setCurrentIndex(0); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-all"
              >
                {t("tryA1")}
              </button>
            </div>
          ) : isFinished ? (
            <div className="card-surface p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">{t("deckComplete")}</h2>
              <div className="flex justify-center gap-6 my-6 text-sm">
                <div className="text-center"><p className="text-2xl font-bold text-emerald-400">{known.size}</p><p className="text-gray-500">{t("knownCount")}</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-red-400">{dontKnowSet.size}</p><p className="text-gray-500">{t("toReview")}</p></div>
              </div>
              <button onClick={resetDeck} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-semibold transition-all">
                <RotateCcw size={16} /> {t("restart")}
              </button>
            </div>
          ) : currentWord ? (
            <>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>{t("card")} {currentIndex + 1} {t("cardOf")} {filtered.length}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">{known.size} ✓</span>
                  <span className="text-red-400">{dontKnowSet.size} ✗</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${((currentIndex) / filtered.length) * 100}%` }} />
              </div>
              <FlashCardComponent word={currentWord} onKnow={handleKnow} onDontKnow={handleDontKnow} />
            </>
          ) : null}
        </div>
      )}

      {view === "grid" && (
        filtered.length === 0 ? (
          <div className="card-surface p-10 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-gray-100 mb-2">{t("comingSoon")}</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{t("comingSoonDesc")}</p>
            <button
              onClick={() => { setLevel("A1"); setCurrentIndex(0); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-all"
            >
              {t("tryA1")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, PAGE_SIZE).map((word) => (
              <GridCard key={word.id} word={word} saved={savedWords.has(word.id)} onToggleSave={toggleSavedWord} lang={lang} t={t as never} />
            ))}
          </div>
        )
      )}
      </div>
    </div>
  );
}
