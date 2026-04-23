"use client";

import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";

const FORM_FIELDS = [
  { label_lt: "Vardas", label_en: "First Name", label_bn: "প্রথম নাম", hint_bn: "আপনার প্রথম নাম লিখুন" },
  { label_lt: "Pavardė", label_en: "Last Name", label_bn: "পদবি", hint_bn: "আপনার পদবি/পারিবারিক নাম" },
  { label_lt: "Gimimo data", label_en: "Date of Birth", label_bn: "জন্ম তারিখ", hint_bn: "দিন/মাস/বছর (dd/mm/yyyy)" },
  { label_lt: "Adresas", label_en: "Address", label_bn: "ঠিকানা", hint_bn: "আপনার বর্তমান ঠিকানা" },
  { label_lt: "Telefono numeris", label_en: "Phone Number", label_bn: "ফোন নম্বর", hint_bn: "+370 xxx xxxxx" },
  { label_lt: "El. paštas", label_en: "Email", label_bn: "ইমেইল", hint_bn: "example@email.com" },
];

const WRITING_PROMPTS = [
  {
    id: "1",
    prompt_bn: "আপনার বন্ধুকে একটি বার্তা লিখুন যে আপনি শনিবার পার্কে দেখা করতে পারবেন না।",
    prompt_en: "Write a message to your friend saying you cannot meet at the park on Saturday.",
    keywords_bn: ["দুঃখিত", "শনিবার", "পারব না", "অন্য দিন", "কারণ"],
    model_lt: "Labas! Atsiprašau, bet šeštadienį negaliu ateiti į parką. Dirbu iki vakaro. Gal kitą savaitę? Ačiū už supratimą!",
    model_en: "Hello! Sorry, but I cannot come to the park on Saturday. I work until evening. Maybe next week? Thank you for understanding!",
    model_bn: "হ্যালো! দুঃখিত, কিন্তু শনিবার আমি পার্কে আসতে পারব না। আমি সন্ধ্যা পর্যন্ত কাজ করব। হয়তো পরের সপ্তাহে? বোঝার জন্য ধন্যবাদ!",
  },
  {
    id: "2",
    prompt_bn: "আপনার সহকর্মীকে একটি বার্তা লিখুন যে আপনি অসুস্থ এবং আজ কাজে আসতে পারবেন না।",
    prompt_en: "Write a message to your colleague that you are sick and cannot come to work today.",
    keywords_bn: ["অসুস্থ", "আজ", "পারব না", "ডাক্তার", "আশা করি"],
    model_lt: "Sveiki! Šiandien sergu ir negaliu ateiti į darbą. Einu pas gydytoją. Grįšiu rytoj. Atsiprašau dėl nepatogumų.",
    model_en: "Hello! Today I am sick and cannot come to work. I'm going to the doctor. I'll be back tomorrow. Sorry for the inconvenience.",
    model_bn: "হ্যালো! আজ আমি অসুস্থ এবং কাজে আসতে পারব না। ডাক্তারের কাছে যাচ্ছি। আগামীকাল ফিরব। অসুবিধার জন্য দুঃখিত।",
  },
];

const CONNECTORS = [
  { lt: "ir", en: "and", bn: "এবং" },
  { lt: "bet", en: "but", bn: "কিন্তু" },
  { lt: "nes", en: "because", bn: "কারণ" },
  { lt: "todėl", en: "therefore", bn: "তাই" },
  { lt: "taip pat", en: "also", bn: "এছাড়াও" },
  { lt: "gal", en: "maybe", bn: "হয়তো" },
  { lt: "Atsiprašau", en: "Sorry", bn: "দুঃখিত" },
  { lt: "Ačiū", en: "Thank you", bn: "ধন্যবাদ" },
];

