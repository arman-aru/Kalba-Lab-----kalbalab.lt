import { FaqClient } from "./FaqClient";
import { FAQS } from "./faqData";
import { SEO } from "@/components/seo/SEO";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, faqLd } from "@/lib/seo/jsonld";
import { SITE, abs } from "@/lib/seo/site";

export const metadata = buildMetadata({
  title: "FAQ — Lithuanian language learning & A1 exam",
  description:
    "Answers about KalbaLab, the Lithuanian A1 integration exam (€52, 50% pass mark), supported languages, native audio, and account features.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <SEO
        blocks={[
          faqLd(FAQS.map((f) => ({ question: f.q, answer: f.aText }))),
          breadcrumbLd([
            { name: "Home", url: SITE.url },
            { name: "FAQ", url: abs("/faq") },
          ]),
        ]}
      />
      <FaqClient />
    </>
  );
}
