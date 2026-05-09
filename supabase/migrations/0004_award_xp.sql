-- ============================================================
-- award_xp(amount int) — atomically increments the caller's XP.
-- Security definer so it can update profiles even with strict RLS.
-- Caps `amount` to 1..100 per call to make abuse impossible.
-- ============================================================

create or replace function public.award_xp(amount int)
returns table (total_xp int, last_seen timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  capped int := greatest(1, least(100, coalesce(amount, 0)));
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  return query
  update public.profiles
     set total_xp  = coalesce(total_xp, 0) + capped,
         last_seen = now()
   where id = uid
   returning total_xp, last_seen;
end;
$$;

revoke all on function public.award_xp(int) from public;
grant execute on function public.award_xp(int) to authenticated;
