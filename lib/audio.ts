"use client";

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakLithuanian(text: string, rate: number = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "lt-LT";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const ltVoice = voices.find((v) => v.lang.startsWith("lt"));
    if (ltVoice) utterance.voice = ltVoice;

    utterance.onend = () => { currentUtterance = null; resolve(); };
    utterance.onerror = (e) => { currentUtterance = null; reject(e); };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  return window.speechSynthesis?.speaking ?? false;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis?.getVoices() ?? [];
}
