"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

export function PostRowActions({ id, slug, status }: { id: string; slug: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Delete failed" }));
        alert(error || "Delete failed");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {status === "published" && (
        <Link
          href={`/blog/${slug}`}
          target="_blank"
          aria-label="View live"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 hover:text-amber-300 hover:border-amber-500/30"
        >
          <ExternalLink size={12} />
        </Link>
      )}
      <Link
        href={`/admin/blog/${id}/edit`}
        aria-label="Edit"
        className="inline-flex items-center gap-1 px-2.5 h-8 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-gray-300 hover:border-amber-500/30 hover:text-amber-300"
      >
        <Pencil size={12} /> Edit
      </Link>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label="Delete"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 hover:text-red-300 hover:border-red-500/30 disabled:opacity-50"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
