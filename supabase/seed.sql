-- LithuanianBD - Seed Data
-- Run AFTER 001_initial.sql migration

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
insert into public.achievements (id, icon, title_lt, title_en, title_bn, description_bn, condition_type, condition_value, xp_bonus) values
  ('first_login',   '🌅', 'Pirma diena',     'First Day',      'প্রথম দিন',        'প্রথম লগইন করেছেন',              'login_count',    1,   10),
  ('words_100',     '📚', '100 žodžių',      '100 Words',      '১০০ শব্দ',         '১০০টি শব্দ শিখেছেন',             'words_learned',  100, 50),
  ('week_streak',   '🔥', 'Savaitė',         'One Week',       'এক সপ্তাহ',        '৭ দিনের ধারাবাহিকতা',            'streak_days',    7,   30),
  ('exam_ready',    '🎓', 'Egzaminas',       'Exam Ready',     'পরীক্ষার প্রস্তুত','সব মক পরীক্ষায় পাস করেছেন',     'mock_exam_pass', 1,   100),
  ('quiz_perfect',  '⭐', 'Tobulas rezultatas','Perfect Score', 'নিখুঁত স্কোর',     'কোনো কুইজে ১০০% পেয়েছেন',       'quiz_perfect',   1,   25),
  ('words_50',      '✨', '50 žodžių',       '50 Words',       '৫০ শব্দ',          '৫০টি শব্দ শিখেছেন',              'words_learned',  50,  25),
  ('month_streak',  '🏆', 'Mėnuo',           'One Month',      'এক মাস',           '৩০ দিনের ধারাবাহিকতা',           'streak_days',    30,  100),
  ('lessons_10',    '🎯', '10 pamokų',       '10 Lessons',     '১০টি পাঠ',         '১০টি পাঠ সম্পন্ন করেছেন',        'lessons_done',   10,  50)
on conflict (id) do nothing;

