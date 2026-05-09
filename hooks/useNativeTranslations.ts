"use client";

import { useEffect, useState } from "react";
import type { UILanguage } from "@/lib/i18n";

// LocalStorage cache: same (lang, text) → same translation forever.
function cacheKey(lang: UILanguage, text: string) {
  return `klb-tr:${lang}:${text}`;
}

function readCache(lang: UILanguage, text: string): string | null {
  try { return localStorage.getItem(cacheKey(lang, text)); } catch { return null; }
}
function writeCache(lang: UILanguage, text: string, value: string) {
  try { localStorage.setItem(cacheKey(lang, text), value); } catch { /* quota / private mode */ }
}

/**
 * Returns a Map<originalText, translatedText> for the given target language.
 *
 *  - For "en" returns each text mapped to itself (English is the source).
 *  - For "bn" returns an empty map (caller already has Bengali in data).
 *  - For all other UI languages, hits /api/translate, caches results.
 */
export function useNativeTranslations(texts: string[], lang: UILanguage): Map<string, string> {
  const [map, setMap] = useState<Map<string, string>>(new Map());

  // Stable dependency: hash of inputs
  const sig = lang + "|" + texts.length + "|" + (texts[0] ?? "") + (texts[texts.length - 1] ?? "");

  useEffect(() => {
    if (lang === "en") {
      setMap(new Map(texts.map((t) => [t, t])));
      return;
    }
    if (lang === "bn" || texts.length === 0) {
      setMap(new Map());
      return;
    }

    // Seed from cache, queue misses for the network
    const seeded = new Map<string, string>();
    const misses: string[] = [];
    const seen = new Set<string>();
    for (const t of texts) {
      if (seen.has(t)) continue;
      seen.add(t);
      const cached = readCache(lang, t);
      if (cached) seeded.set(t, cached);
      else misses.push(t);
    }
    setMap(seeded);
    if (misses.length === 0) return;

    let cancelled = false;
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tl: lang, sl: "en", texts: misses }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { translations?: (string | null)[] } | null) => {
        if (!data?.translations || cancelled) return;
        setMap((prev) => {
          const next = new Map(prev);
          misses.forEach((orig, i) => {
            const tr = data.translations?.[i];
            if (tr && tr.trim()) {
              next.set(orig, tr);
              writeCache(lang, orig, tr);
            }
          });
          return next;
        });
      })
      .catch(() => {});

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, lang]);

  return map;
}
