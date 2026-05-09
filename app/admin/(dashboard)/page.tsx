import { Users, Inbox, Mail, Trophy, Flame, Star } from "lucide-react";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { StatCard } from "@/components/admin/StatCard";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

type DailySignup = { day: string; signups: number };

async function loadOverview() {
  const sb = getSupabaseAdmin();

  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalUsers,
    newUsers7,
    activeUsers7,
    unreadMessages,
    totalMessages,
    activeSubs,
    topXp,
    recentSignups,
    daily,
  ] = await Promise.all([
    sb.from("profiles").select("*", { count: "exact", head: true }),
    sb.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", since7),
    sb.from("profiles").select("*", { count: "exact", head: true }).gte("last_seen", since7),
    sb.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    sb.from("contact_messages").select("*", { count: "exact", head: true }),
    sb.from("newsletter_subscribers").select("*", { count: "exact", head: true }).is("unsubscribed_at", null),
    sb.from("profiles").select("id, full_name, email, total_xp, streak_count").order("total_xp", { ascending: false }).limit(5),
    sb.from("profiles").select("id, full_name, email, created_at, total_xp").order("created_at", { ascending: false }).limit(5),
    sb.from("admin_daily_signups").select("*").gte("day", since30.slice(0, 10)).order("day", { ascending: true }),
  ]);

  return {
    totalUsers: totalUsers.count ?? 0,
    newUsers7: newUsers7.count ?? 0,
    activeUsers7: activeUsers7.count ?? 0,
    unreadMessages: unreadMessages.count ?? 0,
    totalMessages: totalMessages.count ?? 0,
    activeSubs: activeSubs.count ?? 0,
    topXp: (topXp.data ?? []) as { id: string; full_name: string | null; email: string; total_xp: number; streak_count: number }[],
    recentSignups: (recentSignups.data ?? []) as { id: string; full_name: string | null; email: string; created_at: string; total_xp: number }[],
    daily: (daily.data ?? []) as DailySignup[],
  };
}

function MiniSparkline({ data }: { data: DailySignup[] }) {
  if (!data.length) return <p className="text-xs text-gray-500">No signups yet.</p>;
  const max = Math.max(1, ...data.map((d) => d.signups));
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm bg-linear-to-t from-amber-500/40 to-amber-300"
            style={{ height: `${(d.signups / max) * 100}%`, minHeight: 2 }}
            title={`${d.day}: ${d.signups}`}
          />
        </div>
      ))}
    </div>
  );
}

export default async function AdminOverviewPage() {
  const data = await loadOverview();

  return (
    <>
      <PageHeader
        title="Overview"
        description="Snapshot of registrations, engagement, and inbound messages."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total users" value={data.totalUsers.toLocaleString()} hint={`+${data.newUsers7} this week`} icon={<Users size={18} />} tint="amber" />
        <StatCard label="Active (7d)" value={data.activeUsers7.toLocaleString()} hint="Users seen in last 7 days" icon={<Flame size={18} />} tint="emerald" />
        <StatCard label="Unread messages" value={data.unreadMessages.toLocaleString()} hint={`${data.totalMessages} total`} icon={<Inbox size={18} />} tint="fuchsia" />
        <StatCard label="Newsletter" value={data.activeSubs.toLocaleString()} hint="Active subscribers" icon={<Mail size={18} />} tint="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-100">Daily signups</h2>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <MiniSparkline data={data.daily} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-100 flex items-center gap-2"><Trophy size={16} className="text-amber-300" /> Top XP</h2>
            <Link href="/admin/leaderboard" className="text-xs text-amber-300 hover:text-amber-200">View all →</Link>
          </div>
          <ul className="space-y-2">
            {data.topXp.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5">
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ${i === 0 ? "bg-amber-400 text-black" : "bg-white/10 text-gray-300"}`}>{i + 1}</span>
                  <span className="truncate text-sm text-gray-200">{p.full_name || p.email}</span>
                </span>
                <span className="text-sm font-bold text-amber-300 tabular-nums shrink-0">
                  <Star size={11} className="inline -mt-0.5 mr-0.5 fill-amber-300" />{p.total_xp.toLocaleString()}
                </span>
              </li>
            ))}
            {!data.topXp.length && <p className="text-xs text-gray-500">No users yet.</p>}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-100">Recent signups</h2>
          <Link href="/admin/users" className="text-xs text-amber-300 hover:text-amber-200">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/10">
                <th className="py-2 pr-3 font-semibold">Name</th>
                <th className="py-2 pr-3 font-semibold">Email</th>
                <th className="py-2 pr-3 font-semibold">XP</th>
                <th className="py-2 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSignups.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="py-2 pr-3 text-gray-200">{p.full_name ?? "—"}</td>
                  <td className="py-2 pr-3 text-gray-400">{p.email}</td>
                  <td className="py-2 pr-3 text-amber-300 tabular-nums">{p.total_xp?.toLocaleString() ?? 0}</td>
                  <td className="py-2 text-gray-500 tabular-nums">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!data.recentSignups.length && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500 text-sm">No signups yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
