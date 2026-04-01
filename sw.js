const CACHE_NAME = 'quizforge-v1.2.2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.eventRequest).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return fetch(event.request);
    })
  );
});