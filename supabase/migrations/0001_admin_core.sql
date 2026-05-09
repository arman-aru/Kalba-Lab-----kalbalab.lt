-- ============================================================
-- KalbaLab admin core schema
-- Run this in the Supabase SQL editor (or via the CLI).
-- It is idempotent — safe to re-run.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- profiles: add admin role + extra columns ----------
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='is_admin') then
    alter table public.profiles add column is_admin boolean not null default false;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='country') then
    alter table public.profiles add column country text;
  end if;
end$$;

create index if not exists profiles_is_admin_idx on public.profiles(is_admin) where is_admin = true;
create index if not exists profiles_total_xp_idx on public.profiles(total_xp desc);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

-- Helper: is the *current request* an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- contact_messages ----------
create table if not exists public.contact_messages (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null check (length(name) between 1 and 200),
  email        text not null check (length(email) between 3 and 320),
  subject      text check (subject is null or length(subject) <= 300),
  message      text not null check (length(message) between 1 and 5000),
  status       text not null default 'new' check (status in ('new','read','archived','spam')),
  ip_hash      text,
  user_agent   text,
  user_id      uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  read_at      timestamptz
);

create index if not exists contact_messages_status_idx on public.contact_messages(status, created_at desc);
create index if not exists contact_messages_email_idx on public.contact_messages(email);
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can insert a contact message" on public.contact_messages;
create policy "Anyone can insert a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using (public.is_admin());

-- ---------- newsletter_subscribers ----------
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default uuid_generate_v4(),
  email           text not null unique check (length(email) between 3 and 320),
  source          text default 'homepage' check (source in ('homepage','footer','contact','dashboard','other')),
  ui_language     text,
  ip_hash         text,
  user_agent      text,
  confirmed       boolean not null default true,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists newsletter_active_idx on public.newsletter_subscribers(created_at desc) where unsubscribed_at is null;

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read subscribers" on public.newsletter_subscribers;
create policy "Admins can read subscribers"
  on public.newsletter_subscribers
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update subscribers" on public.newsletter_subscribers;
create policy "Admins can update subscribers"
  on public.newsletter_subscribers
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete subscribers" on public.newsletter_subscribers;
create policy "Admins can delete subscribers"
  on public.newsletter_subscribers
  for delete
  to authenticated
  using (public.is_admin());

-- ---------- admin_audit_log ----------
create table if not exists public.admin_audit_log (
  id          bigserial primary key,
  admin_id    uuid references auth.users(id) on delete set null,
  admin_email text,
  action      text not null,
  target      text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx on public.admin_audit_log(created_at desc);

alter table public.admin_audit_log enable row level security;

drop policy if exists "Admins can read audit log" on public.admin_audit_log;
create policy "Admins can read audit log"
  on public.admin_audit_log
  for select
  to authenticated
  using (public.is_admin());

-- ---------- profiles RLS hardening ----------
-- Ensure RLS is on for profiles, with sensible defaults: users see themselves; admins see all.
alter table public.profiles enable row level security;

drop policy if exists "Self can read own profile" on public.profiles;
create policy "Self can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Self can update own profile" on public.profiles;
create policy "Self can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and is_admin = (select is_admin from public.profiles where id = auth.uid()));

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- Daily-signups view (for analytics) ----------
create or replace view public.admin_daily_signups as
select
  date_trunc('day', created_at)::date as day,
  count(*)::int as signups
from public.profiles
group by 1
order by 1 desc;

-- View security: rely on the underlying table's RLS (admins-only read).
revoke all on public.admin_daily_signups from anon;
grant select on public.admin_daily_signups to authenticated;
