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
  /** Arrivée depuis le lien « mot de passe oublié » : on demande le nouveau mot de passe */
  recovering: boolean
  onRecovered: () => void
}

type Mode = 'signin' | 'signup' | 'forgot'

const STATUS_TEXT: Record<SyncStatus, string> = {
  off: 'Synchronisation non configurée',
  'signed-out': 'Non connecté',
  syncing: 'Synchronisation…',
  synced: 'Synchronisé',
  pending: 'Modifications en attente d’envoi',
  offline: 'Hors ligne : la synchro reprendra au retour du réseau',
  error: 'Erreur de synchronisation',
}

/** Messages Supabase les plus courants, en français */
function frError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.'
  if (m.includes('email not confirmed')) return 'Adresse pas encore confirmée : clique sur le lien reçu par e-mail, puis reconnecte-toi.'
  if (m.includes('already registered') || m.includes('already been registered')) return 'Un compte existe déjà avec cette adresse : connecte-toi.'
  if (m.includes('password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (m.includes('rate limit') || m.includes('security purposes')) return 'Trop de tentatives, réessaie dans une minute.'
  if (m.includes('unable to validate email') || m.includes('invalid format')) return 'Adresse e-mail invalide.'
  return message
}

export function AccountDialog(props: Props) {
  const { open, onClose, session, status, error, lastSync, count, onSyncNow, recovering, onRecovered } = props
  const ref = useRef<HTMLDialogElement>(null)
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    else if (!open && d.open) d.close()
  }, [open])

  const switchMode = (m: Mode) => {
    setMode(m)
    setMessage(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMessage(null)
    const mail = email.trim()
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: mail, password })
        if (error) throw error
        setPassword('')
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: mail,
          password,
          options: { emailRedirectTo: window.location.origin },
        })
        if (error) throw error
        setPassword('')
        if (!data.session) {
          setMessage({ text: `Compte créé. Confirme ton adresse avec le lien envoyé à ${mail} (regarde aussi dans les spams), puis connecte-toi ici.` })
          setMode('signin')
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(mail, { redirectTo: window.location.origin })
        if (error) throw error
        setMessage({ text: `Si un compte existe pour ${mail}, un lien pour choisir un nouveau mot de passe vient d’être envoyé.` })
        setMode('signin')
      }
    } catch (err) {
      setMessage({ text: frError(err instanceof Error ? err.message : String(err)), error: true })
    } finally {
      setBusy(false)
    }
  }

  async function saveNewPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMessage(null)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setMessage({ text: frError(error.message), error: true })
    else {
      setPassword('')
      setMessage({ text: 'Mot de passe mis à jour.' })
      onRecovered()
    }
  }

  async function signOut() {
    if (!supabase) return
    if (!confirm('Se déconnecter ? Ta liste reste sur cet appareil, mais ne sera plus synchronisée.')) return
    await supabase.auth.signOut()
  }

  const passwordField = (autoComplete: string) => (
    <label className="field">
      <span>Mot de passe</span>
      <div className="password-wrap">
        <input
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={autoComplete === 'new-password' ? '6 caractères minimum' : ''}
        />
        <button type="button" className="link-btn show-pw" onClick={() => setShowPassword((v) => !v)}>
          {showPassword ? 'Masquer' : 'Afficher'}
        </button>
      </div>
    </label>
  )

  let body: React.ReactNode
  if (recovering && session) {
    body = (
      <form onSubmit={saveNewPassword} className="account-form">
        <p className="muted">Choisis un nouveau mot de passe pour {session.user.email}.</p>
        {passwordField('new-password')}
        <button className="btn" disabled={busy || password.length < 6}>
          {busy ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
        </button>
      </form>
    )
  } else if (session) {
    body = (
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
          synchronisés sur tous les appareils où tu te connectes avec ce compte.
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
    )
  } else {
    body = (
      <form onSubmit={submit} className="account-form">
        {mode !== 'forgot' && (
          <div className="segmented" role="tablist" aria-label="Type de connexion">
            <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'on' : ''} onClick={() => switchMode('signin')}>
              Se connecter
            </button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'on' : ''} onClick={() => switchMode('signup')}>
              Créer un compte
            </button>
          </div>
        )}
        <p className="muted small">
          {mode === 'forgot'
            ? 'Indique ton adresse : tu recevras un lien pour choisir un nouveau mot de passe.'
            : 'Sauvegarde ta liste en ligne et retrouve-la sur ton téléphone et ton ordinateur.'}
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
        {mode !== 'forgot' && passwordField(mode === 'signup' ? 'new-password' : 'current-password')}
        <button className="btn" disabled={busy || !email.includes('@') || (mode !== 'forgot' && password.length < 6)}>
          {busy ? 'Un instant…' : mode === 'signin' ? 'Se connecter' : mode === 'signup' ? 'Créer mon compte' : 'Envoyer le lien'}
        </button>
        {mode === 'signin' && (
          <button type="button" className="link-btn" onClick={() => switchMode('forgot')}>
            Mot de passe oublié ?
          </button>
        )}
        {mode === 'forgot' && (
          <button type="button" className="link-btn" onClick={() => switchMode('signin')}>
            Retour à la connexion
          </button>
        )}
      </form>
    )
  }

  return (
    <dialog ref={ref} className="dialog account-dialog" onClose={onClose}>
      <header className="dialog-head">
        <h2>{recovering && session ? 'Nouveau mot de passe' : 'Compte et synchronisation'}</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Fermer">
          <Icon name="close" size={20} />
        </button>
      </header>
      <div className="dialog-body account-body">
        {body}
        {message && <p className={`small account-message ${message.error ? 'error' : ''}`}>{message.text}</p>}
      </div>
    </dialog>
  )
}
