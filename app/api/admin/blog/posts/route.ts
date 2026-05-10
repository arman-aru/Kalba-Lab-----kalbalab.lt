import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";
import { BlogPostInputSchema } from "@/lib/blog/schema";
import { sanitizeBodyHtml, extractHeadings, estimateReadingMinutes } from "@/lib/blog/sanitize";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("blog_posts")
    .select("id, slug, status, category_slug, primary_locale, published_at, updated_at, featured_image")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const ids = (data ?? []).map((r) => r.id);
  const titles = new Map<string, string>();
  if (ids.length) {
    const { data: trs } = await sb
      .from("blog_post_translations")
      .select("post_id, locale, title")
      .in("post_id", ids);
    (trs ?? []).forEach((t) => {
      if (!titles.has(t.post_id)) titles.set(t.post_id, t.title);
    });
  }

  return Response.json({
    posts: (data ?? []).map((r) => ({
      id: r.id,
      slug: r.slug,
      status: r.status,
      category: r.category_slug,
      locale: r.primary_locale,
      title: titles.get(r.id) ?? r.slug,
      publishedAt: r.published_at,
      updatedAt: r.updated_at,
      featuredImage: r.featured_image,
    })),
  });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  let raw: unknown;
  try { raw = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const withAuthor = { ...(raw as object), authorId: admin.user.id };

  const preflight = (() => {
    const v = withAuthor as { translations?: Array<{ bodyHtml?: string; headings?: unknown[]; }>; readingMinutes?: number };
    if (Array.isArray(v.translations)) {
      v.translations = v.translations.map((t) => {
        const dirty = typeof t.bodyHtml === "string" ? t.bodyHtml : "";
        const cleaned = sanitizeBodyHtml(dirty);
        const { html, headings } = extractHeadings(cleaned);
        return { ...t, bodyHtml: html, headings };
      });
      const primary = v.translations[0];
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

  const { data: inserted, error: insertErr } = await sb
    .from("blog_posts")
    .insert({
      slug: post.slug,
      status: post.status,
      category_slug: post.category,
      primary_locale: post.primaryLocale,
      tags: post.tags,
      featured_image: post.featuredImage,
      author_id: post.authorId,
      reading_minutes: post.readingMinutes,
      published_at: post.publishedAt,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    return Response.json({ error: insertErr?.message ?? "Insert failed" }, { status: 500 });
  }

  const trRows = post.translations.map((t) => ({
    post_id: inserted.id,
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

  const { error: trErr } = await sb.from("blog_post_translations").insert(trRows);
  if (trErr) {
    await sb.from("blog_posts").delete().eq("id", inserted.id);
    return Response.json({ error: trErr.message }, { status: 500 });
  }

  await sb.from("admin_audit_log").insert({
    admin_id: admin.user.id,
    admin_email: admin.profile.email,
    action: `blog:create:${post.status}`,
    target: inserted.id,
  }).then(() => null, () => null);

  return Response.json({ ok: true, id: inserted.id, slug: post.slug });
}
