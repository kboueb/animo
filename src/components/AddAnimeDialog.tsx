import { useEffect, useRef, useState } from 'react'
import { STATUS_FR, searchAnime, yearOf, type AniMedia } from '../anilist'
import { STATUSES, STATUS_LABELS, type Anime, type Status } from '../types'

interface Props {
  open: boolean
  defaultStatus: Status
  existingIds: Set<number>
  onAdd: (anime: Omit<Anime, 'id' | 'addedAt' | 'updatedAt'>) => void
  onClose: () => void
}

export function AddAnimeDialog({ open, defaultStatus, existingIds, onAdd, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>(defaultStatus)
  const [results, setResults] = useState<AniMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setStatus(defaultStatus)
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, defaultStatus])

  // Recherche avec un délai de 400 ms après la dernière frappe
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setError(null)
      return
    }
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        setResults(await searchAnime(q, ctrl.signal))
      } catch (e) {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : 'Erreur de recherche')
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    }, 400)
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [query])

  const addFromAniList = (a: AniMedia) =>
    onAdd({
      anilistId: a.id,
      malId: a.idMal ?? undefined,
      title: a.title.romaji,
      titleAlt: a.title.english && a.title.english !== a.title.romaji ? a.title.english : undefined,
      image: a.coverImage.large,
      type: a.format ?? undefined,
      episodes: a.episodes,
      year: yearOf(a),
      url: a.siteUrl,
      status,
      rating: 0,
      notes: '',
    })

  const addManual = () => {
    onAdd({ title: query.trim(), status, rating: 0, notes: '' })
    setQuery('')
  }

  return (
    <dialog ref={dialogRef} className="dialog" onClose={onClose}>
      <header className="dialog-head">
        <h2>Ajouter un anime</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
      </header>

      <div className="dialog-controls">
        <input
          ref={inputRef}
          type="search"
          placeholder="Rechercher un titre (ex. Frieren, One Piece…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="inline-field">
          Ajouter dans
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="dialog-body">
        {loading && <p className="muted">Recherche…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && query.trim().length >= 2 && results.length === 0 && !error && (
          <p className="muted">Aucun résultat.</p>
        )}

        <ul className="results">
          {results.map((a) => {
            const already = existingIds.has(a.id)
            return (
              <li key={a.id} className="result">
                <img src={a.coverImage.medium} alt="" loading="lazy" />
                <div className="result-info">
                  <strong>{a.title.romaji}</strong>
                  {a.title.english && a.title.english !== a.title.romaji && (
                    <span className="muted">{a.title.english}</span>
                  )}
                  <span className="muted small">
                    {[a.format, yearOf(a), a.episodes ? `${a.episodes} ép.` : null, STATUS_FR[a.status]]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
                <button className="btn" disabled={already} onClick={() => addFromAniList(a)}>
                  {already ? 'Déjà ajouté' : 'Ajouter'}
                </button>
              </li>
            )
          })}
        </ul>

        {query.trim().length >= 2 && (
          <button className="btn ghost manual" onClick={addManual}>
            + Ajouter « {query.trim()} » manuellement
          </button>
        )}
      </div>
    </dialog>
  )
}
