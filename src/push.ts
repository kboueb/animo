// Notifications push sur cet appareil (abonnement enregistré dans Supabase, envoi par le serveur Vercel).
import { supabase } from './supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

export type PushState = 'not-configured' | 'unsupported' | 'needs-install' | 'denied' | 'off' | 'on'

function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export async function pushState(): Promise<PushState> {
  if (!VAPID_PUBLIC_KEY) return 'not-configured'
  // Sur iPhone / iPad, les notifications web ne marchent que dans l'app installée sur l'écran d'accueil
  if (isIOS() && !isStandalone()) return 'needs-install'
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window))
    return 'unsupported'
  if (Notification.permission === 'denied') return 'denied'
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  return sub && Notification.permission === 'granted' ? 'on' : 'off'
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(padded)
  const bytes = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes
}

export async function enablePush(): Promise<void> {
  if (!supabase || !VAPID_PUBLIC_KEY) throw new Error('Notifications non configurées.')
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Autorisation refusée : active les notifications pour ANIMO dans les réglages.')
  const reg = await navigator.serviceWorker.ready
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64ToBytes(VAPID_PUBLIC_KEY) }))
  const json = sub.toJSON()
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
      user_agent: navigator.userAgent.slice(0, 300),
    },
    { onConflict: 'endpoint' },
  )
  if (error) throw new Error(error.message)
}

export async function disablePush(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return
  if (supabase) await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
  await sub.unsubscribe()
}

/** Demande au serveur d'envoyer une notification de test à tous mes appareils abonnés. */
export async function sendTestPush(): Promise<number> {
  if (!supabase) throw new Error('Non configuré.')
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Connecte-toi d’abord.')
  const res = await fetch('/api/test-push', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Le serveur a répondu ${res.status}`)
  const json = (await res.json()) as { sent: number }
  return json.sent
}
