const STATIC_CACHE = 'financas-static-v1';
const API_CACHE = 'financas-api-v1';
const OFFLINE_URL = '/offline.html';
const API_ORIGIN = 'http://localhost:8080';

const CACHE_FIRST_PATHS = ['/categories', '/spending-limits'];
const NETWORK_FIRST_PATHS = ['/transactions'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll([OFFLINE_URL]))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

function matchesApiPath(request, paths) {
    if (request.method !== 'GET') return false;
    const url = new URL(request.url);
    if (url.origin !== API_ORIGIN) return false;
    return paths.some((path) => url.pathname.startsWith(path));
}

async function cacheFirst(request) {
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
}

async function networkFirst(request) {
    const cache = await caches.open(API_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        throw err;
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (matchesApiPath(request, CACHE_FIRST_PATHS)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (matchesApiPath(request, NETWORK_FIRST_PATHS)) {
        event.respondWith(networkFirst(request));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => caches.match(OFFLINE_URL))
        );
    }
});

self.addEventListener('message', (event) => {
    const data = event.data || {};

    if (data.type === 'SHOW_SPENDING_NOTIFICATION' && data.payload) {
        self.registration.showNotification(data.payload.title, {
            body: data.payload.body,
            tag: data.payload.tag,
            icon: '/favicon.svg',
        });
    }

    // A cache-first entry only reflects what was on the network at first
    // fetch. When the app itself creates/deletes a resource under a
    // cache-first path, drop the stale cached list so the next read goes
    // back to the network instead of serving pre-mutation data forever.
    if (data.type === 'INVALIDATE_CACHE' && data.path) {
        event.waitUntil(
            caches.open(API_CACHE).then((cache) =>
                cache.keys().then((requests) =>
                    Promise.all(
                        requests
                            .filter((req) => new URL(req.url).pathname === data.path)
                            .map((req) => cache.delete(req))
                    )
                )
            )
        );
    }
});
