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
          // Short edge cache so a new signup shows up on the home page
          // within ~10 seconds. Browsers don't cache, so client polling is
          // honest. SWR allows the next visitor in the window to get a near-
          // instant response while we refresh in the background.
          "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch {
    return Response.json({ learners: null }, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }
}
