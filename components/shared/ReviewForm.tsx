"use client";

import { useEffect, useState } from "react";
import { Loader2, Send, Star, Check, AlertTriangle, Clock, Edit3 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useAppStore } from "@/stores/useAppStore";
import { awardXP } from "@/lib/award-xp";

type Status = "pending" | "approved" | "rejected" | null;

type Existing = {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  rating: number;
  feedback: string;
  status: Status;
} | null;

export function ReviewForm() {
  const user = useAppStore((s) => s.user);
  const [existing, setExisting] = useState<Existing>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [hover, setHover] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Load any existing review for this user.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const sb = getSupabaseBrowser();
      const { data } = await sb
        .from("reviews")
        .select("id, name, location, country, rating, feedback, status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setExisting(data as Existing);
        setName(data.name ?? "");
        setLocation(data.location ?? "");
        setCountry(data.country ?? "");
        setRating(data.rating ?? 5);
        setFeedback(data.feedback ?? "");
      } else {
        setName(user.full_name ?? "");
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (feedback.trim().length < 5) { setError("Please write at least a few words"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, country, rating, feedback }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit");
      // Award XP only on the first-time submission (not edits).
      if (!existing) awardXP("review_submit");
      setExisting({
        id: existing?.id ?? "tmp",
        name, location: location || null, country: country || null,
        rating, feedback, status: "pending",
      });
      setEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-6 anim-fade-up">
        <div className="h-5 w-32 rounded bg-white/10 animate-pulse mb-3" />
        <div className="h-12 rounded bg-white/5 animate-pulse" />
      </div>
    );
  }

  // Shows the existing review summary + edit button.
  if (existing && !editing) {
    const statusBadge = {
      pending:  { tint: "bg-amber-500/15 text-amber-300 ring-amber-500/30",   icon: <Clock size={11} />,         label: "Pending review" },
      approved: { tint: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30", icon: <Check size={11} />,     label: "Published" },
      rejected: { tint: "bg-red-500/15 text-red-300 ring-red-500/30",         icon: <AlertTriangle size={11} />, label: "Not approved — please edit" },
    }[(existing.status ?? "pending") as Exclude<Status, null>];

    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-6 anim-fade-up">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-gray-100 flex items-center gap-2">
              <Star size={15} className="text-amber-300 fill-amber-300" />
              Your review
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Help other learners find KalbaLab.</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${statusBadge.tint}`}>
            {statusBadge.icon} {statusBadge.label}
          </span>
        </div>

        <div className="relative flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < existing.rating ? "fill-amber-300 text-amber-300" : "text-gray-700"}
            />
          ))}
        </div>
        <p className="relative text-sm text-gray-200 leading-relaxed mb-3">&ldquo;{existing.feedback}&rdquo;</p>
        <p className="relative text-xs text-gray-500">
          {existing.name}
          {existing.location || existing.country
            ? ` · ${[existing.location, existing.country].filter(Boolean).join(", ")}`
            : ""}
        </p>

        <button
          onClick={() => setEditing(true)}
          className="relative mt-4 inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200 transition-colors"
        >
          <Edit3 size={13} /> Edit my review
        </button>
        {savedFlash && (
          <p className="relative mt-2 text-xs text-emerald-300 inline-flex items-center gap-1"><Check size={12} /> Saved — awaiting approval</p>
        )}
      </div>
    );
  }

  // Edit / new form
  return (
    <form onSubmit={onSubmit} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-6 anim-fade-up space-y-4">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative">
        <h3 className="font-bold text-gray-100 flex items-center gap-2">
          <Star size={15} className="text-amber-300 fill-amber-300" />
          Leave a review
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Reviews are moderated — yours appears on the homepage once an admin approves it. <span className="text-amber-300">Write in English.</span></p>
      </div>

      {/* Stars */}
      <div className="relative">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${n} stars`}
              >
                <Star size={22} className={filled ? "fill-amber-300 text-amber-300" : "text-gray-700"} />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-gray-400 tabular-nums">{rating}/5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-gray-100 text-sm focus:border-amber-500/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">City / Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={120}
            placeholder="Vilnius"
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-gray-100 text-sm focus:border-amber-500/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            maxLength={80}
            placeholder="Lithuania"
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-gray-100 text-sm focus:border-amber-500/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Your feedback (English)</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          maxLength={1500}
          rows={5}
          placeholder="Share what you liked, what helped you, what we could improve…"
          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-gray-100 text-sm focus:border-amber-500/50 focus:outline-none resize-y"
        />
        <p className="mt-1 text-[11px] text-gray-500 text-right">{feedback.length}/1500</p>
      </div>

      {error && (
        <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm transition-all disabled:opacity-60"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {existing ? "Update review" : "Submit review"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
