/**
 * Server-only helper that emits a single <script type="application/ld+json">.
 * Pass a plain JSON-LD object built from lib/seo/jsonld.ts.
 */
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // The string is generated server-side from a typed builder, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
