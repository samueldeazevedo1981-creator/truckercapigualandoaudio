const prefix = 'trucker-cap-igualando-audio:' + self.registration.scope + ':';
const version = prefix + '1';
const assets = ['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(version).then(cache => cache.addAll(assets)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(prefix) && key !== version).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(version);
      return await cache.match('./index.html') || Response.error();
    }));
    return;
  }
  event.respondWith(caches.open(version).then(async cache => {
    return await cache.match(request) || fetch(request);
  }));
});
