import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

const ALLOWED = new Set(["read", "archived", "spam", "delete"]);

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { id, action } = (body ?? {}) as { id?: string; action?: string };

  if (!id || !action || !ALLOWED.has(action)) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();

  if (action === "delete") {
    const { error } = await sb.from("contact_messages").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
  } else {
    const patch: Record<string, unknown> = { status: action };
    if (action === "read") patch.read_at = new Date().toISOString();
    const { error } = await sb.from("contact_messages").update(patch).eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  await sb.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.profile.email,
    action: `message:${action}`,
    target: id,
  });

  return Response.json({ ok: true });
}
