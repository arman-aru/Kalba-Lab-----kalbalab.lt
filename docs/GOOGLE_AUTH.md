# Google sign-in / sign-up

The "Sign in/up with Google" buttons on `/login` and `/register` use Supabase OAuth. The redirect lands on `/auth/callback`, which exchanges the code for a session, upserts a `profiles` row, and forwards the user to `/dashboard`.

## 1. Create the Google OAuth client

1. Go to <https://console.cloud.google.com/apis/credentials>.
2. **Create credentials → OAuth client ID → Web application**.
3. **Authorized JavaScript origins** — add every origin you'll use:
   - `http://localhost:3000`
   - `https://YOUR-NETLIFY-DOMAIN.netlify.app`
   - `https://YOUR-CUSTOM-DOMAIN.com` (if any)
4. **Authorized redirect URIs** — add **only the Supabase callback** (Supabase forwards to your app):
   ```
   https://YOUR-PROJECT.supabase.co/auth/v1/callback
   ```
5. Copy the **Client ID** and **Client secret**.

## 2. Enable Google in Supabase

In Supabase Studio → **Authentication → Providers → Google**:
- Toggle **Enable**.
- Paste the Client ID and Client secret from step 1.
- Save.

In **Authentication → URL Configuration**:
- **Site URL**: your production URL (e.g. `https://YOUR-NETLIFY-DOMAIN.netlify.app`)
- **Additional Redirect URLs** — add every origin's callback you'll use:
  ```
  http://localhost:3000/auth/callback
  https://YOUR-NETLIFY-DOMAIN.netlify.app/auth/callback
  https://YOUR-CUSTOM-DOMAIN.com/auth/callback
  ```

## 3. That's it

- The site already has `/auth/callback` wired (`app/auth/callback/route.ts`).
- The login and register pages call `signInWithOAuth({ provider: "google" })` via the shared `<GoogleButton />` component.
- After Google returns, Supabase redirects to `/auth/callback?code=…&next=/dashboard`. The route exchanges the code, upserts the user's `profiles` row (id, email, full_name, avatar), and redirects them onward.

## Troubleshooting

- **"redirect_uri_mismatch"** → the URI you put in Google Console must match `https://<project>.supabase.co/auth/v1/callback` exactly. The app domain is *not* listed as an authorized redirect URI in Google — only Supabase is.
- **Lands back on /login with `error=...`** → check the Supabase **Authentication → Providers → Google** is enabled, and that the URL in **Authentication → URL Configuration → Additional Redirect URLs** includes your `/auth/callback` URL.
- **Profile row missing** → the callback upserts via the user's session; if you have row-level security on `profiles`, make sure the user can write their own row (the existing migration's policy `Self can update own profile` covers this; an INSERT policy may also be needed if you locked it further).
