// KalbaLab service worker — minimum viable for installability.
// Caches the app shell offline-first; falls back to network for everything else.

const CACHE = "kalbalab-v1";
const SHELL = ["/", "/login", "/register", "/favicon_io/site.webmanifest"];

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

  // Don't cache API or auth endpoints — always go to network.
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((res) => {
            // Stash a copy of successful same-origin GETs.
            if (res.ok && url.origin === self.location.origin) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
            }
            return res;
          })
          .catch(() => caches.match("/"))
    )
  );
});
