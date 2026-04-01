const CACHE_NAME = 'quizforge-v1.3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
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

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // ─── 1. THE API GUARD (IMPORTANT) ───
  // If the request is going to an AI provider, don't touch it.
  // Letting the browser handle this natively prevents 401/CORS errors.
  if (event.request.url.includes('googleapis.com') || 
      event.request.url.includes('openai.com') || 
      event.request.url.includes('groq.com') ||
      event.request.url.includes('deepseek.com')) {
    return; 
  }

  // ─── 2. THE CACHE LOGIC ───
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached file if found, otherwise go to network
      return response || fetch(event.request);
    }).catch(() => {
      // Emergency fallback to network
      return fetch(event.request);
    })
  );
});