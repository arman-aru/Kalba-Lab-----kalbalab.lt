import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, VocabularyItem, FlashcardDeck } from "@/types";

interface AppState {
  // Theme
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  toggleTheme: () => void;

  // UI language
  uiLanguage: "bn" | "en";
  setUiLanguage: (l: "bn" | "en") => void;

  // Auth / user
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;

  // Audio preferences
  audioAutoplay: boolean;
  setAudioAutoplay: (v: boolean) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;

  // Flashcard state
  currentDeckId: string | null;
  setCurrentDeckId: (id: string | null) => void;
  savedWords: Set<string>;
  toggleSavedWord: (id: string) => void;

  // Quiz state
  quizInProgress: boolean;
  setQuizInProgress: (v: boolean) => void;

  // Vocabulary filter state
  vocabFilters: {
    level: string;
    topic: string;
    pos: string;
    gender: string;
    search: string;
  };
  setVocabFilter: (key: string, value: string) => void;
  resetVocabFilters: () => void;

  // Recent searches
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
}

const defaultVocabFilters = {
  level: "all",
  topic: "all",
  pos: "all",
  gender: "all",
  search: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (t) => set({ theme: t }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      uiLanguage: "bn",
      setUiLanguage: (l) => set({ uiLanguage: l }),

      user: null,
      setUser: (u) => set({ user: u }),

      audioAutoplay: false,
      setAudioAutoplay: (v) => set({ audioAutoplay: v }),

      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),

      currentDeckId: null,
      setCurrentDeckId: (id) => set({ currentDeckId: id }),
      savedWords: new Set(),
      toggleSavedWord: (id) =>
        set((s) => {
          const next = new Set(s.savedWords);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { savedWords: next };
        }),

      quizInProgress: false,
      setQuizInProgress: (v) => set({ quizInProgress: v }),

      vocabFilters: defaultVocabFilters,
      setVocabFilter: (key, value) =>
        set((s) => ({ vocabFilters: { ...s.vocabFilters, [key]: value } })),
      resetVocabFilters: () => set({ vocabFilters: defaultVocabFilters }),

      recentSearches: [],
      addRecentSearch: (q) =>
        set((s) => ({
          recentSearches: [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 8),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "lithuanianbd-store",
      partialize: (s) => ({
        theme: s.theme,
        uiLanguage: s.uiLanguage,
        audioAutoplay: s.audioAutoplay,
        recentSearches: s.recentSearches,
      }),
    }
  )
);
