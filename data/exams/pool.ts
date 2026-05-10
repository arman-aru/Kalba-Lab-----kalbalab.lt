/**
 * Question pool for the A1 mock exam. Each attempt draws a subset from these
 * pools so the paper is different every time. Content matches the official
 * Lithuanian A1 integration test format.
 */

export interface MCQ {
  id: string;
  audio?: string;        // Lithuanian text for TTS playback (listening only)
  q_en: string;
  q_bn: string;
  options_en: string[];
  options_bn: string[];
  correct: number;
}

export interface ReadingPassage {
  id: string;
  text_lt: string;
  questions: MCQ[];
}

export interface WritingPrompt {
  id: string;
  prompt_en: string;
  prompt_bn: string;
  minWords: number;
  maxWords: number;
}

export interface SpeakingPrompt {
  id: string;
  prompt_en: string;
  prompt_bn: string;
  /** A model Lithuanian answer the candidate can listen to before/after speaking. */
  model_lt?: string;
}

/* -------------------------------- Listening ------------------------------- */

export const LISTENING_POOL: MCQ[] = [
  {
    id: "L01",
    audio: "Autobusas į Kauną išvyksta aštuonioliktą valandą.",
    q_en: "When does the bus depart?",
    q_bn: "বাসটি কখন ছাড়বে?",
    options_en: ["17:00", "18:00", "19:00", "20:00"],
    options_bn: ["১৭:০০", "১৮:০০", "১৯:০০", "২০:০০"],
    correct: 1,
  },
  {
    id: "L02",
    audio: "Parduotuvė sekmadienį atidaryta nuo dešimtos iki šešioliktos.",
    q_en: "How long is the shop open on Sunday?",
    q_bn: "রবিবার দোকান কতক্ষণ খোলা?",
    options_en: ["8:00–16:00", "10:00–16:00", "10:00–18:00", "9:00–17:00"],
    options_bn: ["৮:০০–১৬:০০", "১০:০০–১৬:০০", "১০:০০–১৮:০০", "৯:০০–১৭:০০"],
    correct: 1,
  },
  {
    id: "L03",
    audio: "Mano sesers vardas Jurga. Ji dirba ligoninėje.",
    q_en: "Where does the speaker's sister work?",
    q_bn: "বক্তার বোন কোথায় কাজ করেন?",
    options_en: ["At a school", "At a hospital", "At a shop", "At a bank"],
    options_bn: ["স্কুলে", "হাসপাতালে", "দোকানে", "ব্যাংকে"],
    correct: 1,
  },
  {
    id: "L04",
    audio: "Šiandien lyja, todėl mes liksime namuose.",
    q_en: "Why are they staying home?",
    q_bn: "তারা কেন বাড়িতে থাকছে?",
    options_en: ["It's cold", "It's raining", "It's snowing", "It's a holiday"],
    options_bn: ["ঠান্ডা", "বৃষ্টি হচ্ছে", "তুষারপাত হচ্ছে", "ছুটি"],
    correct: 1,
  },
  {
    id: "L05",
    audio: "Bilietas į Vilnių kainuoja keturis eurus.",
    q_en: "How much is the ticket to Vilnius?",
    q_bn: "ভিলনিউসের টিকেট কত?",
    options_en: ["€2", "€3", "€4", "€5"],
    options_bn: ["২€", "৩€", "৪€", "৫€"],
    correct: 2,
  },
  {
    id: "L06",
    audio: "Posėdis prasideda devintą valandą ryto.",
    q_en: "When does the meeting start?",
    q_bn: "মিটিং কখন শুরু হবে?",
    options_en: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
    options_bn: ["সকাল ৮:০০", "সকাল ৯:০০", "সকাল ১০:০০", "সকাল ১১:০০"],
    correct: 1,
  },
  {
    id: "L07",
    audio: "Aš gyvenu Kaune, Laisvės alėjoje.",
    q_en: "Where does the speaker live?",
    q_bn: "বক্তা কোথায় থাকেন?",
    options_en: ["In Vilnius", "In Kaunas", "In Klaipėda", "In Šiauliai"],
    options_bn: ["ভিলনিউসে", "কাউনাসে", "ক্লাইপেদায়", "শিয়াউলিয়ায়"],
    correct: 1,
  },
  {
    id: "L08",
    audio: "Vaistinė yra prie autobusų stoties.",
    q_en: "Where is the pharmacy?",
    q_bn: "ফার্মেসি কোথায়?",
    options_en: ["By the train station", "By the bus station", "By the school", "By the park"],
    options_bn: ["রেল স্টেশনের পাশে", "বাস স্টেশনের পাশে", "স্কুলের পাশে", "পার্কের পাশে"],
    correct: 1,
  },
  {
    id: "L09",
    audio: "Kava su pienu kainuoja du eurus penkiasdešimt centų.",
    q_en: "How much is coffee with milk?",
    q_bn: "দুধ দিয়ে কফির দাম কত?",
    options_en: ["€1.50", "€2.00", "€2.50", "€3.00"],
    options_bn: ["১.৫০€", "২.০০€", "২.৫০€", "৩.০০€"],
    correct: 2,
  },
  {
    id: "L10",
    audio: "Šiandien penktadienis, rytoj šeštadienis.",
    q_en: "What day is it today?",
    q_bn: "আজ কী বার?",
    options_en: ["Thursday", "Friday", "Saturday", "Sunday"],
    options_bn: ["বৃহস্পতিবার", "শুক্রবার", "শনিবার", "রবিবার"],
    correct: 1,
  },
  {
    id: "L11",
    audio: "Vasarą labai karšta, žiemą sninga.",
    q_en: "What does the speaker say about winter?",
    q_bn: "বক্তা শীতকাল সম্পর্কে কী বলেন?",
    options_en: ["It's hot", "It rains", "It snows", "It's windy"],
    options_bn: ["গরম", "বৃষ্টি", "তুষারপাত", "ঝোড়ো"],
    correct: 2,
  },
  {
    id: "L12",
    audio: "Kambario numeris yra dvidešimt trys.",
    q_en: "What is the room number?",
    q_bn: "কক্ষ নম্বর কত?",
    options_en: ["13", "20", "23", "33"],
    options_bn: ["১৩", "২০", "২৩", "৩৩"],
    correct: 2,
  },
  {
    id: "L13",
    audio: "Mokytoja kalba angliškai ir lietuviškai.",
    q_en: "Which languages does the teacher speak?",
    q_bn: "শিক্ষিকা কোন কোন ভাষায় কথা বলেন?",
    options_en: ["English & Russian", "English & Lithuanian", "Lithuanian only", "Russian only"],
    options_bn: ["ইংরেজি ও রাশিয়ান", "ইংরেজি ও লিথুয়ানিয়ান", "শুধু লিথুয়ানিয়ান", "শুধু রাশিয়ান"],
    correct: 1,
  },
  {
    id: "L14",
    audio: "Norėčiau dvi arbatas ir vieną duoną.",
    q_en: "What does the speaker want to order?",
    q_bn: "বক্তা কী অর্ডার করতে চান?",
    options_en: ["2 coffees, 1 bread", "2 teas, 1 bread", "1 tea, 2 breads", "2 teas, 2 breads"],
    options_bn: ["২ কফি, ১ রুটি", "২ চা, ১ রুটি", "১ চা, ২ রুটি", "২ চা, ২ রুটি"],
    correct: 1,
  },
  {
    id: "L15",
    audio: "Traukinys atvyksta į ketvirtą peroną.",
    q_en: "Which platform does the train arrive at?",
    q_bn: "ট্রেনটি কোন প্ল্যাটফর্মে আসবে?",
    options_en: ["Platform 2", "Platform 3", "Platform 4", "Platform 5"],
    options_bn: ["২ নং প্ল্যাটফর্ম", "৩ নং প্ল্যাটফর্ম", "৪ নং প্ল্যাটফর্ম", "৫ নং প্ল্যাটফর্ম"],
    correct: 2,
  },
  {
    id: "L16",
    audio: "Mano šeima — keturi asmenys: aš, žmona ir du vaikai.",
    q_en: "How many people are in the speaker's family?",
    q_bn: "বক্তার পরিবারে কত জন?",
    options_en: ["3", "4", "5", "6"],
    options_bn: ["৩", "৪", "৫", "৬"],
    correct: 1,
  },
];

