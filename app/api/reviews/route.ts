// GET  /api/reviews            → public list of approved reviews (cached 60s)
// POST /api/reviews            → authenticated user submits/updates their review

import { getSupabaseAdmin, getSupabaseServer, supabaseConfigured } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ reviews: [] }, { headers: { "Cache-Control": "public, max-age=30" } });
  }
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("reviews")
    .select("id, name, location, country, rating, feedback, created_at")
    .eq("status", "approved")
    .order("approved_at", { ascending: false, nullsFirst: false })
    .limit(30);

  return Response.json(
    { reviews: data ?? [] },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    }
  );
}

export async function POST(req: Request) {
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "Service not configured" }, { status: 503 });
  }

  const sbUser = await getSupabaseServer();
  const { data: { user } } = await sbUser.auth.getUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, location, country, rating, feedback } = (body ?? {}) as Record<string, unknown>;
  const nameStr = String(name ?? "").trim().slice(0, 120);
  const locStr  = location ? String(location).trim().slice(0, 120) : null;
  const ctryStr = country  ? String(country).trim().slice(0, 80)  : null;
  const fbStr   = String(feedback ?? "").trim().slice(0, 1500);
  const rt      = Math.round(Number(rating ?? 0));

  if (!nameStr) return Response.json({ error: "Name required" }, { status: 400 });
  if (rt < 1 || rt > 5) return Response.json({ error: "Rating must be 1–5" }, { status: 400 });
  if (fbStr.length < 5) return Response.json({ error: "Feedback too short" }, { status: 400 });

  // Upsert by user — one review per user, edits reset to pending via trigger.
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("reviews").upsert(
    {
      user_id: user.id,
      name: nameStr,
      location: locStr,
      country: ctryStr,
      rating: rt,
      feedback: fbStr,
      // Don't pass status — DB default ('pending') handles new rows; trigger handles edits.
    },
    { onConflict: "user_id" }
  );
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
