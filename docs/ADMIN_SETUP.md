# Admin dashboard — setup

The admin lives at `/admin`, behind Supabase Auth + an `is_admin` flag on `profiles`.
Public users hit `/api/contact` and `/api/newsletter` (open to anon, rate-limited, hardened with a honeypot). All admin tables are read-only to non-admins via RLS.

## 1. Environment variables

Add these to `.env.local` (and to Netlify → Site settings → Environment variables for production):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...        # anon (public) key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...            # SECRET — server-only
```

> The service-role key bypasses RLS. It must **never** be exposed to the browser. It is only used inside `app/api/**` and the admin layout (server-only code).

## 2. Run the SQL migration

In Supabase Studio → SQL editor, run:

```
supabase/migrations/0001_admin_core.sql
```

It is idempotent (safe to re-run). It creates:

- `profiles.is_admin` column
- `contact_messages`, `newsletter_subscribers`, `admin_audit_log` tables
- `is_admin()` helper (security definer)
- Row Level Security policies — anon can `INSERT` into the public-facing tables; only admins can read/update/delete them
- `admin_daily_signups` view used by Overview
- Indexes on hot columns (`is_admin`, `total_xp`, `created_at`, etc.)

## 3. Promote your first admin

Sign up normally on the site, then in Supabase SQL editor:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

Now visit `/admin` — you'll be sent to `/admin/login`, sign in, and land on the overview.

## 4. Netlify deployment

- The Next.js app deploys with `@netlify/plugin-nextjs` (auto-detected).
- Add the three env vars above to Netlify.
- The middleware at `middleware.ts` runs on every `/admin/*` request and redirects unauthorized users to `/admin/login`.
- The admin layout adds `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, and `X-Robots-Tag: noindex, nofollow`.

## 5. What the admin can do

| Section       | Path                  | What it shows |
| ------------- | --------------------- | ------------- |
| Overview      | `/admin`              | Total/active users, unread messages, newsletter, top-XP, signup sparkline, recent registrations |
| Users         | `/admin/users`        | Searchable, paginated user list with CSV export |
| Messages      | `/admin/messages`     | Contact-form inbox; tabs (new/read/archived/spam/all); reply, archive, delete; CSV export |
| Newsletter    | `/admin/newsletter`   | Active + unsubscribed list; bulk BCC compose; CSV export |
| Top XP        | `/admin/leaderboard`  | Podium for top 3 + ranks 4–10 |

Every admin write (message status change, export) is logged to `admin_audit_log`.

## 6. Security checklist

- ✅ RLS on every admin table; reads gated by `is_admin()`
- ✅ Service-role key is server-only (`app/api`, `app/admin/(dashboard)/layout.tsx`)
- ✅ Middleware redirects unauthenticated visitors before any data is fetched
- ✅ Public endpoints rate-limit per IP and use honeypot fields
- ✅ Email/length validation on inserts; raw IPs are hashed (`SHA-256`, truncated)
- ✅ Admin pages send `noindex`, `DENY` framing, `no-referrer`
- ✅ Admin actions are audit-logged (id, email, action, target, time)
