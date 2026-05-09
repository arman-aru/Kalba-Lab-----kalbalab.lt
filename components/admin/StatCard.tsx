import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tint = "amber",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tint?: "amber" | "emerald" | "blue" | "fuchsia" | "purple";
}) {
  const tints: Record<string, string> = {
    amber:    "from-amber-500/15 ring-amber-500/20 text-amber-300",
    emerald:  "from-emerald-500/15 ring-emerald-500/20 text-emerald-300",
    blue:     "from-blue-500/15 ring-blue-500/20 text-blue-300",
    fuchsia:  "from-fuchsia-500/15 ring-fuchsia-500/20 text-fuchsia-300",
    purple:   "from-purple-500/15 ring-purple-500/20 text-purple-300",
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br ${tints[tint]} bg-[var(--surface)]/60 backdrop-blur-sm p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-gray-50">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
        {icon && (
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${tints[tint]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
