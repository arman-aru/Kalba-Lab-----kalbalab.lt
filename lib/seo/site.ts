/**
 * Single source of truth for site-level identity used by SEO meta + JSON-LD.
 * Update once; metadata generators and structured data flow from here.
 */

export const SITE = {
  name: "KalbaLab",
  legalName: "KalbaLab",
  url: "https://kalbalab.lt",
  defaultLocale: "en" as const,
  // Locales the site renders content in. Used for hreflang + Article inLanguage.
  locales: ["en", "lt"] as const,
  description:
    "Learn Lithuanian with native audio, multilingual explanations, and complete A1 exam preparation — built for the international community in Lithuania.",
  logo: "/favicon_io/android-chrome-512x512.png",
  socials: [
    // Add real handles here. Used by Organization.sameAs.
    // "https://www.facebook.com/kalbalab",
    // "https://www.instagram.com/kalbalab",
    // "https://www.youtube.com/@kalbalab",
  ],
  contact: {
    email: "info@kalbalab.lt",
    // Optional. If present, populates Organization.contactPoint.
    telephone: undefined as string | undefined,
    areaServed: "LT",
    availableLanguage: ["Lithuanian", "English", "Bengali", "Hindi", "Urdu", "Arabic"],
  },
  address: {
    addressCountry: "LT",
    addressLocality: "Vilnius",
  },
} as const;

export type SiteLocale = (typeof SITE.locales)[number];

/** Absolute URL for a given path. */
export function abs(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build hreflang `alternates.languages` map for a given path (no locale prefix). */
export function hreflangFor(path: string): Record<string, string> {
  const map: Record<string, string> = { "x-default": abs(path) };
  for (const l of SITE.locales) map[l] = abs(path);
  return map;
}
