import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function supabaseConfigured() {
  return Boolean(URL && ANON);
}

/**
 * Server client tied to the request's auth cookies.
 * RLS still applies — this is the right client for any user-context query.
 */
export async function getSupabaseServer() {
  const store = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component — cookies are read-only there. Safe to ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses RLS — use ONLY inside route handlers
 * after you've already authorized the caller as admin.
 */
export function getSupabaseAdmin() {
  if (!SERVICE) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createSupabaseClient(URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Centralized admin gate. Returns the authenticated user if and only if
 * they are flagged is_admin in `profiles`. Otherwise returns null.
 */
export async function requireAdmin() {
  if (!supabaseConfigured()) return null;
  const sb = await getSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await sb
    .from("profiles")
    .select("id, email, full_name, is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) return null;
  return { user, profile };
}
