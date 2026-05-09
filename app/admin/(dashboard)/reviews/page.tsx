import { Star } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { PageHeader } from "@/components/admin/PageHeader";
import { ReviewRow } from "@/components/admin/ReviewRow";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all",      label: "All"      },
] as const;

const PAGE_SIZE = 25;

type Props = { searchParams: Promise<{ status?: string; page?: string }> };

export default async function AdminReviewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = STATUS_TABS.some((t) => t.key === sp.status) ? sp.status! : "pending";
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const sb = getSupabaseAdmin();
  let q = sb
    .from("reviews")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status !== "all") q = q.eq("status", status);

  const { data: reviews, count } = await q;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Approve, reject, or remove user reviews. Approved reviews appear on the homepage."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <a
            key={t.key}
            href={`?status=${t.key}`}
            className={`px-3 h-9 inline-flex items-center rounded-lg text-sm transition-colors ${
              status === t.key ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30" : "border border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {(reviews ?? []).map((r) => (
          <ReviewRow key={r.id} review={r} />
        ))}
        {!reviews?.length && (
          <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 p-10 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
            <Star size={24} className="text-gray-700" />
            No reviews here.
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {pages} · {total.toLocaleString()} total</span>
          <div className="flex gap-2">
            {page > 1 && <a className="px-3 h-9 inline-flex items-center rounded-lg border border-white/10 hover:bg-white/5" href={`?status=${status}&page=${page - 1}`}>← Prev</a>}
            {page < pages && <a className="px-3 h-9 inline-flex items-center rounded-lg border border-white/10 hover:bg-white/5" href={`?status=${status}&page=${page + 1}`}>Next →</a>}
          </div>
        </div>
      )}
    </>
  );
}
