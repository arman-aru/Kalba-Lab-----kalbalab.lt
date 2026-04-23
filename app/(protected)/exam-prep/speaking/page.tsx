"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Play, RotateCcw } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";

const SPEAKING_TOPICS = [
  {
    id: "intro",
    title_en: "Introduce Yourself",
    title_lt: "Prisistatykite",
    title_bn: "নিজেকে পরিচয় করান",
    questions: [
      { lt: "Koks jūsų vardas?", en: "What is your name?", bn: "আপনার নাম কী?" },
      { lt: "Iš kur jūs esate?", en: "Where are you from?", bn: "আপনি কোথা থেকে এসেছেন?" },
      { lt: "Kur gyvename?", en: "Where do you live?", bn: "আপনি কোথায় থাকেন?" },
      { lt: "Kuo dirbate?", en: "What do you do for work?", bn: "আপনি কী কাজ করেন?" },
    ],
    model_lt: "Labas! Mano vardas Anika. Aš esu iš Bangladešo. Gyvenu Vilniuje. Dirbu fabrike. Man trisdešimt metų.",
    model_en: "Hello! My name is Anika. I am from Bangladesh. I live in Vilnius. I work in a factory. I am thirty years old.",
    model_bn: "হ্যালো! আমার নাম আনিকা। আমি বাংলাদেশ থেকে। আমি ভিলনিউসে থাকি। আমি একটি কারখানায় কাজ করি। আমার বয়স ত্রিশ।",
    key_vocab: [
      { lt: "Mano vardas", en: "My name is", bn: "আমার নাম" },
      { lt: "Aš esu iš", en: "I am from", bn: "আমি থেকে এসেছি" },
      { lt: "Gyvenu", en: "I live (in)", bn: "আমি থাকি" },
      { lt: "Dirbu", en: "I work", bn: "আমি কাজ করি" },
    ],
  },
  {
    id: "family",
    title_en: "Talk About Your Family",
    title_lt: "Papasakokite apie šeimą",
    title_bn: "পরিবার সম্পর্কে বলুন",
    questions: [
      { lt: "Ar turite šeimą?", en: "Do you have a family?", bn: "আপনার কি পরিবার আছে?" },
      { lt: "Kiek turite vaikų?", en: "How many children do you have?", bn: "আপনার কয়টি সন্তান আছে?" },
      { lt: "Kur gyvena jūsų šeima?", en: "Where does your family live?", bn: "আপনার পরিবার কোথায় থাকে?" },
    ],
    model_lt: "Taip, turiu šeimą. Mano žmona ir du vaikai gyvena Bangladeše. Labai pasiilgstu. Planuoju atvežti juos į Lietuvą.",
    model_en: "Yes, I have a family. My wife and two children live in Bangladesh. I miss them a lot. I plan to bring them to Lithuania.",
    model_bn: "হ্যাঁ, আমার পরিবার আছে। আমার স্ত্রী ও দুই সন্তান বাংলাদেশে থাকে। আমি তাদের অনেক মিস করি। লিথুয়ানিয়ায় আনার পরিকল্পনা আছে।",
    key_vocab: [
      { lt: "šeima", en: "family", bn: "পরিবার" },
      { lt: "vaikai", en: "children", bn: "সন্তান" },
      { lt: "pasiilgstu", en: "I miss", bn: "মিস করি" },
      { lt: "planuoju", en: "I plan", bn: "পরিকল্পনা করি" },
    ],
  },
];

