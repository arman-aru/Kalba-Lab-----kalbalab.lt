import {
  LISTENING_POOL,
  READING_POOL,
  WRITING_POOL,
  SPEAKING_POOL,
  type MCQ,
  type ReadingPassage,
  type WritingPrompt,
  type SpeakingPrompt,
} from "@/data/exams/pool";

export interface ExamPaper {
  id: string;
  seed: number;
  listening: MCQ[];
  reading: ReadingPassage[];
  writing: WritingPrompt;
  speaking: SpeakingPrompt[];
}

const COUNTS = {
  listening: 8,   // 8 of 16
  readingPassages: 2, // 2 of 6 → 6 reading questions per paper
  speaking: 2,    // 2 of 8
} as const;

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using the supplied PRNG. */
function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function shortId(seed: number): string {
  // Format: A1-MOCK-#1234 (always 4 digits)
  return `A1-MOCK-#${(Math.abs(seed) % 10000).toString().padStart(4, "0")}`;
}

/**
 * Build a complete A1 mock exam paper from a seed. Same seed → same paper,
 * which lets us persist the seed in sessionStorage so reloads don't shuffle
 * the questions mid-attempt.
 */
export function buildPaper(seed: number): ExamPaper {
  const rand = mulberry32(seed);

  const listening = shuffle(LISTENING_POOL, rand).slice(0, COUNTS.listening);
  const reading = shuffle(READING_POOL, rand).slice(0, COUNTS.readingPassages);
  const writing = shuffle(WRITING_POOL, rand)[0];
  const speaking = shuffle(SPEAKING_POOL, rand).slice(0, COUNTS.speaking);

  return {
    id: shortId(seed),
    seed,
    listening,
    reading,
    writing,
    speaking,
  };
}

/**
 * How many distinct papers this pool can theoretically produce.
 * Useful for UI copy: "1 of {variants}".
 */
export function variantCount(): number {
  // C(16,8) * C(6,2) * 8 * C(8,2) ≈ 36M — effectively unbounded for users.
  // We surface a friendlier number ("8+") since past 8 the user perceives "different every time".
  return 8;
}
