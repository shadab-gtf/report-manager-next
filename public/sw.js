self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("report-manager-shell-v1")
      .then((cache) =>
        cache.addAll([
          "/",
          "/brand-logo.svg",
          "/appstore-images/android/launchericon-192x192.png",
          "/appstore-images/android/launchericon-512x512.png",
        ]),
      ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "Report Manager", {
      body: data.body || "You have a new reporting update.",
      icon: data.icon || "/appstore-images/android/launchericon-192x192.png",
      badge: "/appstore-images/windows/Square44x44Logo.targetsize-96.png",
    }),
  );
});
