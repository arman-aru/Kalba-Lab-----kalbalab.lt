"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Moon, Sun, Search, BookOpen, FlipHorizontal, GraduationCap, LayoutDashboard, User, LogOut, Menu, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { StreakBadge } from "@/components/shared/StreakBadge";

const NAV_LINKS = [
  { href: "/flashcards", label_en: "Flashcards", label_bn: "ফ্ল্যাশকার্ড", icon: FlipHorizontal },
  { href: "/vocabulary", label_en: "Vocabulary", label_bn: "শব্দভাণ্ডার", icon: BookOpen },
  { href: "/lessons", label_en: "Lessons", label_bn: "পাঠ", icon: BookOpen },
  { href: "/exam-prep", label_en: "Exam Prep", label_bn: "পরীক্ষার প্রস্তুতি", icon: GraduationCap },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, uiLanguage, setUiLanguage, setSearchOpen, user } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const label = (en: string, bn: string) => (uiLanguage === "bn" ? bn : en);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">🇱🇹</span>
          <span className="font-bold text-amber-400 text-lg tracking-tight">LithuanianBD</span>
        </Link>

        {/* Search trigger (desktop) */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-gray-400 text-sm hover:border-amber-500/30 hover:text-gray-300 transition-all flex-1 max-w-xs"
          aria-label="Open search"
        >
          <Search size={14} />
          <span className="flex-1 text-left">{label("Search...", "খুঁজুন...")} </span>
          <kbd className="text-xs border border-gray-700 rounded px-1.5 py-0.5 bg-gray-800">⌘K</kbd>
        </button>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              {label(link.label_en, link.label_bn)}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language toggle */}
          <button
            onClick={() => setUiLanguage(uiLanguage === "bn" ? "en" : "bn")}
            className="hidden sm:flex items-center gap-1 text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 text-gray-400 hover:text-gray-200 hover:border-amber-500/30 transition-all"
            title="Toggle UI language"
          >
            <span>{uiLanguage === "bn" ? "বাংলা" : "EN"}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--border)] text-gray-400 hover:text-gray-200 hover:border-amber-500/30 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Streak (if logged in) */}
          {user && <StreakBadge count={user.streak_count} size="sm" />}

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-all"
              >
                {user.full_name?.[0]?.toUpperCase() ?? "U"}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-[var(--border)]">
                    <p className="text-sm font-medium text-gray-200">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {[
                    { href: "/dashboard", icon: LayoutDashboard, label: label("Dashboard", "ড্যাশবোর্ড") },
                    { href: "/profile", icon: User, label: label("Profile", "প্রোফাইল") },
                    { href: "/flashcards", icon: FlipHorizontal, label: label("Flashcards", "ফ্ল্যাশকার্ড") },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-white/5 transition-colors"
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border)] mt-1">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
                      <LogOut size={14} />
                      {label("Sign Out", "লগ আউট")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
            >
              {label("Sign In", "লগইন")}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-1.5 rounded-lg border border-[var(--border)] text-gray-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-gray-300 hover:bg-white/5"
                )}
              >
                {label(link.label_en, link.label_bn)}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label("Sign In", "লগইন")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
