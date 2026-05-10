import ContactClient from "./ContactClient";
import { SEO } from "@/components/seo/SEO";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { SITE, abs } from "@/lib/seo/site";

export const metadata = buildMetadata({
  title: "Contact KalbaLab",
  description:
    "Get in touch with KalbaLab — questions about Lithuanian lessons, A1 exam preparation, content suggestions, or partnership inquiries.",
  path: "/contact",
});

const CONTACT_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": abs("/contact"),
  url: abs("/contact"),
  name: "Contact KalbaLab",
  inLanguage: "en",
  isPartOf: { "@id": `${SITE.url}#website` },
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "armansalekofficial@gmail.com",
      availableLanguage: ["English", "Lithuanian", "Bengali"],
      areaServed: "LT",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <SEO blocks={[
        CONTACT_LD,
        breadcrumbLd([
          { name: "Home", url: SITE.url },
          { name: "Contact", url: abs("/contact") },
        ]),
      ]} />
      <ContactClient />
    </>
  );
}
