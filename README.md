# 🇱🇹 KalbaLab — Learn Lithuanian, in your language

A multilingual Lithuanian language learning app for international communities living in or moving to Lithuania. Lessons, vocabulary, and explanations are available in **English · Bengali · Hindi · Uzbek · Tajik · Kyrgyz · Azerbaijani**, with native Lithuanian audio on every word and complete A1 exam preparation.

## Features

- **Flashcards** with SM-2 spaced repetition and 3D flip animation
- **120+ vocabulary words** across 25 topics (A1 level)
- **5 real-world dialogues** (shop, doctor, directions, restaurant, introductions)
- **Grammar lessons** with trilingual tables and Bengali explanations
- **A1 Exam Prep** — Listening, Reading, Writing, Speaking, and Mock Exam
- **Audio TTS** on every Lithuanian word using Web Speech API (lt-LT)
- **XP system** with levels, streaks, and achievements
- **CMD+K spotlight search** across all vocabulary
- **Dark mode** default with amber + emerald accent theme

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand with persist middleware |
| Backend | Supabase (PostgreSQL + Auth) |
| Audio | Web Speech API (browser-native, no API key needed) |
| Fonts | Inter + Noto Sans Bengali (Google Fonts) |
| Deployment | Vercel |

## Project Structure

```
app/
  (auth)/          # Login, Register
  (protected)/     # Dashboard, Flashcards, Vocabulary, Lessons, Quizzes, Exam Prep, Profile
  page.tsx         # Landing page
components/
  audio/           # AudioButton — TTS on any Lithuanian text
  layout/          # Navbar, Footer, SpotlightSearch
  shared/          # TrilingualText, BengaliExplanation, ProgressRing, StreakBadge, ExamTimerBar
data/              # Mock content (vocabulary, dialogues, grammar, alphabet)
lib/               # audio.ts, spaced-repetition.ts, xp.ts, supabase.ts, utils.ts
stores/            # Zustand global store
supabase/
  migrations/      # 001_initial.sql — all table definitions + RLS
  seed.sql         # Achievements, lessons, core vocabulary
types/             # Shared TypeScript interfaces
```

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd KalbaLab
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials (see **Supabase Setup** below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The app works fully with mock data even without Supabase configured. Audio TTS works in any browser that supports the Web Speech API (Chrome, Edge, Safari). Firefox has limited Lithuanian voice support.

## Supabase Setup

### Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Wait for the project to finish provisioning (~2 minutes).
3. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Run migrations

In the Supabase dashboard, go to **SQL Editor** and run each file in order:

```
supabase/migrations/001_initial.sql   ← Creates all tables, RLS policies, triggers
supabase/seed.sql                     ← Seeds achievements, lessons, core vocabulary
```

Or with Supabase CLI:

```bash
npx supabase db push
npx supabase db seed
```

### Enable Google OAuth (optional)

1. Go to **Authentication → Providers → Google**.
2. Follow the Supabase docs to create a Google OAuth app and add the credentials.
3. Add your Supabase callback URL to the Google Cloud Console allowed redirect URIs.

## Connecting Supabase to the App

Create `lib/supabase.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Install the Supabase SSR package:

```bash
npm install @supabase/ssr @supabase/supabase-js
```

The auth forms at `app/(auth)/login/page.tsx` and `register/page.tsx` are ready to wire up — replace the `handleSubmit` placeholders with `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`.

## Adding New Vocabulary

Edit `data/vocabulary.ts`. Each entry follows this shape:

```typescript
{
  id: "v200",                          // unique, sequential
  lithuanian: "katė",                  // the word in Lithuanian
  english: "cat",                      // English translation
  bengali: "বিড়াল",                   // Bengali translation
  part_of_speech: "noun",              // noun | verb | adjective | adverb | phrase | ...
  gender: "feminine",                  // masculine | feminine | null
  plural_form: "katės",               // optional
  level: "A1",
  topic: "animals",                    // must match one of TOPICS in vocabulary.ts
  example_sentence_lt: "Turiu katę.", 
  example_sentence_en: "I have a cat.",
  example_sentence_bn: "আমার একটি বিড়াল আছে।",
}
```

Then add the same row to `supabase/seed.sql` and re-run the seed in Supabase SQL Editor.

## Adding New Grammar Topics

Edit `data/grammar.ts`. Add a new entry to `grammarTopics` with:

```typescript
{
  slug: "my-new-topic",          // URL slug: /lessons/a1/grammar/my-new-topic
  title_lt: "...", title_en: "...", title_bn: "...",
  level: "A1",
  explanation_bn: "...",         // Bengali explanation
  tables: [...],                 // headers + rows
  examples: [...],               // lt/en/bn triples
  tips_bn: [...],                // Bengali tips array
}
```

`generateStaticParams()` in the grammar page automatically picks it up — no routing changes needed.

## Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

Vercel auto-detects Next.js. No `vercel.json` configuration needed.

After deploy, add your Vercel URL (`https://your-app.vercel.app`) to:
- Supabase → **Authentication → URL Configuration → Site URL**
- Supabase → **Authentication → URL Configuration → Redirect URLs**

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| TTS (lt-LT) | ✅ | ✅ | ✅ | ⚠️ Limited |
| Recording (Speaking) | ✅ | ✅ | ✅ | ✅ |
| Bengali font | ✅ | ✅ | ✅ | ✅ |

For best Lithuanian TTS quality, use Chrome or Edge. The app falls back gracefully if a Lithuanian voice is unavailable.

## License

MIT — build on it freely.
# KalbaLab
