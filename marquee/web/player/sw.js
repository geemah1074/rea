// Keeps the player's own files available offline so a screen that reboots
// without internet still starts and plays its saved content.
// Network first (so updates arrive), cache as fallback. Supabase traffic is not touched.
const SHELL_CACHE = "marquee-shell-v1";
const SHELL = [
  "./",
  "./index.html",
  "./player.css",
  "./player.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "../shared/config.js",
  "../shared/client.js",
  "../shared/schedule.js",
  "../shared/vendor/supabase-2.45.4.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("marquee-shell-") && key !== SHELL_CACHE)
          await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin)
    return;
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res.ok) {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        if (req.mode === "navigate") return caches.match("./index.html");
        throw new Error("offline");
      }
    })(),
  );
});
