// KalbaLab service worker — minimum viable for installability.
// Caches the app shell offline-first; falls back to network for everything else.
//
// Bump CACHE version when you change cache rules so old installed workers
// drop their previous cache on activate. (v2 added explicit /api/, /_next/,
// and audio MIME bypass so TTS responses can never be served stale.)

const CACHE = "kalbalab-v2";
const SHELL = ["/", "/login", "/register", "/favicon_io/site.webmanifest"];

// Things we never want to read from cache. /api/ covers all backend calls
// (TTS, translate, contact, etc); /_next/ is build-output that already has
// hashed filenames so the network is fine for it; /auth/ is OAuth callbacks.
const NEVER_CACHE_PREFIXES = ["/api/", "/auth/", "/_next/data/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never intercept these — let the browser go straight to the network so
  // no audio / API response can ever be served from a stale cache.
  if (NEVER_CACHE_PREFIXES.some((p) => url.pathname.startsWith(p))) return;

  // Defensive: never cache audio responses regardless of path. If a future
  // bug routes audio through a non-/api path, this still saves us.
  const accept = req.headers.get("accept") || "";
  if (accept.startsWith("audio/")) return;

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((res) => {
            // Stash a copy of successful same-origin GETs that aren't audio.
            if (
              res.ok &&
              url.origin === self.location.origin &&
              !(res.headers.get("content-type") || "").startsWith("audio/")
            ) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
            }
            return res;
          })
          .catch(() => caches.match("/"))
    )
  );
});
