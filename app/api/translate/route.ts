// Server-side translation proxy.
// POST /api/translate { tl: "hi", texts: ["hello", "thanks"] } -> { translations: [...] }
//
// Uses the MyMemory free translation API (no key required, ~50k chars/day
// anonymously). Each (sl, tl, text) is deterministic so we cache hard.

import { getClientIp, rateLimit, sameOriginOk } from "@/lib/rate-limit";

export const runtime = "edge";

const TARGET = "https://api.mymemory.translated.net/get";

interface Body {
  tl?: string;
  texts?: string[];
  sl?: string;
}

interface MyMemoryResponse {
  responseData?: { translatedText?: string; match?: number };
  responseStatus?: number;
}

// MyMemory ships some translations (notably Tajik / certain Cyrillic) as
// UTF-8 bytes presented as Latin-1 characters — i.e. real "Р" (0xD0 0xA0)
// arrives as the two characters Ð (U+00D0) and  (U+00A0). Re-encode the
// string as Latin-1 bytes and decode as UTF-8 to recover the original.
function repairMojibake(s: string): string {
  // Skip if no characters in the suspicious 0x80–0xFF range
  let suspicious = false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c > 0xFF) return s; // contains real Unicode — not mojibake
    if (c >= 0x80) suspicious = true;
  }
  if (!suspicious) return s;
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return s;
  }
}

async function translateOne(text: string, sl: string, tl: string): Promise<string | null> {
  const langpair = `${sl}|${tl}`;
  const url = `${TARGET}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}&de=armansalekofficial@gmail.com`;
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return null;
    const data = (await res.json()) as MyMemoryResponse;
    const raw = data?.responseData?.translatedText?.trim();
    if (!raw) return null;
    if (raw.toUpperCase().startsWith("INVALID")) return null;
    if (raw.toUpperCase().startsWith("MYMEMORY WARNING")) return null;
    return repairMojibake(raw);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  // Same-origin check + IP rate limit so attackers can't burn our MyMemory
  // free-tier quota or pin our edge runtime under sustained load.
  if (!sameOriginOk(req)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = getClientIp(req);
  const rl = rateLimit(`translate:${ip}`, 60, 60 * 60 * 1000); // 60/hour per IP
  if (!rl.ok) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Body;
  try { body = (await req.json()) as Body; } catch { return Response.json({ error: "bad json" }, { status: 400 }); }

  const { texts } = body;
  if (!body.tl || !Array.isArray(texts)) {
    return Response.json({ error: "tl and texts[] required" }, { status: 400 });
  }
  // Hard caps on per-request size and per-string length to prevent abuse of
  // the free MyMemory tier and keep the worker pool bounded.
  const tl: string = String(body.tl).slice(0, 8);
  const sl: string = String(body.sl ?? "en").slice(0, 8);
  const list = texts
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.slice(0, 500))
    .slice(0, 100);

  const CONCURRENCY = 6;
  const results: (string | null)[] = new Array(list.length).fill(null);
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= list.length) break;
      const item = list[i];
      if (item === undefined) break;
      results[i] = await translateOne(item, sl, tl);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, list.length) }, worker));

  return Response.json(
    { translations: results },
    {
      headers: {
        "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=2592000",
      },
    }
  );
}
