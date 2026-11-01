import { useEffect, useMemo, useRef, useState } from 'react'
import { AccountDialog } from './components/AccountDialog'
import { AddAnimeDialog } from './components/AddAnimeDialog'
import { AnimeCard, STATUS_ICON, hasFreshNews } from './components/AnimeCard'
import { Icon } from './components/Icon'
import { Logo } from './components/Logo'
import { BackupReminder } from './components/BackupReminder'
import { SeedBanner } from './components/SeedBanner'
import { exportLibrary } from './backup'
import { checkNews } from './anilist'
import { STATUSES, STATUS_HINTS, STATUS_LABELS, type Anime, type Status } from './types'
import { cloudEnabled } from './supabase'
import { useCloudSync } from './useCloudSync'
import { isAnimeList, useLibrary } from './useLibrary'

type Sort = 'recent' | 'title' | 'rating'
type View = 'grid' | 'list'

const VIEW_KEY = 'animo.view'
/** Préférence d'affichage, mémorisée par appareil */
function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

const EMPTY_TEXT: Record<Status, string> = {
  watched: 'Aucun anime terminé pour l’instant.',
  waiting: 'Aucun anime en attente d’une suite.',
  planned: 'Ta liste « à suivre » est vide.',
}

/** Nom affiché : titre anglais s'il existe, sinon romaji */
const nameOf = (a: Anime) => a.titleAlt ?? a.title

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function App() {
  const { items, itemsRef, add, addMany, update, remove, applySync } = useLibrary()
  const cloud = useCloudSync(items, itemsRef, applySync)
  const [accountOpen, setAccountOpen] = useState(false)
  // Lien « mot de passe oublié » ouvert : on affiche directement le formulaire de nouveau mot de passe
  useEffect(() => {
    if (cloud.recovering) setAccountOpen(true)
  }, [cloud.recovering])
  const [tab, setTab] = useState<Status>('waiting')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [view, setView] = useState<View>(readView)
  const changeView = (v: View) => {
    setView(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      /* préférence non mémorisée : sans gravité */
    }
  }
  const [adding, setAdding] = useState(false)
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set())
  const [bulkProgress, setBulkProgress] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // Incrémenté après un export pour rafraîchir le rappel de sauvegarde
  const [backupTick, setBackupTick] = useState(0)

  const counts = useMemo(
    () => Object.fromEntries(STATUSES.map((s) => [s, items.filter((a) => a.status === s).length])) as Record<Status, number>,
    [items],
  )
  const allIds = useMemo(() => new Set(items.flatMap((a) => (a.anilistId ? [a.anilistId] : []))), [items])
  const watchedIds = useMemo(
    () => new Set(items.flatMap((a) => (a.anilistId && a.status === 'watched' ? [a.anilistId] : []))),
    [items],
  )
  const newsCount = items.filter((a) => a.status === 'waiting' && hasFreshNews(a, watchedIds)).length

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const list = items.filter(
      (a) => a.status === tab && (!q || a.title.toLowerCase().includes(q) || a.titleAlt?.toLowerCase().includes(q)),
    )
    const sorters: Record<Sort, (a: Anime, b: Anime) => number> = {
      recent: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
      title: (a, b) => nameOf(a).localeCompare(nameOf(b), 'fr'),
      rating: (a, b) => b.rating - a.rating || nameOf(a).localeCompare(nameOf(b), 'fr'),
    }
    return [...list].sort(sorters[sort])
  }, [items, tab, filter, sort])

  async function runCheck(anime: Anime) {
    if (!anime.anilistId) return
    setCheckingIds((s) => new Set(s).add(anime.id))
    try {
      const found = await checkNews(anime.anilistId)
      update(anime.id, { news: { checkedAt: new Date().toISOString(), items: found } }, false)
    } catch (e) {
      update(
        anime.id,
        { news: { checkedAt: new Date().toISOString(), items: [], error: e instanceof Error ? e.message : 'Erreur' } },
        false,
      )
    } finally {
      setCheckingIds((s) => {
        const next = new Set(s)
        next.delete(anime.id)
        return next
      })
    }
  }

  async function checkAll() {
    // Séquentiel et espacé pour respecter la limite de débit d'AniList
    const todo = items.filter((x) => x.status === 'waiting' && x.anilistId)
    try {
      for (const [i, a] of todo.entries()) {
        setBulkProgress(`${i + 1}/${todo.length}`)
        await runCheck(a)
        if (i < todo.length - 1) await sleep(1000)
      }
    } finally {
      setBulkProgress(null)
    }
  }

  async function importJson(file: File) {
    try {
      const data = JSON.parse(await file.text())
      if (!isAnimeList(data)) throw new Error('format')
      addMany(data)
      alert(`Restauration terminée : les anime absents de ta liste ont été ajoutés (${data.length} dans la sauvegarde).`)
    } catch {
      alert('Fichier invalide : utilise un export ANIMO (.json).')
    }
  }

  const checkingAny = checkingIds.size > 0 || !!bulkProgress

  return (
    <div className="app">
      <header className="topbar">
        <Logo />
        <div className="topbar-actions">
          {cloudEnabled && (
            <button
              className={`icon-btn cloud-btn cloud-${cloud.status}`}
              onClick={() => setAccountOpen(true)}
              title={cloud.session ? 'Compte et synchronisation' : 'Se connecter pour synchroniser'}
              aria-label="Compte et synchronisation"
            >
              <Icon name="cloud" size={21} />
              <span className="cloud-dot" aria-hidden="true" />
            </button>
          )}
          <button className="icon-btn" onClick={async () => {
              if (await exportLibrary(items)) setBackupTick((t) => t + 1)
            }} disabled={!items.length} title="Sauvegarder ma liste (fichier JSON)" aria-label="Sauvegarder ma liste">
            <Icon name="download" size={20} />
          </button>
          <button className="icon-btn" onClick={() => fileRef.current?.click()} title="Restaurer une sauvegarde" aria-label="Restaurer une sauvegarde">
            <Icon name="upload" size={20} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importJson(f)
              e.target.value = ''
            }}
          />
          <button className="btn desktop-only" onClick={() => setAdding(true)}>
            <Icon name="plus" size={16} /> Ajouter
          </button>
        </div>
      </header>

      <BackupReminder
        key={backupTick}
        items={items}
        cloudActive={!!cloud.session && cloud.status !== 'error'}
        onExported={() => setBackupTick((t) => t + 1)}
      />

      <SeedBanner
        onImport={(list) => {
          addMany(list)
          setTab('waiting')
        }}
      />

      <nav className="tabs" role="tablist" aria-label="Listes">
        {STATUSES.map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={tab === s}
            className={`tab tab-${s} ${tab === s ? 'active' : ''}`}
            onClick={() => {
              setTab(s)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span className="tab-icon">
              <Icon name={STATUS_ICON[s]} size={20} />
              {s === 'waiting' && newsCount > 0 && <span className="tab-dot" aria-hidden="true" />}
            </span>
            <span className="tab-text">
              <span className="tab-label">{STATUS_LABELS[s]}</span>
              <span className="tab-count">
                {counts[s]}
                <span className="wide-only"> anime</span>
                {s === 'waiting' && newsCount > 0 && (
                  <span className="tab-news wide-only">
                    {' · '}
                    {newsCount} nouveauté{newsCount > 1 ? 's' : ''}
                  </span>
                )}
              </span>
            </span>
          </button>
        ))}
      </nav>

      <section className="toolbar">
        <div className="toolbar-head">
          <h2 className="list-title">{STATUS_LABELS[tab]}</h2>
          <p className="hint">{STATUS_HINTS[tab]}</p>
        </div>
        <div className="toolbar-controls">
          <label className="search">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="Filtrer…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filtrer par titre"
            />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Trier">
            <option value="recent">Récents</option>
            <option value="title">A → Z</option>
            <option value="rating">Mieux notés</option>
          </select>
          <div className="view-toggle" role="group" aria-label="Affichage">
            <button
              className={view === 'grid' ? 'on' : ''}
              aria-pressed={view === 'grid'}
              onClick={() => changeView('grid')}
              title="Affichage en grille"
              aria-label="Affichage en grille"
            >
              <Icon name="grid" size={18} />
            </button>
            <button
              className={view === 'list' ? 'on' : ''}
              aria-pressed={view === 'list'}
              onClick={() => changeView('list')}
              title="Affichage en liste"
              aria-label="Affichage en liste"
            >
              <Icon name="list" size={18} />
            </button>
          </div>
        </div>
        {tab === 'waiting' && counts.waiting > 0 && (
          <button className="btn small check-all" onClick={checkAll} disabled={checkingAny}>
            <Icon name="refresh" size={15} />
            {bulkProgress ? `Vérification ${bulkProgress}…` : checkingAny ? 'Vérification…' : 'Vérifier les nouveautés'}
            {newsCount > 0 && !checkingAny && <span className="btn-badge">{newsCount}</span>}
          </button>
        )}
      </section>

      {visible.length === 0 ? (
        <div className="empty">
          <span className={`empty-icon tab-${tab}`}>
            <Icon name={STATUS_ICON[tab]} size={28} />
          </span>
          <p>{filter ? 'Aucun anime ne correspond au filtre.' : EMPTY_TEXT[tab]}</p>
          {!filter && (
            <button className="btn" onClick={() => setAdding(true)}>
              <Icon name="plus" size={16} /> Ajouter un anime
            </button>
          )}
        </div>
      ) : (
        <main className={`grid ${view === 'list' ? 'is-list' : ''}`}>
          {visible.map((a) => (
            <AnimeCard
              key={a.id}
              anime={a}
              watchedIds={watchedIds}
              checking={checkingIds.has(a.id)}
              onUpdate={(patch) => update(a.id, patch, !('seenNews' in patch))}
              onRemove={() => remove(a.id)}
              onCheckNews={() => runCheck(a)}
            />
          ))}
        </main>
      )}

      <button className="fab" onClick={() => setAdding(true)} aria-label="Ajouter un anime">
        <Icon name="plus" size={26} />
      </button>

      <AddAnimeDialog
        open={adding}
        defaultStatus={tab}
        existingIds={allIds}
        onAdd={add}
        onClose={() => setAdding(false)}
      />

      <AccountDialog
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        session={cloud.session}
        status={cloud.status}
        error={cloud.error}
        lastSync={cloud.lastSync}
        count={items.length}
        onSyncNow={() => void cloud.syncNow()}
        recovering={cloud.recovering}
        onRecovered={cloud.clearRecovery}
      />

      <footer className="footer muted tiny">
        {cloud.session ? `Synchronisé avec ${cloud.session.user.email}` : 'Données stockées sur cet appareil'} · Recherche via AniList
      </footer>
    </div>
  )
}
