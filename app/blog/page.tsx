import Link from "next/link";
import { ArrowRight, BookOpen, Bell } from "lucide-react";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { BlogCard } from "@/components/blog/BlogCard";
import { FeaturedHero } from "@/components/blog/FeaturedHero";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { listPublishedPosts, listCategoriesWithCounts } from "@/lib/blog/queries";
import { buildBlogListJsonLd } from "@/lib/blog/jsonld";
import { BLOG_CATEGORIES, type BlogCategorySlug } from "@/lib/blog/schema";
import { SEO } from "@/components/seo/SEO";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { SITE, abs } from "@/lib/seo/site";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "KalbaLab Blog — Lithuanian language guides & A1 exam tips",
  description:
    "Practical guides for learning Lithuanian and passing the A1 integration exam — written for the international community living in Lithuania.",
  path: "/blog",
});

function isCategorySlug(v: string | undefined): v is BlogCategorySlug {
  return !!v && (BLOG_CATEGORIES as readonly string[]).includes(v);
}

export default async function BlogPage(
  { searchParams }: { searchParams: Promise<{ category?: string }> },
) {
  const sp = await searchParams;
  const category = isCategorySlug(sp.category) ? sp.category : undefined;

  const [posts, categories] = await Promise.all([
    listPublishedPosts({ limit: 30, category }),
    listCategoriesWithCounts(),
  ]);

  const total = categories.reduce((n, c) => n + c.count, 0);
  const [featured, ...rest] = posts;
  const jsonLd = buildBlogListJsonLd(posts);

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />

      <SEO blocks={[
        jsonLd,
        breadcrumbLd([
          { name: "Home", url: SITE.url },
          { name: "Blog", url: abs("/blog") },
        ]),
      ]} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="mb-10 max-w-3xl anim-fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">
            Blog
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-100 leading-tight mb-4">
            Articles &amp; study guides
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Practical guides for learning Lithuanian and passing the A1 exam — written for the
            international community living in Lithuania.
          </p>
        </header>

        <div className="mb-10">
          <CategoryFilter categories={categories} total={total} />
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featured && (
              <section className="mb-12">
                <FeaturedHero post={featured} />
              </section>
            )}

            {rest.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold text-gray-100 mb-5 flex items-center gap-2">
                  <BookOpen size={18} className="text-amber-400" /> Latest articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((p, i) => (
                    <BlogCard key={p.slug} post={p} priority={i < 3} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-transparent p-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-3">
        <Bell size={20} />
      </div>
      <h3 className="font-bold text-gray-100 mb-1">First posts dropping soon</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md mx-auto">
        We&apos;re writing the first batch right now. Subscribe for the launch — or tell us what to
        cover first.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-amber-500/30 hover:bg-white/[0.06] text-amber-300 font-semibold text-sm transition-all"
      >
        Suggest a topic <ArrowRight size={14} />
      </Link>
    </div>
  );
}
