"use client";

import { useState } from "react";
import { Play, Pause, Check, BadgeCheck } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { VOICES, type VoicePack } from "@/lib/voices";
import { speakLithuanian, stopSpeaking } from "@/lib/audio";

const PREVIEW_TEXT = "Labas! Aš mokausi lietuvių kalbos.";

export function VoicePicker() {
  const voiceId = useAppStore((s) => s.voiceId);
  const setVoiceId = useAppStore((s) => s.setVoiceId);
  const [previewing, setPreviewing] = useState<string | null>(null);

  const togglePreview = async (v: VoicePack) => {
    if (previewing === v.id) {
      stopSpeaking();
      setPreviewing(null);
      return;
    }
    stopSpeaking();
    setPreviewing(v.id);
    try {
      await speakLithuanian(PREVIEW_TEXT, 1, v.id);
    } catch { /* swallow */ }
    finally {
      setPreviewing((p) => (p === v.id ? null : p));
    }
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <label className="block text-sm font-medium text-gray-300">Voice pack</label>
        <span className="text-[11px] text-gray-500">Tap ▶ to preview</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {VOICES.map((v) => {
          const active = voiceId === v.id;
          const isPreviewing = previewing === v.id;
          return (
            <div
              key={v.id}
              className={`relative rounded-xl border p-3 transition-all cursor-pointer ${
                active
                  ? "border-amber-500/40 bg-amber-500/10 ring-1 ring-amber-500/30"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
              onClick={() => setVoiceId(v.id)}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); togglePreview(v); }}
                  className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                    isPreviewing
                      ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                      : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                  aria-label={`Preview ${v.name}`}
                >
                  {isPreviewing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-semibold ${active ? "text-amber-200" : "text-gray-100"}`}>{v.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      v.gender === "female" ? "bg-pink-500/15 text-pink-300" : "bg-cyan-500/15 text-cyan-300"
                    }`}>
                      {v.gender}
                    </span>
                    {v.native && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                        <BadgeCheck size={10} /> Native
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{v.description}</p>
                </div>

                {active && (
                  <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-gray-500">
        <span className="text-emerald-400 font-semibold">Native</span> voices are recorded by Lithuanian speakers — best pronunciation.
        Multilingual voices speak Lithuanian very well but with a subtle accent.
      </p>
    </div>
  );
}
