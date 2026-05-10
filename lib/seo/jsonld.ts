/**
 * JSON-LD builders. All return plain objects ready for
 * <script type="application/ld+json">. See components/seo/JsonLd.tsx.
 */
import { SITE, abs } from "./site";

const PUBLISHER = {
  "@type": "Organization",
  "@id": `${SITE.url}#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: abs(SITE.logo) },
};

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE.url}#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: abs(SITE.logo),
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE.address.addressCountry,
      addressLocality: SITE.address.addressLocality,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE.contact.email,
        ...(SITE.contact.telephone && { telephone: SITE.contact.telephone }),
        areaServed: SITE.contact.areaServed,
        availableLanguage: SITE.contact.availableLanguage,
      },
    ],
    sameAs: SITE.socials,
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: [...SITE.locales],
    publisher: { "@id": `${SITE.url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/vocabulary?search={query}` },
      "query-input": "required name=query",
    },
  };
}

export function personLd(args: {
  id?: string;
  name: string;
  url?: string;
  imageUrl?: string;
  jobTitle?: string;
  bio?: string;
  sameAs?: string[];
  knowsAbout?: string[];
  worksFor?: { name: string; url: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...(args.id && { "@id": args.id }),
    name: args.name,
    ...(args.url && { url: args.url }),
    ...(args.imageUrl && { image: args.imageUrl }),
    ...(args.jobTitle && { jobTitle: args.jobTitle }),
    ...(args.bio && { description: args.bio }),
    ...(args.knowsAbout && { knowsAbout: args.knowsAbout }),
    ...(args.sameAs && { sameAs: args.sameAs }),
    ...(args.worksFor && {
      worksFor: { "@type": "Organization", name: args.worksFor.name, url: args.worksFor.url },
    }),
  };
}

export function breadcrumbLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/* --------------------------- Article (blog post) -------------------------- */

export type ArticleArgs = {
  url: string;
  headline: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl?: string;
  inLanguage: string;
  keywords?: string[];
  section?: string;
  wordCount?: number;
  citations?: { name: string; url: string }[];
};

export function articleLd(a: ArticleArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
    headline: a.headline,
    description: a.description,
    image: [a.imageUrl],
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: {
      "@type": "Person",
      name: a.authorName,
      ...(a.authorUrl && { url: a.authorUrl }),
    },
    publisher: PUBLISHER,
    inLanguage: a.inLanguage,
    ...(a.keywords?.length && { keywords: a.keywords.join(", ") }),
    ...(a.section && { articleSection: a.section }),
    ...(a.wordCount && { wordCount: a.wordCount }),
    ...(a.citations?.length && {
      citation: a.citations.map((c) => ({
        "@type": "CreativeWork",
        name: c.name,
        url: c.url,
      })),
    }),
  };
}

export function faqLd(faq: { question: string; answer: string }[]) {
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

/* --------------------------- Course / Lesson ------------------------------ */

export function courseLd(args: {
  id?: string;
  url: string;
  name: string;
  description: string;
  inLanguage?: string;
  educationalLevel?: string;          // e.g. "A1"
  teaches?: string[];                 // e.g. ["Lithuanian grammar", "Lithuanian pronunciation"]
  hasCourseInstance?: {
    courseMode: "online" | "blended" | "onsite";
    courseWorkload?: string;          // ISO 8601 duration, e.g. "PT40H"
  };
  offers?: { price: number; priceCurrency: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    ...(args.id && { "@id": args.id }),
    name: args.name,
    description: args.description,
    url: args.url,
    provider: { "@id": `${SITE.url}#organization` },
    inLanguage: args.inLanguage ?? "lt",
    ...(args.educationalLevel && { educationalLevel: args.educationalLevel }),
    ...(args.teaches?.length && { teaches: args.teaches }),
    ...(args.hasCourseInstance && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: args.hasCourseInstance.courseMode,
        ...(args.hasCourseInstance.courseWorkload && {
          courseWorkload: args.hasCourseInstance.courseWorkload,
        }),
      },
    }),
    ...(args.offers && {
      offers: {
        "@type": "Offer",
        price: args.offers.price,
        priceCurrency: args.offers.priceCurrency,
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

export function howToLd(args: {
  name: string;
  description: string;
  totalTime?: string;             // ISO 8601, e.g. "PT15M"
  steps: { name: string; text: string; url?: string; imageUrl?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    ...(args.totalTime && { totalTime: args.totalTime }),
    step: args.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url && { url: s.url }),
      ...(s.imageUrl && { image: s.imageUrl }),
    })),
  };
}
