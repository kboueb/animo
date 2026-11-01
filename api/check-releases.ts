// Tâche quotidienne (Vercel Cron, voir vercel.json) : vérifie les anime « En attente » de chaque utilisateur,
// enregistre les nouveautés, crée les alertes et envoie les notifications push.
import { detectReleases, refreshNews } from '../src/releases.js'
import type { Anime, NewsItem } from '../src/types.js'
import { adminClient, sendToUser } from './_lib/server.js'

interface Row {
  id: string
  user_id: string
  data: Anime
}

export async function GET(request: Request) {
  // Vercel Cron envoie « Authorization: Bearer <CRON_SECRET> » : on refuse tout autre appel
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const db = adminClient()
  const { data, error } = await db
    .from('animes')
    .select('id,user_id,data')
    .eq('deleted', false)
    .eq('data->>status', 'waiting')
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const rows = ((data ?? []) as Row[]).filter((r) => r.data?.anilistId)
  const baseIds = [...new Set(rows.map((r) => r.data.anilistId!))]
  const knownIds = [...new Set(rows.flatMap((r) => r.data.news?.items.map((i) => i.id) ?? []))]
  const fresh = await refreshNews(baseIds, knownIds)

  const now = new Date().toISOString()
  const byUser = new Map<string, { title: string; body: string }[]>()
  let updated = 0

  for (const row of rows) {
    const next = fresh.get(row.data.anilistId!)
    if (!next) continue
    const prev = row.data.news?.items
    const name = row.data.titleAlt ?? row.data.title
    const alerts = detectReleases(name, prev, next)

    // Mise à jour des nouveautés uniquement si quelque chose a changé (statut, nouvelle suite, prochain épisode)
    const sig = (items: NewsItem[] | undefined) =>
      JSON.stringify((items ?? []).map((i) => [i.id, i.status, i.nextEpisode?.episode ?? null]))
    if (sig(prev) !== sig(next)) {
      const newData: Anime = { ...row.data, news: { checkedAt: now, items: next }, modifiedAt: now }
      const { error: upErr } = await db
        .from('animes')
        .update({ data: newData, modified_at: now, updated_at: now })
        .eq('id', row.id)
      if (!upErr) updated++
    }

    if (!alerts.length) continue
    // Une alerte déjà connue (même clé) n'est pas recréée : seules les nouvelles déclenchent une notification
    const { data: inserted, error: insErr } = await db
      .from('alerts')
      .upsert(
        alerts.map((a) => ({
          user_id: row.user_id,
          key: a.key,
          kind: a.kind,
          anime_id: row.id,
          title: a.title,
          body: a.body,
          url: a.url,
        })),
        { onConflict: 'user_id,key', ignoreDuplicates: true },
      )
      .select('title,body')
    if (insErr) {
      console.error('Alertes non enregistrées', insErr.message)
      continue
    }
    if (inserted?.length) byUser.set(row.user_id, [...(byUser.get(row.user_id) ?? []), ...inserted])
  }

  let pushed = 0
  for (const [userId, list] of byUser) {
    const payload =
      list.length === 1
        ? { title: list[0].title, body: list[0].body, url: '/?alerts=1', tag: 'animo-release' }
        : {
            title: `🎉 ${list.length} nouveautés dans ta liste`,
            body: list.map((a) => a.title.replace(/^\S+\s/, '')).slice(0, 4).join(' · '),
            url: '/?alerts=1',
            tag: 'animo-release',
          }
    pushed += await sendToUser(db, userId, payload).catch((e) => {
      console.error('Push', (e as Error).message)
      return 0
    })
  }

  return Response.json({ checked: rows.length, updated, alerts: [...byUser.values()].flat().length, pushed })
}
