import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'

// Tutoriel de prise en main : une suite d'écrans avec une vraie capture de l'app.
// S'ouvre tout seul au premier lancement, puis depuis « Guide » (pied de page / en-tête).

const SEEN_KEY = 'animo.guide.v1'

export function guideSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) !== null
  } catch {
    return true
  }
}

function markGuideSeen() {
  try {
    localStorage.setItem(SEEN_KEY, new Date().toISOString())
  } catch {
    /* ignoré */
  }
}

function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

interface Step {
  title: string
  text: ReactNode
  points?: { icon: IconName; text: ReactNode }[]
  image?: string
  alt?: string
  visual?: ReactNode
}

function installStep(): Step {
  const ios = isIOS()
  return {
    title: 'Installe ANIMO sur ton téléphone',
    text: 'ANIMO s’utilise comme une vraie app : icône sur l’écran d’accueil, plein écran, et fonctionne même hors ligne.',
    points: ios
      ? [
          { icon: 'upload', text: <>Dans Safari, touche <b>Partager</b> (le carré avec la flèche).</> },
          { icon: 'plus', text: <>Choisis <b>Sur l’écran d’accueil</b>, puis <b>Ajouter</b>.</> },
          { icon: 'bell', text: <>Ouvre ANIMO depuis l’icône : c’est nécessaire pour recevoir les notifications sur iPhone.</> },
        ]
      : [
          { icon: 'download', text: <>Dans Chrome, ouvre le menu <b>⋮</b> puis <b>Installer l’application</b>.</> },
          { icon: 'plus', text: <>Sur ordinateur, clique sur l’icône d’installation dans la barre d’adresse.</> },
          { icon: 'bell', text: <>Une fois installée, active les notifications depuis la cloche.</> },
        ],
    visual: (
      <div className="guide-install">
        <img src="/icon-192.png" alt="" width={96} height={96} />
        <span>ANIMO</span>
      </div>
    ),
  }
}

function buildSteps(): Step[] {
  const steps: Step[] = [
    {
      title: 'Bienvenue sur ANIMO',
      text: 'Tes anime sont rangés dans trois listes. Passe de l’une à l’autre avec les onglets en bas de l’écran.',
      image: '/tutorial/home.webp',
      alt: 'Écran principal d’ANIMO avec la liste En attente',
      points: [
        { icon: 'check', text: <><b>Déjà vus</b> : ce que tu as terminé.</> },
        { icon: 'clock', text: <><b>En attente</b> : vus, mais tu attends une suite ou de nouveaux épisodes.</> },
        { icon: 'bookmark', text: <><b>À suivre</b> : ce que tu veux commencer.</> },
      ],
    },
    {
      title: 'Ajoute un anime',
      text: 'Touche le bouton rose + en bas à droite et tape un titre : les résultats viennent d’AniList, avec l’affiche.',
      image: '/tutorial/add.webp',
      alt: 'Recherche « Frieren » dans la fenêtre d’ajout',
      points: [
        { icon: 'bookmark', text: <>Choisis la liste dans <b>Ajouter dans</b>, puis touche <b>Ajouter</b>.</> },
        { icon: 'plus', text: <>Introuvable ? Utilise <b>Ajouter manuellement</b>.</> },
      ],
    },
    {
      title: 'Ta fiche anime',
      text: 'Chaque anime a sa fiche : note-le, écris un commentaire et déplace-le d’une liste à l’autre.',
      image: '/tutorial/card.webp',
      alt: 'Une fiche anime avec ses étoiles et les boutons Vu, En attente, À voir',
      points: [
        { icon: 'sparkle', text: <>Touche les <b>étoiles</b> pour noter, et <b>+ Ajouter une note</b> pour un commentaire.</> },
        { icon: 'check', text: <>Les trois boutons du bas changent la liste : <b>Vu</b>, <b>En attente</b>, <b>À voir</b>.</> },
        { icon: 'trash', text: <>La corbeille sur l’affiche supprime l’anime.</> },
      ],
    },
    {
      title: 'Repère les nouveautés',
      text: 'Pour la liste En attente, ANIMO cherche les suites de chaque anime et te montre où elles en sont.',
      image: '/tutorial/news.webp',
      alt: 'Deux fiches avec les badges Annoncé et Nouveauté',
      points: [
        { icon: 'sparkle', text: <><b>Nouveauté</b> : une suite est sortie, tu peux la regarder.</> },
        { icon: 'clock', text: <><b>Annoncé</b> : une suite est prévue, avec sa date si elle est connue.</> },
        { icon: 'check', text: <>Touche <b>Vu</b> sur une suite regardée pour retirer le badge.</> },
      ],
    },
    {
      title: 'Trie, filtre, vérifie',
      text: 'Retrouve vite un titre et garde tes listes à jour.',
      image: '/tutorial/tools.webp',
      alt: 'Barre de filtre, tri, bascule grille ou liste et bouton Vérifier les nouveautés',
      points: [
        { icon: 'search', text: <><b>Filtrer</b> par titre, et trier avec le menu à côté.</> },
        { icon: 'grid', text: <>Bascule entre <b>grille</b> et <b>liste</b> avec les deux boutons.</> },
        { icon: 'refresh', text: <><b>Vérifier les nouveautés</b> relance la recherche de suites pour toute la liste.</> },
      ],
    },
    {
      title: 'Ne rate aucune sortie',
      text: 'La cloche en haut regroupe les alertes : suite sortie ou nouvelle saison annoncée. ANIMO vérifie chaque jour.',
      image: '/tutorial/alerts.webp',
      alt: 'Fenêtre des alertes de sortie',
      points: [
        { icon: 'bell', text: <>Un chiffre rose sur la cloche signale des alertes non lues.</> },
        { icon: 'sparkle', text: <>Touche une alerte pour afficher l’anime concerné.</> },
        { icon: 'cloud', text: <>Connecté, active les <b>notifications</b> pour être prévenu même app fermée.</> },
      ],
    },
    {
      title: 'Garde ta liste en sécurité',
      text: 'Crée un compte (le nuage en haut) pour sauvegarder ta liste en ligne et la retrouver sur tous tes appareils.',
      image: '/tutorial/account.webp',
      alt: 'Fenêtre Compte et synchronisation',
      points: [
        { icon: 'cloud', text: <>Connecté, tout se synchronise tout seul entre téléphone et ordinateur.</> },
        { icon: 'download', text: <>Sans compte, la flèche <b>Sauvegarder</b> garde une copie dans un fichier.</> },
        { icon: 'upload', text: <>La flèche <b>Restaurer</b> recharge une sauvegarde.</> },
      ],
    },
  ]
  if (!isStandalone()) steps.push(installStep())
  return steps
}

