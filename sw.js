// Adapted from https://glitch.com/edit/#!/workbox-strategies
// Adapted from https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/
// Resource https://developers.google.com/web/tools/workbox/modules/workbox-strategies
// Resource https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
var workbox;  // needed to prevent "workbox is undefined" glitch.com warning
const staticResources = [
  "https://cdn.glitch.com/3b5435b3-c38c-479b-a5a7-d254c2e23cc0%2Fchaos.png?v=1600527757494"
];


workbox.setConfig({
  debug: true
});

// To avoid async issues, we load strategies before we call it in the event listener
const {strategies} = workbox;

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  /*if (event.request.mode === 'navigate') {
    if (url.hash !== '' && url.hash.split('=')[0] !== '#edit') {
      var code;
      try {
        code = decodeURI(url.hash.substring(1));
      } catch {
        code = 'Malformated URI. <a href="/">Click here to fix</a>';
      }
      event.respondWith(
        new Response(code, {headers: {'content-type': 'text/html'}}
      ));
    }
    else {*/
  
  const request = event.request;

  const staleWhileRevalidate = new workbox.strategies.StaleWhileRevalidate();
  event.respondWith(staleWhileRevalidate.handle({event, request}));
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