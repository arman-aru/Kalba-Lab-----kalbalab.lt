"use client";

import { useState, useTransition } from "react";
import { Check, X, Trash2, Star } from "lucide-react";

type Review = {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  rating: number;
  feedback: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const ACTIONS = [
  { value: "approve" as const, label: "Approve", icon: Check, tone: "emerald" },
  { value: "reject"  as const, label: "Reject",  icon: X,     tone: "red"     },
  { value: "delete"  as const, label: "Delete",  icon: Trash2, tone: "red", danger: true },
];

export function ReviewRow({ review }: { review: Review }) {
  const [hidden, setHidden] = useState(false);
  const [status, setStatus] = useState(review.status);
  const [pending, startTransition] = useTransition();

  if (hidden) return null;

  const act = (action: (typeof ACTIONS)[number]["value"]) => {
    startTransition(async () => {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, action }),
      });
      if (!res.ok) return;
      if (action === "delete") setHidden(true);
      else setStatus(action === "approve" ? "approved" : "rejected");
    });
  };

  const statusBadge = {
    pending:  "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    rejected: "bg-red-500/15 text-red-300 ring-red-500/30",
  }[status];

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-gray-100 truncate">{review.name}</span>
            {(review.location || review.country) && (
              <span className="text-xs text-gray-500">· {[review.location, review.country].filter(Boolean).join(", ")}</span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ring-1 ${statusBadge}`}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? "fill-amber-300 text-amber-300" : "text-gray-700"} />
            ))}
            <span className="ml-1 text-xs text-gray-500 tabular-nums">{review.rating}/5</span>
          </div>
        </div>
        <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">{new Date(review.created_at).toLocaleDateString()}</span>
      </div>

      <p className="text-sm text-gray-200 leading-relaxed bg-black/30 rounded-lg p-3 border border-white/5 mb-3 whitespace-pre-wrap">{review.feedback}</p>

      <div className="flex flex-wrap items-center gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.value}
            onClick={() => act(a.value)}
            disabled={pending}
            className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm border ${
              a.tone === "emerald"
                ? "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                : a.danger
                ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                : "border-red-500/20 text-red-300 hover:bg-red-500/10"
            } disabled:opacity-50`}
          >
            <a.icon size={14} /> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
