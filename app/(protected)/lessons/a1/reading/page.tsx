"use client";

import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { BengaliExplanation } from "@/components/shared/BengaliExplanation";
import { cn } from "@/lib/utils";

const READING_PASSAGES = [
  {
    id: "p1",
    title_en: "My Family",
    title_lt: "Mano šeima",
    title_bn: "আমার পরিবার",
    level: "A1",
    topic: "Family",
    text_lt: "Mano vardas Karim. Aš esu iš Bangladešo. Turiu šeimą. Mano žmona ir du vaikai gyvena Dakoje. Mano žmonos vardas Fatima. Ji yra namų šeimininkė. Turime dukrą ir sūnų. Dukrai septyneri metai, sūnui penkeri. Labai pasiilgstu šeimos. Planuoju atvežti juos į Lietuvą kitąmet.",
    text_en: "My name is Karim. I am from Bangladesh. I have a family. My wife and two children live in Dhaka. My wife's name is Fatima. She is a housewife. We have a daughter and a son. The daughter is seven years old, the son is five. I miss my family very much. I plan to bring them to Lithuania next year.",
    text_bn: "আমার নাম করিম। আমি বাংলাদেশ থেকে। আমার পরিবার আছে। আমার স্ত্রী ও দুই সন্তান ঢাকায় থাকে। আমার স্ত্রীর নাম ফাতিমা। সে গৃহিণী। আমাদের একটি মেয়ে ও একটি ছেলে আছে। মেয়ের বয়স সাত, ছেলের পাঁচ। আমি পরিবারকে অনেক মিস করি। পরের বছর তাদের লিথুয়ানিয়ায় আনার পরিকল্পনা আছে।",
    questions: [
      { q_bn: "করিম কোথা থেকে?", q_en: "Where is Karim from?", options_bn: ["লিথুয়ানিয়া", "বাংলাদেশ", "ভারত", "পাকিস্তান"], correct: 1, exp_bn: "'Aš esu iš Bangladešo' = আমি বাংলাদেশ থেকে।" },
      { q_bn: "করিমের কতটি সন্তান?", q_en: "How many children does Karim have?", options_bn: ["একটি", "দুটি", "তিনটি", "কোনোটি নেই"], correct: 1, exp_bn: "'du vaikai' = দুই সন্তান।" },
      { q_bn: "করিমের ছেলের বয়স কত?", q_en: "How old is Karim's son?", options_bn: ["৩ বছর", "৫ বছর", "৭ বছর", "১০ বছর"], correct: 1, exp_bn: "'sūnui penkeri' = ছেলের বয়স পাঁচ।" },
    ],
    vocab: [
      { lt: "šeima", en: "family", bn: "পরিবার" },
      { lt: "žmona", en: "wife", bn: "স্ত্রী" },
      { lt: "dukra", en: "daughter", bn: "মেয়ে" },
      { lt: "sūnus", en: "son", bn: "ছেলে" },
      { lt: "pasiilgstu", en: "I miss", bn: "মিস করি" },
    ],
  },
  {
    id: "p2",
    title_en: "My City",
    title_lt: "Mano miestas",
    title_bn: "আমার শহর",
    level: "A1",
    topic: "Places",
    text_lt: "Gyvenu Vilniuje. Vilnius yra Lietuvos sostinė. Čia gyvena apie pusė milijono žmonių. Mano butas yra Naujamiestyje. Netoli yra autobusų stotelė ir parduotuvė. Nuo namų iki darbo einu dvidešimt minučių pėsčiomis. Man patinka Vilnius. Miestas yra gražus ir saugus.",
    text_en: "I live in Vilnius. Vilnius is the capital of Lithuania. About half a million people live here. My apartment is in Naujamestis. Nearby there is a bus stop and a shop. From home to work I walk twenty minutes. I like Vilnius. The city is beautiful and safe.",
    text_bn: "আমি ভিলনিউসে থাকি। ভিলনিউস লিথুয়ানিয়ার রাজধানী। এখানে প্রায় পাঁচ লাখ মানুষ বাস করে। আমার অ্যাপার্টমেন্ট নাউজামেসটিসে। কাছেই একটি বাস স্টপ ও দোকান আছে। বাড়ি থেকে কাজে হেঁটে বিশ মিনিট। আমি ভিলনিউস পছন্দ করি। শহরটি সুন্দর ও নিরাপদ।",
    questions: [
      { q_bn: "ভিলনিউস কোন দেশের রাজধানী?", q_en: "Vilnius is the capital of which country?", options_bn: ["এস্তোনিয়া", "লাটভিয়া", "লিথুয়ানিয়া", "পোল্যান্ড"], correct: 2, exp_bn: "'Vilnius yra Lietuvos sostinė' = ভিলনিউস লিথুয়ানিয়ার রাজধানী।" },
      { q_bn: "বাড়ি থেকে কাজে যেতে কত সময় লাগে?", q_en: "How long to walk from home to work?", options_bn: ["১০ মিনিট", "১৫ মিনিট", "২০ মিনিট", "৩০ মিনিট"], correct: 2, exp_bn: "'dvidešimt minučių pėsčiomis' = হেঁটে বিশ মিনিট।" },
      { q_bn: "লেখক শহর সম্পর্কে কী মনে করেন?", q_en: "What does the writer think of the city?", options_bn: ["ব্যয়বহুল", "ব্যস্ত", "সুন্দর ও নিরাপদ", "ছোট ও নিরিবিলি"], correct: 2, exp_bn: "'gražus ir saugus' = সুন্দর ও নিরাপদ।" },
    ],
    vocab: [
      { lt: "sostinė", en: "capital city", bn: "রাজধানী" },
      { lt: "butas", en: "apartment / flat", bn: "অ্যাপার্টমেন্ট" },
      { lt: "netoli", en: "nearby / not far", bn: "কাছে" },
      { lt: "pėsčiomis", en: "on foot", bn: "হেঁটে" },
      { lt: "saugus", en: "safe", bn: "নিরাপদ" },
    ],
  },
  {
    id: "p3",
    title_en: "A Working Day",
    title_lt: "Darbo diena",
    title_bn: "একটি কর্মদিবস",
    level: "A1",
    topic: "Daily Life",
    text_lt: "Keliuosi septintą ryto. Pusryčiauju ir einu į darbą. Dirbu gamykloje nuo aštuonių iki šešiolikos. Pietų pertrauka yra dvyliktą. Per pertrauką valgau sumuštinį ir geriu kavą. Po darbo einu į parduotuvę. Vakare mokaus lietuvių kalbos. Einu miegoti vienuoliktą valandą.",
    text_en: "I wake up at seven in the morning. I have breakfast and go to work. I work in a factory from eight to sixteen. Lunch break is at twelve. During the break I eat a sandwich and drink coffee. After work I go to the shop. In the evening I study Lithuanian. I go to sleep at eleven.",
    text_bn: "আমি সকাল সাতটায় উঠি। সকালের নাস্তা করে কাজে যাই। কারখানায় আটটা থেকে ষোলোটা পর্যন্ত কাজ করি। দুপুরের বিরতি বারোটায়। বিরতিতে স্যান্ডউইচ খাই ও কফি পান করি। কাজের পর দোকানে যাই। সন্ধ্যায় লিথুয়ানিয়ান পড়ি। রাত এগারোটায় ঘুমাতে যাই।",
    questions: [
      { q_bn: "লেখক কখন ঘুম থেকে ওঠেন?", q_en: "When does the writer wake up?", options_bn: ["৬টায়", "৭টায়", "৮টায়", "৯টায়"], correct: 1, exp_bn: "'Keliuosi septintą ryto' = সকাল সাতটায় উঠি।" },
      { q_bn: "দুপুরের বিরতিতে কী খান?", q_en: "What does he eat during the lunch break?", options_bn: ["ভাত", "স্যান্ডউইচ", "পিৎজা", "স্যুপ"], correct: 1, exp_bn: "'sumuštinį' = স্যান্ডউইচ।" },
      { q_bn: "সন্ধ্যায় কী করেন?", q_en: "What does he do in the evening?", options_bn: ["টিভি দেখেন", "বন্ধুদের সাথে থাকেন", "লিথুয়ানিয়ান পড়েন", "রান্না করেন"], correct: 2, exp_bn: "'mokaus lietuvių kalbos' = লিথুয়ানিয়ান শিখি।" },
    ],
    vocab: [
      { lt: "keliuosi", en: "I wake up / get up", bn: "উঠি" },
      { lt: "pusryčiauju", en: "I have breakfast", bn: "সকালের নাস্তা করি" },
      { lt: "pertrauka", en: "break / pause", bn: "বিরতি" },
      { lt: "sumuštinis", en: "sandwich", bn: "স্যান্ডউইচ" },
      { lt: "mokaus", en: "I am studying / learning", bn: "শিখছি" },
    ],
  },
  {
    id: "p4",
    title_en: "Lithuanian Nature",
    title_lt: "Lietuvos gamta",
    title_bn: "লিথুয়ানিয়ার প্রকৃতি",
    level: "A1",
    topic: "Nature",
    text_lt: "Lietuva yra graži šalis. Čia yra daug miškų ir ežerų. Vasarą šilta, žiemą labai šalta ir sninga. Man patinka lietuviška gamta. Sekmadieniais vaikštau parke. Parke yra medžių, žolės ir gėlių. Kartais einu prie ežero žvejoti.",
    text_en: "Lithuania is a beautiful country. There are many forests and lakes here. In summer it is warm, in winter it is very cold and it snows. I like Lithuanian nature. On Sundays I walk in the park. In the park there are trees, grass and flowers. Sometimes I go fishing at the lake.",
    text_bn: "লিথুয়ানিয়া একটি সুন্দর দেশ। এখানে অনেক বন ও হ্রদ আছে। গ্রীষ্মে উষ্ণ, শীতকালে খুব ঠান্ডা ও তুষারপাত হয়। আমি লিথুয়ানিয়ান প্রকৃতি পছন্দ করি। রবিবারে পার্কে হাঁটি। পার্কে গাছ, ঘাস ও ফুল আছে। মাঝেমাঝে হ্রদে মাছ ধরতে যাই।",
    questions: [
      { q_bn: "লিথুয়ানিয়ায় কী বেশি আছে?", q_en: "What is plentiful in Lithuania?", options_bn: ["পাহাড় ও মরুভূমি", "বন ও হ্রদ", "সমুদ্র ও দ্বীপ", "নদী ও জলপ্রপাত"], correct: 1, exp_bn: "'daug miškų ir ežerų' = অনেক বন ও হ্রদ।" },
      { q_bn: "শীতকালে কেমন হয়?", q_en: "What is winter like?", options_bn: ["উষ্ণ ও বৃষ্টি", "গরম ও শুষ্ক", "ঠান্ডা ও তুষার", "হালকা ও রৌদ্রজ্জ্বল"], correct: 2, exp_bn: "'žiemą labai šalta ir sninga' = শীতে খুব ঠান্ডা ও তুষারপাত।" },
      { q_bn: "রবিবারে কোথায় হাঁটেন?", q_en: "Where does he walk on Sundays?", options_bn: ["বনে", "পার্কে", "হ্রদের ধারে", "শহরে"], correct: 1, exp_bn: "'Sekmadieniais vaikštau parke' = রবিবারে পার্কে হাঁটি।" },
    ],
    vocab: [
      { lt: "miškas", en: "forest / wood", bn: "বন" },
      { lt: "ežeras", en: "lake", bn: "হ্রদ" },
      { lt: "vasara", en: "summer", bn: "গ্রীষ্ম" },
      { lt: "žiema", en: "winter", bn: "শীত" },
      { lt: "sninga", en: "it is snowing", bn: "তুষারপাত হচ্ছে" },
    ],
  },
];

