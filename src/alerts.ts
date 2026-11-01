// Alertes de sortie : stockées sur l'appareil, et synchronisées avec Supabase quand on est connecté.
import { useEffect, useState } from 'react'
import type { ReleaseAlert } from './releases'
import { supabase } from './supabase'

export interface AppAlert extends ReleaseAlert {
  animeId?: string
  createdAt: string
  readAt?: string
}

const KEY = 'animo.alerts'
const EVENT = 'animo-alerts'
const MAX = 100

function load(): AppAlert[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function save(list: AppAlert[]) {
  const sorted = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(sorted))
  } catch {
    /* ignoré */
  }
  window.dispatchEvent(new Event(EVENT))
}

/** Ajoute des alertes (ignore celles déjà connues). Retourne les nouvelles. */
export function addAlerts(list: (ReleaseAlert & { animeId?: string })[]): AppAlert[] {
  if (!list.length) return []
  const current = load()
  const keys = new Set(current.map((a) => a.key))
  const now = new Date().toISOString()
  const fresh = list.filter((a) => !keys.has(a.key)).map((a) => ({ ...a, createdAt: now }))
  if (fresh.length) save([...fresh, ...current])
  return fresh
}

export function markAllRead() {
  const now = new Date().toISOString()
  save(load().map((a) => (a.readAt ? a : { ...a, readAt: now })))
}

export function clearAlerts() {
  save([])
}

/** Liste des alertes, à jour en direct (même onglet et autres onglets) */
export function useAlerts() {
  const [alerts, setAlerts] = useState<AppAlert[]>(load)
  useEffect(() => {
    const refresh = () => setAlerts(load())
    const onStorage = (e: StorageEvent) => e.key === KEY && refresh()
    window.addEventListener(EVENT, refresh)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return alerts
}

interface AlertRow {
  key: string
  kind: AppAlert['kind']
  anime_id: string | null
  title: string
  body: string
  url: string
  created_at: string
  read_at: string | null
}

/**
 * Synchro des alertes avec Supabase : récupère celles du serveur (notifications push, autres appareils),
 * fusionne (« lue » si lue quelque part), puis renvoie l'état local.
 * Silencieux si la table n'existe pas encore (schéma des alertes pas encore installé).
 */
export async function syncAlerts(userId: string) {
  if (!supabase) return
  const { data, error } = await supabase
    .from('alerts')
    .select('key,kind,anime_id,title,body,url,created_at,read_at')
    .order('created_at', { ascending: false })
    .limit(MAX)
  if (error) {
    console.warn('Alertes non synchronisées :', error.message)
    return
  }

  const local = new Map(load().map((a) => [a.key, a]))
  for (const r of data as AlertRow[]) {
    const mine = local.get(r.key)
    local.set(r.key, {
      key: r.key,
      kind: r.kind,
      newsId: Number(r.key.split(':')[1]) || 0,
      title: r.title,
      body: r.body,
      url: r.url,
      animeId: r.anime_id ?? mine?.animeId,
      createdAt: mine?.createdAt ?? r.created_at,
      readAt: mine?.readAt ?? r.read_at ?? undefined,
    })
  }
  const merged = [...local.values()]
  save(merged)

  const rows = merged.map((a) => ({
    user_id: userId,
    key: a.key,
    kind: a.kind,
    anime_id: a.animeId ?? null,
    title: a.title,
    body: a.body,
    url: a.url,
    created_at: a.createdAt,
    read_at: a.readAt ?? null,
  }))
  if (rows.length) {
    const { error: upErr } = await supabase.from('alerts').upsert(rows, { onConflict: 'user_id,key' })
    if (upErr) console.warn('Alertes non envoyées :', upErr.message)
  }
}
