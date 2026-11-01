import type { Session } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase'
import type { SyncStatus } from '../useCloudSync'
import { Icon } from './Icon'

interface Props {
  open: boolean
  onClose: () => void
  session: Session | null
  status: SyncStatus
  error: string | null
  lastSync: Date | null
  count: number
  onSyncNow: () => void
}

const STATUS_TEXT: Record<SyncStatus, string> = {
  off: 'Synchronisation non configurée',
  'signed-out': 'Non connecté',
  syncing: 'Synchronisation…',
  synced: 'Synchronisé',
  pending: 'Modifications en attente d’envoi',
  offline: 'Hors ligne : la synchro reprendra au retour du réseau',
  error: 'Erreur de synchronisation',
}

export function AccountDialog({ open, onClose, session, status, error, lastSync, count, onSyncNow }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    else if (!open && d.open) d.close()
  }, [open])

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } })
    setBusy(false)
    if (error) setMessage(error.message)
    else {
      setStep('code')
      setMessage(`Code envoyé à ${email.trim()}. Pense à regarder dans les spams.`)
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMessage(null)
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' })
    setBusy(false)
    if (error) setMessage('Code invalide ou expiré. Vérifie-le ou demande un nouveau code.')
    else {
      setCode('')
      setStep('email')
    }
  }

  async function signOut() {
    if (!supabase) return
    if (!confirm('Se déconnecter ? Ta liste reste sur cet appareil, mais ne sera plus synchronisée.')) return
    await supabase.auth.signOut()
  }

  return (
    <dialog ref={ref} className="dialog account-dialog" onClose={onClose}>
      <header className="dialog-head">
        <h2>Compte et synchronisation</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Fermer">
          <Icon name="close" size={20} />
        </button>
      </header>

      <div className="dialog-body account-body">
        {session ? (
          <>
            <div className={`sync-card status-${status}`}>
              <span className="sync-icon">
                <Icon name="cloud" size={22} />
              </span>
              <div>
                <strong>{STATUS_TEXT[status]}</strong>
                <span className="muted small">
                  {lastSync ? `Dernière synchro : ${lastSync.toLocaleString('fr-FR')}` : 'Pas encore synchronisé'}
                </span>
                {error && status === 'error' && <span className="error small">{error}</span>}
              </div>
            </div>
            <p className="muted small">
              Connecté avec <strong>{session.user.email}</strong>. Tes {count} anime sont sauvegardés en ligne et
              synchronisés sur tous les appareils où tu te connectes avec cette adresse.
            </p>
            <div className="row">
              <button className="btn" onClick={onSyncNow} disabled={status === 'syncing'}>
                <Icon name="refresh" size={16} /> Synchroniser maintenant
              </button>
              <button className="btn ghost" onClick={signOut}>
                Se déconnecter
              </button>
            </div>
          </>
        ) : step === 'email' ? (
          <form onSubmit={sendCode} className="account-form">
            <p className="muted">
              Connecte-toi pour sauvegarder ta liste en ligne et la retrouver sur ton téléphone et ton ordinateur.
              Pas de mot de passe : tu reçois un code par e-mail.
            </p>
            <label className="field">
              <span>Adresse e-mail</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.fr"
              />
            </label>
            <button className="btn" disabled={busy || !email.includes('@')}>
              {busy ? 'Envoi…' : 'Recevoir un code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="account-form">
            <label className="field">
              <span>Code reçu par e-mail</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={10}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="code-input"
              />
            </label>
            <button className="btn" disabled={busy || code.length < 6}>
              {busy ? 'Vérification…' : 'Se connecter'}
            </button>
            <button type="button" className="link-btn" onClick={() => setStep('email')}>
              Changer d’adresse ou renvoyer un code
            </button>
          </form>
        )}
        {message && <p className="small account-message">{message}</p>}
      </div>
    </dialog>
  )
}
