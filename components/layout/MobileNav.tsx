"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, BookOpen, GraduationCap, User, BookMarked } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/lib/i18n";

const NAV_ITEMS: { href: string; icon: typeof BookOpen; key: TranslationKey }[] = [
  { href: "/flashcards", icon: CreditCard,    key: "flashcards" },
  { href: "/vocabulary", icon: BookMarked,    key: "vocabulary" },
  { href: "/lessons",    icon: BookOpen,      key: "lessons" },
  { href: "/exam-prep",  icon: GraduationCap, key: "examPrep" },
  { href: "/profile",    icon: User,          key: "profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-pb pointer-events-none"
    >
      <div className="px-3 pb-3 pt-2 pointer-events-auto">
        <div
          className="relative mx-auto max-w-md rounded-2xl border border-white/10 bg-[rgba(18,18,20,0.72)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* subtle top highlight */}
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

          <ul className="relative grid grid-cols-5">
            {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const label = t(key);
              return (
                <li key={href} className="flex">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className="group relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 outline-none"
                  >
                    <span
                      className={`relative flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                        active
                          ? "bg-linear-to-b from-amber-400/25 to-amber-500/10 ring-1 ring-amber-400/40 shadow-[0_6px_20px_-6px_rgba(245,158,11,0.55)]"
                          : "group-hover:bg-white/5 group-active:scale-95"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={active ? 2.4 : 1.8}
                        className={`transition-colors ${
                          active ? "text-amber-300" : "text-gray-400 group-hover:text-gray-200"
                        }`}
                      />
                    </span>
                    <span
                      className={`text-[10.5px] font-medium leading-none tracking-wide transition-colors ${
                        active ? "text-amber-300" : "text-gray-500 group-hover:text-gray-300"
                      }`}
                    >
                      {label}
                    </span>
                    {active && (
                      <span className="pointer-events-none absolute -bottom-0.5 left-1/2 h-0.75 w-8 -translate-x-1/2 rounded-full bg-linear-to-r from-amber-400 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
