"use client";

import Link from "next/link";
import { Coffee, Mail, Send, Globe, FlaskConical } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LANGUAGES } from "@/lib/i18n";
import { useState, type SVGProps } from "react";

const COFFEE_URL = "https://www.buymeacoffee.com/kalbalab"; // ← swap with your real handle

// Inline brand SVGs — lucide-react removed brand logos in newer versions.
function FacebookIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  );
}
function InstagramIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function LinkedinIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const SOCIAL = [
  { href: "https://www.facebook.com/arman.salek.88/",     label: "Facebook",  icon: FacebookIcon },
  { href: "https://www.instagram.com/arman._.salek",      label: "Instagram", icon: InstagramIcon },
  { href: "https://www.linkedin.com/in/abu-salek-arman/", label: "LinkedIn",  icon: LinkedinIcon },
];

export function Footer({ className }: { className?: string }) {
  const { t, lang } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer", ui_language: lang }),
      });
    } catch {}
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className={`relative border-t border-white/10 bg-[var(--surface)]/30 backdrop-blur-sm mt-auto ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Top: 4 columns + brand */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand block — 2 cols on md+ */}
          <div className="col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5 mb-3">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/30 via-amber-500/15 to-amber-600/10 ring-1 ring-amber-500/30 shadow-[0_4px_16px_-4px_rgba(245,158,11,0.45)] transition-transform group-hover:scale-105">
                <FlaskConical size={20} className="text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" strokeWidth={2.2} />
              </span>
              <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-linear-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                Kalba<span className="ml-1">Lab</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">{t("footerTagline")}</p>

            {/* Newsletter */}
            <form onSubmit={onSubscribe} className="max-w-xs">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{t("newsletter")}</label>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("yourEmail")}
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-l-lg border border-white/10 bg-white/[0.03] text-gray-200 placeholder-gray-600 focus:border-amber-500/40 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-r-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors flex items-center gap-1"
                  aria-label={t("subscribe")}
                >
                  <Send size={14} />
                </button>
              </div>
              {subscribed && (
                <p className="text-emerald-400 text-xs mt-2">✓ {t("subscribe")} ✓</p>
              )}
            </form>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t("product")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lessons"     className="text-gray-400 hover:text-amber-300 transition-colors">{t("lessons")}</Link></li>
              <li><Link href="/vocabulary"  className="text-gray-400 hover:text-amber-300 transition-colors">{t("vocabulary")}</Link></li>
              <li><Link href="/flashcards"  className="text-gray-400 hover:text-amber-300 transition-colors">{t("flashcards")}</Link></li>
              <li><Link href="/quizzes"     className="text-gray-400 hover:text-amber-300 transition-colors">{t("quizzes")}</Link></li>
              <li><Link href="/exam-prep"   className="text-gray-400 hover:text-amber-300 transition-colors">{t("examPrep")}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t("resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/exam-prep"   className="text-gray-400 hover:text-amber-300 transition-colors">{t("examInfo")}</Link></li>
              <li><Link href="/blog"        className="text-gray-400 hover:text-amber-300 transition-colors">{t("blog")}</Link></li>
              <li><Link href="/faq"         className="text-gray-400 hover:text-amber-300 transition-colors">{t("faq")}</Link></li>
              <li><Link href="/about"       className="text-gray-400 hover:text-amber-300 transition-colors">{t("about")}</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t("community")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-400 hover:text-amber-300 transition-colors">{t("contact")}</Link></li>
              <li>
                <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  <Coffee size={14} /> {t("buyCoffee")}
                </a>
              </li>
              <li>
                <a href="mailto:armansalekofficial@gmail" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-amber-300 transition-colors">
                  <Mail size={14} /> armansalekofficial@gmail
                </a>
              </li>
            </ul>
            {/* Social */}
            <div className="flex items-center gap-2 mt-4">
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] hover:border-amber-500/40 hover:text-amber-400 text-gray-400 flex items-center justify-center transition-all"
                >
                  <s.icon width={14} height={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t("legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-400 hover:text-amber-300 transition-colors">{t("privacy")}</Link></li>
              <li><Link href="/terms"   className="text-gray-400 hover:text-amber-300 transition-colors">{t("terms")}</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-amber-300 transition-colors">{t("cookies")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Languages strip */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 inline-flex items-center gap-1.5">
            <Globe size={12} className="text-amber-400" /> {t("language")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((L) => (
              <span
                key={L.code}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${
                  lang === L.code
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-white/10 bg-white/[0.02] text-gray-400"
                }`}
              >
                <span>{L.flag}</span>
                <span>{L.nativeName}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10 text-xs text-gray-500">
          <p>© {year} KalbaLab. {t("allRights")}</p>
          <p className="text-center md:text-right">
            {t("madeIn")}{" · "}
            <span>
              {t("developedBy")}{" "}
              <a href="https://www.facebook.com/arman.salek.88/" target="_blank" rel="noopener noreferrer" className="text-amber-400/80 hover:text-amber-300">
                Arman
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
