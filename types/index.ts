export type Level = "A1" | "A2" | "B1";
export type PartOfSpeech =
  | "noun" | "verb" | "adjective" | "adverb" | "pronoun"
  | "conjunction" | "preposition" | "interjection" | "numeral" | "phrase";
export type Gender = "m" | "f" | "n" | "pl";
export type VocabStatus = "new" | "learning" | "known";
export type LessonType = "fundamentals" | "grammar" | "dialogue" | "reading" | "quiz" | "exam";

export type Topic =
  | "Body Parts" | "Clothing & Fashion" | "Colors & Descriptions"
  | "Daily Routines" | "Directions & Locations" | "Education & Learning"
  | "Emotions & Feelings" | "Entertainment & Culture" | "Family & Relationships"
  | "Food & Drinks" | "Geography & Places" | "Grammar & Language"
  | "Greetings & Expressions" | "Health & Medicine" | "Housing & Living"
  | "Numbers & Quantities" | "Personal Information" | "Professions & Work"
  | "Shopping & Commerce" | "Sports & Hobbies" | "Technology & Communication"
  | "Time & Dates" | "Transportation & Travel" | "Weather & Seasons"
  | "At the Restaurant";

export interface VocabularyItem {
  id: string;
  lithuanian: string;
  english: string;
  bengali: string;
  part_of_speech: PartOfSpeech;
  gender?: Gender;
  plural_form?: string;
  level: Level;
  topic: Topic;
  audio_url?: string;
  example_sentence_lt: string;
  example_sentence_en: string;
  example_sentence_bn: string;
  created_at?: string;
}

export interface DialogueLine {
  id: string;
  dialogue_id: string;
  speaker: "A" | "B";
  speaker_name: string;
  lithuanian: string;
  english: string;
  bengali: string;
  order_index: number;
  audio_url?: string;
}

export interface Dialogue {
  id: string;
  title_en: string;
  title_lt: string;
  title_bn: string;
  scenario_en: string;
  scenario_bn: string;
  level: Level;
  slug: string;
  lines: DialogueLine[];
  vocabulary?: VocabularyItem[];
  created_at?: string;
}

export interface AlphabetLetter {
  letter: string;
  name: string;
  sound_en: string;
  sound_bn: string;
  example_word: string;
  example_meaning_en: string;
  example_meaning_bn: string;
  is_special: boolean;
}

export interface GrammarLesson {
  id: string;
  slug: string;
  title_en: string;
  title_lt: string;
  title_bn: string;
  level: Level;
  order_index: number;
  description_en: string;
  description_bn: string;
}

export interface ReadingPassage {
  id: string;
  slug: string;
  title_en: string;
  title_lt: string;
  title_bn: string;
  level: Level;
  topic: string;
  passage_lt: string;
  passage_en: string;
  passage_bn: string;
  estimated_minutes: number;
  questions: ReadingQuestion[];
  vocabulary: VocabularyItem[];
}

export interface ReadingQuestion {
  id: string;
  question_lt: string;
  question_en: string;
  question_bn: string;
  options: { lt: string; en: string; bn: string }[];
  correct_answer: number;
  explanation_bn: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  preferred_language: "bn" | "en";
  streak_count: number;
  total_xp: number;
  created_at: string;
  last_seen: string;
}

export interface UserVocabProgress {
  vocabulary_id: string;
  status: VocabStatus;
  ease_factor: number;
  next_review: string;
  review_count: number;
}

export interface QuizQuestion {
  id: string;
  type: "vocab" | "listening" | "fill-blank" | "translation";
  question_lt?: string;
  question_en: string;
  question_bn: string;
  audio_text?: string;
  options: QuizOption[];
  correct_index: number;
  explanation_bn: string;
  vocabulary_id?: string;
}

export interface QuizOption {
  lithuanian?: string;
  english?: string;
  bengali?: string;
}

export interface DailyGoal {
  target_xp: number;
  earned_xp: number;
  activities: { name: string; xp: number; completed: boolean }[];
}

export interface Achievement {
  id: string;
  title_lt: string;
  title_en: string;
  title_bn: string;
  description_bn: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  user_id: string;
  is_public: boolean;
  card_count: number;
  created_at: string;
  items?: VocabularyItem[];
}

export interface NavItem {
  label_en: string;
  label_bn: string;
  href: string;
  icon?: string;
}
