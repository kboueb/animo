// Outils communs aux fonctions serveur (Vercel) : accès Supabase « admin » et envoi de notifications push.
// Ces variables ne sont lues QUE côté serveur, jamais injectées dans l'app.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export function adminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('Variables Supabase serveur manquantes (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

let vapidReady = false
function setupVapid() {
  if (vapidReady) return
  const pub = process.env.VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !priv) throw new Error('Clés VAPID manquantes (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)')
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? 'https://animo-seven.vercel.app', pub, priv)
  vapidReady = true
}

export interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

/** Envoie une notification à tous les appareils abonnés d'un utilisateur. Supprime les abonnements expirés. */
export async function sendToUser(db: SupabaseClient, userId: string, payload: PushPayload): Promise<number> {
  setupVapid()
  const { data: subs, error } = await db
    .from('push_subscriptions')
    .select('id,endpoint,p256dh,auth')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)

  let sent = 0
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
        { TTL: 60 * 60 * 24 },
      )
      sent++
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode
      // 404 / 410 : abonnement expiré ou révoqué sur l'appareil
      if (status === 404 || status === 410) await db.from('push_subscriptions').delete().eq('id', s.id)
      else console.error('Échec envoi push', status, (e as Error).message)
    }
  }
  return sent
}
