const STATIC_CACHE = "rm-static-assets-v1";
const RUNTIME_CACHE = "rm-runtime-pages-v1";

const PRECACHE_ASSETS = [
  "/",
  "/dashboard",
  "/reports/create",
  "/profile",
  "/brand-logo.svg",
  "/favicon.ico",
  "/manifest.json",
];

// Install Event - Pre-cache the basic app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== STATIC_CACHE && name !== RUNTIME_CACHE) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Caching strategy
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  // Skip API routes, Chrome extensions, dev-server HMR sockets, etc.
  if (
    url.pathname.startsWith("/api") ||
    url.origin !== self.location.origin ||
    url.pathname.includes("webpack") ||
    url.pathname.startsWith("/_next/webpack-hmr")
  ) {
    return;
  }

  // Caching Strategy: Static assets (JS chunks, CSS, images, fonts)
  const isStaticAsset =
    url.pathname.includes("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|css|js)$/);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // If offline and not in cache, try to return fallback placeholder if image
          if (event.request.url.match(/\.(png|jpg|jpeg|svg)$/)) {
            return caches.match("/brand-logo.svg");
          }
        });
      })
    );
    return;
  }

  // Caching Strategy for HTML pages / Routes: Network First with Cache Fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fall back to cache on failure (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If the page is not in cache, fallback to main index shell
          return caches.match("/");
        });
      })
  );
});
