// Adapted from https://glitch.com/edit/#!/workbox-strategies
// Resource https://developers.google.com/web/tools/workbox/modules/workbox-strategies
// Resource https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
var workbox;  // needed to prevent "workbox is undefined" glitch.com warning
const staticResources = [
  
];


workbox.setConfig({
  debug: true
});

// To avoid async issues, we load strategies before we call it in the event listener
const {strategies} = workbox;

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (event.request.mode === 'navigate') {
    event.respondWith(new Response(decodeURI(url.pathname.substring(1)), {
        headers: {'content-type': 'text/html'},
      }));
  }
});

// This immediately deploys the service worker w/o requiring a refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();

/*self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(workbox.core.cacheNames.runtime).then(function(cache) {
      return cache.addAll(staticResources);
    })
  );
});*/