interface Props {
  open: boolean
  onClose: () => void
}

export function GuideDialog({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [steps] = useState(buildSteps)
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const step = steps[index]
  const last = index === steps.length - 1

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      setIndex(0)
      d.showModal()
      // Le focus va sur « Suivant » plutôt que sur le logo
      d.querySelector<HTMLElement>('.guide-foot .btn:last-child')?.focus()
    } else if (!open && d.open) d.close()
  }, [open])

  // Précharge la capture suivante pour un passage sans attente
  useEffect(() => {
    const next = steps[index + 1]?.image
    if (open && next) new Image().src = next
  }, [open, index, steps])

  const close = () => {
    markGuideSeen()
    onClose()
  }
  const go = (i: number) => setIndex(Math.max(0, Math.min(steps.length - 1, i)))

  return (
    <dialog
      ref={ref}
      className="dialog guide-dialog"
      onClose={close}
      aria-labelledby="guide-title"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
    >
      <header className="dialog-head guide-head">
        <Logo />
        <button className="link-btn" onClick={close}>
          {last ? 'Fermer' : 'Passer'}
        </button>
      </header>

      <div
        className="guide-stage"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        }}
      >
        <div className="guide-visual" key={`v${index}`}>
          {step.image ? <img className="guide-shot" src={step.image} alt={step.alt ?? ''} /> : step.visual}
        </div>

        <div className="guide-text" key={`t${index}`}>
          <p className="guide-count">
            Étape {index + 1} sur {steps.length}
          </p>
          <h2 id="guide-title">{step.title}</h2>
          <p className="guide-lead">{step.text}</p>
          {step.points && (
            <ul className="guide-points">
              {step.points.map((p, i) => (
                <li key={i}>
                  <span className="guide-point-icon">
                    <Icon name={p.icon} size={16} />
                  </span>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <footer className="guide-foot">
        <button className="btn ghost small" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Étape précédente">
          <Icon name="back" size={16} />
        </button>
        <div className="guide-dots">
          {steps.map((s, i) => (
            <button
              key={i}
              aria-current={i === index ? 'step' : undefined}
              aria-label={`Étape ${i + 1} : ${s.title}`}
              className={i === index ? 'active' : ''}
              onClick={() => go(i)}
            />
          ))}
        </div>
        {last ? (
          <button className="btn small" onClick={close}>
            C’est parti !
          </button>
        ) : (
          <button className="btn small" onClick={() => go(index + 1)}>
            Suivant <Icon name="next" size={16} />
          </button>
        )}
      </footer>
    </dialog>
  )
}
