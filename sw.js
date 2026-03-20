const CACHE_NAME = 'bibel-lauscher-pro-v4';

// Nur die absolut notwendigen Dateien für den Start cachen.
// WICHTIG: Nutze relative Pfade './', damit es auf GitHub Pages im Unterordner läuft!
const ASSETS = [
  './',
  './index.html',
  './vosk.js',
  './manifest.json',
  './bible_de.json'
];

// 1. INSTALLATION: Core-Dateien in den Cache laden
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Erzwingt, dass der neue Service Worker sofort aktiv wird
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Core Assets für Offline-Betrieb gespeichert.');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. AKTIVIERUNG: Alten Cache löschen, falls vorhanden
self.addEventListener('activate', (event) => {
  // WICHTIG: Übernimmt sofort die Kontrolle über alle offenen Tabs
  event.waitUntil(self.clients.claim());

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
                  .map((name) => caches.delete(name))
      );
    })
  );
});

// 3. FETCH: Der Herzschlag der App (Sicherheit + Cache)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // A. SICHERHEITS-FIX FÜR GITHUB PAGES (COOP/COEP Header)
  // Das ersetzt den coi-serviceworker.js und schaltet SharedArrayBuffer frei.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // B. NORMALES CACHING (Network-First / Cache-Fallback)
  if (url.includes('cdnjs.cloudflare.com')) return; // Cloudflare ignorieren

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Wenn im Cache, sofort ausliefern
      if (cachedResponse) return cachedResponse;

      // Wenn nicht im Cache, aus dem Netzwerk holen und für später speichern
      return fetch(event.request).then((networkResponse) => {
        // Nur erfolgreiche Anfragen (z.B. das Modell) automatisch cachen
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      });
    })
  );
});