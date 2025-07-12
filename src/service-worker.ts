self.addEventListener('activate', e => {
  e.waitUntil(self.registration.navigationPreload.enable());
});

self.addEventListener('fetch', e => {
  e.respondWith((async () => {
    const preload = await e.preloadResponse;
    return preload || fetch(e.request);
  })());
});