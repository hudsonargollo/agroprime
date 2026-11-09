#!/usr/bin/env bash
# Publica el worker agroprime-mkt-proxy y sus rutas /mkt en la zona clubemkt.digital.
# Uso (el token NO va en el repo):
#   export CF_API_TOKEN=... CF_ACCOUNT_ID=... CF_ZONE_ID=...
#   ./deploy/cloudflare/deploy-worker.sh
set -euo pipefail

: "${CF_API_TOKEN:?Falta CF_API_TOKEN (Workers Scripts:Edit + Workers Routes:Edit + Zone:Read)}"
: "${CF_ACCOUNT_ID:?Falta CF_ACCOUNT_ID}"
: "${CF_ZONE_ID:?Falta CF_ZONE_ID}"

NAME=agroprime-mkt-proxy
DIR=$(cd "$(dirname "$0")" && pwd)
API=https://api.cloudflare.com/client/v4

echo "== 1. Subir el worker =="
curl -sS -X PUT "$API/accounts/$CF_ACCOUNT_ID/workers/scripts/$NAME" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -F "metadata={\"main_module\":\"$NAME.js\",\"compatibility_date\":\"2026-11-01\"};type=application/json" \
  -F "$NAME.js=@$DIR/$NAME.js;type=application/javascript+module" \
  | python3 -c 'import sys,json; d=json.load(sys.stdin); print("ok" if d.get("success") else d.get("errors"))'

echo "== 2. Rutas /mkt (idempotente) =="
existing=$(curl -sS "$API/zones/$CF_ZONE_ID/workers/routes" -H "Authorization: Bearer $CF_API_TOKEN" \
  | python3 -c 'import sys,json; print("\n".join(r["pattern"] for r in json.load(sys.stdin).get("result",[])))')

for pattern in "agroprime.clubemkt.digital/mkt" "agroprime.clubemkt.digital/mkt/*"; do
  if grep -qxF "$pattern" <<<"$existing"; then
    echo "ya existe: $pattern"
    continue
  fi
  curl -sS -X POST "$API/zones/$CF_ZONE_ID/workers/routes" \
    -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
    --data "{\"pattern\":\"$pattern\",\"script\":\"$NAME\"}" \
    | python3 -c 'import sys,json; d=json.load(sys.stdin); print("creada" if d.get("success") else d.get("errors"))'
done

echo "Verificación: curl -sI https://agroprime.clubemkt.digital/mkt | head -1"
