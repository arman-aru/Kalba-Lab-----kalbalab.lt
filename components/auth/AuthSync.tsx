"use client";

import { useEffect } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useAppStore } from "@/stores/useAppStore";
import { awardXP } from "@/lib/award-xp";
import type { UserProfile } from "@/types";

const DAILY_LOGIN_KEY = "kalbalab.lastLoginDate";

function maybeAwardDailyLogin() {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    const last = localStorage.getItem(DAILY_LOGIN_KEY);
    if (last === today) return;
    localStorage.setItem(DAILY_LOGIN_KEY, today);
    awardXP("daily_login");
  } catch {
    // localStorage unavailable — skip silently
  }
}

/**
 * Subscribes to Supabase auth state and mirrors the signed-in profile
 * into the Zustand store so the rest of the UI (Navbar, Dashboard, etc.)
 * can read it synchronously.
 */
export function AuthSync() {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const sb = getSupabaseBrowser();

    let cancelled = false;

    const loadProfile = async (userId: string, fallbackEmail: string, meta: Record<string, unknown> | null) => {
      const { data: profile } = await sb
        .from("profiles")
        .select("id, email, full_name, avatar_url, preferred_language, streak_count, total_xp, created_at, last_seen, is_admin")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (profile) {
        setUser(profile as UserProfile);
        maybeAwardDailyLogin();
      } else {
        // First sign-in — the trigger should have created the row, but if RLS
        // or timing caused a miss, build a minimal record from the auth user.
        const fullName = (meta?.full_name as string | undefined) ?? (meta?.name as string | undefined) ?? null;
        const avatar = (meta?.avatar_url as string | undefined) ?? undefined;
        setUser({
          id: userId,
          email: fallbackEmail,
          full_name: fullName ?? "",
          avatar_url: avatar,
          preferred_language: "en",
          streak_count: 0,
          total_xp: 0,
          created_at: new Date().toISOString(),
          last_seen: new Date().toISOString(),
        });
      }
    };

    // 1. Initial load: read the current session if any.
    sb.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
      if (!user) {
        setUser(null);
        return;
      }
      loadProfile(user.id, user.email ?? "", user.user_metadata ?? null);
    });

    // 2. Live updates on sign-in / sign-out / token refresh.
    const { data: sub } = sb.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        return;
      }
      const u = session.user;
      loadProfile(u.id, u.email ?? "", u.user_metadata ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
}
