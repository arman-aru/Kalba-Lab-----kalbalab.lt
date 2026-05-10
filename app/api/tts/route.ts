// Lithuanian TTS proxy.
// Voices come from the catalog in `lib/voices.ts`. The default is the native
// Lithuanian female (Ona). All Azure Neural voices route through msedge-tts
// (no API key needed). The "Classic" voice routes to translate.google.com TTS
// as a fallback.

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { getVoice } from "@/lib/voices";
import { getClientIp, rateLimit, sameOriginOk } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_LEN = 500;

function cleanForTTS(input: string): string {
  return input
    .toLocaleLowerCase("lt")
    .replace(/[!?.,;:¡¿…]+/g, " ")
    .replace(/[—–\-]+/g, " ")
    .replace(/["'`“”‘’()]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function azureNeuralTTS(voiceName: string, text: string, slow: boolean): Promise<Response | null> {
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text, slow ? { rate: "-25%" } : undefined);

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk as Buffer);
    }
    tts.close();
    const buf = Buffer.concat(chunks);

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=2592000, immutable",
      },
    });
  } catch (err) {
    console.warn("Azure neural TTS failed:", err);
    return null;
  }
}

async function legacyTranslateTTS(text: string): Promise<Response> {
  const target = `https://translate.google.com/translate_tts?ie=UTF-8&tl=lt&q=${encodeURIComponent(text)}&client=tw-ob`;
  const upstream = await fetch(target, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept": "audio/mpeg, audio/*;q=0.9, */*;q=0.5",
      "Referer": "https://translate.google.com/",
    },
    cache: "no-store",
  });
  if (!upstream.ok || !upstream.body) {
    return new Response(`Upstream TTS failed: ${upstream.status}`, { status: 502 });
  }
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
}

export async function GET(req: Request) {
  // TTS is expensive and called frequently — cap per-IP to deter scraping
  // and protect the upstream Azure / Google translate endpoints.
  if (!sameOriginOk(req)) {
    return new Response("Forbidden", { status: 403 });
  }
  const ip = getClientIp(req);
  const rl = rateLimit(`tts:${ip}`, 200, 60 * 60 * 1000); // 200/hour per IP
  if (!rl.ok) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const url = new URL(req.url);
  const raw = url.searchParams.get("text")?.trim();
  const slow = url.searchParams.get("slow") === "1";
  const voiceId = url.searchParams.get("voice");

  if (!raw) return new Response("Missing text", { status: 400 });
  if (raw.length > MAX_LEN) {
    return new Response(`Text too long (max ${MAX_LEN} chars)`, { status: 400 });
  }

  const text = cleanForTTS(raw) || raw;
  const voice = getVoice(voiceId);

  if (voice.provider === "azure-neural") {
    const res = await azureNeuralTTS(voice.voiceName, text, slow);
    if (res) return res;
    // fall through if Azure fails
  }

  return legacyTranslateTTS(text);
}
