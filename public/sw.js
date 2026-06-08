const CACHE = 'pk-neon-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (url.pathname.match(/\.(js|css|svg|png|woff2?|ttf)$/)) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached
          return fetch(e.request).then(res => { cache.put(e.request, res.clone()); return res })
        })
      )
    )
  }
})

self.addEventListener('push', e => {
  const data = e.data?.json?.() ?? {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'Poker League', {
      body: data.body || '',
      icon: '/poker-neon/favicon.svg',
      badge: '/poker-neon/favicon.svg',
      tag: 'poker-announcement',
      data: { url: data.url || '/poker-neon/' },
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      if (list.length) return list[0].focus()
      return clients.openWindow(e.notification.data?.url || '/poker-neon/')
    })
  )
})
