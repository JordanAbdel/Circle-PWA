// Bump SW_VERSION any time you deploy meaningful content changes.
// This ensures the old cache is purged and fresh assets are fetched.
const SW_VERSION = "2025-05-19-1";
const CACHE = `circle-${SW_VERSION}`;

// Only pre-cache CDN scripts — these URLs are version-pinned and immutable.
// Local assets (HTML, CSS, JSX) use network-first so deploys are always fresh.
const CDN_PRECACHE = [
  "https://unpkg.com/react@18.3.1/umd/react.development.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CDN_PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // Delete every cache that isn't the current version.
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    // Network-first for all local assets.
    // Cache is only a fallback when the network is unavailable (offline support).
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for CDN scripts — their URLs are version-pinned so they're
    // effectively immutable. This avoids re-downloading React/Babel on every load.
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});
