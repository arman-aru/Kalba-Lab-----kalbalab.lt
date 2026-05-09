import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, VocabularyItem, FlashcardDeck } from "@/types";
import type { UILanguage } from "@/lib/i18n";

interface AppState {
  // Theme
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  toggleTheme: () => void;

  // UI language
  uiLanguage: UILanguage;
  setUiLanguage: (l: UILanguage) => void;

  // Auth / user
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;

  // XP
  liveXP: number;
  addXP: (amount: number) => void;
  lastXPGain: { amount: number; at: number } | null;

  // Audio preferences
  audioAutoplay: boolean;
  setAudioAutoplay: (v: boolean) => void;
  voiceId: string;
  setVoiceId: (id: string) => void;
  dailyGoalXP: number;
  setDailyGoalXP: (n: number) => void;
  todayXP: number;
  todayDate: string;
  addTodayXP: (n: number) => void;

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

      uiLanguage: "en",
      setUiLanguage: (l) => set({ uiLanguage: l }),

      user: null,
      setUser: (u) => set({ user: u }),

      liveXP: 1240,
      lastXPGain: null,
      addXP: (amount) =>
        set((s) => ({
          liveXP: s.liveXP + amount,
          lastXPGain: { amount, at: Date.now() },
        })),

      audioAutoplay: false,
      setAudioAutoplay: (v) => set({ audioAutoplay: v }),
      voiceId: "ona",
      setVoiceId: (id) => set({ voiceId: id }),
      dailyGoalXP: 50,
      setDailyGoalXP: (n) => set({ dailyGoalXP: n }),
      todayXP: 0,
      todayDate: new Date().toISOString().slice(0, 10),
      addTodayXP: (n) =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          if (s.todayDate !== today) {
            return { todayXP: n, todayDate: today };
          }
          return { todayXP: s.todayXP + n };
        }),

      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),

      currentDeckId: null,
      setCurrentDeckId: (id) => set({ currentDeckId: id }),
      savedWords: new Set(),
      toggleSavedWord: (id) =>
        set((s) => {
          const next = new Set(s.savedWords);
          const wasAdding = !next.has(id);
          if (wasAdding) next.add(id);
          else next.delete(id);
          // Award XP only when the user *adds* a new word — not when they remove one.
          if (wasAdding && typeof window !== "undefined") {
            // Lazy-load to avoid a server-side bundle on this otherwise-pure store.
            import("@/lib/award-xp").then(({ awardXP }) => awardXP("vocab_save")).catch(() => {});
          }
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
      name: "kalbalab-store",
      partialize: (s) => ({
        theme: s.theme,
        uiLanguage: s.uiLanguage,
        audioAutoplay: s.audioAutoplay,
        voiceId: s.voiceId,
        dailyGoalXP: s.dailyGoalXP,
        todayXP: s.todayXP,
        todayDate: s.todayDate,
        recentSearches: s.recentSearches,
      }),
    }
  )
);
