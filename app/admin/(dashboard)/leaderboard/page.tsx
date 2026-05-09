import { Trophy, Star, Flame } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("profiles")
    .select("id, full_name, email, total_xp, streak_count, preferred_language, created_at")
    .order("total_xp", { ascending: false })
    .limit(10);

  const top = data ?? [];
  const podium = top.slice(0, 3);
  const rest = top.slice(3);

  const podiumOrder = [1, 0, 2]; // visually: 2nd, 1st, 3rd

  return (
    <>
      <PageHeader
        title="Top 10 — Most active learners"
        description="Ranked by total XP. Updates as users earn XP across the platform."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {podiumOrder.map((idx) => {
          const p = podium[idx];
          if (!p) return <div key={idx} />;
          const place = idx + 1;
          const medal =
            place === 1 ? "from-amber-300 to-amber-500 text-black ring-amber-400/50" :
            place === 2 ? "from-slate-300 to-slate-500 text-black ring-slate-400/50" :
                          "from-orange-400 to-orange-600 text-black ring-orange-400/50";
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm p-5 ${place === 1 ? "sm:order-2 sm:-translate-y-2" : place === 2 ? "sm:order-1" : "sm:order-3"}`}
            >
              <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-br ${medal} opacity-20 blur-2xl`} />
              <div className="relative flex items-center gap-4">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${medal} ring-2 font-extrabold text-xl`}>
                  {place}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-100 truncate">{p.full_name || p.email}</p>
                  <p className="text-xs text-gray-500 truncate">{p.email}</p>
                </div>
              </div>
              <div className="relative mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-black/30 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">XP</p>
                  <p className="font-bold text-amber-300 tabular-nums flex items-center gap-1"><Star size={12} className="fill-amber-300" />{p.total_xp.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-black/30 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Streak</p>
                  <p className="font-bold text-orange-300 tabular-nums flex items-center gap-1"><Flame size={12} />{p.streak_count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
          <Trophy size={16} className="text-amber-300" />
          <h2 className="font-bold text-gray-100">Ranks 4 – 10</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="py-3 px-4 font-semibold">#</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">XP</th>
              <th className="py-3 px-4 font-semibold">Streak</th>
              <th className="py-3 px-4 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((p, i) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="py-2.5 px-4 text-gray-500 tabular-nums">{i + 4}</td>
                <td className="py-2.5 px-4 text-gray-200">{p.full_name ?? "—"}</td>
                <td className="py-2.5 px-4 text-gray-500">{p.email}</td>
                <td className="py-2.5 px-4 text-amber-300 tabular-nums">{p.total_xp.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-orange-300 tabular-nums">{p.streak_count}</td>
                <td className="py-2.5 px-4 text-gray-500 tabular-nums">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!rest.length && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-500 text-sm">Not enough users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
