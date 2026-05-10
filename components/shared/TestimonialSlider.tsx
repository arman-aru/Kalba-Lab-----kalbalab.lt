"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

type Review = {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  rating: number;
  feedback: string;
};

const AUTOPLAY_MS = 6000;
// Show this many lines before "Read more" appears. Same on every breakpoint
// so a long review never breaks the 3-column grid layout on desktop.
const CLAMP_LINES = 3;
// Approximate character cutoff that maps to ~3 lines in a typical card width.
const READ_MORE_THRESHOLD = 160;

function ReviewCard({
  review,
  expanded,
  onToggle,
}: {
  review: Review;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isLong = review.feedback.length > READ_MORE_THRESHOLD;
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-amber-500/8 via-[var(--surface)] to-[var(--surface)] p-6 backdrop-blur-sm flex flex-col">
      <Quote size={24} className="text-amber-400/50 mb-3" />
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} size={14} className={j < review.rating ? "fill-amber-300 text-amber-300" : "text-gray-700"} />
        ))}
      </div>
      <p
        className={`text-sm md:text-[15px] text-gray-100 leading-relaxed mb-3 ${
          isLong && !expanded ? `line-clamp-${CLAMP_LINES}` : ""
        }`}
        style={isLong && !expanded ? { display: "-webkit-box", WebkitLineClamp: CLAMP_LINES, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
      >
        &ldquo;{review.feedback}&rdquo;
      </p>
      {isLong && (
        <button
          type="button"
          onClick={onToggle}
          className="self-start mb-4 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <div className="mt-auto flex items-center gap-3 pt-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-500/40 text-amber-300 font-bold shrink-0">
          {review.name?.[0]?.toUpperCase() ?? "?"}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-100 truncate">{review.name}</p>
          <p className="text-xs text-gray-500 truncate">
            {[review.location, review.country].filter(Boolean).join(", ") || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialSlider({ fallback = [] as Review[] }: { fallback?: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(fallback);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  // Cards-per-page is responsive. We track it so paging math matches what the
  // user sees: 1 on mobile, 2 on tablet, 3 on desktop.
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/reviews");
        if (!r.ok) return;
        const data = (await r.json()) as { reviews: Review[] };
        if (!cancelled && Array.isArray(data.reviews) && data.reviews.length) {
          setReviews(data.reviews);
        }
      } catch { /* keep fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerPage(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pages = useMemo(() => {
    const out: Review[][] = [];
    for (let i = 0; i < reviews.length; i += perPage) {
      out.push(reviews.slice(i, i + perPage));
    }
    return out;
  }, [reviews, perPage]);

  // Clamp page when perPage changes so we don't end up off the end.
  useEffect(() => {
    if (page > pages.length - 1) setPage(Math.max(0, pages.length - 1));
  }, [pages.length, page]);

  // Autoplay — paused on hover, or while any card on the current page is expanded.
  useEffect(() => {
    if (paused || expandedIds.size > 0 || pages.length < 2) return;
    const id = setInterval(() => setPage((p) => (p + 1) % pages.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, pages.length, expandedIds]);

  // Collapse expanded cards when the page changes.
  useEffect(() => { setExpandedIds(new Set()); }, [page]);

  if (!reviews.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-[var(--surface)]/40 p-10 text-center">
        <p className="text-sm text-gray-400">No reviews yet — be the first to leave one from your profile!</p>
      </div>
    );
  }

  const prev = () => setPage((p) => (p - 1 + pages.length) % pages.length);
  const next = () => setPage((p) => (p + 1) % pages.length);

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });

  const gridCols = perPage === 3 ? "lg:grid-cols-3" : perPage === 2 ? "sm:grid-cols-2" : "";

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative">
          {pages.map((pageReviews, pi) => (
            <div
              key={pi}
              className={`transition-opacity duration-500 ${
                pi === page ? "relative opacity-100" : "absolute inset-0 opacity-0 pointer-events-none"
              }`}
              aria-hidden={pi !== page}
            >
              <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-5 items-stretch`}>
                {pageReviews.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    expanded={expandedIds.has(r.id)}
                    onToggle={() => toggleExpanded(r.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {pages.length > 1 && (
          <div className="relative mt-6 flex items-center justify-between">
            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Show page ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-amber-400" : "w-1.5 bg-white/15 hover:bg-white/30"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous reviews" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} aria-label="Next reviews" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
