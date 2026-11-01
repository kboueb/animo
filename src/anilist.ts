// Client minimal pour l'API GraphQL d'AniList (gratuite, sans clé).
// Limite : ~30 à 90 requêtes/min, d'où les pauses et les nouvelles tentatives sur 429.
import type { NewsItem } from './types'

const API = 'https://graphql.anilist.co'
const TIMEOUT_MS = 15000

export type AniStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS'

export interface AniMedia {
  id: number
  idMal: number | null
  siteUrl: string
  title: { romaji: string; english: string | null }
  coverImage: { large: string; medium: string }
  format: string | null
  episodes: number | null
  seasonYear: number | null
  startDate: { year: number | null; month: number | null; day: number | null }
  status: AniStatus
  nextAiringEpisode: { episode: number; airingAt: number } | null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function gql<T>(query: string, variables: Record<string, unknown>, signal?: AbortSignal, retries = 2): Promise<T> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    })
  } catch (e) {
    if (timeout.aborted) throw new Error('AniList ne répond pas, réessaie plus tard.')
    throw e
  }
  if (res.status === 429 && retries > 0) {
    await sleep(Number(res.headers.get('Retry-After') ?? 2) * 1000)
    return gql(query, variables, signal, retries - 1)
  }
  if (!res.ok) throw new Error(`AniList a répondu ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data as T
}

const MEDIA_FIELDS = `
  id idMal siteUrl format episodes seasonYear status
  title { romaji english }
  coverImage { large medium }
  startDate { year month day }
  nextAiringEpisode { episode airingAt }
`

export async function searchAnime(search: string, signal?: AbortSignal): Promise<AniMedia[]> {
  const query = `query ($search: String) {
    Page(perPage: 12) {
      media(search: $search, type: ANIME, isAdult: false, sort: [SEARCH_MATCH, POPULARITY_DESC]) { ${MEDIA_FIELDS} }
    }
  }`
  const data = await gql<{ Page: { media: AniMedia[] } }>(query, { search }, signal)
  return data.Page.media
}

export const yearOf = (m: AniMedia) => m.seasonYear ?? m.startDate.year

function formatDate(d: AniMedia['startDate']): string | undefined {
  if (!d.year) return undefined
  if (!d.month) return String(d.year)
  return new Date(d.year, d.month - 1, d.day ?? 1).toLocaleDateString('fr-FR', {
    day: d.day ? 'numeric' : undefined,
    month: 'short',
    year: 'numeric',
  })
}

const toNews = (m: AniMedia): NewsItem => ({
  id: m.id,
  title: m.title.english ?? m.title.romaji,
  status: m.status,
  date: formatDate(m.startDate),
  nextEpisode: m.nextAiringEpisode ?? undefined,
  url: m.siteUrl,
})

interface MediaWithRelations extends AniMedia {
  relations: { edges: { relationType: string; node: AniMedia & { type: string } }[] }
}

/**
 * Cherche ce qu'il y a de neuf pour un anime : la série elle-même si elle est
 * encore en diffusion, et toutes ses suites (chaîne de "SEQUEL" suivie sur 6 niveaux).
 */
export async function checkNews(anilistId: number): Promise<NewsItem[]> {
  const query = `query ($id: Int) {
    Media(id: $id, type: ANIME) {
      ${MEDIA_FIELDS}
      relations { edges { relationType node { type ${MEDIA_FIELDS} } } }
    }
  }`
  const items: NewsItem[] = []
  const seen = new Set<number>([anilistId])
  let current = anilistId
  for (let depth = 0; depth < 6; depth++) {
    const { Media } = await gql<{ Media: MediaWithRelations }>(query, { id: current })
    if (depth > 0 || Media.status === 'RELEASING') items.push(toNews(Media))
    const next = Media.relations.edges.find(
      (e) => e.relationType === 'SEQUEL' && e.node.type === 'ANIME' && !seen.has(e.node.id),
    )?.node
    if (!next) break
    seen.add(next.id)
    current = next.id
    await sleep(700)
  }
  return items
}

export const STATUS_FR: Record<string, string> = {
  FINISHED: 'Terminé',
  RELEASING: 'En diffusion',
  NOT_YET_RELEASED: 'À venir',
  CANCELLED: 'Annulé',
  HIATUS: 'En pause',
}
