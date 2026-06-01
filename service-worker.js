const CACHE_NAME = 'keem-studio-v2';
const urlsToCache = ['/clip-studio/', '/clip-studio/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// ── Push notifications ──────────────────────────────────────
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  const title = data.title || 'Keem Studio';
  const options = {
    body: data.body || '',
    icon: data.icon || '/clip-studio/icon-192.png',
    badge: '/clip-studio/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: '/clip-studio/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/clip-studio/'));
});
