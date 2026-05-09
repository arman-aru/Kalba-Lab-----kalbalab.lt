// Public stats endpoint — returns the live learner count.
// Uses the service-role key server-side because RLS blocks anon reads of `profiles`.
// Cached for 5 minutes so a viral landing page doesn't hammer Supabase.

import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) {
    return Response.json({ learners: null }, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }

  try {
    const supabase = createClient(url, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return Response.json(
      { learners: count ?? 0 },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return Response.json({ learners: null }, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }
}