-- ============================================================
-- LESSONS
-- ============================================================
insert into public.lessons (id, title_lt, title_en, title_bn, description_en, description_bn, lesson_type, level, topic, order_index, xp_reward, estimated_minutes) values
  -- Fundamentals
  ('fundamentals-alphabet', 'Abėcėlė', 'Lithuanian Alphabet', 'লিথুয়ানিয়ান বর্ণমালা',
   'Learn all 32 letters of the Lithuanian alphabet with pronunciation',
   '৩২টি লিথুয়ানিয়ান অক্ষর ও উচ্চারণ শিখুন',
   'fundamentals', 'A1', 'alphabet', 1, 30, 15),

  ('fundamentals-numbers', 'Skaičiai', 'Numbers 0–100', 'সংখ্যা ০–১০০',
   'Count in Lithuanian from zero to one hundred',
   'শূন্য থেকে একশো পর্যন্ত লিথুয়ানিয়ানে গণনা করুন',
   'fundamentals', 'A1', 'numbers', 2, 30, 15),

  ('fundamentals-days', 'Dienos ir mėnesiai', 'Days & Months', 'দিন ও মাস',
   'Days of the week and months of the year',
   'সপ্তাহের দিন ও বছরের মাসগুলো',
   'fundamentals', 'A1', 'time', 3, 20, 10),

  -- Grammar
  ('grammar-to-be', 'Veiksmažodis "būti"', 'Verb: To Be', '"হওয়া" ক্রিয়া',
   'Conjugate the most important Lithuanian verb: būti (to be)',
   'লিথুয়ানিয়ানের সবচেয়ে গুরুত্বপূর্ণ ক্রিয়া "būti" (হওয়া) শিখুন',
   'grammar', 'A1', 'grammar', 4, 50, 20),

  ('grammar-nouns-gender', 'Daiktavardžių giminė', 'Noun Genders', 'বিশেষ্যের লিঙ্গ',
   'Understanding masculine and feminine nouns in Lithuanian',
   'লিথুয়ানিয়ানে পুংলিঙ্গ ও স্ত্রীলিঙ্গ বিশেষ্য বোঝা',
   'grammar', 'A1', 'grammar', 5, 50, 20),

  ('grammar-present-tense', 'Esamasis laikas', 'Present Tense', 'বর্তমান কাল',
   'How to conjugate verbs in the present tense',
   'বর্তমান কালে ক্রিয়া রূপান্তর করতে শিখুন',
   'grammar', 'A1', 'grammar', 6, 50, 20),

  ('grammar-questions', 'Klausiamieji sakiniai', 'Asking Questions', 'প্রশ্ন করা',
   'Question words and how to form questions in Lithuanian',
   'প্রশ্নবোধক শব্দ ও লিথুয়ানিয়ানে প্রশ্ন গঠন',
   'grammar', 'A1', 'grammar', 7, 50, 20),

  -- Dialogues
  ('dialogue-first-meeting', 'Pirmasis susitikimas', 'First Meeting', 'প্রথম সাক্ষাৎ',
   'Introduce yourself and greet someone for the first time',
   'নিজেকে পরিচয় দিন ও প্রথমবার কাউকে অভিবাদন জানান',
   'dialogue', 'A1', 'greetings', 8, 30, 10),

  ('dialogue-at-the-shop', 'Parduotuvėje', 'At the Shop', 'দোকানে',
   'Buy groceries and everyday items in Lithuanian',
   'লিথুয়ানিয়ান ভাষায় মুদিখানা ও দৈনন্দিন জিনিস কিনুন',
   'dialogue', 'A1', 'shopping', 9, 30, 10),

  ('dialogue-at-the-doctor', 'Pas gydytoją', 'At the Doctor', 'ডাক্তারের কাছে',
   'Describe symptoms and understand medical advice',
   'উপসর্গ বর্ণনা করুন ও চিকিৎসা পরামর্শ বুঝুন',
   'dialogue', 'A1', 'health', 10, 30, 10),

  ('dialogue-asking-directions', 'Kaip nueiti?', 'Asking Directions', 'পথনির্দেশনা',
   'Ask for and understand directions in Lithuanian',
   'লিথুয়ানিয়ান ভাষায় দিকনির্দেশনা জিজ্ঞাসা করুন ও বুঝুন',
   'dialogue', 'A1', 'directions', 11, 30, 10),

  ('dialogue-at-the-restaurant', 'Restorane', 'At the Restaurant', 'রেস্তোরাঁয়',
   'Order food and handle restaurant conversations',
   'খাবার অর্ডার দিন ও রেস্তোরাঁর কথোপকথন করুন',
   'dialogue', 'A1', 'food', 12, 30, 10)

on conflict (id) do nothing;

