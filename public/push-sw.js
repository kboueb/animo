// Notifications push d'ANIMO, chargé par le service worker généré (vite.config.ts → workbox.importScripts).
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'ANIMO', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/favicon-48.png',
      tag: data.tag,
      data: { url: data.url || '/?alerts=1' },
    }),
  )
})

// Clic sur la notification : on rouvre ANIMO (ou on le ramène au premier plan) sur la liste des alertes
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL((event.notification.data && event.notification.data.url) || '/?alerts=1', self.location.origin).href
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin)) {
          await client.focus()
          client.postMessage({ type: 'animo-open-alerts' })
          return
        }
      }
      await self.clients.openWindow(url)
    })(),
  )
})
