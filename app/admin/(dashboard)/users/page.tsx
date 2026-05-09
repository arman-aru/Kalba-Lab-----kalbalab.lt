import { Download, Search } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function UsersPage({ searchParams }: Props) {
  const { q = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr) || 1);
  const sb = getSupabaseAdmin();

  let query = sb
    .from("profiles")
    .select("id, full_name, email, total_xp, streak_count, preferred_language, created_at, last_seen, is_admin", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: users, count } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Users"
        description={`${total.toLocaleString()} registered users.`}
        actions={
          <a
            href={`/api/admin/export?type=users${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200"
          >
            <Download size={14} /> Export CSV
          </a>
        }
      />

      <form className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-3 h-10 rounded-xl border border-white/10 bg-black/30 text-sm text-gray-100 placeholder-gray-500 focus:border-amber-500/40 focus:outline-none"
          />
        </div>
        <button type="submit" className="px-3 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold">Search</button>
      </form>

      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 bg-black/30">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Lang</th>
                <th className="py-3 px-4 font-semibold">XP</th>
                <th className="py-3 px-4 font-semibold">Streak</th>
                <th className="py-3 px-4 font-semibold">Joined</th>
                <th className="py-3 px-4 font-semibold">Last seen</th>
                <th className="py-3 px-4 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2.5 px-4 text-gray-200">{u.full_name ?? "—"}</td>
                  <td className="py-2.5 px-4 text-gray-400">{u.email}</td>
                  <td className="py-2.5 px-4 text-gray-400 uppercase text-xs">{u.preferred_language ?? "—"}</td>
                  <td className="py-2.5 px-4 text-amber-300 tabular-nums">{(u.total_xp ?? 0).toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-gray-300 tabular-nums">{u.streak_count ?? 0}</td>
                  <td className="py-2.5 px-4 text-gray-500 tabular-nums">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-2.5 px-4 text-gray-500 tabular-nums">{u.last_seen ? new Date(u.last_seen).toLocaleDateString() : "—"}</td>
                  <td className="py-2.5 px-4">
                    {u.is_admin ? (
                      <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">Admin</span>
                    ) : (
                      <span className="text-xs text-gray-600">User</span>
                    )}
                  </td>
                </tr>
              ))}
              {!users?.length && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-500 text-sm">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <a className="px-3 h-9 inline-flex items-center rounded-lg border border-white/10 hover:bg-white/5" href={`?q=${encodeURIComponent(q)}&page=${page - 1}`}>← Prev</a>
            )}
            {page < pages && (
              <a className="px-3 h-9 inline-flex items-center rounded-lg border border-white/10 hover:bg-white/5" href={`?q=${encodeURIComponent(q)}&page=${page + 1}`}>Next →</a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
