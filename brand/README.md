# Identité ANIMO

**Oni-chan**, la mascotte : un onigiri kawaii couleur sakura. Sa silhouette triangulaire fait écho au A d'ANIMO.

## Couleurs

| Rôle | HEX | Usage |
| --- | --- | --- |
| Rose sakura | `#E0457B` | Corps d'Oni-chan, accent principal, boutons |
| Prune | `#5B3A6E` | Algue (nori), liste « Déjà vus », texte de marque |
| Joues | `#F9A3BE` | Uniquement sur la mascotte |
| Crème | `#FBF7F4` | Fond de l'app |
| Encre | `#2A1E2E` | Texte |

Polices de l'interface : **Zen Maru Gothic** (titres, nom « ANIMO ») et **Nunito** (texte), via Google Fonts.

## Fichiers

| Fichier | Quand l'utiliser |
| --- | --- |
| `animo-mascot.svg` | Version principale en couleurs (≥ 48 px) |
| `animo-mascot-small.svg` | Petites tailles (≤ 32 px) : sans bouche ni joues, yeux agrandis |
| `animo-mascot-black.svg` / `-white.svg` / `-plum.svg` | Une couleur (visage et algue en creux) |
| `animo-mascot-small-knockout.svg` | Base des icônes d'app (blanc sur tuile rose) |
| `animo-mascot-app-icon.svg`, `apple-touch-icon.png`, `icon-*.png`, `maskable-512.png` | Icônes d'app (déjà copiées dans `public/`) |
| `favicon.ico`, `favicon.svg`, `favicon-*.png` | Favicons (déjà copiés dans `public/`) |

## Règles simples

- Laisser autour de la mascotte une marge au moins égale à la largeur de l'algue.
- Taille minimale : 16 px avec la version `small`, 48 px avec la version complète.
- Ne pas déformer, pivoter de façon permanente, changer les couleurs ou ajouter d'ombre.
- Sur fond rose ou photo, utiliser la version blanche.

Le nom « ANIMO » est composé en Zen Maru Gothic Black (texte HTML, licence SIL OFL, usage libre).
