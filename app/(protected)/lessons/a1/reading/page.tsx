"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useNativeTranslations } from "@/hooks/useNativeTranslations";
import { PageBackdrop } from "@/components/ui/PageBackdrop";

interface ReadingQuestion {
  q_en: string;
  q_bn: string;
  options_en: string[];
  options_bn: string[];
  correct: number;
  exp_en: string;
  exp_bn: string;
}

interface ReadingPassage {
  id: string;
  title_en: string;
  title_lt: string;
  title_bn: string;
  level: string;
  topic: string;
  text_lt: string;
  text_en: string;
  text_bn: string;
  questions: ReadingQuestion[];
  vocab: { lt: string; en: string; bn: string }[];
}

const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "p1", title_en: "My Family", title_lt: "Mano šeima", title_bn: "আমার পরিবার", level: "A1", topic: "Family",
    text_lt: "Mano vardas Karim. Aš esu iš Bangladešo. Turiu šeimą. Mano žmona ir du vaikai gyvena Dakoje. Mano žmonos vardas Fatima. Ji yra namų šeimininkė. Turime dukrą ir sūnų. Dukrai septyneri metai, sūnui penkeri. Labai pasiilgstu šeimos. Planuoju atvežti juos į Lietuvą kitąmet.",
    text_en: "My name is Karim. I am from Bangladesh. I have a family. My wife and two children live in Dhaka. My wife's name is Fatima. She is a housewife. We have a daughter and a son. The daughter is seven years old, the son is five. I miss my family very much. I plan to bring them to Lithuania next year.",
    text_bn: "আমার নাম করিম। আমি বাংলাদেশ থেকে। আমার পরিবার আছে। আমার স্ত্রী ও দুই সন্তান ঢাকায় থাকে। আমার স্ত্রীর নাম ফাতিমা। সে গৃহিণী। আমাদের একটি মেয়ে ও একটি ছেলে আছে। মেয়ের বয়স সাত, ছেলের পাঁচ। আমি পরিবারকে অনেক মিস করি। পরের বছর তাদের লিথুয়ানিয়ায় আনার পরিকল্পনা আছে।",
    questions: [
      { q_en: "Where is Karim from?",         q_bn: "করিম কোথা থেকে?",  options_en: ["Lithuania", "Bangladesh", "India", "Pakistan"], options_bn: ["লিথুয়ানিয়া", "বাংলাদেশ", "ভারত", "পাকিস্তান"], correct: 1, exp_en: "'Aš esu iš Bangladešo' = I am from Bangladesh.", exp_bn: "'Aš esu iš Bangladešo' = আমি বাংলাদেশ থেকে।" },
      { q_en: "How many children does Karim have?", q_bn: "করিমের কতটি সন্তান?", options_en: ["One", "Two", "Three", "None"],            options_bn: ["একটি", "দুটি", "তিনটি", "কোনোটি নেই"],   correct: 1, exp_en: "'du vaikai' = two children.",                exp_bn: "'du vaikai' = দুই সন্তান।" },
      { q_en: "How old is Karim's son?",      q_bn: "করিমের ছেলের বয়স কত?", options_en: ["3 years", "5 years", "7 years", "10 years"], options_bn: ["৩ বছর", "৫ বছর", "৭ বছর", "১০ বছর"],     correct: 1, exp_en: "'sūnui penkeri' = the son is five.",        exp_bn: "'sūnui penkeri' = ছেলের বয়স পাঁচ।" },
    ],
    vocab: [
      { lt: "šeima",      en: "family",  bn: "পরিবার" },
      { lt: "žmona",      en: "wife",    bn: "স্ত্রী" },
      { lt: "dukra",      en: "daughter", bn: "মেয়ে" },
      { lt: "sūnus",      en: "son",     bn: "ছেলে" },
      { lt: "pasiilgstu", en: "I miss",  bn: "মিস করি" },
    ],
  },
  {
    id: "p2", title_en: "My City", title_lt: "Mano miestas", title_bn: "আমার শহর", level: "A1", topic: "Places",
    text_lt: "Gyvenu Vilniuje. Vilnius yra Lietuvos sostinė. Čia gyvena apie pusė milijono žmonių. Mano butas yra Naujamiestyje. Netoli yra autobusų stotelė ir parduotuvė. Nuo namų iki darbo einu dvidešimt minučių pėsčiomis. Man patinka Vilnius. Miestas yra gražus ir saugus.",
    text_en: "I live in Vilnius. Vilnius is the capital of Lithuania. About half a million people live here. My apartment is in Naujamestis. Nearby there is a bus stop and a shop. From home to work I walk twenty minutes. I like Vilnius. The city is beautiful and safe.",
    text_bn: "আমি ভিলনিউসে থাকি। ভিলনিউস লিথুয়ানিয়ার রাজধানী। এখানে প্রায় পাঁচ লাখ মানুষ বাস করে। আমার অ্যাপার্টমেন্ট নাউজামেসটিসে। কাছেই একটি বাস স্টপ ও দোকান আছে। বাড়ি থেকে কাজে হেঁটে বিশ মিনিট। আমি ভিলনিউস পছন্দ করি। শহরটি সুন্দর ও নিরাপদ।",
    questions: [
      { q_en: "Vilnius is the capital of which country?", q_bn: "ভিলনিউস কোন দেশের রাজধানী?",       options_en: ["Estonia", "Latvia", "Lithuania", "Poland"],                                    options_bn: ["এস্তোনিয়া", "লাটভিয়া", "লিথুয়ানিয়া", "পোল্যান্ড"],          correct: 2, exp_en: "'Vilnius yra Lietuvos sostinė' = Vilnius is the capital of Lithuania.", exp_bn: "'Vilnius yra Lietuvos sostinė' = ভিলনিউস লিথুয়ানিয়ার রাজধানী।" },
      { q_en: "How long to walk from home to work?",      q_bn: "বাড়ি থেকে কাজে যেতে কত সময় লাগে?", options_en: ["10 minutes", "15 minutes", "20 minutes", "30 minutes"],                       options_bn: ["১০ মিনিট", "১৫ মিনিট", "২০ মিনিট", "৩০ মিনিট"],                  correct: 2, exp_en: "'dvidešimt minučių pėsčiomis' = twenty minutes on foot.",                exp_bn: "'dvidešimt minučių pėsčiomis' = হেঁটে বিশ মিনিট।" },
      { q_en: "What does the writer think of the city?",  q_bn: "লেখক শহর সম্পর্কে কী মনে করেন?",   options_en: ["Expensive", "Busy", "Beautiful and safe", "Small and quiet"],                  options_bn: ["ব্যয়বহুল", "ব্যস্ত", "সুন্দর ও নিরাপদ", "ছোট ও নিরিবিলি"],         correct: 2, exp_en: "'gražus ir saugus' = beautiful and safe.",                                exp_bn: "'gražus ir saugus' = সুন্দর ও নিরাপদ।" },
    ],
    vocab: [
      { lt: "sostinė",   en: "capital city",      bn: "রাজধানী" },
      { lt: "butas",     en: "apartment / flat", bn: "অ্যাপার্টমেন্ট" },
      { lt: "netoli",    en: "nearby / not far", bn: "কাছে" },
      { lt: "pėsčiomis", en: "on foot",          bn: "হেঁটে" },
      { lt: "saugus",    en: "safe",             bn: "নিরাপদ" },
    ],
  },
  {
    id: "p3", title_en: "A Working Day", title_lt: "Darbo diena", title_bn: "একটি কর্মদিবস", level: "A1", topic: "Daily Life",
    text_lt: "Keliuosi septintą ryto. Pusryčiauju ir einu į darbą. Dirbu gamykloje nuo aštuonių iki šešiolikos. Pietų pertrauka yra dvyliktą. Per pertrauką valgau sumuštinį ir geriu kavą. Po darbo einu į parduotuvę. Vakare mokaus lietuvių kalbos. Einu miegoti vienuoliktą valandą.",
    text_en: "I wake up at seven in the morning. I have breakfast and go to work. I work in a factory from eight to sixteen. Lunch break is at twelve. During the break I eat a sandwich and drink coffee. After work I go to the shop. In the evening I study Lithuanian. I go to sleep at eleven.",
    text_bn: "আমি সকাল সাতটায় উঠি। সকালের নাস্তা করে কাজে যাই। কারখানায় আটটা থেকে ষোলোটা পর্যন্ত কাজ করি। দুপুরের বিরতি বারোটায়। বিরতিতে স্যান্ডউইচ খাই ও কফি পান করি। কাজের পর দোকানে যাই। সন্ধ্যায় লিথুয়ানিয়ান পড়ি। রাত এগারোটায় ঘুমাতে যাই।",
    questions: [
      { q_en: "When does the writer wake up?",            q_bn: "লেখক কখন ঘুম থেকে ওঠেন?",      options_en: ["6 AM", "7 AM", "8 AM", "9 AM"],                                                  options_bn: ["৬টায়", "৭টায়", "৮টায়", "৯টায়"],                                  correct: 1, exp_en: "'Keliuosi septintą ryto' = I wake up at seven in the morning.",   exp_bn: "'Keliuosi septintą ryto' = সকাল সাতটায় উঠি।" },
      { q_en: "What does he eat during the lunch break?", q_bn: "দুপুরের বিরতিতে কী খান?",     options_en: ["Rice", "Sandwich", "Pizza", "Soup"],                                              options_bn: ["ভাত", "স্যান্ডউইচ", "পিৎজা", "স্যুপ"],                              correct: 1, exp_en: "'sumuštinį' = a sandwich.",                                       exp_bn: "'sumuštinį' = স্যান্ডউইচ।" },
      { q_en: "What does he do in the evening?",          q_bn: "সন্ধ্যায় কী করেন?",         options_en: ["Watches TV", "Hangs out with friends", "Studies Lithuanian", "Cooks"],            options_bn: ["টিভি দেখেন", "বন্ধুদের সাথে থাকেন", "লিথুয়ানিয়ান পড়েন", "রান্না করেন"], correct: 2, exp_en: "'mokaus lietuvių kalbos' = I study Lithuanian.",                  exp_bn: "'mokaus lietuvių kalbos' = লিথুয়ানিয়ান শিখি।" },
    ],
    vocab: [
      { lt: "keliuosi",      en: "I wake up / get up",      bn: "উঠি" },
      { lt: "pusryčiauju",   en: "I have breakfast",       bn: "সকালের নাস্তা করি" },
      { lt: "pertrauka",     en: "break / pause",          bn: "বিরতি" },
      { lt: "sumuštinis",    en: "sandwich",               bn: "স্যান্ডউইচ" },
      { lt: "mokaus",        en: "I am studying / learning", bn: "শিখছি" },
    ],
  },
  {
    id: "p4", title_en: "Lithuanian Nature", title_lt: "Lietuvos gamta", title_bn: "লিথুয়ানিয়ার প্রকৃতি", level: "A1", topic: "Nature",
    text_lt: "Lietuva yra graži šalis. Čia yra daug miškų ir ežerų. Vasarą šilta, žiemą labai šalta ir sninga. Man patinka lietuviška gamta. Sekmadieniais vaikštau parke. Parke yra medžių, žolės ir gėlių. Kartais einu prie ežero žvejoti.",
    text_en: "Lithuania is a beautiful country. There are many forests and lakes here. In summer it is warm, in winter it is very cold and it snows. I like Lithuanian nature. On Sundays I walk in the park. In the park there are trees, grass and flowers. Sometimes I go fishing at the lake.",
    text_bn: "লিথুয়ানিয়া একটি সুন্দর দেশ। এখানে অনেক বন ও হ্রদ আছে। গ্রীষ্মে উষ্ণ, শীতকালে খুব ঠান্ডা ও তুষারপাত হয়। আমি লিথুয়ানিয়ান প্রকৃতি পছন্দ করি। রবিবারে পার্কে হাঁটি। পার্কে গাছ, ঘাস ও ফুল আছে। মাঝেমাঝে হ্রদে মাছ ধরতে যাই।",
    questions: [
      { q_en: "What is plentiful in Lithuania?", q_bn: "লিথুয়ানিয়ায় কী বেশি আছে?", options_en: ["Mountains and deserts", "Forests and lakes", "Seas and islands", "Rivers and waterfalls"], options_bn: ["পাহাড় ও মরুভূমি", "বন ও হ্রদ", "সমুদ্র ও দ্বীপ", "নদী ও জলপ্রপাত"],          correct: 1, exp_en: "'daug miškų ir ežerų' = many forests and lakes.",        exp_bn: "'daug miškų ir ežerų' = অনেক বন ও হ্রদ।" },
      { q_en: "What is winter like?",            q_bn: "শীতকালে কেমন হয়?",         options_en: ["Warm and rainy", "Hot and dry", "Cold and snowy", "Mild and sunny"],                            options_bn: ["উষ্ণ ও বৃষ্টি", "গরম ও শুষ্ক", "ঠান্ডা ও তুষার", "হালকা ও রৌদ্রজ্জ্বল"], correct: 2, exp_en: "'žiemą labai šalta ir sninga' = winter is very cold with snow.", exp_bn: "'žiemą labai šalta ir sninga' = শীতে খুব ঠান্ডা ও তুষারপাত।" },
      { q_en: "Where does he walk on Sundays?",  q_bn: "রবিবারে কোথায় হাঁটেন?",   options_en: ["In the forest", "In the park", "By the lake", "In the city"],                                     options_bn: ["বনে", "পার্কে", "হ্রদের ধারে", "শহরে"],                                correct: 1, exp_en: "'Sekmadieniais vaikštau parke' = on Sundays I walk in the park.", exp_bn: "'Sekmadieniais vaikštau parke' = রবিবারে পার্কে হাঁটি।" },
    ],
    vocab: [
      { lt: "miškas",  en: "forest / wood",     bn: "বন" },
      { lt: "ežeras",  en: "lake",              bn: "হ্রদ" },
      { lt: "vasara",  en: "summer",            bn: "গ্রীষ্ম" },
      { lt: "žiema",   en: "winter",            bn: "শীত" },
      { lt: "sninga",  en: "it is snowing",     bn: "তুষারপাত হচ্ছে" },
    ],
  },
];

