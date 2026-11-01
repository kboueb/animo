// Ce qui reste à envoyer au serveur (persisté pour survivre à une fermeture de l'app hors ligne).
const DIRTY = 'animo.sync.dirty'
const DELETED = 'animo.sync.deleted'

function readSet(key: string): Set<string> {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? '[]')
    return new Set(Array.isArray(v) ? v : [])
  } catch {
    return new Set()
  }
}
function writeSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    /* ignoré */
  }
}

/** Anime modifiés localement, à envoyer. */
export function markDirty(...ids: string[]) {
  const set = readSet(DIRTY)
  ids.forEach((id) => set.add(id))
  writeSet(DIRTY, set)
  // Si on le modifie, il n'est plus supprimé
  const del = readSet(DELETED)
  if (ids.some((id) => del.delete(id))) writeSet(DELETED, del)
}

/** Anime supprimés localement, à supprimer côté serveur. */
export function markDeleted(...ids: string[]) {
  const del = readSet(DELETED)
  ids.forEach((id) => del.add(id))
  writeSet(DELETED, del)
  const set = readSet(DIRTY)
  if (ids.some((id) => set.delete(id))) writeSet(DIRTY, set)
}

export const pendingDirty = () => readSet(DIRTY)
export const pendingDeleted = () => readSet(DELETED)

/** Retire de la file ce qui a bien été envoyé. */
export function clearPending(sentDirty: Iterable<string>, sentDeleted: Iterable<string>) {
  const set = readSet(DIRTY)
  for (const id of sentDirty) set.delete(id)
  writeSet(DIRTY, set)
  const del = readSet(DELETED)
  for (const id of sentDeleted) del.delete(id)
  writeSet(DELETED, del)
}

export function pendingCount() {
  return readSet(DIRTY).size + readSet(DELETED).size
}
