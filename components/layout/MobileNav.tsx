"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, CreditCard, GraduationCap, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label_en: "Home", label_bn: "হোম" },
  { href: "/lessons", icon: BookOpen, label_en: "Lessons", label_bn: "পাঠ" },
  { href: "/flashcards", icon: CreditCard, label_en: "Cards", label_bn: "কার্ড" },
  { href: "/exam-prep", icon: GraduationCap, label_en: "Exam", label_bn: "পরীক্ষা" },
  { href: "/profile", icon: User, label_en: "Profile", label_bn: "প্রোফাইল" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--surface)] border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ href, icon: Icon, label_en, label_bn }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-bengali leading-tight ${active ? "text-amber-400" : ""}`}>
                {label_bn}
              </span>
              {active && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
