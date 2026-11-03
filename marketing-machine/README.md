# AgroMkt — máquina de marketing de Agro-Prime

Workspace de agentes (OpenCode) que produce contenido real y publicable para
seis canales: **SEO/blog, email, social, pauta (Meta+Google), prospección
directa y alianzas/influencers**. Todo el contenido vive en `workflow/` y es
consumido también por el **Hub** (`../hub/`, la UI web en /mkt) y el motor
propio de programación.

## Empezar

1. Copiar `.env.example` a `.env` y completar (Resend, URLs, secret del Hub).
2. Abrir el workspace con `opencode` desde esta carpeta.
3. Leer `AGENTS.md` (las reglas de la casa) — los archivos de `context/` son la
   fuente de verdad de marca, ICP, ofertas y compliance.

## Comandos principales

| Área | Comandos |
| --- | --- |
| SEO | `/research` `/write` `/rewrite` `/optimize` `/analyze-existing` `/prioridades` |
| Email | `/email-secuencia` `/email-campania` `/email-boletin` |
| Social | `/social-calendario` `/social-post` `/social-reel-guion` |
| Pauta | `/ads-meta` `/ads-google` `/ads-angles` |
| Outreach | `/outreach-whatsapp` `/outreach-email` `/outreach-lista` |
| Alianzas | `/alianzas` `/influencer-buscar` `/influencer-campania` |
| Transversal | `/campania` (una breve → todos los canales) `/calendario` |

## Estructura

- `AGENTS.md` — reglas y pipeline
- `.opencode/agent/` — 13 subagentes especializados (SEO, editor, compliance,
  ads, email, outreach, social, influencer-fit, intención, CRO…)
- `.opencode/command/` — los comandos de arriba
- `context/` — 11 archivos de conocimiento (voz, ICP, features, ofertas,
  keywords, competitors, links, compliance, estilo, partners, criterios
  influencer) — **mantener actualizados**
- `workflow/` — el contenido y su contrato de datos (`workflow/README.md`)
- `.env.example` — credenciales para Fase 2 (envío Resend, etc.)

## Flujo típico

```
/research "invertir en ganado Bolivia"
/write "invertir en ganado Bolivia"      # produce draft + reportes de agentes
/optimize workflow/blog/drafts/…          # close checklist, estado → aprobado
```
```
/campania "más conversaciones de genética Q1"   # assets por canal con CAM-ID
/calendario "diciembre"                          # vista unificada + post-specs
```

El Hub (`../hub/`) expone todo esto en el navegador: kanban por estados,
calendario, edición, copiado y exportación (MD/HTML/JSON/CSV/ICS), con versionado
por git en el mismo repo. Publiación/programación real la ejecuta el motor
propio leyendo los post-spec JSON de `workflow/social/calendario/`.

## Fase 2 (pendiente)

- Script de envío vía Resend API
- Integraciones GA4 / Search Console / DataForSEO para `/research` y `/prioridades`
- WordPress publishing (si se monta blog en WP) o deploy estático de `/blog/`
