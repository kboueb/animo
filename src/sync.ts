// Synchronisation locale ⇄ Supabase.
// Principe : l'appareil reste la source immédiate (rapide, hors ligne). À chaque synchro :
//   1. on récupère ce qui a changé sur le serveur depuis la dernière fois,
//   2. on fusionne (la modification la plus récente gagne, par anime),
//   3. on envoie ce qui a changé localement (le serveur refuse d'écraser une version plus récente).
import { supabase } from './supabase'
import { clearPending, markDeleted, markDirty, pendingDeleted, pendingDirty } from './syncState'
import type { Anime } from './types'

const LAST_PULL = 'animo.sync.lastPull'
const LAST_SYNC = 'animo.sync.lastSync'
const SYNC_USER = 'animo.sync.user'
const PAGE = 1000

interface Row {
  id: string
  data: Anime
  deleted: boolean
  modified_at: string
  updated_at: string
}

export const modifiedOf = (a: Anime) => a.modifiedAt ?? a.updatedAt

export function lastSyncDate(): Date | null {
  try {
    const v = localStorage.getItem(LAST_SYNC)
    return v ? new Date(v) : null
  } catch {
    return null
  }
}

/** À appeler quand un autre compte se connecte sur cet appareil : on repart d'une synchro complète. */
function resetIfUserChanged(userId: string, items: Anime[]) {
  if (localStorage.getItem(SYNC_USER) === userId) return
  localStorage.setItem(SYNC_USER, userId)
  localStorage.removeItem(LAST_PULL)
  // Première synchro de ce compte sur cet appareil : toute la liste locale est à envoyer
  if (items.length) markDirty(...items.map((a) => a.id))
}

async function pull(): Promise<Row[]> {
  const since = localStorage.getItem(LAST_PULL) ?? '1970-01-01T00:00:00Z'
  const rows: Row[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabase!
      .from('animes')
      .select('id,data,deleted,modified_at,updated_at')
      .gt('updated_at', since)
      .order('updated_at', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(error.message)
    rows.push(...(data as Row[]))
    if (!data || data.length < PAGE) break
    from += PAGE
  }
  return rows
}

/** Fusionne les lignes du serveur dans la liste locale. Retourne la nouvelle liste. */
export function merge(local: Anime[], rows: Row[]): Anime[] {
  const dirty = pendingDirty()
  const byId = new Map(local.map((a) => [a.id, a]))

  for (const row of rows) {
    const mine = byId.get(row.id)
    const remoteTime = new Date(row.modified_at).getTime()
    if (mine && dirty.has(row.id) && new Date(modifiedOf(mine)).getTime() >= remoteTime) continue // ma version est plus récente
    if (row.deleted) {
      byId.delete(row.id)
      continue
    }
    if (!mine || new Date(modifiedOf(mine)).getTime() < remoteTime) {
      byId.set(row.id, { ...row.data, id: row.id, modifiedAt: row.modified_at })
    }
  }

  // Doublons (même anime AniList ajouté sur deux appareils avant la synchro) : on garde la version serveur
  const serverIds = new Set(rows.filter((r) => !r.deleted).map((r) => r.id))
  const seen = new Map<number, string>()
  const duplicates: string[] = []
  for (const a of [...byId.values()].sort((x, y) => Number(serverIds.has(y.id)) - Number(serverIds.has(x.id)))) {
    if (!a.anilistId) continue
    const keep = seen.get(a.anilistId)
    if (keep && keep !== a.id) duplicates.push(a.id)
    else seen.set(a.anilistId, a.id)
  }
  duplicates.forEach((id) => byId.delete(id))
  if (duplicates.length) markDeleted(...duplicates)

  // On garde l'ordre local, les nouveaux du serveur en tête
  const localIds = new Set(local.map((a) => a.id))
  const added = [...byId.values()].filter((a) => !localIds.has(a.id))
  const kept = local.filter((a) => byId.has(a.id)).map((a) => byId.get(a.id)!)
  return [...added, ...kept]
}

async function push(items: Anime[]) {
  const dirty = pendingDirty()
  const deleted = pendingDeleted()
  if (!dirty.size && !deleted.size) return
  const byId = new Map(items.map((a) => [a.id, a]))
  const now = new Date().toISOString()
  const rows = [
    ...[...dirty]
      .filter((id) => byId.has(id))
      .map((id) => {
        const a = byId.get(id)!
        return { id, data: a, deleted: false, modified_at: modifiedOf(a) }
      }),
    ...[...deleted].map((id) => ({ id, data: {}, deleted: true, modified_at: now })),
  ]
  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await supabase!.rpc('sync_animes', { rows: rows.slice(i, i + 200) })
    if (error) throw new Error(error.message)
  }
  clearPending(dirty, deleted)
}

/**
 * Synchronise. `apply` reçoit la liste fusionnée (à poser sans la marquer comme modifiée).
 * Retourne la liste à jour.
 */
export async function syncNow(items: Anime[], apply: (next: Anime[]) => void): Promise<Anime[]> {
  if (!supabase) return items
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  if (!user) return items

  resetIfUserChanged(user.id, items)
  const rows = await pull()
  let next = items
  if (rows.length) {
    next = merge(items, rows)
    apply(next)
    localStorage.setItem(LAST_PULL, rows[rows.length - 1].updated_at)
  }
  await push(next)
  localStorage.setItem(LAST_SYNC, new Date().toISOString())
  return next
}
