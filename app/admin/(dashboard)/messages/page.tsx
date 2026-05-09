import { Download } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { PageHeader } from "@/components/admin/PageHeader";
import { MessageRow } from "@/components/admin/MessageRow";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type Props = { searchParams: Promise<{ status?: string; page?: string }> };

const STATUS_TABS = [
  { key: "new",      label: "Inbox" },
  { key: "read",     label: "Read" },
  { key: "archived", label: "Archived" },
  { key: "spam",     label: "Spam" },
  { key: "all",      label: "All" },
] as const;

export default async function MessagesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = STATUS_TABS.some((t) => t.key === sp.status) ? sp.status! : "new";
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const sb = getSupabaseAdmin();
  let query = sb
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status !== "all") query = query.eq("status", status);

  const { data: messages, count } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Messages"
        description="Contact form submissions."
        actions={
          <a
            href="/api/admin/export?type=messages"
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200"
          >
            <Download size={14} /> Export CSV
          </a>
        }
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
        {(messages ?? []).map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}
        {!messages?.length && (
          <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 p-10 text-center text-gray-500 text-sm">
            No messages here.
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
