import { useState } from 'react'
import { exportLibrary, isInstalled, isIOS, lastExportDate, needsBackup, snoozeReminder } from '../backup'
import type { Anime } from '../types'
import { Icon } from './Icon'

/** Bandeau de rappel : sauvegarder la liste (et installer l'app sur iPhone). */
export function BackupReminder({
  items,
  cloudActive,
  onExported,
}: {
  items: Anime[]
  /** Connecté à Supabase : la liste est déjà sauvegardée en ligne */
  cloudActive: boolean
  onExported: () => void
}) {
  const [hidden, setHidden] = useState(false)
  if (hidden || cloudActive || !needsBackup(items.length)) return null

  const last = lastExportDate()
  const days = last ? Math.floor((Date.now() - last.getTime()) / 86_400_000) : null
  const showInstallTip = isIOS() && !isInstalled()

  return (
    <aside className="backup-banner" role="status">
      <span className="backup-icon">
        <Icon name="download" size={20} />
      </span>
      <div className="seed-text">
        <strong>{last ? `Dernière sauvegarde il y a ${days} jours` : 'Ta liste n’a jamais été sauvegardée'}</strong>
        <span>
          Tes {items.length} anime sont stockés uniquement sur cet appareil. Garde une copie dans Fichiers ou iCloud Drive.
          {showInstallTip && ' Astuce : ajoute ANIMO à l’écran d’accueil, Safari protège mieux ses données.'}
        </span>
      </div>
      <div className="seed-actions">
        <button
          className="btn small"
          onClick={async () => {
            if (await exportLibrary(items)) {
              setHidden(true)
              onExported()
            }
          }}
        >
          Sauvegarder
        </button>
        <button
          className="btn ghost small"
          onClick={() => {
            snoozeReminder()
            setHidden(true)
          }}
        >
          Plus tard
        </button>
      </div>
    </aside>
  )
}
