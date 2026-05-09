"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Users, Mail, Inbox, Trophy, LogOut, Menu, X, ShieldCheck, Star,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",            label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/users",      label: "Users",       icon: Users },
  { href: "/admin/messages",   label: "Messages",    icon: Inbox },
  { href: "/admin/reviews",    label: "Reviews",     icon: Star },
  { href: "/admin/newsletter", label: "Newsletter",  icon: Mail },
  { href: "/admin/leaderboard",label: "Top XP",      icon: Trophy },
];

export function AdminShell({
  user,
  children,
}: {
  user: { email: string; name: string | null };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await getSupabaseBrowser().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[var(--background)] text-gray-100">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 px-4 h-14 border-b border-white/10 bg-[var(--background)]/85 backdrop-blur">
        <Link href="/admin" className="inline-flex items-center gap-2 font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30 text-amber-300">
            <ShieldCheck size={16} />
          </span>
          Admin
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5"
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl flex flex-col transition-transform duration-200 md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
            "md:top-0 md:h-screen"
          )}
        >
          <div className="hidden md:flex items-center gap-2 px-5 h-16 border-b border-white/10">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/30 text-amber-300">
              <ShieldCheck size={18} />
            </span>
            <div className="leading-tight">
              <p className="font-bold text-sm">KalbaLab</p>
              <p className="text-[11px] uppercase tracking-wider text-amber-300/80">Admin</p>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30"
                      : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-semibold text-gray-100 truncate">{user.name ?? "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
