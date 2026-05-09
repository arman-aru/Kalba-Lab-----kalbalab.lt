"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const sb = getSupabaseBrowser();

    try {
      const { error: e } = await sb.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (e) throw e;
      router.replace("/profile");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 isolate overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md anim-fade-up">
        <div className="text-center mb-8">
          <Link href="/" className="group inline-flex items-center gap-2.5 mb-6">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/30 via-amber-500/15 to-amber-600/10 ring-1 ring-amber-500/30 shadow-[0_4px_16px_-4px_rgba(245,158,11,0.45)] transition-transform group-hover:scale-105">
              <FlaskConical size={20} className="text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" strokeWidth={2.2} />
            </span>
            <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-linear-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              Kalba<span className="ml-1">Lab</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-100">{t("welcomeBack")}</h1>
          <p className="text-gray-400 text-sm mt-2">{t("loginSubtitle")}</p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl p-7 sm:p-8 shadow-2xl shadow-amber-500/[0.04]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm anim-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full px-3.5 py-3 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t("password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 pr-11 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 hover:scale-[1.02]",
                loading && "opacity-70 cursor-not-allowed scale-100"
              )}
            >
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>{t("signIn")}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-3 bg-[var(--surface)]/80 text-gray-500">{t("or")}</span>
            </div>
          </div>

          <GoogleButton label={t("signInGoogle")} next="/dashboard" />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
