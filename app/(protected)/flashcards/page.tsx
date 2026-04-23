"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Grid, CreditCard, Bookmark, BookmarkCheck, Volume2 } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { cn, getPosColor, getPosLabel, getGenderLabel, getLevelColor } from "@/lib/utils";
import { vocabularyData, TOPICS, PARTS_OF_SPEECH } from "@/data/vocabulary";
import type { VocabularyItem } from "@/types";
import { useAppStore } from "@/stores/useAppStore";

const PAGE_SIZE = 30;

function FlashCardComponent({ word, onKnow, onDontKnow }: {
  word: VocabularyItem;
  onKnow: () => void;
  onDontKnow: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const { savedWords, toggleSavedWord, audioAutoplay } = useAppStore();

  useEffect(() => {
    setFlipped(false);
  }, [word.id]);

  useEffect(() => {
    if (audioAutoplay) {
      const t = setTimeout(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(word.lithuanian);
          u.lang = "lt-LT";
          u.rate = 0.9;
          window.speechSynthesis.speak(u);
        }
      }, 400);
      return () => clearTimeout(t);
    }
  }, [word.id, audioAutoplay]);

  const isSaved = savedWords.has(word.id);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card */}
      <div
        className="flashcard-container w-full max-w-md h-72 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={cn("flashcard-inner w-full h-full", flipped && "flipped")}>
          {/* Front */}
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
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                  {getGenderLabel(word.gender)}
                </span>
              )}
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", getLevelColor(word.level))}>
                {word.level}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Click to reveal meaning · ক্লিক করুন অর্থ দেখতে</p>
          </div>

          {/* Back */}
          <div className="flashcard-back card-surface border-emerald-500/20 p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-100 mb-1">{word.english}</p>
              <p className="bn-text font-bengali text-2xl">{word.bengali}</p>
            </div>
            <div className="bg-[var(--background)] rounded-lg p-3 text-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="lt-text font-medium text-sm">{word.example_sentence_lt}</span>
                <AudioButton text={word.example_sentence_lt} size="sm" />
              </div>
              <p className="en-text text-xs">{word.example_sentence_en}</p>
              <p className="bn-text font-bengali text-xs">{word.example_sentence_bn}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{word.topic}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSavedWord(word.id); }}
                className={cn("flex items-center gap-1 transition-colors", isSaved ? "text-amber-400" : "text-gray-600 hover:text-gray-400")}
              >
                {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onDontKnow}
          className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold text-sm transition-all flex items-center gap-2"
        >
          ✗ Don't Know
        </button>
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-5 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-gray-300 font-semibold text-sm transition-all"
        >
          ↕ Flip
        </button>
        <button
          onClick={onKnow}
          className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold text-sm transition-all flex items-center gap-2"
        >
          ✓ Know
        </button>
      </div>

      {/* Keyboard hints */}
      <p className="text-xs text-gray-600">
        <kbd className="bg-gray-800 rounded px-1 py-0.5">Space</kbd> flip ·{" "}
        <kbd className="bg-gray-800 rounded px-1 py-0.5">→</kbd> know ·{" "}
        <kbd className="bg-gray-800 rounded px-1 py-0.5">←</kbd> don&apos;t know ·{" "}
        <kbd className="bg-gray-800 rounded px-1 py-0.5">S</kbd> speak
      </p>
    </div>
  );
}

function GridCard({ word, saved, onToggleSave }: { word: VocabularyItem; saved: boolean; onToggleSave: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
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
        <p className="bn-text font-bengali text-base">{word.bengali}</p>
      </div>
      {expanded && (
        <div className="bg-[var(--background)] rounded-lg p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="lt-text font-medium">{word.example_sentence_lt}</span>
            <AudioButton text={word.example_sentence_lt} size="sm" />
          </div>
          <p className="en-text">{word.example_sentence_en}</p>
          <p className="bn-text font-bengali">{word.example_sentence_bn}</p>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors self-start"
      >
        {expanded ? "Hide example ▲" : "Show example ▼"}
      </button>
      <p className="text-xs text-gray-700">{word.topic}</p>
    </div>
  );
}

export default function FlashcardsPage() {
  const [view, setView] = useState<"card" | "grid">("card");
  const [level, setLevel] = useState("A1");
  const [topic, setTopic] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [dontKnow, setDontKnow] = useState<Set<string>>(new Set());
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
    setKnown((k) => new Set(k).add(currentWord.id));
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1));
  }, [currentWord, filtered.length]);

  const handleDontKnow = useCallback(() => {
    if (!currentWord) return;
    setDontKnow((k) => new Set(k).add(currentWord.id));
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1));
  }, [currentWord, filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (view !== "card" || !currentWord) return;
      if (e.key === "ArrowRight") handleKnow();
      if (e.key === "ArrowLeft") handleDontKnow();
      if (e.key === "s" || e.key === "S") {
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(currentWord.lithuanian);
          u.lang = "lt-LT";
          window.speechSynthesis.speak(u);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, currentWord, handleKnow, handleDontKnow]);

  const resetDeck = () => {
    setCurrentIndex(0);
    setKnown(new Set());
    setDontKnow(new Set());
  };

  const isFinished = view === "card" && currentIndex >= filtered.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">
          Flashcards <span className="text-amber-400 font-bengali text-xl">· ফ্ল্যাশকার্ড</span>
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {filtered.length} cards · {known.size} known · {dontKnow.size} to review
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
          {["A1", "A2", "B1", "All"].map((l) => (
            <button key={l} onClick={() => { setLevel(l); setCurrentIndex(0); }}
              className={cn("px-3 py-1.5 text-sm transition-colors", level === l ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}>
              {l}
            </button>
          ))}
        </div>
        <select
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setCurrentIndex(0); }}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-300 text-sm focus:outline-none"
        >
          <option value="all">All Topics</option>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden ml-auto">
          <button onClick={() => setView("card")} className={cn("px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors", view === "card" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}>
            <CreditCard size={14} /> Card
          </button>
          <button onClick={() => setView("grid")} className={cn("px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors", view === "grid" ? "bg-amber-500/10 text-amber-400" : "text-gray-400 hover:text-gray-200")}>
            <Grid size={14} /> Grid
          </button>
        </div>
      </div>

      {/* Card View */}
      {view === "card" && (
        <div className="max-w-lg mx-auto">
          {isFinished ? (
            <div className="card-surface p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">ডেক শেষ হয়েছে!</h2>
              <p className="text-gray-400 text-sm mb-1">Deck Complete!</p>
              <div className="flex justify-center gap-6 my-6 text-sm">
                <div className="text-center"><p className="text-2xl font-bold text-emerald-400">{known.size}</p><p className="text-gray-500">Known</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-red-400">{dontKnow.size}</p><p className="text-gray-500">To Review</p></div>
              </div>
              <button onClick={resetDeck} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-semibold transition-all">
                <RotateCcw size={16} /> আবার শুরু করুন / Restart
              </button>
            </div>
          ) : currentWord ? (
            <>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>Card {currentIndex + 1} of {filtered.length}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">{known.size} ✓</span>
                  <span className="text-red-400">{dontKnow.size} ✗</span>
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

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, PAGE_SIZE).map((word) => (
            <GridCard key={word.id} word={word} saved={savedWords.has(word.id)} onToggleSave={toggleSavedWord} />
          ))}
        </div>
      )}
    </div>
  );
}

