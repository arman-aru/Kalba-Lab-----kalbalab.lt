-- ============================================================
-- Base profiles table (run BEFORE 0001_admin_core.sql)
-- Idempotent — safe to re-run.
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text,
  avatar_url          text,
  preferred_language  text default 'en',
  streak_count        int  not null default 0,
  total_xp            int  not null default 0,
  created_at          timestamptz not null default now(),
  last_seen           timestamptz not null default now()
);

create unique index if not exists profiles_email_key on public.profiles (lower(email));

-- Auto-create a profile row whenever a new auth user is created
-- (covers Google OAuth, email/password, magic-link, etc.).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
