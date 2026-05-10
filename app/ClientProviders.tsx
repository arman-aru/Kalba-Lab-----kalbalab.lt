"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpotlightSearch } from "@/components/layout/SpotlightSearch";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthSync } from "@/components/auth/AuthSync";
import { InstallPWA } from "@/components/shared/InstallPWA";
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

  // Register the PWA service worker once the app is interactive.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol === "http:" && window.location.hostname !== "localhost") return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => { /* non-fatal */ });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <AuthSync />
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer className="hidden md:block" />
      <SpotlightSearch />
      <MobileNav />
      <InstallPWA />
    </div>
  );
}
