# ANIMO

Application web pour suivre ses anime, en trois listes :

- **Déjà vus** : les anime terminés, avec une note sur 5 et des notes perso
- **En attente** : vus, mais en attente d'une suite ou de nouveaux épisodes. Le bouton « Vérifier les nouveautés » interroge AniList et liste les suites (terminées, en diffusion ou à venir, avec la date du prochain épisode)
- **À suivre** : les anime pas encore commencés

## Installer sur le téléphone (PWA)

ANIMO est une PWA : une fois en ligne (en HTTPS, par exemple sur Vercel ou Netlify), ouvre le site sur ton téléphone puis :

- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil »
- **Android (Chrome)** : menu ⋮ → « Installer l'application »

L'app s'ouvre alors en plein écran et fonctionne hors ligne (liste et affiches déjà vues). La recherche et la vérification des nouveautés demandent une connexion.

## Synchronisation en ligne (Supabase, optionnel)

Sans configuration, ANIMO fonctionne en local uniquement. Avec Supabase, la liste est sauvegardée en ligne et synchronisée entre tes appareils (connexion par e-mail + mot de passe, compatible avec le plan gratuit).

1. Crée un projet Supabase (directement, ou via l'intégration Supabase de Vercel).
2. **SQL Editor** → New query → colle le contenu de [`supabase/schema.sql`](supabase/schema.sql) → **Run** (« Success. No rows returned »).
3. **Authentication → URL Configuration** : mets l'adresse de l'app en ligne (ex. `https://animo.vercel.app`) dans *Site URL* et dans *Redirect URLs*. Elle sert aux liens de confirmation d'adresse et de mot de passe oublié.
4. Optionnel : **Authentication → Sign In / Providers → Email** → désactive *Confirm email* pour pouvoir te connecter tout de suite après avoir créé ton compte.
5. Variables d'environnement : l'app accepte `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (fichier `.env.local`, modèle `.env.example`) **ou** les variables créées par l'intégration Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`…). Seules l'URL et la clé publique sont injectées dans l'app, jamais la clé `service_role`.
6. Un bouton nuage apparaît en haut de l'app : crée ton compte, puis connecte-toi avec les mêmes identifiants sur tes autres appareils.

Fonctionnement : l'appareil reste la source immédiate (rapide, hors ligne). La synchro a lieu à la connexion, après chaque modification, au retour sur l'app, au retour du réseau et toutes les 2 minutes. En cas de modification du même anime sur deux appareils, la plus récente gagne. Les règles RLS garantissent que chaque compte ne voit que ses propres données.

## Alertes de sortie et notifications push

- **Dans l'app** : une cloche (en haut) liste les alertes. ANIMO vérifie automatiquement les anime « En attente » une fois par jour à l'ouverture (requêtes AniList groupées : quelques secondes pour toute la liste) et crée une alerte quand une suite **sort** (passe d'« à venir » à « en diffusion » / « terminé ») ou est **annoncée**.
- **Notifications push** (app fermée) : une tâche Vercel (`api/check-releases.ts`, tous les jours à 7 h UTC, voir `vercel.json`) fait la même vérification pour chaque compte et envoie une notification aux appareils abonnés. Une même sortie n'est signalée qu'une fois (clé unique par utilisateur).

Mise en place (une fois) :
1. Supabase → SQL Editor → exécute [`supabase/schema-alerts.sql`](supabase/schema-alerts.sql).
2. Dans le terminal du projet : `bash scripts/setup-push.sh` (génère les clés VAPID et le secret de la tâche, les enregistre dans Vercel, redéploie).
3. Dans ANIMO (connecté) : cloche → **Activer les notifications** → **Envoyer un test**. Sur iPhone / iPad : uniquement depuis l'app installée sur l'écran d'accueil (iOS 16.4 ou plus).

## Lancer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # version de production dans dist/ (avec service worker)
npm run preview  # tester la version de production en local
```

## Fonctionnement

- Recherche et affiches via l'API GraphQL publique d'[AniList](https://anilist.co) (sans clé). Un titre introuvable peut être ajouté manuellement.
- **Pas de serveur ni de base de données** : la liste est stockée sur l'appareil (`localStorage`). Pour éviter de la perdre :
  - ANIMO demande au navigateur un stockage **persistant** (pas d'effacement automatique) ;
  - à chaque enregistrement, la version précédente est gardée en **copie de secours** (`animo.library.backup`), utilisée si la liste principale devient illisible ;
  - un **rappel de sauvegarde** s'affiche si la liste n'a jamais été exportée, ou si la dernière sauvegarde date de plus de 14 jours avec des changements depuis ;
  - le bouton **Sauvegarder** (flèche ↓) exporte un fichier `animo-AAAA-MM-JJ.json` : sur iPhone, la feuille de partage permet de l'enregistrer dans Fichiers / iCloud Drive. Le bouton **Restaurer** (flèche ↑) réimporte une sauvegarde en ajoutant les anime manquants, sans rien écraser.
- Sur iPhone, installe ANIMO sur l'écran d'accueil : Safari peut effacer les données d'un simple site après 7 jours sans visite, pas celles d'une app installée.
- Chaque appareil a sa propre liste (pas de synchronisation). Pour passer de l'un à l'autre : Sauvegarder sur le premier, Restaurer sur le second.
- Badge **Nouveauté** : une suite est sortie (ou en diffusion) et tu ne l'as pas marquée « Vu ». Badge **Annoncé** : une suite est prévue mais pas encore sortie.
- Au premier lancement sur un appareil, une bannière propose d'ajouter la liste « Animes saison 2 » (52 anime, dans `src/data/seed.ts`). Les anime déjà présents sont ignorés.

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/types.ts` | Modèle de données (`Anime`, statuts, nouveautés) |
| `src/anilist.ts` | Client AniList : recherche et détection des suites |
| `src/useLibrary.ts` | Hook de persistance (localStorage, synchro entre onglets) |
| `src/App.tsx` | Onglets, filtre, tri, export/import |
| `src/components/` | Fenêtre d'ajout, carte d'anime, logo, icônes |
| `brand/` | Logo Oni-chan : masters SVG, variantes, icônes, guide |
