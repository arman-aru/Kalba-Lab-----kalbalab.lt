import { getSupabaseAdmin, supabaseConfigured } from "@/lib/supabase-server";
import { getClientIp, hashIp, rateLimit, sameOriginOk } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set(["homepage", "footer", "contact", "dashboard", "other"]);

export async function POST(req: Request) {
  if (!sameOriginOk(req)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "Service not configured" }, { status: 503 });
  }

  const ip = getClientIp(req);
  const rl = rateLimit(`newsletter:${ip}`, 10, 60 * 60 * 1000); // 10/hour
  if (!rl.ok) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, source, ui_language, hp } = (body ?? {}) as Record<string, unknown>;
  if (typeof hp === "string" && hp.length > 0) {
    return Response.json({ ok: true }); // honeypot — pretend success
  }

  const emailStr = String(email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(emailStr) || emailStr.length > 320) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  const src = ALLOWED_SOURCES.has(String(source)) ? String(source) : "homepage";
  const ui = ui_language ? String(ui_language).slice(0, 8) : null;

  const sb = getSupabaseAdmin();
  const ipHash = await hashIp(ip);
  const ua = req.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { error } = await sb
    .from("newsletter_subscribers")
    .upsert(
      {
        email: emailStr,
        source: src,
        ui_language: ui,
        ip_hash: ipHash,
        user_agent: ua,
        unsubscribed_at: null,
      },
      { onConflict: "email" }
    );

  if (error) {
    return Response.json({ error: "Could not subscribe" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
