// Tiny in-memory rate limiter — per-IP token bucket.
// Good enough to keep the contact form / newsletter from being flooded.
// On Netlify/Vercel each instance gets its own counter, which is acceptable
// for low-traffic forms. Swap for Upstash later if you need global limits.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0, retryAfter: b.resetAt - now };
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Cheap, non-cryptographic IP hash for storage. We never store raw IPs.
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`kalbalab:${ip}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Defence-in-depth CSRF check for state-changing JSON endpoints.
 *
 * SameSite=Lax cookies (Supabase default) already block cross-site form
 * submissions, but a JSON POST from another origin would still ride the
 * session if the browser allowed it. Verifying Origin against Host closes
 * that gap.
 *
 * Returns true when Origin (or Referer fallback) matches Host. If neither
 * header is present (typical of non-browser clients), it allows the request
 * through — those callers still pass through rate limiting and input
 * validation downstream.
 */
export function sameOriginOk(req: Request): boolean {
  const host = req.headers.get("host");
  if (!host) return true;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return true;
}
