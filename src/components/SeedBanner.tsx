import { useState } from 'react'
import { SEED_KEY, SEED_LIST, SEED_NAME } from '../data/seed'
import type { Anime } from '../types'
import { Icon } from './Icon'

type NewAnime = Omit<Anime, 'id' | 'addedAt' | 'updatedAt'>

function readFlag(): boolean {
  try {
    return localStorage.getItem(SEED_KEY) !== null
  } catch {
    return false
  }
}

/**
 * Propose une seule fois (par appareil) d'ajouter la liste préparée.
 * Les anime déjà présents sont ignorés, rien n'est écrasé.
 */
export function SeedBanner({ onImport }: { onImport: (list: NewAnime[]) => void }) {
  const [done, setDone] = useState(readFlag)
  if (done) return null

  const waiting = SEED_LIST.filter((a) => a.status === 'waiting').length

  const close = (value: 'imported' | 'dismissed') => {
    try {
      localStorage.setItem(SEED_KEY, value)
    } catch {
      /* stockage indisponible : la bannière reviendra au prochain chargement */
    }
    setDone(true)
  }

  return (
    <aside className="seed-banner" role="status">
      <span className="seed-icon">
        <Icon name="sparkle" size={20} />
      </span>
      <div className="seed-text">
        <strong>Ta liste « {SEED_NAME} » est prête</strong>
        <span>
          {SEED_LIST.length} anime déjà vus, dont {waiting} avec une suite sortie ou annoncée.
        </span>
      </div>
      <div className="seed-actions">
        <button
          className="btn small"
          onClick={() => {
            onImport(SEED_LIST.map((a) => ({ ...a, rating: 0, notes: '' })))
            close('imported')
          }}
        >
          Ajouter
        </button>
        <button className="btn ghost small" onClick={() => close('dismissed')}>
          Ignorer
        </button>
      </div>
    </aside>
  )
}
