import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Supabase : on accepte les noms de variables de l'intégration Vercel ↔ Supabase
 * (NEXT_PUBLIC_SUPABASE_*, SUPABASE_*) en plus des nôtres (VITE_SUPABASE_*).
 * Seules l'URL et la clé publique (anon / publishable) sont injectées dans l'app :
 * la clé service_role, aussi créée par l'intégration, n'est jamais lue ici.
 */
function supabaseEnv(mode: string) {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const first = (...names: string[]) => names.map((n) => env[n]).find((v) => v && v.trim()) ?? ''
  return {
    vapidPublicKey: first('VITE_VAPID_PUBLIC_KEY', 'VAPID_PUBLIC_KEY'),
    url: first('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'),
    anonKey: first(
      'VITE_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'SUPABASE_PUBLISHABLE_KEY',
    ),
  }
}

export default defineConfig(({ mode }) => {
  const supa = supabaseEnv(mode)
  return {
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supa.url),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supa.anonKey),
    // Clé publique VAPID (notifications push). La clé privée reste côté serveur.
    'import.meta.env.VITE_VAPID_PUBLIC_KEY': JSON.stringify(supa.vapidPublicKey),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ANIMO',
        short_name: 'ANIMO',
        description: 'Suivi de tes anime : déjà vus, en attente de nouveautés, à suivre.',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#FBF7F4',
        background_color: '#FBF7F4',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        // Les fonctions serveur ne doivent jamais être servies par le cache de l'app
        navigateFallbackDenylist: [/^\/api\//],
        // Réception et clic des notifications push
        importScripts: ['push-sw.js'],
        runtimeCaching: [
          {
            // Affiches AniList : on les garde pour un affichage hors ligne
            urlPattern: ({ url }) => url.hostname.endsWith('anilist.co') && url.pathname.startsWith('/file/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'anilist-covers',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
}
})
