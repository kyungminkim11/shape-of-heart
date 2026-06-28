const CACHE = 'shape-of-heart-v5';
const ASSETS = [
  './','./index.html','./types.html','./pairings.html','./tests.html','./glossary.html','./encyclopedia.html','./feedback.html','./history.html',
  './styles.css','./site.css','./content-pages.css','./tests.css','./encyclopedia.css','./readability.css','./personalization.css',
  './site.js','./site-enhancements.js','./test-enhancements.js','./history.js','./content-data.js','./types.js','./pairings.js','./tests.js','./glossary.js','./encyclopedia.js',
  './manifest.webmanifest','./contact.json','./robots.txt','./assets/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
});