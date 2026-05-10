import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareDock } from "@/components/blog/ShareDock";
import { KeyTakeaways } from "@/components/blog/KeyTakeaways";
import { FocusModeToggle } from "@/components/blog/FocusModeToggle";
import { MDXContent } from "@/components/blog/MDXContent";
import { getPostBySlug, listPublishedSlugs } from "@/lib/blog/queries";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/lib/blog/jsonld";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `https://kalbalab.lt/blog/${post.slug}`;
  return {
    title: post.seo.title ?? post.title,
    description: post.seo.description ?? post.excerpt,
    alternates: { canonical: post.seo.canonical ?? url },
    robots: post.seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.featuredImage.url,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage.url],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const url = `https://kalbalab.lt/blog/${post.slug}`;
  const articleLd = buildArticleJsonLd(post);
  const breadcrumbLd = buildBreadcrumbJsonLd(post);
  const faqLd = post.faq.length ? buildFaqJsonLd(post.faq) : null;

  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:grid lg:grid-cols-[180px_minmax(0,720px)_240px] lg:gap-10">
        <aside data-blog-aside className="hidden lg:block sticky top-24 self-start">
          <ShareDock url={url} title={post.title} />
        </aside>

        <article className="min-w-0">
          <header className="mb-8">
            <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-4">
              <a href="/blog" className="hover:text-amber-300">Blog</a>
              <span className="mx-1.5">/</span>
              <a
                href={`/blog?category=${post.category.slug}`}
                className="hover:text-amber-300"
              >
                {post.category.name}
              </a>
            </nav>

            <span className="inline-flex text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold mb-3">
              {post.category.name}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-50 leading-tight tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>
                By <span className="text-gray-300">{post.author.name}</span>
              </span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
              <span className="ml-auto"><FocusModeToggle /></span>
            </div>
          </header>

          <figure className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              width={post.featuredImage.width}
              height={post.featuredImage.height}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </figure>

          {post.keyTakeaways.length > 0 && <KeyTakeaways items={post.keyTakeaways} />}

          <MDXContent body={post.body} />

          {post.faq.length > 0 && (
            <section className="mt-14 pt-10 border-t border-white/10">
              <h2 className="text-2xl font-extrabold text-gray-100 mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {post.faq.map((q, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 open:border-amber-500/30"
                  >
                    <summary className="cursor-pointer font-semibold text-gray-100 marker:text-amber-400">
                      {q.question}
                    </summary>
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">{q.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 lg:hidden">
            <ShareDock url={url} title={post.title} />
          </div>
        </article>

        <aside data-blog-aside className="hidden lg:block sticky top-24 self-start">
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </div>
  );
}
