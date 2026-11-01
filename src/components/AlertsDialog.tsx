import { useEffect, useRef, useState } from 'react'
import { clearAlerts, markAllRead, type AppAlert } from '../alerts'
import { disablePush, enablePush, pushState, sendTestPush, type PushState } from '../push'
import { cloudEnabled } from '../supabase'
import { Icon } from './Icon'

interface Props {
  open: boolean
  onClose: () => void
  alerts: AppAlert[]
  loggedIn: boolean
  onOpenAccount: () => void
  onShowAnime: (animeId: string) => void
  checking: boolean
  onCheckNow: () => void
}

function ago(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'à l’instant'
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  return days < 7 ? `il y a ${days} j` : new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const PUSH_TEXT: Record<PushState, string> = {
  on: 'Activées sur cet appareil : tu seras prévenu chaque jour s’il y a une sortie, même app fermée.',
  off: 'Reçois une notification quand une suite attendue sort, même quand l’app est fermée.',
  denied: 'Bloquées par le navigateur : autorise les notifications pour ANIMO dans les réglages.',
  'needs-install': 'Sur iPhone / iPad, ajoute d’abord ANIMO à l’écran d’accueil (Partager → Sur l’écran d’accueil), puis ouvre-le depuis l’icône.',
  unsupported: 'Non disponibles sur ce navigateur.',
  'not-configured': 'Pas encore configurées sur le serveur (clés VAPID à ajouter dans Vercel).',
}

export function AlertsDialog(props: Props) {
  const { open, onClose, alerts, loggedIn, onOpenAccount, onShowAnime, checking, onCheckNow } = props
  const ref = useRef<HTMLDialogElement>(null)
  const [push, setPush] = useState<PushState>('unsupported')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      setMessage(null)
      void pushState().then(setPush)
    } else if (!open && d.open) d.close()
  }, [open])

  const close = () => {
    markAllRead()
    onClose()
  }

  async function togglePush() {
    setBusy(true)
    setMessage(null)
    try {
      if (push === 'on') {
        await disablePush()
        setMessage({ text: 'Notifications désactivées sur cet appareil.' })
      } else {
        await enablePush()
        setMessage({ text: 'Notifications activées. Tu peux envoyer un test pour vérifier.' })
      }
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : String(e), error: true })
    } finally {
      setPush(await pushState())
      setBusy(false)
    }
  }

  async function test() {
    setBusy(true)
    setMessage(null)
    try {
      const sent = await sendTestPush()
      setMessage(
        sent
          ? { text: `Notification de test envoyée à ${sent} appareil${sent > 1 ? 's' : ''}.` }
          : { text: 'Aucun appareil abonné : active d’abord les notifications.', error: true },
      )
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : String(e), error: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog ref={ref} className="dialog alerts-dialog" onClose={close}>
      <header className="dialog-head">
        <h2>Alertes de sortie</h2>
        <button className="icon-btn" onClick={close} aria-label="Fermer">
          <Icon name="close" size={20} />
        </button>
      </header>

      <div className="dialog-body alerts-body">
        <div className="alerts-actions">
          <button className="btn ghost small" onClick={onCheckNow} disabled={checking}>
            <Icon name="refresh" size={15} /> {checking ? 'Vérification…' : 'Vérifier maintenant'}
          </button>
          {alerts.length > 0 && (
            <button className="link-btn" onClick={() => confirm('Effacer toutes les alertes de cet appareil ?') && clearAlerts()}>
              Tout effacer
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="alerts-empty">
            <span className="empty-icon tab-waiting">
              <Icon name="bell" size={26} />
            </span>
            <p>Aucune alerte pour l’instant.</p>
            <p className="muted small">
              ANIMO vérifie chaque jour tes anime « En attente » et te prévient quand une suite sort ou est annoncée.
            </p>
          </div>
        ) : (
          <ul className="alerts-list">
            {alerts.map((a) => (
              <li key={a.key} className={`alert-item kind-${a.kind} ${a.readAt ? '' : 'unread'}`}>
                <button className="alert-main" onClick={() => a.animeId && onShowAnime(a.animeId)} disabled={!a.animeId}>
                  <strong>{a.title}</strong>
                  <span className="muted small">{a.body}</span>
                  <span className="muted tiny">{ago(a.createdAt)}</span>
                </button>
                <a className="icon-btn" href={a.url} target="_blank" rel="noreferrer" title="Voir sur AniList" aria-label="Voir sur AniList">
                  <Icon name="search" size={16} />
                </a>
              </li>
            ))}
          </ul>
        )}

        <section className="push-card">
          <div>
            <strong>Notifications sur cet appareil</strong>
            <p className="muted small">{PUSH_TEXT[push]}</p>
          </div>
          {!cloudEnabled || (push !== 'on' && push !== 'off') ? null : !loggedIn ? (
            <button className="btn small" onClick={onOpenAccount}>
              Se connecter pour activer
            </button>
          ) : (
            <div className="row">
              <button className={`btn small ${push === 'on' ? 'ghost' : ''}`} onClick={togglePush} disabled={busy}>
                {push === 'on' ? 'Désactiver' : 'Activer les notifications'}
              </button>
              {push === 'on' && (
                <button className="btn ghost small" onClick={test} disabled={busy}>
                  Envoyer un test
                </button>
              )}
            </div>
          )}
          {message && <p className={`small ${message.error ? 'error' : 'muted'}`}>{message.text}</p>}
        </section>
      </div>
    </dialog>
  )
}
