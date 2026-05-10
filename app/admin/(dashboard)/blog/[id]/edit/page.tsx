import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";
import { PostForm, type PostFormInitial } from "@/components/admin/blog/PostForm";
import type { BlogCategorySlug, BlogLocale, FaqItem, ImageRef } from "@/lib/blog/schema";

export const metadata = { title: "Edit post · Blog" };
export const dynamic = "force-dynamic";

type Seo = { title?: string; description?: string; noindex?: boolean; canonical?: string };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const sb = getSupabaseAdmin();

  const { data: post } = await sb
    .from("blog_posts")
    .select("id, slug, status, category_slug, primary_locale, tags, featured_image, published_at")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const { data: trs } = await sb
    .from("blog_post_translations")
    .select("locale, title, excerpt, body_json, body_html, key_takeaways, faq, seo")
    .eq("post_id", id);

  const initial: PostFormInitial = {
    id: post.id,
    slug: post.slug,
    status: post.status as PostFormInitial["status"],
    category: post.category_slug as BlogCategorySlug,
    primaryLocale: post.primary_locale as BlogLocale,
    tags: (post.tags ?? []) as string[],
    featuredImage: post.featured_image as ImageRef,
    publishedAt: post.published_at,
    translations: (trs ?? []).map((t) => ({
      locale: t.locale as BlogLocale,
      title: t.title as string,
      excerpt: t.excerpt as string,
      bodyJson: t.body_json,
      bodyHtml: t.body_html as string,
      keyTakeaways: (t.key_takeaways ?? []) as string[],
      faq: (t.faq ?? []) as FaqItem[],
      seo: (t.seo ?? { noindex: false }) as Seo,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-300 mb-1">
            <ArrowLeft size={12} /> Back to posts
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-100 truncate">Edit: {initial.translations[0]?.title ?? initial.slug}</h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">/{initial.slug}</p>
        </div>
        {initial.status === "published" && (
          <Link
            href={`/blog/${initial.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-gray-300 hover:border-amber-500/30 hover:text-amber-300"
          >
            <ExternalLink size={12} /> View live
          </Link>
        )}
      </div>

      <PostForm initial={initial} />
    </div>
  );
}
