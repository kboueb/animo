import { useState } from 'react'
import { STATUS_FR } from '../anilist'
import { STATUSES, type Anime, type NewsItem, type Status } from '../types'
import { Icon, type IconName } from './Icon'

interface Props {
  anime: Anime
  watchedIds: Set<number>
  checking: boolean
  onUpdate: (patch: Partial<Anime>) => void
  onRemove: () => void
  onCheckNews: () => void
}

export const STATUS_ICON: Record<Status, IconName> = { watched: 'check', waiting: 'clock', planned: 'bookmark' }
const STATUS_SHORT: Record<Status, string> = { watched: 'Vu', waiting: 'En attente', planned: 'À voir' }

/** Une suite est "nouvelle" si elle n'a pas encore été vue. */
export function isSeen(anime: Anime, newsId: number, watchedIds: Set<number>) {
  return watchedIds.has(newsId) || !!anime.seenNews?.includes(newsId)
}

const WATCHABLE = new Set(['FINISHED', 'RELEASING'])

/** Il y a quelque chose à regarder : une suite sortie (ou en diffusion) pas encore vue. */
export function hasFreshNews(anime: Anime, watchedIds: Set<number>) {
  return !!anime.news?.items.some((n) => WATCHABLE.has(n.status) && !isSeen(anime, n.id, watchedIds))
}

/** Une suite est seulement annoncée (rien à regarder pour l'instant). */
function hasAnnounced(anime: Anime) {
  return !!anime.news?.items.some((n) => n.status === 'NOT_YET_RELEASED')
}

function newsDetail(n: NewsItem): string {
  if (n.nextEpisode) {
    const when = new Date(n.nextEpisode.airingAt * 1000).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    return `Ép. ${n.nextEpisode.episode} le ${when}`
  }
  return n.date ? (n.status === 'NOT_YET_RELEASED' ? `Prévu : ${n.date}` : `Depuis ${n.date}`) : ''
}