export default function WritingPracticePage() {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [activePrompt, setActivePrompt] = useState(WRITING_PROMPTS[0]);
  const [message, setMessage] = useState("");
  const [showModel, setShowModel] = useState(false);

  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Exam Prep / Writing</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Writing Practice <span className="text-amber-400 font-bengali text-xl">· লেখার অনুশীলন</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Rašymas — Practice form filling and message writing</p>
      </div>

      {/* Exercise 1: Form */}
      <div className="card-surface p-6 mb-6">
        <h2 className="font-bold text-gray-200 text-lg mb-1">ব্যায়াম ১: ফর্ম পূরণ · Exercise 1: Form Filling</h2>
        <p className="text-gray-400 text-sm mb-4 font-bengali">নিচের ফর্মটি পূরণ করুন — লিথুয়ানিয়ান ক্ষেত্রগুলো পড়ে বাংলা সংকেত অনুযায়ী তথ্য দিন</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FORM_FIELDS.map((field) => (
            <div key={field.label_lt}>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="lt-text font-bold text-sm">{field.label_lt}</label>
                <AudioButton text={field.label_lt} size="sm" />
                <span className="text-gray-400 text-xs">({field.label_en})</span>
              </div>
              <p className="text-xs text-gray-500 font-bengali mb-1">{field.label_bn}: {field.hint_bn}</p>
              <input
                type="text"
                value={formValues[field.label_lt] ?? ""}
                onChange={(e) => setFormValues({ ...formValues, [field.label_lt]: e.target.value })}
                placeholder={field.hint_bn}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Exercise 2: Message */}
      <div className="card-surface p-6 mb-6">
        <h2 className="font-bold text-gray-200 text-lg mb-1">ব্যায়াম ২: বার্তা লেখা · Exercise 2: Message Writing</h2>
        <p className="text-gray-400 text-sm mb-4">লক্ষ্য: ৫০-৮০ শব্দ · Target: 50-80 words</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {WRITING_PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActivePrompt(p); setMessage(""); setShowModel(false); }}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${activePrompt.id === p.id ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "border-[var(--border)] text-gray-400 hover:text-gray-200"}`}
            >
              Prompt {p.id}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 mb-4">
          <p className="bn-text font-bengali text-emerald-200">{activePrompt.prompt_bn}</p>
          <p className="text-gray-400 text-sm mt-1">{activePrompt.prompt_en}</p>
        </div>

        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-2 font-bengali">মূল শব্দ যা ব্যবহার করতে পারেন:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activePrompt.keywords_bn.map((k) => (
              <span key={k} className="text-xs px-2 py-0.5 rounded bg-amber-900/20 text-amber-400 font-bengali">{k}</span>
            ))}
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="এখানে আপনার বার্তা লিথুয়ানিয়ানে লিখুন... / Write your message in Lithuanian here..."
          rows={5}
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none text-sm resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${wordCount < 50 ? "text-red-400" : wordCount <= 80 ? "text-emerald-400" : "text-amber-400"}`}>
            {wordCount} words {wordCount < 50 ? "(আরো লিখুন)" : wordCount <= 80 ? "(✓ ভালো!)" : "(একটু ছোট করুন)"}
          </span>
          <button
            onClick={() => setShowModel(!showModel)}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            {showModel ? "মডেল উত্তর লুকান" : "মডেল উত্তর দেখুন"}
          </button>
        </div>

        {showModel && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Model Answer</p>
            <div className="flex items-center gap-2 mb-1">
              <p className="lt-text font-medium text-sm">{activePrompt.model_lt}</p>
              <AudioButton text={activePrompt.model_lt} size="sm" />
            </div>
            <p className="en-text text-xs mb-1">{activePrompt.model_en}</p>
            <p className="bn-text font-bengali text-sm">{activePrompt.model_bn}</p>
          </div>
        )}
      </div>

      {/* Connectors */}
      <div className="card-surface p-5">
        <h2 className="font-bold text-gray-200 mb-3">দরকারী সংযোজক · Useful Connectors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONNECTORS.map((c) => (
            <div key={c.lt} className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="lt-text font-bold text-sm">{c.lt}</span>
                <AudioButton text={c.lt} size="sm" />
              </div>
              <p className="en-text text-xs">{c.en}</p>
              <p className="bn-text font-bengali text-xs">{c.bn}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
