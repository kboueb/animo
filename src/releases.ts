// Logique partagée navigateur + serveur (fonction Vercel) :
//  - récupération GROUPÉE des suites sur AniList (quelques requêtes pour toute la liste),
//  - détection des sorties à signaler (suite sortie, suite annoncée).
// Aucune dépendance au navigateur : ce fichier est aussi importé par api/check-releases.ts.
import type { NewsItem } from './types'

const API = 'https://graphql.anilist.co'
const BATCH = 50
const MAX_DEPTH = 6

interface MediaNode {
  id: number
  type: string
  status: string
  siteUrl: string
  title: { romaji: string; english: string | null }
  startDate: { year: number | null; month: number | null; day: number | null }
  nextAiringEpisode: { episode: number; airingAt: number } | null
  relations?: { edges: { relationType: string; node: { id: number; type: string } }[] }
}

const FIELDS = `id type status siteUrl title { romaji english } startDate { year month day }
  nextAiringEpisode { episode airingAt } relations { edges { relationType node { id type } } }`

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function gql<T>(query: string, variables: Record<string, unknown>, tries = 4): Promise<T> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(20_000),
  })
  if (res.status === 429 && tries > 0) {
    await sleep((Number(res.headers.get('Retry-After')) || 5) * 1000 + 300)
    return gql(query, variables, tries - 1)
  }
  if (!res.ok) throw new Error(`AniList a répondu ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data as T
}

async function fetchBatch(ids: number[]): Promise<MediaNode[]> {
  const out: MediaNode[] = []
  for (let i = 0; i < ids.length; i += BATCH) {
    const data = await gql<{ Page: { media: MediaNode[] } }>(
      `query ($ids: [Int]) { Page(perPage: ${BATCH}) { media(id_in: $ids, type: ANIME) { ${FIELDS} } } }`,
      { ids: ids.slice(i, i + BATCH) },
    )
    out.push(...data.Page.media)
    if (i + BATCH < ids.length) await sleep(700)
  }
  return out
}

function formatDate(d: MediaNode['startDate']): string | undefined {
  if (!d.year) return undefined
  if (!d.month) return String(d.year)
  return new Date(d.year, d.month - 1, d.day ?? 1).toLocaleDateString('fr-FR', {
    day: d.day ? 'numeric' : undefined,
    month: 'short',
    year: 'numeric',
  })
}

const toNews = (m: MediaNode): NewsItem => ({
  id: m.id,
  title: m.title.english ?? m.title.romaji,
  status: m.status,
  date: formatDate(m.startDate),
  ...(m.nextAiringEpisode ? { nextEpisode: m.nextAiringEpisode } : {}),
  url: m.siteUrl,
})

const nextSequelId = (m: MediaNode, seen: Set<number>) =>
  m.relations?.edges.find((e) => e.relationType === 'SEQUEL' && e.node.type === 'ANIME' && !seen.has(e.node.id))?.node.id

/**
 * Pour chaque anime (id AniList), calcule la liste à jour de ses nouveautés :
 * la série elle-même si elle est en diffusion, puis la chaîne de suites.
 * `knownIds` (suites déjà connues) permet de tout récupérer dès la première requête.
 * Les anime introuvables sont absents du résultat (on garde alors l'ancien état).
 */
export async function refreshNews(baseIds: number[], knownIds: number[] = []): Promise<Map<number, NewsItem[]>> {
  const cache = new Map<number, MediaNode>()
  const tried = new Set<number>()
  let toFetch = [...new Set([...baseIds, ...knownIds])]

  for (let round = 0; round <= MAX_DEPTH && toFetch.length; round++) {
    toFetch.forEach((id) => tried.add(id))
    for (const m of await fetchBatch(toFetch)) cache.set(m.id, m)
    // Suites découvertes mais pas encore récupérées
    const missing = new Set<number>()
    for (const base of baseIds) {
      const seen = new Set([base])
      let cur = cache.get(base)
      for (let d = 0; cur && d < MAX_DEPTH; d++) {
        const next = nextSequelId(cur, seen)
        if (!next) break
        seen.add(next)
        cur = cache.get(next)
        if (!cur && !tried.has(next)) missing.add(next)
      }
    }
    toFetch = [...missing]
    if (toFetch.length) await sleep(700)
  }

  const result = new Map<number, NewsItem[]>()
  for (const base of baseIds) {
    const b = cache.get(base)
    if (!b) continue
    const items: NewsItem[] = b.status === 'RELEASING' ? [toNews(b)] : []
    const seen = new Set([base])
    let cur: MediaNode | undefined = b
    for (let d = 0; cur && d < MAX_DEPTH; d++) {
      const next = nextSequelId(cur, seen)
      if (!next) break
      seen.add(next)
      cur = cache.get(next)
      if (cur) items.push(toNews(cur))
    }
    result.set(base, items)
  }
  return result
}

export type AlertKind = 'released' | 'announced'

export interface ReleaseAlert {
  /** Unique par utilisateur : une même sortie n'est signalée qu'une fois (appli ou serveur) */
  key: string
  kind: AlertKind
  newsId: number
  title: string
  body: string
  url: string
}

const isOut = (status: string) => status === 'RELEASING' || status === 'FINISHED'

/**
 * Compare l'ancien et le nouvel état des suites d'un anime et renvoie les alertes à émettre.
 * Pas d'alerte à la toute première vérification (sinon avalanche à l'import d'une liste).
 */
export function detectReleases(animeTitle: string, prev: NewsItem[] | undefined, next: NewsItem[]): ReleaseAlert[] {
  if (!prev) return []
  const before = new Map(prev.map((i) => [i.id, i]))
  const alerts: ReleaseAlert[] = []
  for (const n of next) {
    const p = before.get(n.id)
    const nowOut = isOut(n.status)
    if (nowOut && (!p || p.status === 'NOT_YET_RELEASED')) {
      alerts.push({
        key: `released:${n.id}`,
        kind: 'released',
        newsId: n.id,
        title: `🎉 Sortie : ${n.title}`,
        body:
          n.status === 'RELEASING'
            ? `La suite de « ${animeTitle} » est en diffusion${n.nextEpisode ? ` (épisode ${n.nextEpisode.episode} bientôt)` : ''}.`
            : `La suite de « ${animeTitle} » est disponible.`,
        url: n.url,
      })
    } else if (!p && n.status === 'NOT_YET_RELEASED') {
      alerts.push({
        key: `announced:${n.id}`,
        kind: 'announced',
        newsId: n.id,
        title: `📣 Suite annoncée : ${n.title}`,
        body: `Pour « ${animeTitle} »${n.date ? `, prévue : ${n.date}` : ''}.`,
        url: n.url,
      })
    }
  }
  return alerts
}
