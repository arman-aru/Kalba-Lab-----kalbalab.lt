// Lithuanian TTS voice catalog.
// "azure-neural" voices go through msedge-tts (Microsoft Edge Neural).
// "translate-tts" is the public Google Translate voice — fallback only.
// All Azure Neural voices listed here have been tested with Lithuanian.

export type VoiceProvider = "azure-neural" | "translate-tts";

export interface VoicePack {
  id: string;
  /** What we show in the dropdown */
  name: string;
  /** One-line description shown under the name */
  description: string;
  gender: "female" | "male";
  /** Native Lithuanian voice = best pronunciation. */
  native: boolean;
  provider: VoiceProvider;
  /** Internal voice identifier passed to the provider. */
  voiceName: string;
}

export const VOICES: VoicePack[] = [
  {
    id: "ona",
    name: "Ona",
    description: "Native Lithuanian female — natural and clear",
    gender: "female",
    native: true,
    provider: "azure-neural",
    voiceName: "lt-LT-OnaNeural",
  },
  {
    id: "leonas",
    name: "Leonas",
    description: "Native Lithuanian male — warm and confident",
    gender: "male",
    native: true,
    provider: "azure-neural",
    voiceName: "lt-LT-LeonasNeural",
  },
  {
    id: "ava",
    name: "Ava",
    description: "Multilingual female — soft and modern",
    gender: "female",
    native: false,
    provider: "azure-neural",
    voiceName: "en-US-AvaMultilingualNeural",
  },
  {
    id: "andrew",
    name: "Andrew",
    description: "Multilingual male — calm and professional",
    gender: "male",
    native: false,
    provider: "azure-neural",
    voiceName: "en-US-AndrewMultilingualNeural",
  },
  {
    id: "emma",
    name: "Emma",
    description: "Multilingual female — expressive",
    gender: "female",
    native: false,
    provider: "azure-neural",
    voiceName: "en-US-EmmaMultilingualNeural",
  },
  {
    id: "brian",
    name: "Brian",
    description: "Multilingual male — deep and steady",
    gender: "male",
    native: false,
    provider: "azure-neural",
    voiceName: "en-US-BrianMultilingualNeural",
  },
  {
    id: "translate",
    name: "Classic",
    description: "Public Google Translate voice (fallback)",
    gender: "female",
    native: false,
    provider: "translate-tts",
    voiceName: "translate-tts",
  },
];

export const DEFAULT_VOICE_ID = "ona";

export function getVoice(id?: string | null): VoicePack {
  return VOICES.find((v) => v.id === id) ?? VOICES.find((v) => v.id === DEFAULT_VOICE_ID)!;
}