export default function SpeakingPracticePage() {
  const [topic, setTopic] = useState(SPEAKING_TOPICS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRef.current = recorder;
      setIsRecording(true);
    } catch {
      alert("Microphone access denied. Please allow microphone access to use this feature.\nমাইক্রোফোন অ্যাক্সেস নেই। এই ফিচারটি ব্যবহার করতে অনুমতি দিন।");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Exam Prep / Speaking</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Speaking Practice <span className="text-amber-400 font-bengali text-xl">· বলার অনুশীলন</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Kalbėjimas — Oral exam practice with recording</p>
      </div>

      <BengaliExplanation
        content="বলার পরীক্ষায় একজন পরীক্ষক আপনাকে প্রশ্ন করবেন। আপনাকে নিজের পরিচয়, পরিবার, কাজ ও দৈনন্দিন জীবন সম্পর্কে বলতে হবে। নিচে অনুশীলন করুন!"
        englishContent="In the speaking exam, an examiner will ask you questions about yourself, your family, work, and daily life. Practice below!"
        className="mb-6"
      />

      {/* Topic selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {SPEAKING_TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTopic(t); setAudioURL(null); setShowModel(false); }}
            className={cn("px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition-all", topic.id === t.id ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "border-[var(--border)] text-gray-400 hover:text-gray-200")}
          >
            {t.title_en}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questions */}
        <div>
          <div className="card-surface p-5 mb-4">
            <h2 className="font-bold text-gray-200 mb-1">{topic.title_en}</h2>
            <p className="text-amber-400 font-bold text-sm mb-0.5">{topic.title_lt}</p>
            <p className="text-emerald-400 font-bengali text-sm mb-4">{topic.title_bn}</p>

            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">পরীক্ষকের প্রশ্ন · Examiner&apos;s Questions</p>
            <div className="space-y-3">
              {topic.questions.map((q, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="lt-text font-bold text-sm">{q.lt}</span>
                    <AudioButton text={q.lt} size="sm" showSlow />
                  </div>
                  <p className="en-text text-xs">{q.en}</p>
                  <p className="bn-text font-bengali text-xs">{q.bn}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key vocab */}
          <div className="card-surface p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">মূল শব্দ · Key Vocabulary</p>
            <div className="grid grid-cols-2 gap-2">
              {topic.key_vocab.map((v) => (
                <div key={v.lt} className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-center gap-1">
                    <span className="lt-text font-bold text-xs">{v.lt}</span>
                    <AudioButton text={v.lt} size="sm" />
                  </div>
                  <p className="en-text text-xs">{v.en}</p>
                  <p className="bn-text font-bengali text-xs">{v.bn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recording panel */}
        <div>
          <div className="card-surface p-6 mb-4">
            <h3 className="font-bold text-gray-200 mb-4">নিজেকে রেকর্ড করুন · Record Yourself</h3>

            <div className="flex flex-col items-center gap-4">
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all",
                isRecording
                  ? "bg-red-500/20 border-red-500 audio-playing"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
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
                {isRecording ? "⏹ রেকর্ড বন্ধ করুন" : "🎙 রেকর্ড শুরু করুন"}
              </button>

              {isRecording && <p className="text-red-400 text-sm animate-pulse">Recording... রেকর্ড হচ্ছে...</p>}
            </div>

            {audioURL && (
              <div className="mt-4 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                <p className="text-xs text-gray-500 mb-2">আপনার রেকর্ডিং · Your Recording</p>
                <audio src={audioURL} controls className="w-full" />
                <button onClick={() => setAudioURL(null)} className="mt-2 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
                  <RotateCcw size={12} /> Delete recording
                </button>
              </div>
            )}
          </div>

          {/* Model answer */}
          <div className="card-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-200">মডেল উত্তর · Model Answer</h3>
              <button onClick={() => setShowModel(!showModel)} className="text-xs text-amber-400 hover:text-amber-300">
                {showModel ? "লুকান" : "দেখুন"}
              </button>
            </div>
            {showModel && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="lt-text font-bold text-sm">{topic.model_lt}</span>
                  <AudioButton text={topic.model_lt} size="sm" showSlow />
                </div>
                <p className="en-text text-sm">{topic.model_en}</p>
                <p className="bn-text font-bengali text-sm">{topic.model_bn}</p>
              </div>
            )}
            {!showModel && <p className="text-gray-600 text-sm font-bengali">প্রথমে নিজে চেষ্টা করুন, তারপর মডেল উত্তর দেখুন।</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
