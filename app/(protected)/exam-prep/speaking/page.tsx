"use client";

import { useMemo, useRef, useState } from "react";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

const SPEAKING_TOPICS = [
  {
    id: "intro", title_en: "Introduce Yourself", title_lt: "Prisistatykite", title_bn: "নিজেকে পরিচয় করান",
    questions: [
      { lt: "Koks jūsų vardas?",   en: "What is your name?",     bn: "আপনার নাম কী?" },
      { lt: "Iš kur jūs esate?",   en: "Where are you from?",   bn: "আপনি কোথা থেকে এসেছেন?" },
      { lt: "Kur gyvename?",       en: "Where do you live?",    bn: "আপনি কোথায় থাকেন?" },
      { lt: "Kuo dirbate?",        en: "What do you do for work?", bn: "আপনি কী কাজ করেন?" },
    ],
    model_lt: "Labas! Mano vardas Arman. Aš esu iš Bangladešo. Gyvenu Vilniuje. Dirbu fabrike. Man trisdešimt metų.",
    model_en: "Hello! My name is Arman. I am from Bangladesh. I live in Vilnius. I work in a factory. I am thirty years old.",
    model_bn: "হ্যালো! আমার নাম আরমান। আমি বাংলাদেশ থেকে। আমি ভিলনিউসে থাকি। আমি একটি কারখানায় কাজ করি। আমার বয়স ত্রিশ।",
    key_vocab: [
      { lt: "Mano vardas", en: "My name is",  bn: "আমার নাম" },
      { lt: "Aš esu iš",   en: "I am from",   bn: "আমি থেকে এসেছি" },
      { lt: "Gyvenu",      en: "I live (in)", bn: "আমি থাকি" },
      { lt: "Dirbu",       en: "I work",      bn: "আমি কাজ করি" },
    ],
  },
  {
    id: "family", title_en: "Talk About Your Family", title_lt: "Papasakokite apie šeimą", title_bn: "পরিবার সম্পর্কে বলুন",
    questions: [
      { lt: "Ar turite šeimą?",       en: "Do you have a family?",         bn: "আপনার কি পরিবার আছে?" },
      { lt: "Kiek turite vaikų?",     en: "How many children do you have?", bn: "আপনার কয়টি সন্তান আছে?" },
      { lt: "Kur gyvena jūsų šeima?", en: "Where does your family live?",   bn: "আপনার পরিবার কোথায় থাকে?" },
    ],
    model_lt: "Taip, turiu šeimą. Mano žmona ir du vaikai gyvena Bangladeše. Labai pasiilgstu. Planuoju atvežti juos į Lietuvą.",
    model_en: "Yes, I have a family. My wife and two children live in Bangladesh. I miss them a lot. I plan to bring them to Lithuania.",
    model_bn: "হ্যাঁ, আমার পরিবার আছে। আমার স্ত্রী ও দুই সন্তান বাংলাদেশে থাকে। আমি তাদের অনেক মিস করি। লিথুয়ানিয়ায় আনার পরিকল্পনা আছে।",
    key_vocab: [
      { lt: "šeima",     en: "family",   bn: "পরিবার" },
      { lt: "vaikai",    en: "children", bn: "সন্তান" },
      { lt: "pasiilgstu", en: "I miss",  bn: "মিস করি" },
      { lt: "planuoju",  en: "I plan",   bn: "পরিকল্পনা করি" },
    ],
  },
];

