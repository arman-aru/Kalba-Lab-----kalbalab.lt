import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * CSP is intentionally permissive enough for Next.js dev-mode hot reload and
 * existing third-party assets (Google Fonts, Supabase Storage, MyMemory TTS,
 * BuyMeACoffee). Tighten further once the asset list is fully audited — every
 * removal here improves defence in depth.
 *
 * - Strict-Transport-Security forces HTTPS for 2 years.
 * - X-Content-Type-Options blocks MIME sniffing.
 * - X-Frame-Options + frame-ancestors block clickjacking.
 * - Referrer-Policy strips path info from outbound referers.
 * - Permissions-Policy disables sensors / camera / payment APIs we don't use.
 * - Cross-Origin-Opener-Policy isolates the browsing context (Spectre).
 */
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security",    value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options",       value: "nosniff" },
  { key: "X-Frame-Options",              value: "DENY" },
  { key: "Referrer-Policy",              value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control",       value: "on" },
  { key: "Permissions-Policy",           value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inlines bootstrap scripts; 'unsafe-inline' is hard to drop
      // without per-request nonces. Add a nonce middleware later to remove it.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://img.buymeacoffee.com",
      "media-src 'self' blob: https://*.supabase.co https://translate.google.com https://*.tts.speech.microsoft.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mymemory.translated.net https://*.tts.speech.microsoft.com",
      "frame-src 'self' https://www.buymeacoffee.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      // Apply globally to HTML pages and API routes.
      { source: "/:path*", headers: SECURITY_HEADERS },
    ];
  },
};

export default nextConfig;
