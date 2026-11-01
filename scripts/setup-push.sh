#!/usr/bin/env bash
# ANIMO : configuration des notifications push (à lancer UNE fois, depuis la racine du projet) :
#   bash scripts/setup-push.sh
#
# Génère la paire de clés VAPID et le secret de la tâche quotidienne, puis les enregistre
# dans les variables d'environnement Vercel (production + preview).
# Les valeurs secrètes ne sont ni affichées, ni écrites dans un fichier.
# Prérequis : être connecté à Vercel (npx vercel login) et le dossier lié au projet (npx vercel link).
set -euo pipefail

echo "→ Génération des clés…"
KEYS=$(npx --yes web-push generate-vapid-keys --json)
PUB=$(printf '%s' "$KEYS" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.parse(d).publicKey))')
PRIV=$(printf '%s' "$KEYS" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.parse(d).privateKey))')
CRON=$(openssl rand -hex 32)
unset KEYS

add() { # nom, valeur, environnement, options
  printf '%s' "$2" | npx vercel@latest env add "$1" "$3" --force ${4:-} >/dev/null
  echo "  ✓ $1 ($3)"
}

echo "→ Enregistrement dans Vercel…"
for ENV in production preview; do
  add VAPID_PUBLIC_KEY "$PUB" "$ENV"
  add VAPID_PRIVATE_KEY "$PRIV" "$ENV" --sensitive
  add CRON_SECRET "$CRON" "$ENV" --sensitive
done
unset PRIV CRON

# Clé publique (non secrète) pour le développement local
if [ -f .env.local ]; then
  grep -v '^VAPID_PUBLIC_KEY=' .env.local > .env.local.tmp || true
  mv .env.local.tmp .env.local
fi
echo "VAPID_PUBLIC_KEY=$PUB" >> .env.local
echo "  ✓ .env.local (clé publique)"

echo "→ Redéploiement de la production pour prendre en compte les clés…"
npx vercel@latest --prod --yes >/dev/null
echo "✅ Terminé. Ouvre ANIMO → cloche → « Activer les notifications »."
