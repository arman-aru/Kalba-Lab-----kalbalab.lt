import type { MetadataRoute } from "next";

const SITE = "https://kalbalab.lt";

// Default-deny private routes for everyone, then explicitly allow the major
// AI training/answer crawlers. To opt OUT of any of these, change `allow: "/"`
// to `disallow: "/"` for that bot.
const AI_CRAWLERS = [
  "GPTBot",            // OpenAI training
  "OAI-SearchBot",     // ChatGPT browsing / answers
  "ChatGPT-User",      // user-initiated ChatGPT browsing
  "Google-Extended",   // Gemini training
  "Applebot-Extended", // Apple Intelligence
  "ClaudeBot",         // Anthropic crawling
  "Claude-User",       // Anthropic answer engine
  "PerplexityBot",     // Perplexity
  "Perplexity-User",
  "CCBot",             // Common Crawl (used by many models)
  "Amazonbot",
  "Bytespider",        // ByteDance / Doubao
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "DuckAssistBot",
  "cohere-ai",
  "anthropic-ai",
];

const PRIVATE_PATHS = [
  "/admin",
  "/api",
  "/auth",
  "/(protected)",
  "/dashboard",
  "/profile",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/", disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
