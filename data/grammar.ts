export interface GrammarExample {
  lt: string;
  en: string;
  bn: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarTopicData {
  id: string;
  slug: string;
  title_lt: string;
  title_en: string;
  title_bn: string;
  level: "A1" | "A2" | "B1";
  order_index: number;
  description_en: string;
  description_bn: string;
  explanation_bn: string;
  tables: GrammarTable[];
  examples: GrammarExample[];
  tips_bn: string[];
}

export const grammarTopics: GrammarTopicData[] = [
  {
    id: "g001",
    slug: "to-be",
    title_lt: "Veiksmažodis 'Būti'",
    title_en: "Verb 'To Be' — Būti",
    title_bn: "ক্রিয়া 'হওয়া / থাকা' — Būti",
    level: "A1",
    order_index: 1,
    description_en: "The most essential verb in Lithuanian. Learn how to say 'I am', 'You are', 'He/She is' etc.",
    description_bn: "লিথুয়ানিয়ান ভাষার সবচেয়ে গুরুত্বপূর্ণ ক্রিয়া। 'আমি আছি', 'তুমি আছ', 'সে আছে' ইত্যাদি বলতে শিখুন।",
    explanation_bn: "বাংলায় আমরা বলি 'আমি আছি', 'তুমি আছ'। লিথুয়ানিয়ানে এই ক্রিয়াটি হলো 'būti'। বর্তমান কালে এর রূপ পরিবর্তন হয়। 'aš esu' মানে 'আমি আছি', 'tu esi' মানে 'তুমি আছ'। মনে রাখবেন — লিথুয়ানিয়ানে ব্যক্তিভেদে ক্রিয়ার শেষাংশ পরিবর্তন হয়!",
    tables: [
      {
        headers: ["Pronoun (Pronouns)", "Lithuanian", "English", "বাংলা"],
        rows: [
          ["aš (I)", "esu", "I am", "আমি আছি"],
          ["tu (you)", "esi", "you are", "তুমি আছ"],
          ["jis/ji (he/she)", "yra", "he/she is", "সে আছে"],
          ["mes (we)", "esame", "we are", "আমরা আছি"],
          ["jūs (you pl.)", "esate", "you are", "আপনারা আছেন"],
          ["jie/jos (they)", "yra", "they are", "তারা আছে"],
        ],
      },
    ],
    examples: [
      { lt: "Aš esu Bangladešas.", en: "I am from Bangladesh.", bn: "আমি বাংলাদেশ থেকে।" },
      { lt: "Tu esi studentas.", en: "You are a student.", bn: "তুমি একজন ছাত্র।" },
      { lt: "Ji yra mokytoja.", en: "She is a teacher.", bn: "সে একজন শিক্ষিকা।" },
      { lt: "Mes esame draugai.", en: "We are friends.", bn: "আমরা বন্ধু।" },
    ],
    tips_bn: [
      "💡 'yra' ব্যবহার হয় jis (সে), ji (সে), jie (তারা) এবং jos (তারা) সবার জন্য।",
      "💡 প্রশ্ন করতে 'Ar' যোগ করুন: 'Ar tu esi studentas?' = 'তুমি কি ছাত্র?'",
      "💡 নেতিবাচক বাক্যে 'ne' যোগ করুন: 'Aš nessu...' = 'Aš ne + esu' = 'আমি নই...'",
    ],
  },
  {
    id: "g002",
    slug: "nouns-gender",
    title_lt: "Daiktavardžių giminė",
    title_en: "Noun Gender (Masculine & Feminine)",
    title_bn: "বিশেষ্যের লিঙ্গ (পুরুষবাচক ও স্ত্রীবাচক)",
    level: "A1",
    order_index: 2,
    description_en: "Lithuanian nouns have two genders: masculine and feminine. The ending of the noun usually tells you the gender.",
    description_bn: "লিথুয়ানিয়ান বিশেষ্যে দুটি লিঙ্গ আছে: পুরুষবাচক এবং স্ত্রীবাচক। বিশেষ্যের শেষাংশ দেখে লিঙ্গ বোঝা যায়।",
    explanation_bn: "বাংলায় বিশেষ্যের লিঙ্গ নেই — কিন্তু লিথুয়ানিয়ানে আছে! সাধারণত '-as', '-is', '-us' দিয়ে শেষ হওয়া শব্দ পুরুষবাচক, আর '-a', '-ė' দিয়ে শেষ হওয়া শব্দ স্ত্রীবাচক।",
    tables: [
      {
        headers: ["Gender", "Common Ending", "Example (LT)", "Meaning (EN)", "বাংলা"],
        rows: [
          ["Masculine (vyriškoji)", "-as", "namas (house)", "house", "বাড়ি"],
          ["Masculine (vyriškoji)", "-is", "brolis (brother)", "brother", "ভাই"],
          ["Masculine (vyriškoji)", "-us", "autobusas→us", "bus", "বাস"],
          ["Feminine (moteriškoji)", "-a", "mama (mother)", "mother", "মা"],
          ["Feminine (moteriškoji)", "-ė", "sesė (sister form)", "sister", "বোন"],
        ],
      },
    ],
    examples: [
      { lt: "Mano namas yra didelis.", en: "My house is big.", bn: "আমার বাড়ি বড়।" },
      { lt: "Mano mama yra gydytoja.", en: "My mother is a doctor.", bn: "আমার মা ডাক্তার।" },
    ],
    tips_bn: [
      "💡 পুরুষবাচক: -as, -is, -ys, -us (উদাহরণ: tėtis = বাবা)",
      "💡 স্ত্রীবাচক: -a, -ė (উদাহরণ: sesuo = বোন, এটি ব্যতিক্রম)",
      "💡 প্রতিটি নতুন শব্দ শেখার সময় লিঙ্গও মনে রাখুন!",
    ],
  },
  {
    id: "g003",
    slug: "present-tense",
    title_lt: "Esamasis laikas",
    title_en: "Present Tense",
    title_bn: "বর্তমান কাল",
    level: "A1",
    order_index: 3,
    description_en: "How to conjugate regular Lithuanian verbs in the present tense. Most verbs end in '-ti' in the infinitive.",
    description_bn: "লিথুয়ানিয়ান নিয়মিত ক্রিয়াকে বর্তমান কালে কীভাবে রূপান্তর করতে হয়। বেশিরভাগ ক্রিয়া infinitive-এ '-ti' দিয়ে শেষ হয়।",
    explanation_bn: "বাংলায় 'আমি খাই', 'তুমি খাও', 'সে খায়' — একইভাবে লিথুয়ানিয়ানেও ব্যক্তিভেদে ক্রিয়া পরিবর্তন হয়। বেশিরভাগ ক্রিয়ার ক্ষেত্রে মূল অংশ থেকে '-ti' বাদ দিয়ে নতুন শেষাংশ যোগ করুন।",
    tables: [
      {
        headers: ["Pronoun", "dirbti (work)", "valgyti (eat)", "English", "বাংলা"],
        rows: [
          ["aš (I)", "dirbu", "valgau", "I work / eat", "আমি কাজ করি / খাই"],
          ["tu (you)", "dirbi", "valgai", "you work / eat", "তুমি কাজ কর / খাও"],
          ["jis/ji (he/she)", "dirba", "valgo", "he/she works / eats", "সে কাজ করে / খায়"],
          ["mes (we)", "dirbame", "valgome", "we work / eat", "আমরা কাজ করি / খাই"],
          ["jūs (you pl.)", "dirbate", "valgote", "you work / eat", "আপনারা কাজ করেন"],
          ["jie/jos (they)", "dirba", "valgo", "they work / eat", "তারা কাজ করে / খায়"],
        ],
      },
    ],
    examples: [
      { lt: "Aš dirbu fabrike.", en: "I work in a factory.", bn: "আমি কারখানায় কাজ করি।" },
      { lt: "Ji valgo pieną.", en: "She eats/drinks milk.", bn: "সে দুধ পান করে।" },
      { lt: "Mes kalbame lietuviškai.", en: "We speak Lithuanian.", bn: "আমরা লিথুয়ানিয়ান কথা বলি।" },
    ],
    tips_bn: [
      "💡 লক্ষ্য করুন: jis/ji এবং jie/jos একই রূপ ব্যবহার করে।",
      "💡 নেতিবাচক করতে 'ne' যোগ করুন ক্রিয়ার আগে: nedirbu = কাজ করি না।",
      "💡 প্রশ্ন করতে বাক্যের আগে 'Ar' যোগ করুন: Ar tu dirbi? = তুমি কি কাজ কর?",
    ],
  },
  {
    id: "g004",
    slug: "questions",
    title_lt: "Klausiamieji žodžiai",
    title_en: "Question Words",
    title_bn: "প্রশ্নবোধক শব্দ",
    level: "A1",
    order_index: 4,
    description_en: "Essential question words in Lithuanian — Who, What, Where, When, Why, How.",
    description_bn: "লিথুয়ানিয়ানে মূল প্রশ্নবোধক শব্দ — কে, কী, কোথায়, কখন, কেন, কীভাবে।",
    explanation_bn: "প্রশ্ন করা যেকোনো ভাষায় খুব গুরুত্বপূর্ণ। লিথুয়ানিয়ান প্রশ্নবোধক শব্দগুলো একবার মুখস্থ করলে সহজেই যেকোনো প্রশ্ন করতে পারবেন।",
    tables: [
      {
        headers: ["Lithuanian", "English", "বাংলা", "Example"],
        rows: [
          ["Kas?", "Who? / What?", "কে? / কী?", "Kas tai? (What is this?)"],
          ["Kur?", "Where?", "কোথায়?", "Kur yra tualetas? (Where is the toilet?)"],
          ["Kada?", "When?", "কখন?", "Kada autobusas? (When is the bus?)"],
          ["Kodėl?", "Why?", "কেন?", "Kodėl? (Why?)"],
          ["Kaip?", "How?", "কীভাবে?", "Kaip sekasi? (How are you?)"],
          ["Kiek?", "How much/many?", "কত?", "Kiek kainuoja? (How much does it cost?)"],
          ["Koks/Kokia?", "What kind?", "কোন ধরনের?", "Kokia kaina? (What is the price?)"],
          ["Ar...?", "Is...? / Are...?", "কি...?", "Ar jūs suprantate? (Do you understand?)"],
        ],
      },
    ],
    examples: [
      { lt: "Kur yra parduotuvė?", en: "Where is the shop?", bn: "দোকান কোথায়?" },
      { lt: "Kiek kainuoja?", en: "How much does it cost?", bn: "দাম কত?" },
      { lt: "Kaip jūsų vardas?", en: "What is your name?", bn: "আপনার নাম কী?" },
      { lt: "Kada ateina autobusas?", en: "When does the bus come?", bn: "বাস কখন আসে?" },
    ],
    tips_bn: [
      "💡 'Ar' ব্যবহার করুন হ্যাঁ/না প্রশ্নের জন্য: 'Ar tu esi studentas?' = 'তুমি কি ছাত্র?'",
      "💡 'Kas' মানে হতে পারে 'কে' অথবা 'কী' — প্রসঙ্গ দেখে বুঝুন।",
      "💡 'Kiek' সংখ্যা ও দামের প্রশ্নে ব্যবহার হয়।",
    ],
  },
];
