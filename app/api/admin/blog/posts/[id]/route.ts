import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";
import { BlogPostInputSchema } from "@/lib/blog/schema";
import { sanitizeBodyHtml, extractHeadings, estimateReadingMinutes } from "@/lib/blog/sanitize";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const sb = getSupabaseAdmin();

  const { data: post, error } = await sb
    .from("blog_posts")
    .select("id, slug, status, category_slug, primary_locale, tags, featured_image, published_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });

  const { data: trs } = await sb
    .from("blog_post_translations")
    .select("locale, title, excerpt, body_json, body_html, key_takeaways, faq, seo")
    .eq("post_id", id);

  return Response.json({
    post: {
      id: post.id,
      slug: post.slug,
      status: post.status,
      category: post.category_slug,
      primaryLocale: post.primary_locale,
      tags: post.tags ?? [],
      featuredImage: post.featured_image,
      publishedAt: post.published_at,
      translations: (trs ?? []).map((t) => ({
        locale: t.locale,
        title: t.title,
        excerpt: t.excerpt,
        bodyJson: t.body_json,
        bodyHtml: t.body_html,
        keyTakeaways: t.key_takeaways ?? [],
        faq: t.faq ?? [],
        seo: t.seo ?? { noindex: false },
      })),
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  let raw: unknown;
  try { raw = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const withAuthor = { ...(raw as object), authorId: admin.user.id };

  const preflight = (() => {
    const v = withAuthor as { translations?: Array<{ bodyHtml?: string; headings?: unknown[] }>; readingMinutes?: number; primaryLocale?: string };
    if (Array.isArray(v.translations)) {
      v.translations = v.translations.map((t) => {
        const dirty = typeof t.bodyHtml === "string" ? t.bodyHtml : "";
        const cleaned = sanitizeBodyHtml(dirty);
        const { html, headings } = extractHeadings(cleaned);
        return { ...t, bodyHtml: html, headings };
      });
      const primary = v.translations.find((t) => (t as { locale?: string }).locale === v.primaryLocale)
        ?? v.translations[0];
      if (primary?.bodyHtml && !v.readingMinutes) {
        v.readingMinutes = estimateReadingMinutes(primary.bodyHtml);
      }
    }
    if (!v.readingMinutes) v.readingMinutes = 1;
    return v;
  })();

  const parsed = BlogPostInputSchema.safeParse(preflight);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const post = parsed.data;
  const sb = getSupabaseAdmin();

  const { error: updErr } = await sb
    .from("blog_posts")
    .update({
      slug: post.slug,
      status: post.status,
      category_slug: post.category,
      primary_locale: post.primaryLocale,
      tags: post.tags,
      featured_image: post.featuredImage,
      reading_minutes: post.readingMinutes,
      published_at: post.publishedAt,
    })
    .eq("id", id);
  if (updErr) return Response.json({ error: updErr.message }, { status: 500 });

  // Sync translations: delete locales no longer present, upsert the rest.
  const submittedLocales = post.translations.map((t) => t.locale);

  if (submittedLocales.length === 0) {
    return Response.json({ error: "At least one translation required" }, { status: 400 });
  }

  const { error: delErr } = await sb
    .from("blog_post_translations")
    .delete()
    .eq("post_id", id)
    .not("locale", "in", `(${submittedLocales.map((l) => `"${l}"`).join(",")})`);
  if (delErr) return Response.json({ error: delErr.message }, { status: 500 });

  const trRows = post.translations.map((t) => ({
    post_id: id,
    locale: t.locale,
    title: t.title,
    excerpt: t.excerpt,
    body_json: t.bodyJson ?? {},
    body_html: t.bodyHtml,
    key_takeaways: t.keyTakeaways,
    headings: t.headings,
    faq: t.faq,
    seo: t.seo,
  }));

  const { error: upsertErr } = await sb
    .from("blog_post_translations")
    .upsert(trRows, { onConflict: "post_id,locale" });
  if (upsertErr) return Response.json({ error: upsertErr.message }, { status: 500 });

  await sb.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.profile.email,
    action: `blog:update:${post.status}`,
    target: id,
  }).then(() => null, () => null);

  return Response.json({ ok: true, id, slug: post.slug });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { status } = (body ?? {}) as { status?: string };
  if (!status || !["draft", "scheduled", "published", "archived"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const patch: Record<string, unknown> = { status };
  if (status === "published") patch.published_at = new Date().toISOString();

  const { error } = await sb.from("blog_posts").update(patch).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  await sb.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.profile.email,
    action: `blog:status:${status}`,
    target: id,
  }).then(() => null, () => null);

  return Response.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  await sb.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.profile.email,
    action: "blog:delete",
    target: id,
  }).then(() => null, () => null);

  return Response.json({ ok: true });
}
