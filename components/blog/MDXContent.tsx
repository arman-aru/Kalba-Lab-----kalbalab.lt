/**
 * Renders pre-sanitized HTML produced by the editor pipeline (TipTap → HTML).
 * The editor is admin-only; HTML is sanitized server-side before persistence.
 */
export function MDXContent({ body }: { body: { html: string } }) {
  return <div className="blog-prose" dangerouslySetInnerHTML={{ __html: body.html }} />;
}