/* --------------------------------- Reading -------------------------------- */

export const READING_POOL: ReadingPassage[] = [
  {
    id: "R01",
    text_lt:
      "KAVOS PARDUOTUVĖ. Atidaryta kasdien 7:00–22:00. Kava: 2€. Arbata: 1.5€. Vanduo: 1€. Wi-Fi nemokamas.",
    questions: [
      { id: "R01-1", q_en: "When does the shop close?",   q_bn: "দোকানটি কখন বন্ধ হয়?",        options_en: ["20:00", "21:00", "22:00", "23:00"], options_bn: ["২০:০০", "২১:০০", "২২:০০", "২৩:০০"], correct: 2 },
      { id: "R01-2", q_en: "How much is a coffee?",       q_bn: "এক কাপ কফির দাম কত?",         options_en: ["€1", "€1.50", "€2", "€2.50"], options_bn: ["১€", "১.৫০€", "২€", "২.৫০€"], correct: 2 },
      { id: "R01-3", q_en: "What does it say about Wi-Fi?", q_bn: "Wi-Fi সম্পর্কে কী লেখা?",   options_en: ["Not available", "Free", "Costs €5/hour", "Password required"], options_bn: ["নেই", "বিনামূল্যে", "৫€/ঘন্টা", "পাসওয়ার্ড লাগে"], correct: 1 },
    ],
  },
  {
    id: "R02",
    text_lt:
      "GYDYTOJAS. Pirmadienis–Penktadienis 8:00–17:00. Adresas: Vilniaus g. 5. Tel.: 8 600 12345. Susisiekite iš anksto.",
    questions: [
      { id: "R02-1", q_en: "On which days does the doctor work?", q_bn: "ডাক্তার কোন দিনগুলো কাজ করেন?", options_en: ["Mon–Fri", "Mon–Sat", "Every day", "Tue–Sat"], options_bn: ["সোম–শুক্র", "সোম–শনি", "প্রতিদিন", "মঙ্গল–শনি"], correct: 0 },
      { id: "R02-2", q_en: "What is the address?",                q_bn: "ঠিকানা কী?",                       options_en: ["Vilniaus 5", "Vilniaus 15", "Laisvės 5", "Kaunas 5"], options_bn: ["Vilniaus ৫", "Vilniaus ১৫", "Laisvės ৫", "Kaunas ৫"], correct: 0 },
      { id: "R02-3", q_en: "What should you do first?",           q_bn: "প্রথমে কী করতে হবে?",            options_en: ["Just walk in", "Call ahead", "Email", "Send a letter"], options_bn: ["সরাসরি যাওয়া", "আগে ফোন করা", "ইমেইল", "চিঠি পাঠানো"], correct: 1 },
    ],
  },
  {
    id: "R03",
    text_lt:
      "Nuomojamas butas. 2 kambariai. 50 m². Vilniuje, centre. Kaina: 450€/mėn. Be baldų. Tel.: 8 555 11122.",
    questions: [
      { id: "R03-1", q_en: "How many rooms?",      q_bn: "কয়টি কক্ষ?",          options_en: ["1", "2", "3", "4"],                      options_bn: ["১", "২", "৩", "৪"],                       correct: 1 },
      { id: "R03-2", q_en: "What is the rent?",    q_bn: "ভাড়া কত?",            options_en: ["€350/mo", "€400/mo", "€450/mo", "€550/mo"], options_bn: ["৩৫০€/মাস", "৪০০€/মাস", "৪৫০€/মাস", "৫৫০€/মাস"], correct: 2 },
      { id: "R03-3", q_en: "Is it furnished?",     q_bn: "এটি কি আসবাবপত্র সহ?", options_en: ["Yes, fully", "Partly", "No, unfurnished", "Only kitchen"], options_bn: ["হ্যাঁ, সম্পূর্ণ", "আংশিক", "না, ফাঁকা", "শুধু রান্নাঘর"], correct: 2 },
    ],
  },
  {
    id: "R04",
    text_lt:
      "Autobusas Vilnius → Kaunas. Išvyksta 8:00, 12:00, 16:00, 20:00. Bilietas 6€. Kelionė trunka 1 val. 30 min.",
    questions: [
      { id: "R04-1", q_en: "How many departures per day?", q_bn: "প্রতিদিন কতবার ছাড়ে?",   options_en: ["2", "3", "4", "5"],   options_bn: ["২", "৩", "৪", "৫"],   correct: 2 },
      { id: "R04-2", q_en: "How much is the ticket?",     q_bn: "টিকেটের দাম কত?",         options_en: ["€4", "€5", "€6", "€8"], options_bn: ["৪€", "৫€", "৬€", "৮€"], correct: 2 },
      { id: "R04-3", q_en: "How long is the journey?",    q_bn: "যাত্রা কতক্ষণ?",          options_en: ["1 h", "1 h 30 min", "2 h", "2 h 30 min"], options_bn: ["১ ঘণ্টা", "১ ঘণ্টা ৩০ মি", "২ ঘণ্টা", "২ ঘণ্টা ৩০ মি"], correct: 1 },
    ],
  },
  {
    id: "R05",
    text_lt:
      "Bibliotekos darbo laikas. Pirmadienis–Penktadienis 9–19. Šeštadienis 10–15. Sekmadienis nedirba. Skaitytojo bilietas nemokamas.",
    questions: [
      { id: "R05-1", q_en: "When does the library close on weekdays?", q_bn: "কর্মদিনে লাইব্রেরি কখন বন্ধ হয়?", options_en: ["17:00", "18:00", "19:00", "20:00"], options_bn: ["১৭:০০", "১৮:০০", "১৯:০০", "২০:০০"], correct: 2 },
      { id: "R05-2", q_en: "Is it open on Sunday?",                    q_bn: "রবিবার কি খোলা?",                  options_en: ["Yes, all day", "Yes, mornings", "No", "Only 10–15"], options_bn: ["হ্যাঁ, সারাদিন", "হ্যাঁ, সকালে", "না", "শুধু ১০-১৫"], correct: 2 },
      { id: "R05-3", q_en: "How much does a reader's card cost?",      q_bn: "পাঠক কার্ডের দাম কত?",             options_en: ["€5", "€10", "Free", "€20/year"], options_bn: ["৫€", "১০€", "বিনামূল্যে", "২০€/বছর"], correct: 2 },
    ],
  },
  {
    id: "R06",
    text_lt:
      "RESTORANAS „ŽALIA EGLĖ\". Pietūs: 7€. Sriuba 3€. Cepelinai 6€. Salotos 4€. Sultys 2€. Kortelės priimamos.",
    questions: [
      { id: "R06-1", q_en: "How much is a lunch set?", q_bn: "দুপুরের সেট মেনুর দাম কত?", options_en: ["€5", "€6", "€7", "€8"], options_bn: ["৫€", "৬€", "৭€", "৮€"], correct: 2 },
      { id: "R06-2", q_en: "What is the cheapest item?", q_bn: "সবচেয়ে সস্তা কী?",          options_en: ["Soup", "Salad", "Juice", "Cepelinai"], options_bn: ["স্যুপ", "সালাদ", "জুস", "সেপেলিনাই"], correct: 2 },
      { id: "R06-3", q_en: "Are cards accepted?",       q_bn: "কার্ড কি গ্রহণ করা হয়?",     options_en: ["Yes", "No, cash only", "Only Visa", "Only debit"], options_bn: ["হ্যাঁ", "না, শুধু নগদ", "শুধু ভিসা", "শুধু ডেবিট"], correct: 0 },
    ],
  },
];

