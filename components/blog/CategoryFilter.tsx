"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Category = { slug: string; name: string; count: number };

export function CategoryFilter({ categories, total }: { categories: Category[]; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("category") ?? "all";

  const setCategory = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(params.toString());
      if (slug === "all") next.delete("category");
      else next.set("category", slug);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const items: Category[] = [{ slug: "all", name: "All", count: total }, ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter posts by category">
      {items.map((c) => {
        const isActive = active === c.slug;
        return (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setCategory(c.slug)}
            className={[
              "inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold transition-all",
              "border",
              isActive
                ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-200",
            ].join(" ")}
          >
            {c.name}
            <span className={isActive ? "text-amber-200/80" : "text-gray-500"}>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
