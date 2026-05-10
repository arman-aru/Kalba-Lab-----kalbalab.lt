"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X, Share, Plus, Apple, Monitor } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const SNOOZE_KEY = "kalbalab.installSnoozedUntil";
const SNOOZE_DAYS = 7;

type Platform = "android" | "ios" | "windows" | "macos" | "other";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/Windows/.test(ua)) return "windows";
  if (/Mac/.test(ua)) return "macos";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS-specific
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [iosSheet, setIosSheet] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandalone()) return; // already installed

    const snoozedUntil = Number(localStorage.getItem(SNOOZE_KEY) || "0");
    const snoozed = snoozedUntil > Date.now();

    const p = detectPlatform();
    setPlatform(p);

    // Native prompt path (Android Chrome, Edge desktop, etc.)
    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      if (!snoozed) {
        // small delay so the banner doesn't appear before first paint
        setTimeout(() => setOpen(true), 1500);
      }
    };
    window.addEventListener("beforeinstallprompt", onBefore as EventListener);

    // iOS has no beforeinstallprompt — show our own card after a delay (only on Safari).
    if (p === "ios" && !snoozed) {
      const ua = navigator.userAgent;
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
      if (isSafari) setTimeout(() => setOpen(true), 2500);
    }

    // Hide if app gets installed.
    const onInstalled = () => {
      setOpen(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
    setOpen(false);
    setIosSheet(false);
  };

  const install = async () => {
    if (platform === "ios") {
      setIosSheet(true);
      return;
    }
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setOpen(false);
        setDeferred(null);
      } else {
        dismiss();
      }
    } catch {
      dismiss();
    }
  };

  if (!open && !iosSheet) return null;

  const PlatformIcon =
    platform === "ios" ? Apple :
    platform === "android" ? Smartphone :
    platform === "windows" || platform === "macos" ? Monitor :
    Smartphone;

  const platformLabel =
    platform === "ios" ? "iPhone / iPad" :
    platform === "android" ? "Android" :
    platform === "windows" ? "Windows" :
    platform === "macos" ? "Mac" :
    "your device";

  return (
    <>
      {/* Floating install card */}
      {open && !iosSheet && (
        <div
          role="dialog"
          aria-label="Install KalbaLab"
          className="fixed z-[60] left-3 right-3 bottom-3 md:left-auto md:right-6 md:bottom-6 md:max-w-sm"
          style={{ animation: "fadeUp 320ms ease-out backwards" }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-[var(--surface)]/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] p-4">
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />

            <button
              onClick={dismiss}
              className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/5"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>

            <div className="relative flex items-start gap-3 pr-6">
              <span className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/30 via-amber-500/15 to-amber-600/10 ring-1 ring-amber-500/30 text-amber-300">
                <PlatformIcon size={22} />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-gray-100 text-sm">Install Kalba Lab on {platformLabel}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Open instantly from your home screen. Works offline, no app store, free.
                </p>
              </div>
            </div>

            <div className="relative mt-3 flex items-center gap-2">
              <button
                onClick={install}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-sm font-bold transition-all"
              >
                <Download size={14} />
                Install — 1 tap
              </button>
              <button
                onClick={dismiss}
                className="inline-flex items-center justify-center px-3 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-300"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS step-by-step sheet (Safari has no native prompt) */}
      {iosSheet && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-label="Install on iOS">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
          <div
            className="absolute left-3 right-3 bottom-4 mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-[var(--surface)]/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] p-5"
            style={{ animation: "fadeUp 320ms ease-out backwards" }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/30 to-amber-600/10 ring-1 ring-amber-500/30 text-amber-300">
                  <Apple size={20} />
                </span>
                <div>
                  <p className="font-bold text-gray-100">Install on iPhone / iPad</p>
                  <p className="text-xs text-gray-500">Takes 5 seconds in Safari</p>
                </div>
              </div>
              <button onClick={dismiss} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/5">
                <X size={16} />
              </button>
            </div>

            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold ring-1 ring-amber-500/30">1</span>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Tap the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-gray-100"><Share size={12} /> Share</span> button at the bottom of Safari.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold ring-1 ring-amber-500/30">2</span>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Scroll down and tap <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-gray-100"><Plus size={12} /> Add to Home Screen</span>.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold ring-1 ring-amber-500/30">3</span>
                <p className="text-sm text-gray-200 leading-relaxed">Tap <span className="font-semibold text-amber-300">Add</span> — done. Open Kalba Lab from your home screen.</p>
              </li>
            </ol>

            <button
              onClick={dismiss}
              className="mt-5 w-full inline-flex items-center justify-center px-3 h-10 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 text-black text-sm font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
