-- ============================================================
-- Blog: posts + per-locale translations + categories + tags
-- Run after 0001_admin_core.sql (depends on public.is_admin()).
-- Idempotent.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- categories ----------
create table if not exists public.blog_categories (
  slug        text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 2 and 40),
  name_en     text not null check (length(name_en) between 2 and 80),
  name_lt     text          check (name_lt is null or length(name_lt) between 2 and 80),
  sort_order  int  not null default 100,
  created_at  timestamptz not null default now()
);

insert into public.blog_categories (slug, name_en, name_lt, sort_order) values
  ('grammar',       'Grammar',       'Gramatika',       10),
  ('vocabulary',    'Vocabulary',    'Žodynas',         20),
  ('exam-prep',     'Exam prep',     'Egzamino ruoša',  30),
  ('pronunciation', 'Pronunciation', 'Tarimas',         40),
  ('culture',       'Culture',       'Kultūra',         50),
  ('study-habits',  'Study habits',  'Mokymosi įpročiai', 60)
on conflict (slug) do nothing;

-- ---------- posts (locale-agnostic columns) ----------
create table if not exists public.blog_posts (
  id               uuid primary key default uuid_generate_v4(),
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 80),
  status           text not null default 'draft'
                     check (status in ('draft','scheduled','published','archived')),
  category_slug    text not null references public.blog_categories(slug) on update cascade,
  primary_locale   text not null default 'en' check (primary_locale in ('en','lt')),
  tags             text[] not null default '{}',
  featured_image   jsonb not null,                       -- { url, alt, width, height, blurDataUrl? }
  author_id        uuid not null references auth.users(id) on delete restrict,
  reading_minutes  int  not null default 1 check (reading_minutes between 1 and 120),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint blog_posts_published_needs_date
    check (status <> 'published' or published_at is not null),
  constraint blog_posts_featured_image_shape
    check (
      featured_image ? 'url'
      and featured_image ? 'alt'
      and length(featured_image->>'alt') >= 4
    )
);

create index if not exists blog_posts_status_idx        on public.blog_posts(status, published_at desc);
create index if not exists blog_posts_published_idx     on public.blog_posts(published_at desc) where status = 'published';
create index if not exists blog_posts_category_idx      on public.blog_posts(category_slug, published_at desc);
create index if not exists blog_posts_tags_gin          on public.blog_posts using gin (tags);

-- ---------- post translations ----------
create table if not exists public.blog_post_translations (
  post_id        uuid not null references public.blog_posts(id) on delete cascade,
  locale         text not null check (locale in ('en','lt')),
  title          text not null check (length(title) between 10 and 120),
  excerpt        text not null check (length(excerpt) between 50 and 220),
  body_json      jsonb not null,                          -- TipTap JSON
  body_html      text  not null check (length(body_html) >= 400),
  key_takeaways  text[] not null default '{}'             -- AI/LLM summary block
                   check (array_length(key_takeaways, 1) is null
                          or (array_length(key_takeaways, 1) between 3 and 7)),
  headings       jsonb not null default '[]'::jsonb,      -- [{id,text,level}]
  faq            jsonb not null default '[]'::jsonb,      -- [{question,answer}]
  seo            jsonb not null default '{}'::jsonb,      -- { title?, description?, noindex?, canonical? }
  primary key (post_id, locale)
);

create index if not exists blog_translations_locale_idx on public.blog_post_translations(locale);

-- ---------- updated_at trigger ----------
create or replace function public.blog_posts_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch
  before update on public.blog_posts
  for each row execute function public.blog_posts_touch_updated_at();

-- ---------- RLS ----------
alter table public.blog_categories          enable row level security;
alter table public.blog_posts               enable row level security;
alter table public.blog_post_translations   enable row level security;

-- Categories: world-readable, admin-writable.
drop policy if exists "Public can read categories" on public.blog_categories;
create policy "Public can read categories"
  on public.blog_categories for select to anon, authenticated using (true);

drop policy if exists "Admins manage categories" on public.blog_categories;
create policy "Admins manage categories"
  on public.blog_categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Posts: public sees only published; admins see all.
drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
  on public.blog_posts for select to anon, authenticated
  using (status = 'published' and published_at <= now());

drop policy if exists "Admins read all posts" on public.blog_posts;
create policy "Admins read all posts"
  on public.blog_posts for select to authenticated using (public.is_admin());

drop policy if exists "Admins manage posts" on public.blog_posts;
create policy "Admins manage posts"
  on public.blog_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Translations follow their parent post's visibility.
drop policy if exists "Public can read translations of published posts" on public.blog_post_translations;
create policy "Public can read translations of published posts"
  on public.blog_post_translations for select to anon, authenticated
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = post_id
        and p.status = 'published'
        and p.published_at <= now()
    )
  );

drop policy if exists "Admins read all translations" on public.blog_post_translations;
create policy "Admins read all translations"
  on public.blog_post_translations for select to authenticated using (public.is_admin());

drop policy if exists "Admins manage translations" on public.blog_post_translations;
create policy "Admins manage translations"
  on public.blog_post_translations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
