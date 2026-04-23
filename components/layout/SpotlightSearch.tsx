"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { vocabularyData } from "@/data/vocabulary";
import { AudioButton } from "@/components/audio/AudioButton";
import Link from "next/link";

interface SearchResult {
  type: "vocab" | "lesson";
  id: string;
  title: string;
  subtitle?: string;
  bengali?: string;
  href: string;
  lithuanian?: string;
}

function searchItems(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const word of vocabularyData) {
    if (
      word.lithuanian.toLowerCase().includes(q) ||
      word.english.toLowerCase().includes(q) ||
      word.bengali.includes(query)
    ) {
      results.push({
        type: "vocab",
        id: word.id,
        title: word.lithuanian,
        subtitle: word.english,
        bengali: word.bengali,
        href: `/vocabulary?q=${encodeURIComponent(word.lithuanian)}`,
        lithuanian: word.lithuanian,
      });
      if (results.length >= 8) break;
    }
  }

  return results;
}

export function SpotlightSearch() {
  const { searchOpen, setSearchOpen, recentSearches, addRecentSearch } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setResults(searchItems(q));
    setSelectedIndex(0);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[selectedIndex]) {
      addRecentSearch(query);
      setSearchOpen(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
      onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-xl card-surface shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="শব্দ খুঁজুন... / Search vocabulary & lessons..."
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm"
          />
          <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-gray-300">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query === "" && recentSearches.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Clock size={12} /> Recent</p>
              {recentSearches.map((s) => (
                <button key={s} onClick={() => handleSearch(s)} className="block w-full text-left text-sm text-gray-400 hover:text-gray-200 py-1 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {results.map((r, i) => (
            <Link
              key={r.id}
              href={r.href}
              onClick={() => { addRecentSearch(query); setSearchOpen(false); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                i === selectedIndex ? "bg-amber-500/10" : "hover:bg-white/5"
              )}
            >
              <BookOpen size={14} className="text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="lt-text font-bold text-sm">{r.title}</span>
                  {r.lithuanian && <AudioButton text={r.lithuanian} size="sm" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{r.subtitle}</span>
                  {r.bengali && <span className="text-xs bn-text font-bengali">{r.bengali}</span>}
                </div>
              </div>
            </Link>
          ))}

          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 text-sm">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-gray-600 text-xs mt-1">No results found for "{query}"</p>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4 text-xs text-gray-600">
          <span><kbd className="bg-gray-800 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="bg-gray-800 rounded px-1">↵</kbd> select</span>
          <span><kbd className="bg-gray-800 rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
