import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : v instanceof Date ? v.toISOString() : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const head = columns.join(",");
  const body = rows.map((r) => columns.map((c) => csvCell(r[c])).join(",")).join("\n");
  return `${head}\n${body}`;
}

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return new Response("Forbidden", { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const sb = getSupabaseAdmin();

  let csv = "";
  let filename = "export.csv";

  if (type === "users") {
    const q = searchParams.get("q") ?? "";
    let qb = sb.from("profiles").select("email, full_name, preferred_language, total_xp, streak_count, created_at, last_seen, is_admin").order("created_at", { ascending: false }).limit(10000);
    if (q) qb = qb.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
    const { data } = await qb;
    csv = toCsv(data ?? [], ["email", "full_name", "preferred_language", "total_xp", "streak_count", "created_at", "last_seen", "is_admin"]);
    filename = `users-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (type === "messages") {
    const { data } = await sb.from("contact_messages").select("created_at, name, email, subject, message, status").order("created_at", { ascending: false }).limit(10000);
    csv = toCsv(data ?? [], ["created_at", "name", "email", "subject", "message", "status"]);
    filename = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
  } else if (type === "newsletter") {
    const { data } = await sb.from("newsletter_subscribers").select("email, source, ui_language, created_at, unsubscribed_at").order("created_at", { ascending: false }).limit(50000);
    csv = toCsv(data ?? [], ["email", "source", "ui_language", "created_at", "unsubscribed_at"]);
    filename = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
  } else {
    return new Response("Unknown export type", { status: 400 });
  }

  await sb.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.profile.email,
    action: `export:${type}`,
    target: filename,
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
