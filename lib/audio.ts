"use client";

// iOS Safari only "unlocks" the SPECIFIC HTMLAudioElement that was created
// (and had .play() called on it) inside the original user gesture. New audio
// elements created later silently fail or get queued. We work around this by
// keeping ONE module-scoped element and just swapping its `src`.
let sharedAudio: HTMLAudioElement | null = null;
let activeReject: ((reason?: unknown) => void) | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedLtVoice: SpeechSynthesisVoice | null | undefined = undefined;

function getSharedAudio(): HTMLAudioElement {
  if (sharedAudio) return sharedAudio;
  const a = new Audio();
  a.preload = "auto";
  // Important on iOS: stay inline (don't fullscreen) and don't suspend on page changes.
  a.setAttribute("playsinline", "");
  a.crossOrigin = "anonymous";
  sharedAudio = a;
  return a;
}

function googleTtsUrl(text: string, slow = false, voiceId?: string): string {
  const params = new URLSearchParams({ text });
  if (slow) params.set("slow", "1");
  if (voiceId) params.set("voice", voiceId);
  return `/api/tts?${params.toString()}`;
}

function playViaGoogle(text: string, rate: number, voiceId?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const wantSlow = rate < 0.95;
    const audio = getSharedAudio();

    // Detach previous one-shot listeners by cloning handlers via assignment.
    const onEnded = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("Google TTS failed")); };
    const cleanup = () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      if (activeReject === reject) activeReject = null;
    };

    audio.addEventListener("ended", onEnded, { once: true });
    audio.addEventListener("error", onError, { once: true });

    // Track the active rejector so stopSpeaking() can settle the promise
    // (pause() alone fires neither ended nor error — would hang forever).
    activeReject = (reason) => { cleanup(); reject(reason ?? new Error("Aborted")); };

    audio.src = googleTtsUrl(text, wantSlow, voiceId);
    audio.playbackRate = wantSlow ? 1 : Math.max(0.5, Math.min(2, rate));
    // Force iOS to actually load the new src instead of re-using the buffer
    // from the previous play (which is what caused "same audio plays again").
    audio.load();

    const playResult = audio.play();
    // Some browsers (older Safari) return undefined instead of a Promise.
    if (playResult && typeof playResult.then === "function") {
      playResult.catch((err) => { cleanup(); reject(err); });
    }
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
    // iOS Safari quirk: speechSynthesis sometimes refuses to start a new
    // utterance until the queue is drained.
    synth.cancel();
    synth.speak(u);
  });
}

export async function speakLithuanian(text: string, rate: number = 1, voiceId?: string): Promise<void> {
  if (typeof window === "undefined") throw new Error("No window");
  // CRITICAL: prime the shared audio element synchronously during the user
  // gesture. iOS Safari only grants playback permission to elements touched
  // inside a click handler — even an empty .load() qualifies.
  getSharedAudio();
  stopSpeaking();
  try {
    await playViaGoogle(text, rate, voiceId);
    return;
  } catch {
    if (window.speechSynthesis) {
      try {
        await playViaSpeechSynthesis(text, rate);
        return;
      } catch { /* fall through */ }
    }
    throw new Error("Audio unavailable — install a Lithuanian voice in your OS or check your network connection.");
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (sharedAudio) {
    try { sharedAudio.pause(); sharedAudio.currentTime = 0; } catch { /* noop */ }
  }
  // Reject the in-flight play promise so the caller's `finally` runs and the
  // UI doesn't get stuck in the "playing" state.
  if (activeReject) {
    const r = activeReject;
    activeReject = null;
    r(new Error("Aborted"));
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  if (sharedAudio && !sharedAudio.paused) return true;
  return window.speechSynthesis?.speaking ?? false;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis?.getVoices() ?? [];
}
