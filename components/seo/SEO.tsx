/**
 * <SEO /> — server component that emits all JSON-LD blocks for a page.
 * Meta/OG/Twitter is handled by Next 16 Metadata API (see lib/seo/metadata.ts);
 * this component handles structured data only.
 *
 * Usage:
 *   import { SEO } from "@/components/seo/SEO";
 *   import { articleLd, breadcrumbLd, faqLd } from "@/lib/seo/jsonld";
 *
 *   export default async function Page() {
 *     return (
 *       <>
 *         <SEO blocks={[articleLd({...}), breadcrumbLd([...]), faqLd([...])]} />
 *         <article>…</article>
 *       </>
 *     );
 *   }
 */
import { JsonLd } from "./JsonLd";

export function SEO({ blocks }: { blocks: unknown[] }) {
  return (
    <>
      {blocks
        .filter((b) => b !== null && b !== undefined)
        .map((b, i) => (
          <JsonLd key={i} data={b} />
        ))}
    </>
  );
}
