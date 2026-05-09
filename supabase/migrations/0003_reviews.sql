-- ============================================================
-- User reviews / testimonials
-- Run after 0001_admin_core.sql. Idempotent.
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null check (length(name)     between 1 and 120),
  location     text     check (location is null or length(location) <= 120),
  country      text     check (country  is null or length(country)  <= 80),
  rating       int  not null check (rating between 1 and 5),
  feedback     text not null check (length(feedback) between 5 and 1500),
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  approved_by  uuid references auth.users(id) on delete set null,
  approved_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- One review per user (they can update it; if you want history, drop this).
create unique index if not exists reviews_user_unique on public.reviews(user_id);

create index if not exists reviews_status_idx     on public.reviews(status, created_at desc);
create index if not exists reviews_approved_idx   on public.reviews(created_at desc) where status = 'approved';

alter table public.reviews enable row level security;

-- Public can read APPROVED reviews (homepage testimonials work even for anon).
drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'approved');

-- Authors can read their own review (any status, including pending).
drop policy if exists "Users can read own review" on public.reviews;
create policy "Users can read own review"
  on public.reviews
  for select
  to authenticated
  using (user_id = auth.uid());

-- Authors can insert their own review (status will default to 'pending').
drop policy if exists "Users can insert own review" on public.reviews;
create policy "Users can insert own review"
  on public.reviews
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Authors can edit their own review BUT only fields they own — not status.
-- A trigger below force-resets status to 'pending' when the body changes.
drop policy if exists "Users can update own review" on public.reviews;
create policy "Users can update own review"
  on public.reviews
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admins can read / update / delete everything.
drop policy if exists "Admins can read all reviews" on public.reviews;
create policy "Admins can read all reviews"
  on public.reviews
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update any review" on public.reviews;
create policy "Admins can update any review"
  on public.reviews
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete any review" on public.reviews;
create policy "Admins can delete any review"
  on public.reviews
  for delete
  to authenticated
  using (public.is_admin());

-- Trigger: when a non-admin author edits their review body/rating/etc.,
-- reset status to 'pending' so it must be re-approved.
create or replace function public.reviews_resubmit_on_edit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.feedback is distinct from old.feedback
     or new.rating  is distinct from old.rating
     or new.name    is distinct from old.name
     or new.location is distinct from old.location
     or new.country  is distinct from old.country
  then
    new.status      := 'pending';
    new.approved_by := null;
    new.approved_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_resubmit_on_edit on public.reviews;
create trigger reviews_resubmit_on_edit
  before update on public.reviews
  for each row execute function public.reviews_resubmit_on_edit();
