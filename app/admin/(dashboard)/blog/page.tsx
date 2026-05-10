import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { PostRowActions } from "@/components/admin/blog/PostRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog posts" };

type Row = {
  id: string;
  slug: string;
  status: string;
  category_slug: string;
  primary_locale: string;
  published_at: string | null;
  updated_at: string;
};

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("blog_posts")
    .select("id, slug, status, category_slug, primary_locale, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as Row[];
  const ids = rows.map((r) => r.id);
  const titles = new Map<string, string>();
  if (ids.length) {
    const { data: trs } = await sb
      .from("blog_post_translations")
      .select("post_id, locale, title")
      .in("post_id", ids);
    (trs ?? []).forEach((t) => {
      if (!titles.has(t.post_id)) titles.set(t.post_id, t.title);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-100">Blog posts</h1>
          <p className="text-sm text-gray-400">Drafts, scheduled, and published articles.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-black text-sm font-bold hover:from-amber-300"
        >
          <Plus size={14} /> New post
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <FileText size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="font-bold text-gray-200">No posts yet</p>
          <p className="text-sm text-gray-500 mt-1">Create your first article to get the blog moving.</p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-bold"
          >
            <Plus size={14} /> Write first post
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/30 border-b border-white/10">
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-100 truncate max-w-md">
                      {titles.get(r.id) ?? r.slug}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">/{r.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{r.category_slug.replace("-", " ")}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(r.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <PostRowActions id={r.id} slug={r.slug} status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-white/5 text-gray-300 border-white/10",
    scheduled: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    archived: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };
  return (
    <span className={`inline-flex text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${map[status] ?? map.draft}`}>
      {status}
    </span>
  );
}
