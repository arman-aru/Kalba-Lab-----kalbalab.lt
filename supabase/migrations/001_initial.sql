-- LithuanianBD - Initial Schema Migration
-- Run this in your Supabase SQL editor or via Supabase CLI

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  preferred_lang text not null default 'bn' check (preferred_lang in ('bn', 'en')),
  daily_goal_xp integer not null default 20,
  audio_autoplay boolean not null default false,
  total_xp integer not null default 0,
  streak_count integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- VOCABULARY
-- ============================================================
create table if not exists public.vocabulary (
  id text primary key,
  lithuanian text not null,
  english text not null,
  bengali text not null,
  part_of_speech text not null check (part_of_speech in ('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'numeral', 'phrase')),
  gender text check (gender in ('masculine', 'feminine', 'neuter')),
  plural_form text,
  level text not null default 'A1' check (level in ('A1', 'A2', 'B1', 'B2')),
  topic text not null,
  example_sentence_lt text,
  example_sentence_en text,
  example_sentence_bn text,
  audio_url text,
  created_at timestamptz not null default now()
);

alter table public.vocabulary enable row level security;

create policy "Vocabulary is public read"
  on public.vocabulary for select
  to authenticated, anon
  using (true);

create index if not exists vocabulary_topic_idx on public.vocabulary(topic);
create index if not exists vocabulary_level_idx on public.vocabulary(level);
create index if not exists vocabulary_pos_idx on public.vocabulary(part_of_speech);

-- ============================================================
-- USER VOCABULARY PROGRESS (Spaced Repetition)
-- ============================================================
create table if not exists public.user_vocab_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  vocab_id text references public.vocabulary(id) on delete cascade not null,
  status text not null default 'new' check (status in ('new', 'learning', 'review', 'mastered')),
  ease_factor numeric not null default 2.5,
  interval integer not null default 1,
  repetitions integer not null default 0,
  next_review timestamptz not null default now(),
  last_reviewed timestamptz,
  times_correct integer not null default 0,
  times_incorrect integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, vocab_id)
);

alter table public.user_vocab_progress enable row level security;

create policy "Users can manage own vocab progress"
  on public.user_vocab_progress for all
  using (auth.uid() = user_id);

create index if not exists uvp_user_id_idx on public.user_vocab_progress(user_id);
create index if not exists uvp_next_review_idx on public.user_vocab_progress(user_id, next_review);
create index if not exists uvp_status_idx on public.user_vocab_progress(user_id, status);

-- ============================================================
-- LESSONS
-- ============================================================
create table if not exists public.lessons (
  id text primary key,
  title_lt text not null,
  title_en text not null,
  title_bn text not null,
  description_en text,
  description_bn text,
  lesson_type text not null check (lesson_type in ('grammar', 'vocabulary', 'dialogue', 'reading', 'listening', 'writing', 'fundamentals')),
  level text not null default 'A1',
  topic text,
  order_index integer not null default 0,
  xp_reward integer not null default 50,
  estimated_minutes integer not null default 10,
  content jsonb,
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;

create policy "Lessons are public read"
  on public.lessons for select
  to authenticated, anon
  using (true);

create index if not exists lessons_level_idx on public.lessons(level);
create index if not exists lessons_type_idx on public.lessons(lesson_type);

-- ============================================================
-- USER LESSON PROGRESS
-- ============================================================
create table if not exists public.user_lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text references public.lessons(id) on delete cascade not null,
  completed boolean not null default false,
  progress_pct integer not null default 0 check (progress_pct between 0 and 100),
  xp_earned integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;

create policy "Users can manage own lesson progress"
  on public.user_lesson_progress for all
  using (auth.uid() = user_id);

create index if not exists ulp_user_id_idx on public.user_lesson_progress(user_id);

-- ============================================================
-- DIALOGUES
-- ============================================================
create table if not exists public.dialogues (
  id text primary key,
  slug text unique not null,
  title_lt text not null,
  title_en text not null,
  title_bn text not null,
  scenario_lt text,
  scenario_en text,
  scenario_bn text,
  level text not null default 'A1',
  lines jsonb not null default '[]',
  key_vocab jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.dialogues enable row level security;

create policy "Dialogues are public read"
  on public.dialogues for select
  to authenticated, anon
  using (true);

-- ============================================================
-- QUIZ SESSIONS
-- ============================================================
create table if not exists public.quiz_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_type text not null,
  score integer not null default 0,
  total integer not null default 0,
  pct integer generated always as (case when total > 0 then (score * 100 / total) else 0 end) stored,
  passed boolean,
  time_taken_seconds integer,
  answers jsonb not null default '[]',
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

alter table public.quiz_sessions enable row level security;

create policy "Users can manage own quiz sessions"
  on public.quiz_sessions for all
  using (auth.uid() = user_id);

create index if not exists qs_user_id_idx on public.quiz_sessions(user_id);
create index if not exists qs_completed_at_idx on public.quiz_sessions(user_id, completed_at desc);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
create table if not exists public.achievements (
  id text primary key,
  icon text not null,
  title_lt text not null,
  title_en text not null,
  title_bn text not null,
  description_bn text,
  condition_type text not null,
  condition_value integer not null,
  xp_bonus integer not null default 0
);

alter table public.achievements enable row level security;

create policy "Achievements are public read"
  on public.achievements for select
  to authenticated, anon
  using (true);

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
create table if not exists public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text references public.achievements(id) on delete cascade not null,
  earned_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "System can insert achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- DAILY ACTIVITY LOG (for activity grid / streaks)
-- ============================================================
create table if not exists public.daily_activity (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  xp_earned integer not null default 0,
  activities_count integer not null default 0,
  unique(user_id, date)
);

alter table public.daily_activity enable row level security;

create policy "Users can manage own daily activity"
  on public.daily_activity for all
  using (auth.uid() = user_id);

create index if not exists da_user_date_idx on public.daily_activity(user_id, date desc);

-- ============================================================
-- SAVED WORDS (bookmarks)
-- ============================================================
create table if not exists public.saved_words (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  vocab_id text references public.vocabulary(id) on delete cascade not null,
  saved_at timestamptz not null default now(),
  unique(user_id, vocab_id)
);

alter table public.saved_words enable row level security;

create policy "Users can manage own saved words"
  on public.saved_words for all
  using (auth.uid() = user_id);

-- ============================================================
-- HELPER: update updated_at timestamp
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_uvp_updated_at before update on public.user_vocab_progress
  for each row execute procedure public.set_updated_at();

create trigger set_ulp_updated_at before update on public.user_lesson_progress
  for each row execute procedure public.set_updated_at();