export function AnimeCard({ anime, watchedIds, checking, onUpdate, onRemove, onCheckNews }: Props) {
  const [editingNotes, setEditingNotes] = useState(false)
  const [draft, setDraft] = useState(anime.notes)
  const fresh = hasFreshNews(anime, watchedIds)
  const displayTitle = anime.titleAlt ?? anime.title

  const meta = [anime.type, anime.year, anime.episodes ? `${anime.episodes} ép.` : null].filter(Boolean).join(' · ')

  return (
    <article className={`card is-${anime.status} ${fresh ? 'has-news' : ''}`}>
      <div className="poster">
        {anime.image ? (
          <img src={anime.image} alt="" loading="lazy" />
        ) : (
          <span className="poster-fallback">{anime.title.slice(0, 1)}</span>
        )}
        {fresh ? (
          <span className="badge-new">
            <Icon name="sparkle" size={14} /> Nouveauté
          </span>
        ) : (
          anime.status === 'waiting' &&
          hasAnnounced(anime) && (
            <span className="badge-new announced">
              <Icon name="clock" size={13} /> Annoncé
            </span>
          )
        )}
        <button
          className="poster-delete"
          aria-label={`Supprimer ${anime.title}`}
          title="Supprimer"
          onClick={() => confirm(`Supprimer « ${anime.title} » ?`) && onRemove()}
        >
          <Icon name="trash" size={16} />
        </button>
        {meta && <span className="poster-meta">{meta}</span>}
      </div>

      <div className="card-body">
        {/* En-tête : titre, infos, note, commentaire (à côté de l'affiche en vue liste) */}
        <div className="card-head">
          {/* Titre anglais en premier quand il existe (plus familier), romaji en sous-titre */}
          <h3 title={displayTitle}>
            {anime.url ? (
              <a href={anime.url} target="_blank" rel="noreferrer">
                {displayTitle}
              </a>
            ) : (
              displayTitle
            )}
          </h3>
          {anime.titleAlt && <p className="alt-title">{anime.title}</p>}
          {/* Infos affichées sous le titre en vue liste (en vue grille, elles sont sur l'affiche) */}
          {meta && <p className="list-meta">{meta}</p>}

          <div className="stars" role="radiogroup" aria-label="Note">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                role="radio"
                aria-checked={anime.rating === n}
                aria-label={`${n} sur 5`}
                className={n <= anime.rating ? 'on' : ''}
                onClick={() => onUpdate({ rating: anime.rating === n ? 0 : n })}
              >
                ★
              </button>
            ))}
          </div>

          {editingNotes ? (
            <div className="notes-edit">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                autoFocus
                aria-label="Note personnelle"
              />
              <div className="row">
                <button
                  className="btn small"
                  onClick={() => {
                    onUpdate({ notes: draft.trim() })
                    setEditingNotes(false)
                  }}
                >
                  Enregistrer
                </button>
                <button
                  className="btn ghost small"
                  onClick={() => {
                    setDraft(anime.notes)
                    setEditingNotes(false)
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button className={`notes ${anime.notes ? '' : 'empty-note'}`} onClick={() => setEditingNotes(true)}>
              {anime.notes || '+ Ajouter une note'}
            </button>
          )}
        </div>

        {anime.status === 'waiting' && (
          <div className="news">
            {anime.news?.error && <p className="error small">{anime.news.error}</p>}
            {anime.news && !anime.news.error && anime.news.items.length === 0 && (
              <p className="muted small">Rien de neuf pour l’instant.</p>
            )}
            {anime.news?.items.map((n) => {
              const live = n.status === 'RELEASING' || n.status === 'NOT_YET_RELEASED'
              const seen = isSeen(anime, n.id, watchedIds)
              const canMarkSeen = n.status === 'FINISHED' || n.status === 'RELEASING'
              const toggleSeen = () => {
                const list = anime.seenNews ?? []
                onUpdate({ seenNews: seen ? list.filter((x) => x !== n.id) : [...list, n.id] })
              }
              return (
                <div key={n.id} className={`news-item ${seen ? 'seen' : ''}`}>
                  <a href={n.url} target="_blank" rel="noreferrer" className="news-title" title={n.title}>
                    {!seen && WATCHABLE.has(n.status) && <span className="dot-new" title="Pas encore vu" />}
                    {n.title}
                  </a>
                  <span className="news-meta">
                    <span className={`pill ${live ? 'live' : ''}`}>{STATUS_FR[n.status] ?? n.status}</span>
                    <span className="clamp">{newsDetail(n)}</span>
                    {canMarkSeen && !watchedIds.has(n.id) && (
                      <button
                        className={`seen-btn ${seen ? 'on' : ''}`}
                        aria-pressed={seen}
                        title={seen ? 'Marquer comme non vu' : 'Marquer comme vu'}
                        onClick={toggleSeen}
                      >
                        <Icon name="check" size={13} />
                        Vu
                      </button>
                    )}
                  </span>
                </div>
              )
            })}
            {anime.anilistId ? (
              <button className="link-btn" disabled={checking} onClick={onCheckNews}>
                <Icon name="refresh" size={14} />
                {checking ? 'Vérification…' : anime.news ? 'Revérifier' : 'Vérifier les nouveautés'}
                {anime.news && !checking && (
                  <span className="muted">· {new Date(anime.news.checkedAt).toLocaleDateString('fr-FR')}</span>
                )}
              </button>
            ) : (
              <p className="muted tiny">Ajouté manuellement : pas de vérification automatique.</p>
            )}
          </div>
        )}

        <div className="status-switch" role="group" aria-label="Déplacer vers">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`status-${s} ${anime.status === s ? 'active' : ''}`}
              aria-pressed={anime.status === s}
              title={STATUS_SHORT[s]}
              onClick={() => onUpdate({ status: s })}
            >
              <Icon name={STATUS_ICON[s]} size={15} />
              <span>{STATUS_SHORT[s]}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}
