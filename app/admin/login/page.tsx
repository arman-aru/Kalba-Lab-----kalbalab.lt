"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason");
  const redirect = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    reason === "forbidden" ? "Your account is not an admin." :
    reason === "unconfigured" ? "Supabase environment variables are not configured." :
    null
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const sb = getSupabaseBrowser();
      const { error: signInErr } = await sb.auth.signInWithPassword({ email, password });
      if (signInErr) throw signInErr;

      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error("Sign-in failed");

      const { data: profile, error: profileErr } = await sb
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (profileErr) throw profileErr;
      if (!profile?.is_admin) {
        await sb.auth.signOut();
        throw new Error("Your account is not an admin.");
      }
      router.replace(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 ring-1 ring-amber-500/30 text-amber-300 mb-3">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-100">Admin sign in</h1>
          <p className="text-sm text-gray-500 mt-1">Authorized personnel only.</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 backdrop-blur p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
