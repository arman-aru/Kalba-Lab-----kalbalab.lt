import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";
  const error = searchParams.get("error_description") || searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  const store = await cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() { return store.getAll(); },
      setAll(items) {
        items.forEach(({ name, value, options }) => store.set(name, value, options));
      },
    },
  });

  const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exErr) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exErr.message)}`);
  }

  // Best-effort: ensure a profiles row exists for this user.
  // Safe to run repeatedly — uses upsert by id.
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const fullName =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null;
      const avatar = (user.user_metadata?.avatar_url as string | undefined) ?? null;
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          avatar_url: avatar,
        },
        { onConflict: "id" }
      );
    }
  } catch { /* non-fatal */ }

  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/dashboard"}`);
}
