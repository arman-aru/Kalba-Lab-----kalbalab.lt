import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getGreeting(name: string): { en: string; bn: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { en: `Good morning, ${name}!`, bn: `শুভ সকাল, ${name}! 🌅` };
  if (hour < 17) return { en: `Good afternoon, ${name}!`, bn: `শুভ দুপুর, ${name}! ☀️` };
  return { en: `Good evening, ${name}!`, bn: `শুভ সন্ধ্যা, ${name}! 🌙` };
}

export function getPosColor(pos: string): string {
  const map: Record<string, string> = {
    noun: "badge-noun",
    verb: "badge-verb",
    adjective: "badge-adj",
    adverb: "badge-adv",
    pronoun: "badge-pron",
    interjection: "badge-int",
    conjunction: "badge-adv",
    preposition: "badge-pron",
    numeral: "badge-noun",
    phrase: "badge-int",
  };
  return map[pos] ?? "badge-int";
}

export function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    A1: "badge-A1",
    A2: "badge-A2",
    B1: "badge-B1",
  };
  return map[level] ?? "badge-A1";
}

export function getPosLabel(pos: string): string {
  const map: Record<string, string> = {
    noun: "Noun",
    verb: "Verb",
    adjective: "Adj.",
    adverb: "Adv.",
    pronoun: "Pron.",
    interjection: "Interj.",
    conjunction: "Conj.",
    preposition: "Prep.",
    numeral: "Num.",
    phrase: "Phrase",
  };
  return map[pos] ?? pos;
}

export function getGenderLabel(gender?: string): string | null {
  if (!gender) return null;
  const map: Record<string, string> = { m: "masc.", f: "fem.", n: "neut.", pl: "pl." };
  return map[gender] ?? null;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
