# Mkt Hub — panel del pipeline de contenido (Agro-Prime)

App web self-hosted (Next.js App Router) para **leer, editar, mover y exportar** el contenido
que vive como archivos en `marketing-machine/workflow/`. Nada de la data vive en la app:
el Hub es una UI sobre los archivos (md + front-matter, JSON post-specs, CSV), y guarda
usuarios/sesiones en SQLite aparte.

## Stack

- Next.js 15 (App Router, route handlers, standalone output), React 19, TypeScript.
- better-sqlite3 (usuarios, sesiones, bitácora), bcryptjs, gray-matter (front-matter), marked (preview/export HTML).
- CSS propio (sin Tailwind): tema oscuro premium, acento dorado `#c9a44a`, texto crema.
- UI en español.

## Estructura

```
hub/
  src/app/
    login/                      Ingreso (email+password)
    (hub)/
      page.tsx                  Dashboard: Kanban con las 6 columnas de estado
      calendario/               Cuadrícula mensual + export ICS
      archivo/                  Explorador por canal/directorio con tabs
      asset/nuevo/              Creación con scaffold por canal/tipo
      asset/[id]/               Editor md (front-matter + cuerpo + preview) / editor estructurado de post-spec
      usuarios/                 Admin: usuarios + bitácora de actividad
    api/
      auth/login | auth/logout
      users | users/[id]                (admin)
      asset (GET/POST) | asset/[id] (GET/PUT/DELETE)
      asset/[id]/estado (PATCH)         (Kanban)
      asset/[id]/fecha (PATCH)          (Calendario → ISO -04:00 en el archivo)
      export/[id]?formato=md|html|json|csv|ics
      export.ics                        (±2 meses)
      history | diff | restore          (versionado git del README del pipeline)
  src/lib/    paths (guard de rutas), content (lectura/escritura), templates (scaffolds),
              auth, guard, db (SQLite), git (commits automáticos), ics, exporters
  scripts/seed.ts  crea el primer admin
  data/       users.db (git-ignorado)
```

## Variables de entorno

| Variable | Default | Qué hace |
| --- | --- | --- |
| `CONTENT_DIR` | `<raíz del repo>/marketing-machine/workflow` | Árbol de contenido. El Hub valida SIEMPRE que cada ruta leída/escrita quede adentro (guard anti path-traversal + lista blanca de directorios). |
| `HUB_PORT` | `4074` | Puerto de dev/start. |
| `HUB_DB_PATH` | `<cwd>/data/users.db` | Ubicación del SQLite. |
| `NEXT_PUBLIC_BASE_PATH` | `/mkt` | basePath del sitio (nginx sirve en `/mkt`). Cámbialo junto con el `location` de nginx. |
| `HUB_GIT_DISABLE` | `«no seteada»` | En `1` desactiva los commits automáticos (útil en envs sin git config). |

## Mutaciones → git

Cada guardado/creación/eliminación/patch de estado o fecha ejecuta (con `cwd` en la raíz del repo,
via `git -C`):

```
git add <archivo> && git commit -m "hub: <id> — <acción> por <email>"
```

Si git no está configurado o falla, se ignora silenciosamente (no frena la operación).
El editor muestra los últimos 20 commits del archivo, diff A→B y "Restaurar esta versión".

## Dev / Build / Run

```bash
npm install
# (si better-sqlite3 no compila binarios por ser package nativo: `npm install-scripts approve better-sqlite3 && npm rebuild better-sqlite3`)
npm run seed        # crea el admin (args o prompt) → hub/data/users.db
npm run build
npm run dev         # http://localhost:4074/mkt  (ojo: basePath /mkt)

# producción (output: standalone):
PORT=4074 node .next/standalone/server.js     # lo que hace `npm start`
# alternativa sin standalone:
npm run build && npm run start:next
```

En producción corre SIEMPRE con env explícitas — el standalone cambia el cwd y los defaults
relativos pueden desenfocarse:

```bash
CONTENT_DIR=/root/ClubeMkt/agroprime/marketing-machine/workflow \
HUB_DB_PATH=/root/ClubeMkt/agroprime/hub/data/users.db \
PORT=4074 node .next/standalone/server.js
```

`contentDir()` resuelve este orden: `CONTENT_DIR` → búsqueda hacia arriba (`*/marketing-machine/workflow`).
`repoRoot()` (para git) es el primer ancestro de CONTENT_DIR que tenga `.git`.

## Seed (primer admin)

```bash
npm run seed -- --email mkt@agroprime.com.bo --password 'CambiarEsto.2026' --role admin
# o interactivo:
npm run seed
```

Roles:

- **admin** — todo: gestión de usuarios, bitácora, crear/editar/mover/eliminar, exportar, restaurar versiones.
- **editor** — crear/editar/mover/eliminar assets, exportar, restaurar. No gestiona usuarios.
- **viewer** — solo lectura (todas las mutaciones están bloqueadas también server-side).

Sesión: cookie httpOnly de 30 días (`mkt_session`), guardia por middleware + validación en
cada página y route handler.

## Nginx ( basePath /mkt )

```nginx
location /mkt/ {
    proxy_pass http://127.0.0.1:4074;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # Next maneja basePath=/mkt: las rutas del app cuadran 1 a 1 con este prefijo.
}
```

> Nota: el `basePath` de `next.config.ts` (default `/mkt`) debe coincidir con el prefijo del
> `location` de nginx. Si cambiás uno, cambiá ambos (`NEXT_PUBLIC_BASE_PATH`).

En el servidor hay dos bloques (`deploy/`): `nginx-agroprime-hub.conf` para
`agroprime.clubemkt.digital/mkt` y `nginx-agroprime-hub-subdomains.conf`, que expone el Hub en
**https://mkt.clubemkt.digital/mkt** (la raíz redirige ahí) y manda `hub.clubemkt.digital` con un
301 a `mkt`. Los nombres exactos ganan sobre el wildcard `*.clubemkt.digital`, que si no cae en
Krikkit y devuelve 404.

## systemd

```ini
[Unit]
Description=Mkt Hub — panel del pipeline de contenido Agro-Prime
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/ClubeMkt/agroprime/hub
ExecStart=/root/.hermes/tools/node-26.7.0-linux-x64/bin/node /root/ClubeMkt/agroprime/hub/.next/standalone/server.js
Environment=PORT=4074
Environment=CONTENT_DIR=/root/ClubeMkt/agroprime/marketing-machine/workflow
Environment=HUB_DB_PATH=/root/ClubeMkt/agroprime/hub/data/users.db
Restart=on-failure
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

## Seguridad

- `resolveRelPath()` valida cada ruta: normaliza, rechaza `..`, exige extensión permitida
  (`.md/.json/.csv`) y exige que el directorio pertenezca a la lista blanca del pipeline
  (`blog/*, email/*, ads/*, outreach/*, social/*, alianzas/*`).
- IDs de assets = base64url de la ruta relativa; se re-verifican al decodificar.
- Viewer (solo lectura): los GET funcionan; cualquier método de mutación responde 403, sin excepción.
- Bitácora de actividad (últimas acciones visibles en /usuarios).