/* --------------------------------- Writing -------------------------------- */

export const WRITING_POOL: WritingPrompt[] = [
  { id: "W01", prompt_en: "Write a message to your friend Roma: you can't go to the park on Saturday because you have work. Suggest meeting next week. (50–80 words)", prompt_bn: "আপনার বন্ধু Roma কে একটি বার্তা লিখুন: শনিবার আপনার কাজ থাকায় পার্কে যেতে পারবেন না। পরের সপ্তাহে দেখা করার প্রস্তাব দিন। (৫০–৮০ শব্দ)", minWords: 50, maxWords: 80 },
  { id: "W02", prompt_en: "Write an email to your landlord: the kitchen tap is broken. Ask when it can be repaired. Be polite. (50–80 words)", prompt_bn: "আপনার বাড়িওয়ালাকে একটি ইমেইল লিখুন: রান্নাঘরের কল ভেঙে গেছে। কখন মেরামত করা যাবে জিজ্ঞাসা করুন। ভদ্র থাকুন। (৫০–৮০ শব্দ)", minWords: 50, maxWords: 80 },
  { id: "W03", prompt_en: "Write a note to your neighbor: ask them to feed your cat for the weekend while you visit Kaunas. (40–70 words)", prompt_bn: "আপনার প্রতিবেশীকে একটি নোট লিখুন: কাউনাস ভ্রমণের সময় উইকএন্ডে আপনার বিড়ালকে খাওয়াতে অনুরোধ করুন। (৪০–৭০ শব্দ)", minWords: 40, maxWords: 70 },
  { id: "W04", prompt_en: "Reply to a job interview invitation: thank them, confirm the meeting, but suggest a different time because you work in the morning. (50–80 words)", prompt_bn: "চাকরির সাক্ষাৎকারের আমন্ত্রণের উত্তর দিন: ধন্যবাদ জানান, মিটিং নিশ্চিত করুন, কিন্তু সকালে কাজ থাকায় ভিন্ন সময় প্রস্তাব করুন। (৫০–৮০ শব্দ)", minWords: 50, maxWords: 80 },
  { id: "W05", prompt_en: "Write a short birthday message to your mother in Lithuanian. Mention what you wish her. (30–50 words)", prompt_bn: "আপনার মাকে লিথুয়ানিয়ান ভাষায় একটি জন্মদিনের বার্তা লিখুন। আপনি তাকে কী কামনা করছেন তা উল্লেখ করুন। (৩০–৫০ শব্দ)", minWords: 30, maxWords: 50 },
  { id: "W06", prompt_en: "Write a message to your teacher: you are sick today and cannot come to class. Apologize and ask for the homework. (40–70 words)", prompt_bn: "আপনার শিক্ষকের কাছে একটি বার্তা লিখুন: আজ আপনি অসুস্থ এবং ক্লাসে আসতে পারবেন না। ক্ষমা চান এবং বাড়ির কাজ জিজ্ঞাসা করুন। (৪০–৭০ শব্দ)", minWords: 40, maxWords: 70 },
  { id: "W07", prompt_en: "Write an email to a language school: ask about the A1 course schedule, price, and location. (50–80 words)", prompt_bn: "একটি ভাষা স্কুলে ইমেইল লিখুন: A1 কোর্সের সময়সূচী, মূল্য এবং অবস্থান সম্পর্কে জিজ্ঞাসা করুন। (৫০–৮০ শব্দ)", minWords: 50, maxWords: 80 },
  { id: "W08", prompt_en: "Apologize to a friend for missing their party last weekend. Explain why and suggest meeting soon. (50–80 words)", prompt_bn: "গত উইকএন্ডে আপনার বন্ধুর পার্টিতে যেতে না পারার জন্য ক্ষমা চান। কারণ ব্যাখ্যা করুন এবং শীঘ্রই দেখা করার প্রস্তাব দিন। (৫০–৮০ শব্দ)", minWords: 50, maxWords: 80 },
];

