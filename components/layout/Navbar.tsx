"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, BookOpen, FlipHorizontal, GraduationCap,
  LayoutDashboard, LogOut, Menu, X, Sparkles, FlaskConical, Settings, ShieldCheck, Star,
  FileText, MessageSquare, HelpCircle, Info, Shield, ScrollText, Cookie,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { T, type TranslationKey } from "@/lib/i18n";

const NAV_LINKS: { href: string; key: TranslationKey; icon: typeof BookOpen }[] = [
  { href: "/flashcards", key: "flashcards", icon: FlipHorizontal },
  { href: "/vocabulary", key: "vocabulary", icon: BookOpen },
  { href: "/lessons",    key: "lessons",    icon: BookOpen },
  { href: "/exam-prep",  key: "examPrep",   icon: GraduationCap },
];

// Footer pages surfaced in both the mobile drawer (signed-out users) and the
// avatar dropdown (signed-in users) so everything is reachable from one menu.
// `label` is plain text; we don't gate these behind translation keys because
// the labels are short and language-neutral.
const FOOTER_LINKS: { href: string; label: string; icon: typeof BookOpen }[] = [
  { href: "/blog",    label: "Blog",    icon: FileText },
  { href: "/about",   label: "About",   icon: Info },
  { href: "/contact", label: "Contact", icon: MessageSquare },
  { href: "/faq",     label: "FAQ",     icon: HelpCircle },
  { href: "/privacy", label: "Privacy", icon: Shield },
  { href: "/terms",   label: "Terms",   icon: ScrollText },
  { href: "/cookies", label: "Cookies", icon: Cookie },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { uiLanguage, setSearchOpen, user } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await getSupabaseBrowser().auth.signOut();
      setUserMenuOpen(false);
      // Hard redirect so the user never lands on a transient render of the
      // protected page they just signed out of (which otherwise flashes a
      // "Loading…" state while React unwinds and middleware redirects).
      window.location.replace("/");
    } catch {
      setSigningOut(false);
    }
  };

  const tr = (key: TranslationKey) => {
    const entry = T[key] as Partial<Record<typeof uiLanguage, string>> & { en: string };
    return entry[uiLanguage] ?? entry.en;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const ctrlBtn =
    "inline-flex items-center justify-center h-9 w-9 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 hover:text-amber-300 hover:border-amber-500/40 hover:bg-white/[0.06] transition-all";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-[var(--background)]/75 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
            : "border-b border-transparent bg-[var(--background)]/40 backdrop-blur-md"
        )}
      >
        <nav className="max-w-7xl mx-auto px-3 sm:px-5 h-14 md:h-16 flex items-center gap-2 md:gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
            aria-label="Kalba Lab home"
          >
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/30 via-amber-500/15 to-amber-600/10 ring-1 ring-amber-500/30 shadow-[0_4px_16px_-4px_rgba(245,158,11,0.45)] transition-transform group-hover:scale-105">
              <FlaskConical size={20} className="text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" strokeWidth={2.2} />
            </span>
            <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-linear-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              Kalba<span className="ml-1">Lab</span>
            </span>
          </Link>

          {/* Search trigger — md+ */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 h-9 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 text-sm hover:border-amber-500/40 hover:text-gray-200 hover:bg-white/[0.06] transition-all flex-1 max-w-[320px] ml-2 outline-none"
            aria-label="Open search"
          >
            <Search size={14} className="text-gray-500" />
            <span className="flex-1 text-left truncate">{tr("search")}</span>
            <kbd className="hidden lg:inline-flex text-[10px] font-mono border border-white/10 rounded-md px-1.5 py-0.5 bg-black/40 text-gray-500">⌘K</kbd>
          </button>

          {/* Nav links — md+ */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 ml-auto">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 lg:px-3.5 h-9 inline-flex items-center rounded-lg text-sm font-medium transition-colors",
                    active ? "text-amber-300" : "text-gray-400 hover:text-gray-100"
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/30"
                      style={{ animation: "navPillIn 220ms ease-out" }}
                    />
                  )}
                  <span className="relative">{tr(link.key)}</span>
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto md:ml-2">
            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(ctrlBtn, "md:hidden")}
              aria-label="Open search"
            >
              <Search size={16} />
            </button>

            <LanguageSwitcher />

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-xl bg-linear-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/30 hover:from-amber-500/40 transition-all"
                  aria-label="Account menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden bg-amber-500/20 ring-1 ring-amber-500/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar_url || "/default-avatar.svg"}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                  <span className="hidden lg:flex flex-col items-start leading-tight max-w-[110px]">
                    <span className="text-[11px] text-amber-200/70 -mb-0.5">Hi,</span>
                    <span className="text-xs font-semibold text-amber-200 truncate w-full">
                      {(() => {
                        const raw = user.full_name?.split(" ")[0] || user.email?.split("@")[0] || "";
                        return raw.length > 5 ? `${raw.slice(0, 5)}..` : raw;
                      })()}
                    </span>
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-12 w-72 rounded-2xl border border-white/10 bg-[var(--surface)]/95 backdrop-blur-xl shadow-2xl py-1.5 z-50 origin-top-right overflow-hidden"
                    style={{ animation: "menuIn 180ms ease-out" }}
                  >
                    {/* Header card */}
                    <div className="px-4 pt-4 pb-3 bg-linear-to-br from-amber-500/10 via-transparent to-transparent border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden bg-amber-500/20 ring-1 ring-amber-500/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={user.avatar_url || "/default-avatar.svg"}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-100 truncate">{user.full_name || "Learner"}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-black/30 px-2.5 py-1.5">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">XP</p>
                          <p className="text-sm font-bold text-amber-300 tabular-nums flex items-center gap-1"><Star size={11} className="fill-amber-300" /> {(user.total_xp ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg bg-black/30 px-2.5 py-1.5">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">Streak</p>
                          <p className="text-sm font-bold text-orange-300 tabular-nums">🔥 {user.streak_count ?? 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        {tr("dashboard")}
                      </Link>
                    </div>

                    {/* Mobile-only main nav — 2-column grid keeps the dropdown
                        compact so it doesn't run off the bottom of small phones. */}
                    <div className="md:hidden border-t border-white/10 px-2 py-2">
                      <p className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Navigate</p>
                      <div className="grid grid-cols-2 gap-1">
                        {NAV_LINKS.map((link) => (
                          <Link
                            key={`mob-${link.href}`}
                            href={link.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
                          >
                            <link.icon size={14} className="shrink-0" />
                            <span className="truncate">{tr(link.key)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Settings link — anchors to the Settings card on /profile. */}
                    <div className="border-t border-white/10 py-1">
                      <Link
                        href="/profile#settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
                      >
                        <Settings size={14} />
                        Settings
                      </Link>
                    </div>

                    {/* Footer / static pages — collapsible on mobile so the
                        dropdown stays short; 2-column grid when expanded. */}
                    <div className="border-t border-white/10">
                      <details className="group md:open:!block" open>
                        <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none md:cursor-default">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">More</span>
                          <span className="md:hidden text-gray-500 group-open:rotate-180 transition-transform">▾</span>
                        </summary>
                        <div className="px-2 pb-2 grid grid-cols-2 md:grid-cols-1 gap-1">
                          {FOOTER_LINKS.map((link) => (
                            <Link
                              key={`menu-${link.href}`}
                              href={link.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg md:rounded-none text-sm text-gray-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
                            >
                              <link.icon size={14} className="shrink-0" />
                              <span className="truncate">{link.label}</span>
                            </Link>
                          ))}
                        </div>
                      </details>
                    </div>

                    {/* Admin shortcut */}
                    {user.is_admin && (
                      <div className="border-t border-white/10 py-1">
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10 transition-colors"
                        >
                          <ShieldCheck size={14} />
                          Admin dashboard
                        </Link>
                      </div>
                    )}

                    {/* Sign out */}
                    <div className="border-t border-white/10 py-1">
                      <button
                        onClick={onSignOut}
                        disabled={signingOut}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors disabled:opacity-60"
                      >
                        <LogOut size={14} />
                        {signingOut ? "Signing out…" : tr("signOut")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-sm font-bold transition-all shadow-[0_6px_20px_-6px_rgba(245,158,11,0.6)]"
              >
                <Sparkles size={14} />
                {tr("signIn")}
              </Link>
            )}

            {/* Mobile menu toggle — only when signed out (signed-in users use the avatar dropdown) */}
            <button
              className={cn(ctrlBtn, "md:hidden", user && "hidden")}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              <span className="relative block w-4 h-4">
                <Menu size={16} className={cn("absolute inset-0 transition-all", mobileOpen ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100")} />
                <X size={16} className={cn("absolute inset-0 transition-all", mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50")} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            // Cap height so the bottom CTA never falls off small screens.
            // Inside, links scroll while the Sign In stays pinned.
            "absolute top-14 left-2 right-2 max-h-[calc(100vh-5rem)] flex flex-col rounded-2xl border border-white/10 bg-[var(--surface)]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden",
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <div className="p-3 overflow-y-auto flex-1 min-h-0">
            <p className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Navigate
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-gray-100"
                    )}
                    style={{ animation: mobileOpen ? `slideIn 220ms ease-out ${i * 30}ms backwards` : undefined }}
                  >
                    <span className={cn(
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-amber-500/15 text-amber-300" : "bg-white/5 text-gray-400"
                    )}>
                      <link.icon size={13} />
                    </span>
                    <span className="truncate">{tr(link.key)}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer / static pages */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">More</p>
              <div className="grid grid-cols-2 gap-1">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={`mob-foot-${link.href}`}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-amber-300 transition-colors"
                  >
                    <link.icon size={13} className="shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Pinned CTA — stays in view even when the link list scrolls. */}
          {!user && (
            <div className="shrink-0 p-3 border-t border-white/10 bg-[var(--surface)]/95">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-sm font-bold transition-all"
              >
                <Sparkles size={14} />
                {tr("signIn")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
