#!/usr/bin/env bash
# Despliega el Mkt Hub: build + usuario seed + systemd + nginx location /mkt.
# Idempotente. Correr como root en el servidor (vmi3098793).
set -euo pipefail

REPO=/root/ClubeMkt/agroprime
HUB=$REPO/hub

echo "== 1. Build del Hub =="
cd "$HUB"
npm run build

echo "== 2. Usuario admin semilla (si no existe DB de usuarios) =="
if [ ! -f "$HUB/data/users.db" ] && [ -f "$HUB/scripts/seed.ts" ]; then
  if [ -z "${1:-}" ]; then
    echo "Uso: deploy.sh <email> <password>"
    exit 0
  fi
  node "$HUB/scripts/seed.ts" "$1" "$2"
fi

echo "== 3. Servicio systemd =="
cp "$REPO/deploy/agroprime-hub.service" /etc/systemd/system/agroprime-hub.service
systemctl daemon-reload
systemctl enable agroprime-hub
systemctl restart agroprime-hub
sleep 3
systemctl --no-pager -l status agroprime-hub | head -5

echo "== 4. Nginx: bloque exacto agroprime.clubemkt.digital con /mkt =="
cp "$REPO/deploy/nginx-agroprime-hub.conf" /etc/nginx/sites-available/agroprime-hub
ln -sf /etc/nginx/sites-available/agroprime-hub /etc/nginx/sites-enabled/agroprime-hub
nginx -t
systemctl reload nginx

echo "== 5. Verificación =="
sleep 2
echo -n "Hub local: "; curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4074/mkt/login
echo -n "Vía nginx: "; curl -s -o /dev/null -w '%{http_code}\n' -H 'Host: agroprime.clubemkt.digital' http://127.0.0.1/mkt/login
echo -n "Sitio raíz intacto: "; curl -s -o /dev/null -w '%{http_code}\n' -H 'Host: agroprime.clubemkt.digital' http://127.0.0.1/
echo "Hu está en: https://agroprime.clubemkt.digital/mkt"
