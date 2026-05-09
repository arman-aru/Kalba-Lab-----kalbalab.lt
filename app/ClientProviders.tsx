"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpotlightSearch } from "@/components/layout/SpotlightSearch";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthSync } from "@/components/auth/AuthSync";
import { useAppStore } from "@/stores/useAppStore";
import { isRTL } from "@/lib/i18n";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const uiLanguage = useAppStore((s) => s.uiLanguage);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = uiLanguage;
    document.documentElement.dir = isRTL(uiLanguage) ? "rtl" : "ltr";
  }, [uiLanguage]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <AuthSync />
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer className="hidden md:block" />
      <SpotlightSearch />
      <MobileNav />
    </div>
  );
}
