export type Status = 'watched' | 'waiting' | 'planned'

export const STATUSES: Status[] = ['watched', 'waiting', 'planned']

export const STATUS_LABELS: Record<Status, string> = {
  watched: 'Déjà vus',
  waiting: 'En attente',
  planned: 'À suivre',
}

export const STATUS_HINTS: Record<Status, string> = {
  watched: 'Les anime terminés',
  waiting: 'Vus, en attente d’une suite ou de nouveaux épisodes',
  planned: 'Les anime pas encore commencés',
}

/** Une suite, ou la série elle-même, trouvée lors d’une vérification des nouveautés. */
export interface NewsItem {
  /** Identifiant AniList */
  id: number
  title: string
  /** Statut AniList : FINISHED | RELEASING | NOT_YET_RELEASED | CANCELLED | HIATUS */
  status: string
  /** Date de début lisible, ex. "4 octobre 2026" */
  date?: string
  /** airingAt = timestamp Unix (secondes) */
  nextEpisode?: { episode: number; airingAt: number }
  url: string
}

export interface NewsCheck {
  checkedAt: string
  items: NewsItem[]
  error?: string
}

export interface Anime {
  id: string
  anilistId?: number
  malId?: number
  title: string
  titleAlt?: string
  image?: string
  type?: string
  episodes?: number | null
  year?: number | null
  url?: string
  status: Status
  /** 0 = pas de note, 1..5 */
  rating: number
  notes: string
  addedAt: string
  /** Dernière action « visible » (sert au tri « Récents ») */
  updatedAt: string
  /** Dernière modification de quelque nature que ce soit (sert à la synchro : la plus récente gagne) */
  modifiedAt?: string
  news?: NewsCheck
  /** Ids AniList des suites déjà vues (elles ne comptent plus comme nouveautés) */
  seenNews?: number[]
}
