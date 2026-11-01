import { useCallback, useEffect, useRef, useState } from 'react'
import { markChanged, requestPersistentStorage } from './backup'
import { markDeleted, markDirty } from './syncState'
import type { Anime } from './types'

const KEY = 'animo.library.v1'
/** Version précédente de la liste, gardée à chaque enregistrement (secours si la principale est illisible). */
const BACKUP_KEY = 'animo.library.backup'

function parse(raw: string | null): Anime[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return isAnimeList(parsed) ? parsed : null
  } catch {
    return null
  }
}

function load(): Anime[] {
  try {
    return parse(localStorage.getItem(KEY)) ?? parse(localStorage.getItem(BACKUP_KEY)) ?? []
  } catch {
    return []
  }
}

function save(items: Anime[]) {
  try {
    const previous = localStorage.getItem(KEY)
    const next = JSON.stringify(items)
    if (previous === next) return false
    // On ne garde en secours qu'une version valide et non vide
    if (previous && parse(previous)?.length) localStorage.setItem(BACKUP_KEY, previous)
    localStorage.setItem(KEY, next)
    return true
  } catch {
    return false
  }
}

export function isAnimeList(value: unknown): value is Anime[] {
  return (
    Array.isArray(value) &&
    value.every(
      (a) =>
        a && typeof a.id === 'string' && typeof a.title === 'string' && ['watched', 'waiting', 'planned'].includes(a.status),
    )
  )
}

type NewAnime = Omit<Anime, 'id' | 'addedAt' | 'updatedAt'>

export function useLibrary() {
  const [items, setItems] = useState<Anime[]>(load)
  // Miroir synchrone de la liste : permet de calculer les changements (et les ids à synchroniser) hors du setState
  const itemsRef = useRef(items)

  const commit = useCallback((next: Anime[]) => {
    itemsRef.current = next
    setItems(next)
  }, [])

  useEffect(() => {
    if (save(items)) markChanged()
  }, [items])

  // Demande au navigateur de ne pas effacer nos données (stockage « persistant »)
  useEffect(() => {
    void requestPersistentStorage()
  }, [])

  // Garde plusieurs onglets ouverts synchronisés
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) commit(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [commit])

  const add = useCallback(
    (anime: NewAnime) => {
      const prev = itemsRef.current
      if (anime.anilistId && prev.some((a) => a.anilistId === anime.anilistId)) return
      const now = new Date().toISOString()
      const created: Anime = { ...anime, id: crypto.randomUUID(), addedAt: now, updatedAt: now, modifiedAt: now }
      commit([created, ...prev])
      markDirty(created.id)
    },
    [commit],
  )

  /** Ajoute plusieurs anime d'un coup, en ignorant ceux déjà présents (même id AniList ou même titre). */
  const addMany = useCallback(
    (list: NewAnime[]) => {
      const prev = itemsRef.current
      const ids = new Set(prev.flatMap((a) => (a.anilistId ? [a.anilistId] : [])))
      const titles = new Set(prev.map((a) => a.title.toLowerCase()))
      const now = Date.now()
      const fresh: Anime[] = list
        .filter((a) => (a.anilistId ? !ids.has(a.anilistId) : !titles.has(a.title.toLowerCase())))
        .map((a, i) => {
          // Décalage d'1 ms pour garder l'ordre de la liste d'origine dans le tri « Récents »
          const at = new Date(now - i).toISOString()
          return { ...a, id: crypto.randomUUID(), addedAt: at, updatedAt: at, modifiedAt: new Date(now).toISOString() }
        })
      if (!fresh.length) return
      commit([...fresh, ...prev])
      markDirty(...fresh.map((a) => a.id))
    },
    [commit],
  )

  /** `touch: false` pour une mise à jour technique (nouveautés) qui ne doit pas remonter l'anime dans « Récents ». */
  const update = useCallback(
    (id: string, patch: Partial<Anime>, touch = true) => {
      const now = new Date().toISOString()
      commit(
        itemsRef.current.map((a) =>
          a.id === id ? { ...a, ...patch, ...(touch ? { updatedAt: now } : {}), modifiedAt: now } : a,
        ),
      )
      markDirty(id)
    },
    [commit],
  )

  const remove = useCallback(
    (id: string) => {
      commit(itemsRef.current.filter((a) => a.id !== id))
      markDeleted(id)
    },
    [commit],
  )

  /** Pose la liste fusionnée venant du serveur, sans la marquer comme modifiée localement. */
  const applySync = useCallback((next: Anime[]) => commit(next), [commit])

  return { items, itemsRef, add, addMany, update, remove, applySync }
}
