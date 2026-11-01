// Client minimal pour l'API GraphQL d'AniList (gratuite, sans clé).
// Limite : ~30 à 90 requêtes/min, d'où les pauses et les nouvelles tentatives sur 429.

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


export const STATUS_FR: Record<string, string> = {
  FINISHED: 'Terminé',
  RELEASING: 'En diffusion',
  NOT_YET_RELEASED: 'À venir',
  CANCELLED: 'Annulé',
  HIATUS: 'En pause',
}
