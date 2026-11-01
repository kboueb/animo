import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { cloudEnabled, supabase } from './supabase'
import { lastSyncDate, syncNow } from './sync'
import { pendingCount } from './syncState'
import type { Anime } from './types'

export type SyncStatus = 'off' | 'signed-out' | 'syncing' | 'synced' | 'pending' | 'offline' | 'error'

/**
 * Déclenche la synchro : à la connexion, après chaque modification (avec un petit délai),
 * au retour sur l'app, au retour du réseau, et toutes les 2 minutes quand l'app est ouverte.
 */
export function useCloudSync(items: Anime[], itemsRef: RefObject<Anime[]>, applySync: (next: Anime[]) => void) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<SyncStatus>(cloudEnabled ? 'signed-out' : 'off')
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(lastSyncDate)
  // Arrivée depuis le lien « mot de passe oublié »
  const [recovering, setRecovering] = useState(false)
  const sessionRef = useRef<Session | null>(null)
  const running = useRef(false)
  const again = useRef(false)

  const run = useCallback(async () => {
    if (!supabase || !sessionRef.current) return
    if (!navigator.onLine) {
      setStatus('offline')
      return
    }
    if (running.current) {
      again.current = true
      return
    }
    running.current = true
    setStatus('syncing')
    try {
      await syncNow(itemsRef.current, applySync)
      setLastSync(lastSyncDate())
      setError(null)
      setStatus(pendingCount() ? 'pending' : 'synced')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de synchronisation')
      setStatus(navigator.onLine ? 'error' : 'offline')
    } finally {
      running.current = false
      if (again.current) {
        again.current = false
        void run()
      }
    }
  }, [itemsRef, applySync])

  // Session : récupérée au démarrage puis suivie
  useEffect(() => {
    if (!supabase) return
    const onSession = (s: Session | null) => {
      sessionRef.current = s
      setSession(s)
      if (s) void run()
      else setStatus('signed-out')
    }
    void supabase.auth.getSession().then(({ data }) => onSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      // Évite une synchro à chaque rafraîchissement de jeton
      if (s?.user.id !== sessionRef.current?.user.id) onSession(s)
      else sessionRef.current = s
    })
    return () => data.subscription.unsubscribe()
  }, [run])

  // Après une modification locale : synchro 1,5 s plus tard (regroupe les clics rapides)
  useEffect(() => {
    if (!sessionRef.current || !pendingCount()) return
    setStatus((s) => (s === 'syncing' ? s : 'pending'))
    const t = setTimeout(() => void run(), 1500)
    return () => clearTimeout(t)
  }, [items, run])

  // Retour sur l'app, retour du réseau, et toutes les 2 minutes
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && void run()
    const onOnline = () => void run()
    const onOffline = () => sessionRef.current && setStatus('offline')
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    const timer = setInterval(() => document.visibilityState === 'visible' && void run(), 120_000)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      clearInterval(timer)
    }
  }, [run])

  return { session, status, error, lastSync, syncNow: run, recovering, clearRecovery: () => setRecovering(false) }
}
