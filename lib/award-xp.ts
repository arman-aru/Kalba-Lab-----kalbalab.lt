"use client";

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useAppStore } from "@/stores/useAppStore";

export type XPReason =
  | "vocab_save"
  | "flashcard_view"
  | "quiz_correct"
  | "lesson_complete"
  | "daily_login"
  | "review_submit"
  | "audio_play";

const AMOUNTS: Record<XPReason, number> = {
  vocab_save:      5,
  flashcard_view:  1,
  quiz_correct:    10,
  lesson_complete: 25,
  daily_login:     10,
  review_submit:   15,
  audio_play:      1,
};

/**
 * Award XP for a real activity. Updates the user.total_xp in the store
 * optimistically and triggers the floating "+X" animation in <LiveXP/>.
 * If the network/RPC fails the optimistic gain is rolled back.
 */
export async function awardXP(reason: XPReason, override?: number): Promise<void> {
  const amount = override ?? AMOUNTS[reason];
  const store = useAppStore.getState();
  const user = store.user;
  if (!user) return;

  const prev = user.total_xp ?? 0;
  // Optimistic update — bumps the LiveXP pill instantly.
  store.setUser({ ...user, total_xp: prev + amount });
  store.addXP(amount);          // fires the "+X" float animation
  store.addTodayXP(amount);     // tracks the daily-goal bucket (resets at midnight)

  const sb = getSupabaseBrowser();

  const reconcile = (newTotal: number) => {
    const cur = useAppStore.getState().user;
    if (cur) useAppStore.getState().setUser({ ...cur, total_xp: newTotal });
  };

  try {
    // Primary path — RPC (atomic, capped, security definer).
    const { data, error } = await sb.rpc("award_xp", { amount });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    const serverXP = (row as { total_xp?: number } | null)?.total_xp;
    if (typeof serverXP === "number") {
      reconcile(serverXP);
      return;
    }
  } catch (rpcErr) {
    console.warn(`award_xp RPC failed for ${reason}, falling back to direct update:`, rpcErr);

    // Fallback — direct row update (works under "Self can update own profile" RLS).
    try {
      const { data, error } = await sb
        .from("profiles")
        .update({ total_xp: prev + amount, last_seen: new Date().toISOString() })
        .eq("id", user.id)
        .select("total_xp")
        .single();
      if (error) throw error;
      if (typeof (data as { total_xp?: number } | null)?.total_xp === "number") {
        reconcile((data as { total_xp: number }).total_xp);
      }
      return;
    } catch (updateErr) {
      console.warn(`Direct XP update failed for ${reason}:`, updateErr);
      // Roll back optimistic update.
      const cur = useAppStore.getState().user;
      if (cur) {
        useAppStore.getState().setUser({ ...cur, total_xp: Math.max(0, (cur.total_xp ?? 0) - amount) });
      }
    }
  }
}
