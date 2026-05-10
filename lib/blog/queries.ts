import "server-only";
import { getSupabaseServer } from "@/lib/supabase-server";
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogCategorySlug,
  type BlogLocale,
  type BlogPostFull,
  type BlogPostListItem,
  type Heading,
  type FaqItem,
  type ImageRef,
  type Seo,
} from "./schema";

type PostRow = {
  id: string;
  slug: string;
  status: string;
  category_slug: BlogCategorySlug;
  primary_locale: BlogLocale;
  tags: string[];
  featured_image: ImageRef;
  author_id: string;
  reading_minutes: number;
  published_at: string;
  updated_at: string;
};

type TranslationRow = {
  post_id: string;
  locale: BlogLocale;
  title: string;
  excerpt: string;
  body_json: unknown;
  body_html: string;
  key_takeaways: string[];
  headings: Heading[];
  faq: FaqItem[];
  seo: Seo;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
};

const CATEGORY_LABELS: Record<BlogCategorySlug, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  "exam-prep": "Exam prep",
  pronunciation: "Pronunciation",
  culture: "Culture",
  "study-habits": "Study habits",
};

function toCategory(slug: BlogCategorySlug): BlogCategory {
  return { slug, name: CATEGORY_LABELS[slug] ?? slug };
}

function pickTranslation(
  rows: TranslationRow[],
  preferred: BlogLocale,
  fallback: BlogLocale,
): TranslationRow | null {
  return (
    rows.find((r) => r.locale === preferred) ??
    rows.find((r) => r.locale === fallback) ??
    rows[0] ??
    null
  );
}

export async function listPublishedSlugs(): Promise<string[]> {
  const sb = await getSupabaseServer();
  const { data, error } = await sb
    .from("blog_posts")
    .select("slug")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => r.slug as string);
}

export async function listPublishedPosts(opts: {
  locale?: BlogLocale;
  category?: BlogCategorySlug;
  limit?: number;
  offset?: number;
} = {}): Promise<BlogPostListItem[]> {
  const locale = opts.locale ?? "en";
  const fallback: BlogLocale = "en";
  const limit = Math.min(opts.limit ?? 24, 100);
  const offset = opts.offset ?? 0;

  const sb = await getSupabaseServer();
  let query = sb
    .from("blog_posts")
    .select("id, slug, status, category_slug, primary_locale, tags, featured_image, author_id, reading_minutes, published_at, updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (opts.category && BLOG_CATEGORIES.includes(opts.category)) {
    query = query.eq("category_slug", opts.category);
  }

  const { data: posts, error } = await query;
  if (error || !posts?.length) return [];

  const ids = posts.map((p) => p.id);
  const { data: translations } = await sb
    .from("blog_post_translations")
    .select("post_id, locale, title, excerpt, body_json, body_html, key_takeaways, headings, faq, seo")
    .in("post_id", ids)
    .in("locale", [locale, fallback]);

  const byPost = new Map<string, TranslationRow[]>();
  (translations ?? []).forEach((t) => {
    const list = byPost.get(t.post_id) ?? [];
    list.push(t as TranslationRow);
    byPost.set(t.post_id, list);
  });

  const out: BlogPostListItem[] = [];
  for (const p of posts as PostRow[]) {
    const t = pickTranslation(byPost.get(p.id) ?? [], locale, fallback);
    if (!t) continue;
    out.push({
      slug: p.slug,
      title: t.title,
      excerpt: t.excerpt,
      category: toCategory(p.category_slug),
      featuredImage: p.featured_image,
      readingMinutes: p.reading_minutes,
      publishedAt: p.published_at,
      tags: p.tags ?? [],
    });
  }
  return out;
}

export async function getPostBySlug(
  slug: string,
  locale: BlogLocale = "en",
): Promise<BlogPostFull | null> {
  const sb = await getSupabaseServer();
  const { data: post, error } = await sb
    .from("blog_posts")
    .select("id, slug, status, category_slug, primary_locale, tags, featured_image, author_id, reading_minutes, published_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !post) return null;

  const { data: translations } = await sb
    .from("blog_post_translations")
    .select("post_id, locale, title, excerpt, body_json, body_html, key_takeaways, headings, faq, seo")
    .eq("post_id", post.id);

  const rows = (translations ?? []) as TranslationRow[];
  const fallback: BlogLocale = (post as PostRow).primary_locale ?? "en";
  const t = pickTranslation(rows, locale, fallback);
  if (!t) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", (post as PostRow).author_id)
    .maybeSingle<ProfileRow>();

  const p = post as PostRow;
  return {
    id: p.id,
    slug: p.slug,
    status: p.status as BlogPostFull["status"],
    category: toCategory(p.category_slug),
    tags: p.tags ?? [],
    featuredImage: p.featured_image,
    author: {
      id: p.author_id,
      name: profile?.full_name ?? "KalbaLab",
      avatarUrl: profile?.avatar_url ?? null,
    },
    publishedAt: p.published_at,
    updatedAt: p.updated_at,
    readingMinutes: p.reading_minutes,
    primaryLocale: p.primary_locale,
    locale: t.locale,
    title: t.title,
    excerpt: t.excerpt,
    body: { json: t.body_json, html: t.body_html },
    keyTakeaways: t.key_takeaways ?? [],
    headings: t.headings ?? [],
    faq: t.faq ?? [],
    seo: t.seo ?? { noindex: false },
    translations: rows.map((r) => ({ locale: r.locale, slug: p.slug })),
  };
}

export async function listCategoriesWithCounts(): Promise<
  Array<{ slug: BlogCategorySlug; name: string; count: number }>
> {
  const sb = await getSupabaseServer();
  const { data } = await sb
    .from("blog_posts")
    .select("category_slug")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  const counts = new Map<BlogCategorySlug, number>();
  (data ?? []).forEach((row) => {
    const slug = row.category_slug as BlogCategorySlug;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  });

  return BLOG_CATEGORIES.map((slug) => ({
    slug,
    name: CATEGORY_LABELS[slug],
    count: counts.get(slug) ?? 0,
  }));
}
