import type { Metadata } from "next";
import { SITE, abs, hreflangFor, type SiteLocale } from "./site";

export type BuildMetadataArgs = {
  title: string;                    // page-specific title (template applied by RootLayout.metadata.title.template)
  description: string;
  path: string;                     // canonical path, e.g. "/blog/my-post"
  locale?: SiteLocale;
  /** Per-locale variants. If omitted, the same `path` is used for all locales (simple sites). */
  alternates?: Partial<Record<SiteLocale, string>>;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article";
  publishedTime?: string;           // ISO
  modifiedTime?: string;            // ISO
  authors?: string[];
  tags?: string[];
  noindex?: boolean;
  /** Override default canonical (e.g., point to primary-language URL). */
  canonical?: string;
};

export function buildMetadata(args: BuildMetadataArgs): Metadata {
  const locale = args.locale ?? SITE.defaultLocale;
  const url = abs(args.path);
  const canonical = args.canonical ?? url;

  // Build hreflang alternates. Per-locale overrides win; otherwise same path.
  const languages: Record<string, string> =
    args.alternates && Object.keys(args.alternates).length
      ? Object.fromEntries(
          [...SITE.locales, "x-default" as const].map((l) => {
            const override = (args.alternates as Record<string, string | undefined>)[l];
            return [l, abs(override ?? args.path)];
          }),
        )
      : hreflangFor(args.path);

  const ogImage = args.image
    ? [{
        url: abs(args.image.url),
        width: args.image.width,
        height: args.image.height,
        alt: args.image.alt ?? args.title,
      }]
    : undefined;

  return {
    title: args.title,
    description: args.description,
    alternates: { canonical, languages },
    robots: args.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: args.type ?? "website",
      url,
      title: args.title,
      description: args.description,
      siteName: SITE.name,
      locale,
      images: ogImage,
      ...(args.type === "article" && {
        publishedTime: args.publishedTime,
        modifiedTime: args.modifiedTime,
        authors: args.authors,
        tags: args.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: ogImage?.map((i) => i.url),
    },
  };
}
