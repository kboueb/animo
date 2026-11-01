// Protection des données locales : stockage persistant, export / partage, suivi des sauvegardes.
import type { Anime } from './types'

const LAST_EXPORT = 'animo.lastExport'
const LAST_CHANGE = 'animo.lastChange'
const SNOOZE = 'animo.backupSnooze'
const DAY = 24 * 60 * 60 * 1000
export const REMIND_AFTER_DAYS = 14

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* stockage plein ou bloqué : on ignore */
  }
}

/** Demande au navigateur de ne pas effacer les données d'ANIMO pour libérer de la place. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

/** ANIMO est ouvert depuis l'écran d'accueil (PWA installée). */
export function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function markChanged() {
  write(LAST_CHANGE, new Date().toISOString())
}

export function lastExportDate(): Date | null {
  const v = read(LAST_EXPORT)
  return v ? new Date(v) : null
}

/** Faut-il rappeler de sauvegarder ? (jamais exporté, ou export ancien avec des changements depuis) */
export function needsBackup(count: number): boolean {
  if (count === 0) return false
  const snooze = read(SNOOZE)
  if (snooze && new Date(snooze).getTime() > Date.now()) return false
  const last = lastExportDate()
  if (!last) return true
  const changed = read(LAST_CHANGE)
  const changedSince = changed ? new Date(changed).getTime() > last.getTime() : false
  return changedSince && Date.now() - last.getTime() > REMIND_AFTER_DAYS * DAY
}

export function snoozeReminder(days = 3) {
  write(SNOOZE, new Date(Date.now() + days * DAY).toISOString())
}

/**
 * Exporte la liste en JSON. Sur mobile, ouvre la feuille de partage
 * (« Enregistrer dans Fichiers », iCloud Drive, Google Drive…), sinon télécharge le fichier.
 * Retourne false si l'utilisateur a annulé.
 */
export async function exportLibrary(items: Anime[]): Promise<boolean> {
  const name = `animo-${new Date().toISOString().slice(0, 10)}.json`
  const json = JSON.stringify(items, null, 2)
  const file = new File([json], name, { type: 'application/json' })
  const touch = window.matchMedia('(pointer: coarse)').matches

  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Sauvegarde ANIMO' })
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return false
      download(file)
    }
  } else {
    download(file)
  }
  write(LAST_EXPORT, new Date().toISOString())
  return true
}

function download(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