const HERO_EXPLAIN_EN = "Read each passage and answer the comprehension questions. Try to understand the main idea even without knowing every word.";
const HERO_EXPLAIN_BN = "প্রতিটি অনুচ্ছেদ পড়ুন এবং প্রশ্নের উত্তর দিন। প্রতিটি শব্দের অর্থ না জানলেও মূল বিষয় বোঝার চেষ্টা করুন।";

function NativeText({ value }: { value: string | undefined }) {
  if (!value) return <span className="inline-block w-24 h-3 rounded bg-white/5 animate-pulse" />;
  return <span>{value}</span>;
}

export default function ReadingLessonsPage() {
  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  const isEn = lang === "en";
  const showOther = !isBn && !isEn;

  const [passage, setPassage] = useState(READING_PASSAGES[0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showTranslation, setShowTranslation] = useState(false);

  const translatable = useMemo(() => {
    if (!showOther) return [];
    const set = new Set<string>();
    set.add(HERO_EXPLAIN_EN);
    READING_PASSAGES.forEach((p) => {
      set.add(p.title_en);
      set.add(p.text_en);
      p.questions.forEach((q) => {
        set.add(q.q_en);
        set.add(q.exp_en);
        q.options_en.forEach((o) => set.add(o));
      });
      p.vocab.forEach((v) => set.add(v.en));
    });
    return Array.from(set);
  }, [showOther]);
  const translated = useNativeTranslations(translatable, lang);

  const answer = (qIdx: number, optIdx: number) => {
    const key = `${passage.id}-${qIdx}`;
    if (answers[key] !== undefined) return;
    setAnswers({ ...answers, [key]: optIdx });
  };

  const allAnswered = passage.questions.every((_, qi) => answers[`${passage.id}-${qi}`] !== undefined);
  const score = passage.questions.filter((q, qi) => answers[`${passage.id}-${qi}`] === q.correct).length;

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 anim-fade-up">
          <div className="text-xs text-gray-500 mb-1">{t("lessons")} / A1 / {t("reading")}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-2">{t("reading")}</h1>
          <p className="text-gray-400 text-sm">Skaitymas — A1 reading passages with comprehension questions.</p>
        </div>

        <BengaliExplanation
          content={isBn ? HERO_EXPLAIN_BN : (translated.get(HERO_EXPLAIN_EN) ?? HERO_EXPLAIN_EN)}
          englishContent={isEn ? undefined : HERO_EXPLAIN_EN}
          className="mb-6"
        />

        {/* Passage selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {READING_PASSAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPassage(p); setAnswers({}); setShowTranslation(false); }}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                passage.id === p.id ? "bg-green-500/10 border-green-500/30" : "border-white/10 bg-white/[0.03] hover:border-green-500/20"
              )}
            >
              <p className={cn("text-sm font-bold", passage.id === p.id ? "text-green-300" : "text-gray-200")}>{p.title_en}</p>
              {isBn ? (
                <p className="text-xs text-gray-500 font-bengali">{p.title_bn}</p>
              ) : showOther ? (
                <p className="text-xs text-gray-500"><NativeText value={translated.get(p.title_en)} /></p>
              ) : null}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading text */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 mb-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300 mb-1 inline-block">{passage.topic}</span>
                  <h2 className="font-bold text-gray-100">{passage.title_en}</h2>
                  <p className="text-amber-400 font-bold text-sm">{passage.title_lt}</p>
                  {isBn && <p className="text-emerald-400 font-bengali text-sm">{passage.title_bn}</p>}
                </div>
                <AudioButton text={passage.text_lt} size="md" showSlow />
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/5 mb-4">
                <p className="lt-text text-base leading-loose">{passage.text_lt}</p>
              </div>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                {showTranslation ? t("hideAnswer") : t("showAnswer")}
              </button>
              {showTranslation && (
                <div className="mt-3 space-y-2 text-sm">
                  <p className="en-text leading-relaxed text-gray-300">{passage.text_en}</p>
                  {isBn && <p className="bn-text font-bengali leading-relaxed">{passage.text_bn}</p>}
                  {showOther && (
                    <p className="text-emerald-300/90 leading-relaxed"><NativeText value={translated.get(passage.text_en)} /></p>
                  )}
                </div>
              )}
            </div>

            {/* Key vocabulary */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Key Words</p>
              <div className="space-y-2">
                {passage.vocab.map((v) => (
                  <div key={v.lt} className="flex items-center gap-3 p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="flex items-center gap-1.5 w-36">
                      <span className="lt-text font-bold text-sm text-amber-400">{v.lt}</span>
                      <AudioButton text={v.lt} size="sm" />
                    </div>
                    <span className="en-text text-xs w-28 text-gray-300">{v.en}</span>
                    {isBn ? (
                      <span className="bn-text font-bengali text-xs text-emerald-400">{v.bn}</span>
                    ) : showOther ? (
                      <span className="text-xs text-emerald-300/80"><NativeText value={translated.get(v.en)} /></span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {passage.questions.map((q, qi) => {
              const key = `${passage.id}-${qi}`;
              const userAnswer = answers[key];
              const answered = userAnswer !== undefined;
              return (
                <div key={qi} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
                  <p className="text-xs text-gray-500 mb-1">Question {qi + 1}</p>
                  <p className={cn("font-medium text-gray-100 mb-1", isBn && "font-bengali")}>
                    {isEn ? q.q_en : isBn ? q.q_bn : <NativeText value={translated.get(q.q_en)} />}
                  </p>
                  {!isEn && <p className="text-xs text-gray-500 mb-3">{q.q_en}</p>}
                  <div className="space-y-2">
                    {q.options_en.map((optEn, oi) => {
                      const optBn = q.options_bn[oi];
                      const display = isEn ? optEn : isBn ? optBn : translated.get(optEn);
                      let style = "border-white/10 bg-white/[0.02] text-gray-300 hover:border-green-500/30 hover:bg-white/[0.05]";
                      if (answered) {
                        if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                        else if (oi === userAnswer) style = "border-red-500 bg-red-500/10 text-red-300";
                        else style = "border-white/10 text-gray-600 opacity-50";
                      }
                      return (
                        <button key={oi} onClick={() => answer(qi, oi)}
                          className={cn("w-full text-left px-3 py-2 rounded-lg border text-sm transition-all", isBn && "font-bengali", style)}>
                          {String.fromCharCode(65 + oi)}. {display ?? <NativeText value={undefined} />}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <p className={cn("text-sm text-emerald-200", isBn && "font-bengali")}>
                        💡 {isEn ? q.exp_en : isBn ? q.exp_bn : <NativeText value={translated.get(q.exp_en)} />}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {allAnswered && (
              <div className={cn(
                "rounded-2xl p-5 border",
                score === passage.questions.length ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"
              )}>
                <p className="font-bold text-gray-100 mb-1">
                  {score === passage.questions.length ? "🎉" : "✓"} {t("complete")}
                </p>
                <p className="text-2xl font-bold text-amber-400">{score}/{passage.questions.length}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
