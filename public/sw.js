// Enhanced service worker for mobile performance optimization with ad refresh support
const CACHE_NAME = 'make-a-pick-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Ad-related domains and paths that should NEVER be cached
const AD_DOMAINS = [
  'googlesyndication.com',
  'googletagservices.com',
  'doubleclick.net',
  'google.com',
  'ezojs.com',
  'ezoic.com',
  'ezstatic.com',
  'highperformanceformat.com',
  'adsterra.com',
  'monetag.com',
  'gatekeeperconsent.com'
];

const AD_PATHS = [
  '/pagead/',
  '/ads/',
  '/adsense/',
  '/ezoic/',
  '/monetag/',
  '/adsterra/',
  'invoke.js',
  'sa.min.js',
  'adsbygoogle.js'
];

// Function to check if request is ad-related
function isAdRequest(url) {
  const urlString = url.toString().toLowerCase();
  
  // Check if URL contains ad domains
  const hasAdDomain = AD_DOMAINS.some(domain => urlString.includes(domain));
  
  // Check if URL contains ad paths
  const hasAdPath = AD_PATHS.some(path => urlString.includes(path));
  
  return hasAdDomain || hasAdPath;
}

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch(() => {
        // Cache failure shouldn't break the app
      })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Fetch event - serve from cache when offline, but never cache ads
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // NEVER cache ad-related requests - always fetch fresh
  if (isAdRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If ad request fails, return empty response to prevent errors
          return new Response('', { status: 204 });
        })
    );
    return;
  }

  // For non-ad requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache the response for future use (only if not ad-related)
            if (!isAdRequest(event.request.url)) {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return fetchResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, return a basic offline page
        if (event.request.destination === 'document') {
          return new Response(
            '<!DOCTYPE html><html><head><title>Make a Pick - Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;text-align:center;padding:50px;background:#111827;color:white;"><h1>You\'re Offline</h1><p>Please check your internet connection and try again.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});