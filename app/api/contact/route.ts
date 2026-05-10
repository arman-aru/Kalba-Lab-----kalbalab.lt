import { getSupabaseAdmin, supabaseConfigured } from "@/lib/supabase-server";
import { getClientIp, hashIp, rateLimit, sameOriginOk } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!sameOriginOk(req)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "Service not configured" }, { status: 503 });
  }

  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000); // 5/hour
  if (!rl.ok) {
    return Response.json({ error: "Too many requests, try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, subject, message, hp } = (body ?? {}) as Record<string, unknown>;

  // Honeypot — bots fill it; real users never see it.
  if (typeof hp === "string" && hp.length > 0) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const errors: string[] = [];
  const nameStr = String(name ?? "").trim();
  const emailStr = String(email ?? "").trim().toLowerCase();
  const subjectStr = subject ? String(subject).trim().slice(0, 300) : null;
  const messageStr = String(message ?? "").trim();

  if (nameStr.length < 1 || nameStr.length > 200) errors.push("Invalid name");
  if (!EMAIL_RE.test(emailStr) || emailStr.length > 320) errors.push("Invalid email");
  if (messageStr.length < 1 || messageStr.length > 5000) errors.push("Invalid message");
  if (errors.length) return Response.json({ error: errors.join(", ") }, { status: 400 });

  const sb = getSupabaseAdmin();
  const ipHash = await hashIp(ip);
  const ua = req.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { error } = await sb.from("contact_messages").insert({
    name: nameStr,
    email: emailStr,
    subject: subjectStr,
    message: messageStr,
    ip_hash: ipHash,
    user_agent: ua,
  });

  if (error) {
    return Response.json({ error: "Could not save message" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