export default function ReadingLessonsPage() {
  const [passage, setPassage] = useState(READING_PASSAGES[0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showTranslation, setShowTranslation] = useState(false);

  const answer = (qIdx: number, optIdx: number) => {
    const key = `${passage.id}-${qIdx}`;
    if (answers[key] !== undefined) return;
    setAnswers({ ...answers, [key]: optIdx });
  };

  const allAnswered = passage.questions.every((_, qi) => answers[`${passage.id}-${qi}`] !== undefined);
  const score = passage.questions.filter((q, qi) => answers[`${passage.id}-${qi}`] === q.correct).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Lessons / A1 / Reading</div>
        <h1 className="text-2xl font-bold text-gray-100">
          Reading <span className="text-amber-400 font-bengali text-xl">· পড়া</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Skaitymas — A1 reading passages with comprehension questions</p>
      </div>

      <BengaliExplanation
        content="প্রতিটি অনুচ্ছেদ পড়ুন এবং প্রশ্নের উত্তর দিন। প্রতিটি শব্দের অর্থ না জানলেও মূল বিষয় বোঝার চেষ্টা করুন। অডিও বাটনে ক্লিক করে উচ্চারণ শুনতে পারবেন।"
        englishContent="Read each passage and answer the comprehension questions. Try to understand the main idea even without knowing every word."
        className="mb-6"
      />

      {/* Passage selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {READING_PASSAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => { setPassage(p); setAnswers({}); setShowTranslation(false); }}
            className={`p-3 rounded-xl border text-left transition-all ${passage.id === p.id ? "bg-green-500/10 border-green-500/20" : "border-[var(--border)] hover:border-green-500/20"}`}
          >
            <p className={`text-sm font-bold ${passage.id === p.id ? "text-green-400" : "text-gray-300"}`}>{p.title_en}</p>
            <p className="text-xs text-gray-500 font-bengali">{p.title_bn}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading text */}
        <div>
          <div className="card-surface p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs px-2 py-0.5 rounded bg-green-900/40 text-green-400 mb-1 inline-block">{passage.topic}</span>
                <h2 className="font-bold text-gray-100">{passage.title_en}</h2>
                <p className="text-amber-400 font-bold text-sm">{passage.title_lt}</p>
                <p className="text-emerald-400 font-bengali text-sm">{passage.title_bn}</p>
              </div>
              <AudioButton text={passage.text_lt} size="md" showSlow />
            </div>

            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] mb-4">
              <p className="lt-text text-base leading-loose">{passage.text_lt}</p>
            </div>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              {showTranslation ? "অনুবাদ লুকান" : "অনুবাদ দেখুন (উত্তরের পরে)"}
            </button>
            {showTranslation && (
              <div className="mt-3 space-y-2 text-sm">
                <p className="en-text leading-relaxed">{passage.text_en}</p>
                <p className="bn-text font-bengali leading-relaxed">{passage.text_bn}</p>
              </div>
            )}
          </div>

          {/* Key vocabulary */}
          <div className="card-surface p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">মূল শব্দ · Key Words</p>
            <div className="space-y-2">
              {passage.vocab.map((v) => (
                <div key={v.lt} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-center gap-1.5 w-36">
                    <span className="lt-text font-bold text-sm">{v.lt}</span>
                    <AudioButton text={v.lt} size="sm" />
                  </div>
                  <span className="en-text text-xs w-28">{v.en}</span>
                  <span className="bn-text font-bengali text-xs text-emerald-400">{v.bn}</span>
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
              <div key={qi} className="card-surface p-5">
                <p className="text-xs text-gray-500 mb-0.5">Question {qi + 1}</p>
                <p className="bn-text font-bengali font-medium mb-0.5">{q.q_bn}</p>
                <p className="en-text text-xs mb-3">{q.q_en}</p>
                <div className="space-y-2">
                  {q.options_bn.map((opt, oi) => {
                    let style = "border-[var(--border)] text-gray-300 hover:border-green-500/30";
                    if (answered) {
                      if (oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                      else if (oi === userAnswer) style = "border-red-500 bg-red-500/10 text-red-300";
                      else style = "border-[var(--border)] text-gray-600 opacity-50";
                    }
                    return (
                      <button key={oi} onClick={() => answer(qi, oi)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-bengali transition-all ${style}`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <p className="bn-text font-bengali text-sm text-emerald-200">💡 {q.exp_bn}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Score summary */}
          {allAnswered && (
            <div className={`card-surface p-5 border ${score === passage.questions.length ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
              <p className="font-bold text-gray-100 mb-1">
                {score === passage.questions.length ? "🎉 নিখুঁত!" : "অনুশীলন সম্পন্ন"}
              </p>
              <p className="text-2xl font-bold text-amber-400">{score}/{passage.questions.length}</p>
              <p className="text-sm text-gray-400 font-bengali mt-1">
                {score === passage.questions.length
                  ? "সব প্রশ্নের সঠিক উত্তর দিয়েছেন!"
                  : "আরও একবার পড়ে চেষ্টা করুন।"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