-- ============================================================
-- VOCABULARY SEED (core 50 words)
-- ============================================================
insert into public.vocabulary (id, lithuanian, english, bengali, part_of_speech, gender, level, topic, example_sentence_lt, example_sentence_en, example_sentence_bn) values
  -- Greetings
  ('v001', 'Labas',       'Hello',        'হ্যালো',          'interjection', null,       'A1', 'greetings', 'Labas! Kaip sekasi?',               'Hello! How are you?',                  'হ্যালো! আপনি কেমন আছেন?'),
  ('v002', 'Ačiū',        'Thank you',    'ধন্যবাদ',         'interjection', null,       'A1', 'greetings', 'Ačiū labai!',                        'Thank you very much!',                 'আপনাকে অনেক ধন্যবাদ!'),
  ('v003', 'Prašom',      'Please / You''re welcome', 'দয়া করে / ধন্যবাদান্তে', 'interjection', null, 'A1', 'greetings', 'Prašom, sėskitės.',  'Please, have a seat.',                 'দয়া করে বসুন।'),
  ('v004', 'Atsiprašau',  'Excuse me / Sorry', 'মাফ করবেন',  'interjection', null,       'A1', 'greetings', 'Atsiprašau, kur yra autobusų stotis?', 'Excuse me, where is the bus station?', 'মাফ করবেন, বাস স্টেশন কোথায়?'),
  ('v005', 'Viso gero',   'Goodbye',      'বিদায়',           'phrase',       null,       'A1', 'greetings', 'Viso gero! Iki!',                    'Goodbye! See you!',                    'বিদায়! দেখা হবে!'),

  -- People & Family
  ('v010', 'žmogus',      'person / man', 'মানুষ',           'noun',         'masculine','A1', 'family',    'Tas žmogus yra mano draugas.',       'That person is my friend.',            'সেই ব্যক্তি আমার বন্ধু।'),
  ('v011', 'moteris',     'woman',        'মহিলা',           'noun',         'feminine', 'A1', 'family',    'Ta moteris dirba parduotuvėje.',      'That woman works in a shop.',          'সেই মহিলা দোকানে কাজ করেন।'),
  ('v012', 'šeima',       'family',       'পরিবার',          'noun',         'feminine', 'A1', 'family',    'Mano šeima gyvena Bangladeše.',       'My family lives in Bangladesh.',       'আমার পরিবার বাংলাদেশে থাকে।'),
  ('v013', 'mama',        'mother / mum', 'মা',              'noun',         'feminine', 'A1', 'family',    'Mano mama gamina maistą.',            'My mother is cooking food.',           'আমার মা রান্না করছেন।'),
  ('v014', 'tėtis',       'father / dad', 'বাবা',            'noun',         'masculine','A1', 'family',    'Mano tėtis dirba gamykloje.',         'My father works in a factory.',        'আমার বাবা কারখানায় কাজ করেন।'),
  ('v015', 'vaikai',      'children',     'সন্তান',          'noun',         'masculine','A1', 'family',    'Turiu du vaikus.',                    'I have two children.',                 'আমার দুটি সন্তান আছে।'),

  -- Numbers
  ('v020', 'vienas',      'one',          'এক',              'numeral',      null,       'A1', 'numbers',   'Turiu vieną katę.',                   'I have one cat.',                      'আমার একটি বিড়াল আছে।'),
  ('v021', 'du',          'two',          'দুই',             'numeral',      null,       'A1', 'numbers',   'Du obuoliai.',                        'Two apples.',                          'দুটি আপেল।'),
  ('v022', 'trys',        'three',        'তিন',             'numeral',      null,       'A1', 'numbers',   'Trys dienos.',                        'Three days.',                          'তিন দিন।'),
  ('v023', 'dešimt',      'ten',          'দশ',              'numeral',      null,       'A1', 'numbers',   'Dešimt eurų.',                        'Ten euros.',                           'দশ ইউরো।'),
  ('v024', 'šimtas',      'hundred',      'একশো',            'numeral',      null,       'A1', 'numbers',   'Šimtas litų.',                        'One hundred litas.',                   'একশো লিটাস।'),

  -- Food & Drink
  ('v030', 'vanduo',      'water',        'পানি',            'noun',         'masculine','A1', 'food',      'Prašom stiklinę vandens.',            'A glass of water, please.',            'এক গ্লাস পানি দিন।'),
  ('v031', 'duona',       'bread',        'রুটি',            'noun',         'feminine', 'A1', 'food',      'Nupirk duonos parduotuvėje.',         'Buy bread at the shop.',               'দোকান থেকে রুটি কিনুন।'),
  ('v032', 'pienas',      'milk',         'দুধ',             'noun',         'masculine','A1', 'food',      'Geriu pieną.',                        'I drink milk.',                        'আমি দুধ পান করি।'),
  ('v033', 'kava',        'coffee',       'কফি',             'noun',         'feminine', 'A1', 'food',      'Ar norite kavos?',                    'Would you like some coffee?',          'আপনি কি কফি চান?'),
  ('v034', 'mėsa',        'meat',         'মাংস',            'noun',         'feminine', 'A1', 'food',      'Aš nevalgyti mėsos.',                 'I do not eat meat.',                   'আমি মাংস খাই না।'),
  ('v035', 'daržovės',    'vegetables',   'সবজি',            'noun',         'feminine', 'A1', 'food',      'Valgyti daug daržovių.',              'Eat plenty of vegetables.',            'প্রচুর সবজি খান।'),

  -- Places
  ('v040', 'parduotuvė',  'shop / store', 'দোকান',           'noun',         'feminine', 'A1', 'places',    'Einu į parduotuvę.',                  'I am going to the shop.',              'আমি দোকানে যাচ্ছি।'),
  ('v041', 'ligoninė',    'hospital',     'হাসপাতাল',        'noun',         'feminine', 'A1', 'places',    'Reikia vykti į ligoninę.',            'I need to go to the hospital.',        'হাসপাতালে যেতে হবে।'),
  ('v042', 'mokykla',     'school',       'স্কুল',           'noun',         'feminine', 'A1', 'places',    'Vaikai eina į mokyklą.',              'The children go to school.',           'শিশুরা স্কুলে যায়।'),
  ('v043', 'darbas',      'work / job',   'কাজ',             'noun',         'masculine','A1', 'places',    'Einu į darbą.',                       'I am going to work.',                  'আমি কাজে যাচ্ছি।'),
  ('v044', 'namai',       'home',         'বাড়ি',            'noun',         'masculine','A1', 'places',    'Grįžtu namo.',                        'I am going home.',                     'আমি বাড়ি ফিরছি।'),

  -- Transport
  ('v050', 'autobusas',   'bus',          'বাস',             'noun',         'masculine','A1', 'transport', 'Autobusas atvyks netrukus.',           'The bus will arrive soon.',            'বাস শীঘ্রই আসবে।'),
  ('v051', 'traukinys',   'train',        'ট্রেন',           'noun',         'masculine','A1', 'transport', 'Traukinys vyksta į Kauną.',            'The train goes to Kaunas.',            'ট্রেনটি কাউনাসে যাচ্ছে।'),
  ('v052', 'taksi',       'taxi',         'ট্যাক্সি',        'noun',         'masculine','A1', 'transport', 'Iškvieskite taksi, prašom.',           'Please call a taxi.',                  'একটি ট্যাক্সি ডাকুন।'),
  ('v053', 'stotelė',     'bus stop',     'বাস স্টপ',        'noun',         'feminine', 'A1', 'transport', 'Kur yra autobusų stotelė?',            'Where is the bus stop?',               'বাস স্টপ কোথায়?'),

  -- Common Verbs
  ('v060', 'būti',        'to be',        'হওয়া',            'verb',         null,       'A1', 'verbs',     'Aš esu iš Bangladešo.',               'I am from Bangladesh.',                'আমি বাংলাদেশ থেকে।'),
  ('v061', 'eiti',        'to go (on foot)', 'হেঁটে যাওয়া', 'verb',         null,       'A1', 'verbs',     'Einu į parduotuvę.',                  'I am going to the shop.',              'আমি দোকানে যাচ্ছি।'),
  ('v062', 'kalbėti',     'to speak',     'বলা / কথা বলা',  'verb',         null,       'A1', 'verbs',     'Kalbiu lietuviškai.',                  'I speak Lithuanian.',                  'আমি লিথুয়ানিয়ান বলি।'),
  ('v063', 'suprasti',    'to understand','বোঝা',            'verb',         null,       'A1', 'verbs',     'Nesuprantu lietuviškai.',             'I do not understand Lithuanian.',      'আমি লিথুয়ানিয়ান বুঝি না।'),
  ('v064', 'dirbti',      'to work',      'কাজ করা',         'verb',         null,       'A1', 'verbs',     'Dirbu gamykloje.',                    'I work in a factory.',                 'আমি কারখানায় কাজ করি।'),
  ('v065', 'gyventi',     'to live',      'বাস করা',         'verb',         null,       'A1', 'verbs',     'Gyvenu Vilniuje.',                    'I live in Vilnius.',                   'আমি ভিলনিউসে থাকি।'),
  ('v066', 'norėti',      'to want',      'চাওয়া',           'verb',         null,       'A1', 'verbs',     'Noriu mokytis lietuvių kalbos.',       'I want to learn Lithuanian.',          'আমি লিথুয়ানিয়ান শিখতে চাই।'),
  ('v067', 'mokytis',     'to learn / study', 'শেখা',        'verb',         null,       'A1', 'verbs',     'Mokausi lietuvių kalbos.',             'I am studying Lithuanian.',            'আমি লিথুয়ানিয়ান শিখছি।'),

  -- Health
  ('v070', 'gydytojas',   'doctor',       'ডাক্তার',         'noun',         'masculine','A1', 'health',    'Reikia vykti pas gydytoją.',           'I need to go to the doctor.',          'ডাক্তারের কাছে যেতে হবে।'),
  ('v071', 'vaistai',     'medicine',     'ওষুধ',            'noun',         'masculine','A1', 'health',    'Gydytojas išrašė vaistų.',            'The doctor prescribed medicine.',      'ডাক্তার ওষুধ দিয়েছেন।'),
  ('v072', 'galva',       'head',         'মাথা',            'noun',         'feminine', 'A1', 'health',    'Man skauda galva.',                   'My head hurts.',                       'আমার মাথা ব্যথা।'),
  ('v073', 'sergu',       'I am sick',    'আমি অসুস্থ',      'verb',         null,       'A1', 'health',    'Šiandien sergu, negaliu ateiti.',     'Today I am sick, I cannot come.',      'আজ অসুস্থ, আসতে পারব না।'),

  -- Work
  ('v080', 'gamykla',     'factory',      'কারখানা',         'noun',         'feminine', 'A1', 'work',      'Dirbu gamykloje.',                    'I work in a factory.',                 'আমি কারখানায় কাজ করি।'),
  ('v081', 'atlyginimas', 'salary / pay', 'বেতন',            'noun',         'masculine','A1', 'work',      'Atlyginimas mokamas pirmą mėnesio dieną.', 'Salary is paid on the first of the month.', 'বেতন মাসের প্রথম দিনে দেওয়া হয়।'),
  ('v082', 'darbdavys',   'employer',     'নিয়োগকর্তা',      'noun',         'masculine','A1', 'work',      'Mano darbdavys yra geras žmogus.',    'My employer is a good person.',        'আমার নিয়োগকর্তা ভালো মানুষ।'),
  ('v083', 'kolegos',     'colleagues',   'সহকর্মীরা',       'noun',         'masculine','A1', 'work',      'Mano kolegos yra draugiški.',         'My colleagues are friendly.',          'আমার সহকর্মীরা বন্ধুত্বপূর্ণ।'),

  -- Question Words
  ('v090', 'kas',         'what / who',   'কী / কে',         'pronoun',      null,       'A1', 'grammar',   'Kas tai yra?',                        'What is this?',                        'এটি কী?'),
  ('v091', 'kur',         'where',        'কোথায়',           'adverb',       null,       'A1', 'grammar',   'Kur yra tualetas?',                   'Where is the toilet?',                 'টয়লেট কোথায়?'),
  ('v092', 'kada',        'when',         'কখন',             'adverb',       null,       'A1', 'grammar',   'Kada atvyksta autobusas?',             'When does the bus arrive?',            'বাস কখন আসে?'),
  ('v093', 'kiek',        'how much / how many', 'কতটুকু / কতটি', 'adverb',  null,       'A1', 'grammar',   'Kiek tai kainuoja?',                  'How much does this cost?',             'এটির দাম কত?'),
  ('v094', 'kodėl',       'why',          'কেন',             'adverb',       null,       'A1', 'grammar',   'Kodėl neatėjote?',                    'Why did you not come?',                'কেন আসেননি?'),
  ('v095', 'kaip',        'how',          'কীভাবে',          'adverb',       null,       'A1', 'grammar',   'Kaip sekasi?',                        'How are you?',                         'আপনি কেমন আছেন?')

on conflict (id) do nothing;
