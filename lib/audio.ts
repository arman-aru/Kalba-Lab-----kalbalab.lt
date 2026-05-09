"use client";

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedLtVoice: SpeechSynthesisVoice | null | undefined = undefined;

// Google Translate's public TTS endpoint produces a real Lithuanian voice
// (much better than the OS default, which usually has no `lt-LT` voice
// installed and falls back to English). Works in any browser via <audio>.
function googleTtsUrl(text: string, slow = false, voiceId?: string): string {
  // Proxied via our /api/tts route to avoid browser-side referer/CORS blocks.
  const params = new URLSearchParams({ text });
  if (slow) params.set("slow", "1");
  if (voiceId) params.set("voice", voiceId);
  return `/api/tts?${params.toString()}`;
}

function playViaGoogle(text: string, rate: number, voiceId?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // For "slow" playback ask the upstream voice to speak slowly — that sounds
    // more natural than scaling <audio>.playbackRate after the fact.
    const wantSlow = rate < 0.95;
    const audio = new Audio(googleTtsUrl(text, wantSlow, voiceId));
    audio.preload = "auto";
    audio.playbackRate = wantSlow ? 1 : Math.max(0.5, Math.min(2, rate));
    audio.onended = () => { if (currentAudio === audio) currentAudio = null; resolve(); };
    audio.onerror = () => { if (currentAudio === audio) currentAudio = null; reject(new Error("Google TTS failed")); };
    currentAudio = audio;
    audio.play().catch(reject);
  });
}

async function getLithuanianVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedLtVoice !== undefined) return cachedLtVoice;
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (voices.length === 0) {
    await new Promise<void>((resolve) => {
      const onChange = () => { synth.removeEventListener("voiceschanged", onChange); resolve(); };
      synth.addEventListener("voiceschanged", onChange);
      setTimeout(() => { synth.removeEventListener("voiceschanged", onChange); resolve(); }, 1500);
    });
    voices = synth.getVoices();
  }
  cachedLtVoice =
    voices.find((v) => v.lang === "lt-LT" || v.lang === "lt_LT") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("lt")) ??
    null;
  return cachedLtVoice;
}

function playViaSpeechSynthesis(text: string, rate: number): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const synth = window.speechSynthesis;
    const voice = await getLithuanianVoice();
    if (!voice) {
      // No Lithuanian voice installed — refuse rather than mangle pronunciation in English.
      reject(new Error("No Lithuanian voice installed"));
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = "lt-LT";
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    u.onend = () => { if (currentUtterance === u) currentUtterance = null; resolve(); };
    u.onerror = (e) => { if (currentUtterance === u) currentUtterance = null; reject(e); };
    currentUtterance = u;
    synth.speak(u);
  });
}

export async function speakLithuanian(text: string, rate: number = 1, voiceId?: string): Promise<void> {
  if (typeof window === "undefined") throw new Error("No window");
  stopSpeaking();
  // 1) Prefer the server TTS proxy — picks the requested voice from our catalog.
  try {
    await playViaGoogle(text, rate, voiceId);
    return;
  } catch {
    // 2) Fall back to native synthesis ONLY if a real lt voice is installed.
    if (window.speechSynthesis) {
      try {
        await playViaSpeechSynthesis(text, rate);
        return;
      } catch { /* swallow and rethrow below */ }
    }
    throw new Error("Audio unavailable — install a Lithuanian voice in your OS or check your network connection.");
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch { /* noop */ }
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  if (currentAudio && !currentAudio.paused) return true;
  return window.speechSynthesis?.speaking ?? false;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis?.getVoices() ?? [];
}
