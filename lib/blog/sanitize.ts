import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "h2", "h3", "h4",
  "strong", "em", "u", "s", "code", "pre",
  "blockquote", "ul", "ol", "li",
  "a", "img", "figure", "figcaption", "hr",
  "table", "thead", "tbody", "tr", "th", "td",
];

export function sanitizeBodyHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
    disallowedTagsMode: "discard",
  });
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/**
 * Walk the sanitized HTML, attach unique IDs to h2/h3/h4, and return
 * both the rewritten HTML and the extracted heading list.
 */
export function extractHeadings(
  html: string,
): { html: string; headings: { id: string; text: string; level: 2 | 3 | 4 }[] } {
  const headings: { id: string; text: string; level: 2 | 3 | 4 }[] = [];
  const used = new Set<string>();

  const out = html.replace(
    /<(h[234])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      const level = Number(tag[1]) as 2 | 3 | 4;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return _match;

      let id = slugifyHeading(text);
      if (!id) id = `section-${headings.length + 1}`;
      let unique = id;
      let n = 2;
      while (used.has(unique)) unique = `${id}-${n++}`;
      used.add(unique);

      headings.push({ id: unique, text, level });

      const cleanedAttrs = attrs.replace(/\sid="[^"]*"/i, "");
      return `<${tag}${cleanedAttrs} id="${unique}">${inner}</${tag}>`;
    },
  );

  return { html: out, headings };
}

export function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 220));
}
