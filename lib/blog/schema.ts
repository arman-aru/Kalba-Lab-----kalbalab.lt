import { z } from "zod";

export const BLOG_LOCALES = ["en", "lt"] as const;
export type BlogLocale = (typeof BLOG_LOCALES)[number];

export const BLOG_CATEGORIES = [
  "grammar",
  "vocabulary",
  "exam-prep",
  "pronunciation",
  "culture",
  "study-habits",
] as const;
export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number];

export const BLOG_STATUSES = ["draft", "scheduled", "published", "archived"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

const Slug = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case");

export const ImageRefSchema = z.object({
  url: z.string().url(),
  alt: z
    .string()
    .min(4, "Alt text is required (≥4 chars) for accessibility & SEO")
    .max(160),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blurDataUrl: z.string().optional(),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

export const HeadingSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(200),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
});
export type Heading = z.infer<typeof HeadingSchema>;

export const FaqItemSchema = z.object({
  question: z.string().min(8).max(200),
  answer: z.string().min(20).max(1000),
});
export type FaqItem = z.infer<typeof FaqItemSchema>;

export const SeoSchema = z.object({
  title: z
    .string()
    .min(20, "SEO title should be ≥20 chars")
    .max(60, "SEO title should be ≤60 chars")
    .optional(),
  description: z
    .string()
    .min(70, "Meta description should be ≥70 chars")
    .max(160, "Meta description should be ≤160 chars")
    .optional(),
  noindex: z.boolean().default(false),
  canonical: z.string().url().optional(),
});
export type Seo = z.infer<typeof SeoSchema>;

export const BlogTranslationSchema = z.object({
  locale: z.enum(BLOG_LOCALES),
  title: z.string().min(10).max(120),
  excerpt: z
    .string()
    .min(50, "Excerpt drives previews — ≥50 chars")
    .max(220),
  bodyJson: z.unknown(),
  bodyHtml: z.string().min(400, "Body too short to rank well (≥400 chars)"),
  keyTakeaways: z
    .array(z.string().min(8).max(220))
    .min(3, "Add ≥3 key takeaways for AI/LLM indexing")
    .max(7),
  headings: z.array(HeadingSchema).min(2, "Add ≥2 H2/H3 sections for ToC + SEO"),
  faq: z.array(FaqItemSchema).max(10).default([]),
  seo: SeoSchema.default({ noindex: false }),
});
export type BlogTranslation = z.infer<typeof BlogTranslationSchema>;

export const BlogPostInputSchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: Slug,
    status: z.enum(BLOG_STATUSES).default("draft"),
    category: z.enum(BLOG_CATEGORIES),
    tags: z.array(z.string().min(2).max(30)).max(8).default([]),
    featuredImage: ImageRefSchema,
    authorId: z.string().uuid(),
    publishedAt: z.string().datetime().nullable().default(null),
    readingMinutes: z.number().int().min(1).max(120),
    primaryLocale: z.enum(BLOG_LOCALES).default("en"),
    translations: z
      .array(BlogTranslationSchema)
      .min(1)
      .superRefine((arr, ctx) => {
        const seen = new Set<string>();
        arr.forEach((t, i) => {
          if (seen.has(t.locale)) {
            ctx.addIssue({
              code: "custom",
              path: [i, "locale"],
              message: "Duplicate locale",
            });
          }
          seen.add(t.locale);
        });
      }),
  })
  .superRefine((post, ctx) => {
    if (post.status === "published" && !post.publishedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "publishedAt is required when status=published",
      });
    }
    const primary = post.translations.find((t) => t.locale === post.primaryLocale);
    if (!primary) {
      ctx.addIssue({
        code: "custom",
        path: ["translations"],
        message: `Missing translation for primary locale "${post.primaryLocale}"`,
      });
    }
  });
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

export const BlogCategorySchema = z.object({
  slug: z.enum(BLOG_CATEGORIES),
  name: z.string(),
});
export type BlogCategory = z.infer<typeof BlogCategorySchema>;

export const AuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type Author = z.infer<typeof AuthorSchema>;

export interface BlogPostListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  featuredImage: ImageRef;
  readingMinutes: number;
  publishedAt: string;
  tags: string[];
}

export interface BlogPostFull {
  id: string;
  slug: string;
  status: BlogStatus;
  category: BlogCategory;
  tags: string[];
  featuredImage: ImageRef;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  primaryLocale: BlogLocale;
  locale: BlogLocale;
  title: string;
  excerpt: string;
  body: { json: unknown; html: string };
  keyTakeaways: string[];
  headings: Heading[];
  faq: FaqItem[];
  seo: Seo;
  translations: { locale: BlogLocale; slug: string }[];
}