const HERO_EXPLAIN_EN = "In the speaking exam, an examiner will ask you questions about yourself, your family, work, and daily life. Practice below.";
const HERO_EXPLAIN_BN = "বলার পরীক্ষায় একজন পরীক্ষক আপনাকে প্রশ্ন করবেন। আপনাকে নিজের পরিচয়, পরিবার, কাজ ও দৈনন্দিন জীবন সম্পর্কে বলতে হবে। নিচে অনুশীলন করুন!";

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-20 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function SpeakingPracticePage() {
  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;

  const [topic, setTopic] = useState(SPEAKING_TOPICS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Pick the first MIME type the current browser supports for recording.
  // Chrome/Firefox: webm/opus. Safari: mp4/aac. Some Android: ogg.
  const pickRecorderMime = (): string | undefined => {
    if (typeof MediaRecorder === "undefined") return undefined;
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];
    for (const m of candidates) {
      if (MediaRecorder.isTypeSupported(m)) return m;
    }
    return undefined;
  };

  const translatable = useMemo(() => {
    if (!showOther) return [];
    const set = new Set<string>();
    set.add(HERO_EXPLAIN_EN);
    SPEAKING_TOPICS.forEach((tp) => {
      set.add(tp.title_en);
      set.add(tp.model_en);
      tp.questions.forEach((q) => set.add(q.en));
      tp.key_vocab.forEach((v) => set.add(v.en));
    });
    return Array.from(set);
  }, [showOther]);
  const translated = useNativeTranslations(translatable, lang);

  const startRecording = async () => {
    setRecError(null);

    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setRecError("Your browser doesn't support audio recording. Try Chrome, Firefox, or Safari.");
      return;
    }

    // Free a previous recording before starting a new one.
    if (audioURL) { URL.revokeObjectURL(audioURL); setAudioURL(null); }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickRecorderMime();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onerror = () => {
        setRecError("Recording failed. Please try again.");
        stream.getTracks().forEach((tr) => tr.stop());
        setIsRecording(false);
      };
      recorder.onstop = () => {
        // Use the recorder's own mimeType (or the first chunk's) so playback
        // matches what was actually recorded — mixing webm/mp4 breaks Safari.
        const type = recorder.mimeType || chunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        if (blob.size === 0) {
          setRecError("No audio captured. Check that your microphone is working.");
        } else {
          setAudioURL(URL.createObjectURL(blob));
        }
        stream.getTracks().forEach((tr) => tr.stop());
      };

      // timeslice ensures dataavailable fires periodically — safer across browsers
      recorder.start(1000);
      mediaRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setRecError("Microphone access denied. Allow microphone permission in your browser settings.");
      } else if (name === "NotFoundError") {
        setRecError("No microphone found. Connect a microphone and try again.");
      } else {
        setRecError("Could not start recording. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="text-xs text-gray-500 mb-1">{t("examPrep")} / {t("speaking")}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("speaking")}</h1>
          <p className="text-gray-400 text-sm">Kalbėjimas — Oral exam practice with recording.</p>
        </div>

        <BengaliExplanation
          content={isBn ? HERO_EXPLAIN_BN : (translated.get(HERO_EXPLAIN_EN) ?? HERO_EXPLAIN_EN)}
          englishContent={isEn ? undefined : HERO_EXPLAIN_EN}
          className="mb-6"
        />

        {/* Topic selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {SPEAKING_TOPICS.map((tp) => (
            <button
              key={tp.id}
              onClick={() => { setTopic(tp); setAudioURL(null); setShowModel(false); }}
              className={cn(
                "px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all",
                topic.id === tp.id
                  ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:border-amber-500/30"
              )}
            >
              {tp.title_en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Questions */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 mb-4">
              <h2 className="font-bold text-gray-100 mb-1">{topic.title_en}</h2>
              <p className="text-amber-400 font-bold text-sm mb-1">{topic.title_lt}</p>
              {isBn ? (
                <p className="text-emerald-400 font-bengali text-sm mb-4">{topic.title_bn}</p>
              ) : showOther ? (
                <p className="text-emerald-300/90 text-sm mb-4"><NativeText value={translated.get(topic.title_en)} /></p>
              ) : <div className="mb-4" />}

              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Examiner's Questions</p>
              <div className="space-y-3">
                {topic.questions.map((q, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="lt-text font-bold text-sm text-amber-400">{q.lt}</span>
                      <AudioButton text={q.lt} size="sm" showSlow />
                    </div>
                    <p className="en-text text-xs text-gray-300">{q.en}</p>
                    {isBn ? (
                      <p className="bn-text font-bengali text-xs text-emerald-400">{q.bn}</p>
                    ) : showOther ? (
                      <p className="text-xs text-emerald-300/80"><NativeText value={translated.get(q.en)} /></p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Key Vocabulary</p>
              <div className="grid grid-cols-2 gap-2">
                {topic.key_vocab.map((v) => (
                  <div key={v.lt} className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="flex items-center gap-1">
                      <span className="lt-text font-bold text-xs text-amber-400">{v.lt}</span>
                      <AudioButton text={v.lt} size="sm" />
                    </div>
                    <p className="en-text text-xs text-gray-300">{v.en}</p>
                    {isBn ? (
                      <p className="bn-text font-bengali text-xs text-emerald-400">{v.bn}</p>
                    ) : showOther ? (
                      <p className="text-xs text-emerald-300/80"><NativeText value={translated.get(v.en)} /></p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recording panel */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-4">
              <h3 className="font-bold text-gray-100 mb-4">Record Yourself</h3>

              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all",
                  isRecording
                    ? "bg-red-500/20 border-red-500 audio-playing"
                    : "bg-white/[0.03] border-white/10 hover:border-amber-500/30"
                )}>
                  {isRecording ? <MicOff size={36} className="text-red-400" /> : <Mic size={36} className="text-gray-400" />}
                </div>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "px-6 py-3 rounded-xl font-semibold transition-all",
                    isRecording
                      ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                      : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                  )}
                >
                  {isRecording ? "⏹ Stop recording" : "🎙 Start recording"}
                </button>

                {isRecording && <p className="text-red-400 text-sm animate-pulse">Recording…</p>}
              </div>

              {recError && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {recError}
                </div>
              )}

              {audioURL && (
                <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Your recording</p>
                  <audio
                    key={audioURL}
                    src={audioURL}
                    controls
                    preload="metadata"
                    className="w-full"
                    onError={() => setRecError("Recorded audio could not be played in this browser.")}
                  />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(audioURL);
                      setAudioURL(null);
                      setRecError(null);
                    }}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Delete recording
                  </button>
                </div>
              )}
            </div>

            {/* Model answer */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-100">Model Answer</h3>
                <button onClick={() => setShowModel(!showModel)} className="text-xs text-amber-400 hover:text-amber-300">
                  {showModel ? t("hideAnswer") : t("showAnswer")}
                </button>
              </div>
              {showModel ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="lt-text font-bold text-sm text-amber-400">{topic.model_lt}</span>
                    <AudioButton text={topic.model_lt} size="sm" showSlow />
                  </div>
                  <p className="en-text text-sm text-gray-300">{topic.model_en}</p>
                  {isBn ? (
                    <p className="bn-text font-bengali text-sm text-emerald-300/90">{topic.model_bn}</p>
                  ) : showOther ? (
                    <p className="text-sm text-emerald-300/90"><NativeText value={translated.get(topic.model_en)} /></p>
                  ) : null}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Try first yourself, then reveal the model answer.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
