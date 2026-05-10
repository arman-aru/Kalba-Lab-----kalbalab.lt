"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, Plus, Trash2, X } from "lucide-react";
import { PostEditor } from "./PostEditor";
import { MediaUploader } from "./MediaUploader";
import {
  BLOG_CATEGORIES,
  BLOG_LOCALES,
  type BlogCategorySlug,
  type BlogLocale,
  type FaqItem,
  type ImageRef,
} from "@/lib/blog/schema";

export type PostFormInitial = {
  id: string;
  slug: string;
  status: "draft" | "scheduled" | "published" | "archived";
  category: BlogCategorySlug;
  tags: string[];
  featuredImage: ImageRef;
  primaryLocale: BlogLocale;
  publishedAt: string | null;
  translations: Array<{
    locale: BlogLocale;
    title: string;
    excerpt: string;
    bodyJson: unknown;
    bodyHtml: string;
    keyTakeaways: string[];
    faq: FaqItem[];
    seo: { title?: string; description?: string; noindex?: boolean; canonical?: string };
  }>;
};

type LocaleState = {
  title: string;
  excerpt: string;
  body: { json: unknown; html: string };
  keyTakeawaysText: string;
  faq: FaqItem[];
  seoTitle: string;
  seoDescription: string;
};

function emptyLocale(): LocaleState {
  return {
    title: "",
    excerpt: "",
    body: { json: { type: "doc", content: [{ type: "paragraph" }] }, html: "" },
    keyTakeawaysText: "",
    faq: [],
    seoTitle: "",
    seoDescription: "",
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function PostForm({ initial }: { initial?: PostFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const initialByLocale: Partial<Record<BlogLocale, LocaleState>> = {};
  if (initial) {
    initial.translations.forEach((t) => {
      initialByLocale[t.locale] = {
        title: t.title,
        excerpt: t.excerpt,
        body: { json: t.bodyJson ?? { type: "doc", content: [{ type: "paragraph" }] }, html: t.bodyHtml },
        keyTakeawaysText: (t.keyTakeaways ?? []).join("\n"),
        faq: t.faq ?? [],
        seoTitle: t.seo?.title ?? "",
        seoDescription: t.seo?.description ?? "",
      };
    });
  }

  const initialLocales = (Object.keys(initialByLocale) as BlogLocale[]);
  const startLocale: BlogLocale = initial?.primaryLocale ?? "en";

  const [primaryLocale, setPrimaryLocale] = useState<BlogLocale>(startLocale);
  const [activeLocales, setActiveLocales] = useState<BlogLocale[]>(
    initialLocales.length ? initialLocales : [startLocale],
  );
  const [activeTab, setActiveTab] = useState<BlogLocale>(startLocale);
  const [byLocale, setByLocale] = useState<Record<BlogLocale, LocaleState>>(() => {
    const map: Partial<Record<BlogLocale, LocaleState>> = { ...initialByLocale };
    if (!map[startLocale]) map[startLocale] = emptyLocale();
    return map as Record<BlogLocale, LocaleState>;
  });

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [category, setCategory] = useState<BlogCategorySlug>(initial?.category ?? "grammar");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [featuredImage, setFeaturedImage] = useState<ImageRef | null>(initial?.featuredImage ?? null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const active = byLocale[activeTab] ?? emptyLocale();
  const effectiveSlug = slugTouched ? slug : slugify(byLocale[primaryLocale]?.title ?? "");

  const patchActive = (patch: Partial<LocaleState>) =>
    setByLocale((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], ...patch } }));

  const addLocale = (locale: BlogLocale) => {
    if (activeLocales.includes(locale)) return;
    setActiveLocales((prev) => [...prev, locale]);
    setByLocale((prev) => ({ ...prev, [locale]: emptyLocale() }));
    setActiveTab(locale);
  };

  const removeLocale = (locale: BlogLocale) => {
    if (locale === primaryLocale) return;
    setActiveLocales((prev) => prev.filter((l) => l !== locale));
    setByLocale((prev) => {
      const { [locale]: _gone, ...rest } = prev;
      return rest as Record<BlogLocale, LocaleState>;
    });
    if (activeTab === locale) setActiveTab(primaryLocale);
  };

  const submit = async (status: "draft" | "published") => {
    setSubmitting(true);
    setErrors([]);
    try {
      const translations = activeLocales.map((locale) => {
        const s = byLocale[locale];
        return {
          locale,
          title: s.title,
          excerpt: s.excerpt,
          bodyJson: s.body.json,
          bodyHtml: s.body.html,
          keyTakeaways: s.keyTakeawaysText.split("\n").map((x) => x.trim()).filter(Boolean),
          faq: s.faq.filter((q) => q.question.trim() && q.answer.trim()),
          seo: {
            title: s.seoTitle || undefined,
            description: s.seoDescription || undefined,
            noindex: false,
          },
        };
      });

      const payload = {
        slug: effectiveSlug,
        status,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        featuredImage,
        primaryLocale,
        translations,
        publishedAt:
          status === "published"
            ? initial?.publishedAt ?? new Date().toISOString()
            : initial?.publishedAt ?? null,
      };

      const url = isEdit ? `/api/admin/blog/posts/${initial!.id}` : "/api/admin/blog/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        const issues: string[] = json.issues
          ? json.issues.map((i: { path: (string | number)[]; message: string }) => `${i.path.join(".")}: ${i.message}`)
          : [json.error ?? "Failed to save"];
        setErrors(issues);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const seoTitleLen = (active.seoTitle || active.title).length;
  const seoDescLen = (active.seoDescription || active.excerpt).length;
  const missingLocales = BLOG_LOCALES.filter((l) => !activeLocales.includes(l));

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-5">
        {/* locale tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
          {activeLocales.map((l) => {
            const isActive = l === activeTab;
            const isPrimary = l === primaryLocale;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setActiveTab(l)}
                className={[
                  "group inline-flex items-center gap-1.5 px-3 h-9 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-white/[0.05] text-amber-300 border-b-2 border-amber-400 -mb-[2px]"
                    : "text-gray-400 hover:text-gray-200",
                ].join(" ")}
              >
                {l}
                {isPrimary && <span className="text-[9px] text-amber-400 font-normal normal-case">primary</span>}
                {!isPrimary && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${l} translation`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocale(l);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        removeLocale(l);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center text-gray-500 hover:text-red-300 cursor-pointer"
                  >
                    <X size={12} />
                  </span>
                )}
              </button>
            );
          })}
          {missingLocales.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) addLocale(e.target.value as BlogLocale);
                e.target.value = "";
              }}
              className="ml-2 h-9 px-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-gray-300"
            >
              <option value="">+ Add translation</option>
              {missingLocales.map((l) => (
                <option key={l} value={l} className="bg-[#0a0a0a]">{l.toUpperCase()}</option>
              ))}
            </select>
          )}
        </div>

        <Field label="Title">
          <input
            value={active.title}
            onChange={(e) => patchActive({ title: e.target.value })}
            placeholder="A clear, specific title"
            className="w-full px-4 h-12 rounded-xl border border-white/10 bg-white/[0.03] text-lg font-bold text-gray-100 placeholder:text-gray-600 focus:border-amber-500/40 focus:outline-none"
          />
        </Field>

        {activeTab === primaryLocale && (
          <Field label="Slug" hint={`/blog/${effectiveSlug || "your-slug"}`}>
            <input
              value={effectiveSlug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              className="w-full px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] font-mono text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
            />
          </Field>
        )}

        <Field label="Excerpt" hint={`${active.excerpt.length} / 50–220 chars`}>
          <textarea
            value={active.excerpt}
            onChange={(e) => patchActive({ excerpt: e.target.value })}
            rows={3}
            placeholder="One paragraph that previews the post."
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
          />
        </Field>

        <Field label="Body">
          <PostEditor
            key={`${activeTab}-${initial?.id ?? "new"}`}
            initialJson={active.body.json}
            onChange={(v) => patchActive({ body: v })}
          />
        </Field>

        <Field label="Key takeaways" hint="One per line, 3–7 entries">
          <textarea
            value={active.keyTakeawaysText}
            onChange={(e) => patchActive({ keyTakeawaysText: e.target.value })}
            rows={4}
            placeholder={"Lithuanian has 7 noun cases.\nMost -as nouns are masculine.\n…"}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
          />
        </Field>

        <FaqRepeater
          items={active.faq}
          onChange={(faq) => patchActive({ faq })}
        />
      </div>

      <aside className="space-y-5 lg:sticky lg:top-20 self-start">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
          <Field label={isEdit ? "Save changes" : "Status"}>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => submit("draft")}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 hover:bg-white/[0.06] disabled:opacity-50"
              >
                <Save size={14} /> {isEdit ? "Save" : "Save draft"}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => submit("published")}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-lg bg-gradient-to-b from-amber-400 to-amber-500 text-black text-sm font-bold hover:from-amber-300 disabled:opacity-50"
              >
                <Send size={14} /> Publish
              </button>
            </div>
          </Field>

          <Field label="Primary language">
            <select
              value={primaryLocale}
              onChange={(e) => {
                const next = e.target.value as BlogLocale;
                setPrimaryLocale(next);
                if (!activeLocales.includes(next)) addLocale(next);
              }}
              className="w-full px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
            >
              {BLOG_LOCALES.map((l) => (
                <option key={l} value={l} className="bg-[#0a0a0a]">{l.toUpperCase()}</option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategorySlug)}
              className="w-full px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Tags" hint="Comma-separated, max 8">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="grammar, beginners, a1"
              className="w-full px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
            />
          </Field>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <MediaUploader value={featuredImage} onChange={setFeaturedImage} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
          <p className="text-xs uppercase tracking-wider font-bold text-amber-300">SEO ({activeTab.toUpperCase()})</p>
          <Field label="Meta title" hint={`${seoTitleLen} / 20–60 chars`}>
            <input
              value={active.seoTitle}
              onChange={(e) => patchActive({ seoTitle: e.target.value })}
              placeholder={active.title || "Defaults to title"}
              className="w-full px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
            />
          </Field>
          <Field label="Meta description" hint={`${seoDescLen} / 70–160 chars`}>
            <textarea
              value={active.seoDescription}
              onChange={(e) => patchActive({ seoDescription: e.target.value })}
              rows={3}
              placeholder={active.excerpt || "Defaults to excerpt"}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-200 focus:border-amber-500/40 focus:outline-none"
            />
          </Field>
          <SeoPreview
            title={active.seoTitle || active.title}
            description={active.seoDescription || active.excerpt}
            slug={effectiveSlug}
          />
        </div>

        {errors.length > 0 && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 space-y-1">
            {errors.map((e, i) => (
              <p key={i}>• {e}</p>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

function FaqRepeater({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (next: FaqItem[]) => void;
}) {
  const set = (idx: number, patch: Partial<FaqItem>) =>
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const add = () => onChange([...items, { question: "", answer: "" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">FAQ</span>
        <button
          type="button"
          onClick={add}
          disabled={items.length >= 10}
          className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 disabled:opacity-50"
        >
          <Plus size={12} /> Add question
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No FAQ entries. They generate FAQPage schema for richer SERPs.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Q{i + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove FAQ"
                  className="text-gray-500 hover:text-red-300"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <input
                value={it.question}
                onChange={(e) => set(i, { question: e.target.value })}
                placeholder="Question"
                className="w-full px-3 h-9 rounded-lg border border-white/10 bg-black/30 text-sm text-gray-100 placeholder:text-gray-600 focus:border-amber-500/40 focus:outline-none"
              />
              <textarea
                value={it.answer}
                onChange={(e) => set(i, { answer: e.target.value })}
                placeholder="Answer (≥20 chars)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-sm text-gray-200 placeholder:text-gray-600 focus:border-amber-500/40 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        {hint && <span className="text-[10px] text-gray-500">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function SeoPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  const url = useMemo(() => `kalbalab.lt › blog › ${slug || "your-slug"}`, [slug]);
  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-xs">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold mb-2">Search preview</p>
      <p className="text-emerald-400 truncate">{url}</p>
      <p className="text-blue-300 font-semibold leading-snug line-clamp-2 mt-0.5">{title || "Your title appears here"}</p>
      <p className="text-gray-400 leading-snug mt-1 line-clamp-2">{description || "Your meta description appears here"}</p>
    </div>
  );
}
