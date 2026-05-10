"use client";

import { useEffect, useState } from "react";
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
// Trigger Read more / Read less only when the review is long enough that the
// line clamp would actually hide content on a typical phone width.
const READ_MORE_THRESHOLD = 180;

export function TestimonialSlider({ fallback = [] as Review[] }: { fallback?: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(fallback);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch approved reviews on mount.
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

  // Autoplay — also paused while a review is expanded so the user can finish reading.
  useEffect(() => {
    if (paused || expandedId !== null || reviews.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reviews.length, expandedId]);

  // Collapse any expanded review when the slide changes so users see fresh content.
  useEffect(() => { setExpandedId(null); }, [index]);

  if (!reviews.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-[var(--surface)]/40 p-10 text-center">
        <p className="text-sm text-gray-400">No reviews yet — be the first to leave one from your profile!</p>
      </div>
    );
  }

  const current = reviews[index];
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-amber-500/8 via-[var(--surface)] to-[var(--surface)] p-6 md:p-10 backdrop-blur-sm">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <Quote size={32} className="text-amber-400/50 mb-4" />

        {/* Slides — only the active one is in normal flow so the wrapper height
            can grow when a long review is expanded on mobile. Inactive slides
            stay absolute so they don't take vertical space. */}
        <div className="relative min-h-[180px]">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className={`transition-opacity duration-500 ${
                i === index
                  ? "relative opacity-100"
                  : "absolute inset-0 opacity-0 pointer-events-none"
              }`}
              aria-hidden={i !== index}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} className={j < r.rating ? "fill-amber-300 text-amber-300" : "text-gray-700"} />
                ))}
              </div>
              {(() => {
                const isLong = r.feedback.length > READ_MORE_THRESHOLD;
                const isExpanded = expandedId === r.id;
                return (
                  <>
                    <p
                      className={`text-base md:text-lg text-gray-100 leading-relaxed mb-3 max-w-3xl ${
                        isLong && !isExpanded ? "line-clamp-5 md:line-clamp-none" : ""
                      }`}
                    >
                      &ldquo;{r.feedback}&rdquo;
                    </p>
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className="md:hidden mb-4 text-amber-300 hover:text-amber-200 text-sm font-semibold transition-colors"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                    {!isLong && <div className="mb-2" />}
                  </>
                );
              })()}
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-500/40 text-amber-300 font-bold">
                  {r.name?.[0]?.toUpperCase() ?? "?"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-100 truncate">{r.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {[r.location, r.country].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {reviews.length > 1 && (
          <div className="relative mt-6 flex items-center justify-between">
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Show review ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-amber-400" : "w-1.5 bg-white/15 hover:bg-white/30"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous review" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} aria-label="Next review" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
