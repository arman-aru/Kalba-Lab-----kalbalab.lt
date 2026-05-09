import { Download, Mail } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function NewsletterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const sb = getSupabaseAdmin();
  const { data: subs, count } = await sb
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { count: activeCount } = await sb
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .is("unsubscribed_at", null);

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allEmails = (subs ?? []).filter((s) => !s.unsubscribed_at).map((s) => s.email).join(",");

  return (
    <>
      <PageHeader
        title="Newsletter"
        description={`${(activeCount ?? 0).toLocaleString()} active subscribers · ${total.toLocaleString()} total entries.`}
        actions={
          <div className="flex gap-2">
            <a
              href={`mailto:?bcc=${encodeURIComponent(allEmails)}`}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200"
            >
              <Mail size={14} /> Compose to page
            </a>
            <a
              href="/api/admin/export?type=newsletter"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200"
            >
              <Download size={14} /> Export CSV
            </a>
          </div>
        }
      />

      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 bg-black/30">
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Source</th>
                <th className="py-3 px-4 font-semibold">Lang</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {(subs ?? []).map((s) => (
                <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2.5 px-4 text-gray-200">{s.email}</td>
                  <td className="py-2.5 px-4 text-gray-400 text-xs">{s.source ?? "—"}</td>
                  <td className="py-2.5 px-4 text-gray-400 uppercase text-xs">{s.ui_language ?? "—"}</td>
                  <td className="py-2.5 px-4">
                    {s.unsubscribed_at ? (
                      <span className="text-xs text-gray-500">Unsubscribed</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">Active</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-gray-500 tabular-nums">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!subs?.length && (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500 text-sm">No subscribers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <a className="px-3 h-9 inline-flex items-center rounded-lg border border-white/10 hover:bg-white/5" href={`?page=${page - 1}`}>← Prev</a>}
            {page < pages && <a className="px-3 h-9 inline-flex items-center rounded-lg border border-white/10 hover:bg-white/5" href={`?page=${page + 1}`}>Next →</a>}
          </div>
        </div>
      )}
    </>
  );
}
