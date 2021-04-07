const FILES_TO_CACHE = [
    '/',
    '/db.js',
    '/index.html',
    '/styles.css',
    '/dist/bundle.js',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
    '/icons',
    '/manifest.webmanifest',
    '/index.js'
];
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', function(event){
    if (event.request.url.includes("/api/")){
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200){
                        cache.put(event.request.url, response.clone())
                    }
                    return response
                })
                .catch(err => {
                    return cache.match(event.request)
                })
            }).catch(err => console.log(err))
        )
        return
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>{
            return cache.match(event.request).then(response => {
                return response || fetch(event.request)
            })
        })
    )
    })
