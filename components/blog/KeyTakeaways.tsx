import { Sparkles } from "lucide-react";

export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside
      aria-labelledby="key-takeaways-heading"
      className="not-prose mb-10 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-transparent p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
          <Sparkles size={16} />
        </span>
        <h2 id="key-takeaways-heading" className="text-sm font-bold uppercase tracking-[0.15em] text-amber-300">
          Key takeaways
        </h2>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-200 leading-relaxed">
            <span className="shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
