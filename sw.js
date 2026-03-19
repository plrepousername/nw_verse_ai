const CACHE_NAME = 'bibel-lauscher-pro-v3';

const ASSETS = [
  '/',
  '/index.html',
  '/vosk.js',
  '/manifest.json',
  '/model.tar.gz'
  // Wenn du Englisch nutzt, füge hier auch '/model-en.tar.gz' hinzu
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('App Dateien für Offline-Nutzung gespeichert.');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Externe Skripte (Entpacker) nicht direkt cachen, das macht der Browser selbst
  if (event.request.url.includes('cdnjs.cloudflare.com')) {
      return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});