/* -------------------------------- Speaking -------------------------------- */

export const SPEAKING_POOL: SpeakingPrompt[] = [
  { id: "S01", prompt_en: "Tell about your family. Mention 3 people, their names, and what they do.", prompt_bn: "আপনার পরিবার সম্পর্কে বলুন। ৩ জনের নাম এবং তারা কী করেন তা উল্লেখ করুন।", model_lt: "Mano šeima — keturi asmenys. Tėtis vardu Antanas, jis dirba inžinieriumi. Mama vardu Rita, ji yra mokytoja. Aš turiu sesę Liną, ji studentė." },
  { id: "S02", prompt_en: "Describe your typical Saturday: morning, afternoon, and evening.",          prompt_bn: "আপনার সাধারণ শনিবার বর্ণনা করুন: সকাল, দুপুর এবং সন্ধ্যা।",                            model_lt: "Šeštadienį rytą geriu kavą ir skaitau. Po pietų einu į parką su draugais. Vakare žiūriu filmą ir anksti einu miegoti." },
  { id: "S03", prompt_en: "Order food and drink at a Lithuanian café (3–5 sentences).",                prompt_bn: "একটি লিথুয়ানিয়ান ক্যাফেতে খাবার এবং পানীয় অর্ডার করুন (৩–৫ বাক্য)।",                       model_lt: "Laba diena! Norėčiau kavos su pienu ir vieną sumuštinį, prašom. Ačiū. Kiek kainuoja? Galiu mokėti kortele?" },
  { id: "S04", prompt_en: "Ask a stranger for directions to the train station.",                       prompt_bn: "একজন অপরিচিত ব্যক্তির কাছে রেল স্টেশনের পথ জিজ্ঞাসা করুন।",                          model_lt: "Atsiprašau, kur yra traukinių stotis? Ar galiu eiti pėsčiomis? Kiek minučių užtruks? Ačiū už pagalbą." },
  { id: "S05", prompt_en: "Introduce yourself: name, country, where you live in Lithuania, your job.", prompt_bn: "নিজের পরিচয় দিন: নাম, দেশ, লিথুয়ানিয়ায় আপনার অবস্থান, পেশা।",                          model_lt: "Labas. Mano vardas Arman. Aš iš Bangladešo. Dabar gyvenu Vilniuje. Dirbu IT įmonėje programuotoju." },
  { id: "S06", prompt_en: "Talk about Lithuanian weather across the four seasons.",                    prompt_bn: "চারটি ঋতুতে লিথুয়ানিয়ান আবহাওয়া সম্পর্কে কথা বলুন।",                                    model_lt: "Pavasarį šilta ir žydi gėlės. Vasarą labai karšta. Rudenį krenta lapai. Žiemą labai šalta ir sninga." },
  { id: "S07", prompt_en: "Describe your work or studies: where, when, what you do.",                  prompt_bn: "আপনার কাজ বা পড়াশোনা বর্ণনা করুন: কোথায়, কখন, কী করেন।",                              model_lt: "Aš dirbu biure Vilniaus centre. Pradedu devintą valandą ryto, baigiu šeštą vakare. Mano darbas yra įdomus." },
  { id: "S08", prompt_en: "Plan a weekend trip with a friend: when, where, how, what you'll do.",      prompt_bn: "বন্ধুর সাথে উইকএন্ড ভ্রমণ পরিকল্পনা করুন: কখন, কোথায়, কীভাবে, কী করবেন।",         model_lt: "Šeštadienį važiuojam į Trakus. Vyksim traukiniu devintą valandą. Pamatysim pilį, valgysim kibinus, grįšim sekmadienio vakare." },
];
