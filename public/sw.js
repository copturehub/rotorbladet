const STATIC_CACHE = 'rotorbladet-static-v2'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // HTML pages: network first, NEVER serve stale HTML
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached
            return new Response('Offline', { status: 503 })
          }),
        ),
    )
    return
  }

  // Static assets (_next/static, images): cache first with background revalidate
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/api/media/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          const clone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          return response
        })
      }),
    )
    return
  }

  // Everything else: network first
  event.respondWith(fetch(request).catch(() => caches.match(request)))
})
