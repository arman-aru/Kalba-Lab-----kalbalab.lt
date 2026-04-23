import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          preferred_language: "bn" | "en";
          streak_count: number;
          total_xp: number;
          created_at: string;
          last_seen: string;
        };
      };
      vocabulary: {
        Row: {
          id: string;
          lithuanian: string;
          english: string;
          bengali: string;
          part_of_speech: string;
          gender: string | null;
          plural_form: string | null;
          level: string;
          topic: string;
          audio_url: string | null;
          example_sentence_lt: string;
          example_sentence_en: string;
          example_sentence_bn: string;
          created_at: string;
        };
      };
    };
  };
};
