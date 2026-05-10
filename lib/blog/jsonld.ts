import type { BlogPostFull, BlogPostListItem, FaqItem } from "./schema";

const SITE_URL = "https://kalbalab.lt";
const SITE_NAME = "KalbaLab";
const PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon_io/android-chrome-512x512.png` },
};

export function buildArticleJsonLd(post: BlogPostFull) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    image: [post.featuredImage.url],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: PUBLISHER,
    inLanguage: post.locale,
    keywords: post.tags.join(", "),
    articleSection: post.category.name,
  };
}

export function buildBreadcrumbJsonLd(post: BlogPostFull) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category.name,
        item: `${SITE_URL}/blog/category/${post.category.slug}`,
      },
      { "@type": "ListItem", position: 4, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };
}

export function buildFaqJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function buildBlogListJsonLd(posts: BlogPostListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      image: p.featuredImage.url,
    })),
  };
}
