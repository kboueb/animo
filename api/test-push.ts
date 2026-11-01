// Notification de test : envoyée à tous les appareils abonnés de l'utilisateur connecté.
import { adminClient, sendToUser } from './_lib/server.js'

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const db = adminClient()
  const { data, error } = await db.auth.getUser(token)
  if (error || !data.user) return new Response('Unauthorized', { status: 401 })

  try {
    const sent = await sendToUser(db, data.user.id, {
      title: '🍙 ANIMO',
      body: 'Les notifications fonctionnent : tu seras prévenu à chaque sortie.',
      url: '/?alerts=1',
      tag: 'animo-test',
    })
    return Response.json({ sent })
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 })
  }
}
