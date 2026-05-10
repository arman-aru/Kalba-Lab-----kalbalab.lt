import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/blog/queries";

const SITE = "https://kalbalab.lt";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/",         priority: 1.0, changeFrequency: "weekly" },
  { path: "/blog",     priority: 0.9, changeFrequency: "daily"  },
  { path: "/about",    priority: 0.6, changeFrequency: "monthly"},
  { path: "/contact",  priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq",      priority: 0.6, changeFrequency: "monthly"},
  { path: "/privacy",  priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms",    priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies",  priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let posts: Awaited<ReturnType<typeof listPublishedPosts>> = [];
  try {
    posts = await listPublishedPosts({ limit: 100 });
  } catch {
    // sitemap should never break the build — fall back to static routes only
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
