# Pipeline de contenido — contrato de datos

Todo el contenido vive como archivos en este árbol. El agente (OpenCode) los ESCRIBE al
producir contenido; el Hub (`../hub/`) los LEE, EDITA y EXPONE; el motor de programación
propio consume el más importante: el **post-spec**.

## Convención universal: front-matter de estado

Cada asset markdown lleva front-matter YAML. El Hub y el Kanban operan sobre estos campos:

```yaml
---
id: blog-2026-11-05-genetica-nelore     # slug-fecha, único
canal: blog | email | social | ads | outreach | alianzas
tipo: articulo | secuencia | campania | post | reel | guion | variante | lista | script | deal
titulo: Título legible del asset
estado: idea | en_progreso | revision | aprobado | programado | publicado
responsable: ""                          # persona asignada (Hub la edita)
fecha_programada: ""                     # ISO 8601 con zona -04:00 (Bolivia) — la escribe el calendario
campania: ""                             # id de campaña transversal, ej: cam-carnes-navidad
notas: ""
---
```

Estados del Kanban: `idea → en_progreso → revision → aprobado → programado → publicado`.

## Árbol

| Ruta | Qué contiene | Formato |
| --- | --- | --- |
| `blog/topics/` | ideas crudas (una idea = un archivo) | md |
| `blog/research/` | briefs de investigación y análisis | md |
| `blog/drafts/` | artículos en borrador | md |
| `blog/published/` | versiones finales listas para el sitio | md |
| `blog/rewrites/` | reescrituras de contenido existente | md |
| `email/secuencias/` | secuencias de goteo (multi-email) | md (un email por sección `## Email N`) |
| `email/campanas/` | envíos únicos, HTML listo para Resend | md + bloque html |
| `ads/meta/` | variantes de anuncios Meta (FB/IG) | md |
| `ads/google/` | anuncios Google Ads (RSA) | md |
| `outreach/listas/` | listas de prospectos | csv |
| `outreach/guiones/` | guiones WhatsApp/email calificados | md |
| `social/calendario/` | **post-specs JSON** para el motor de programación | json |
| `social/posts/` | posts de imagen/carrusel (caption completo) | md |
| `social/reels/` | guiones de reels/story (escena a escena) | md |
| `alianzas/prospectos/` | prospectos de partners e influencers | md |
| `alianzas/campanas/` | briefs y deals de campañas con partners/influencers | md |

## Post-spec (esquema social/calendario/*.json) — v1.0

Contrato para el motor de programación propio. Campos obligatorios marcados con *.

```json
{
  "schema": "agroprime.social/1.0",
  "id": "social-2026-11-15-genetica-reel",
  "plataforma": "instagram",
  "plataformas_extra": ["facebook"],
  "fecha_publicacion": "2026-11-15T08:00:00-04:00",
  "formato": "reel",
  "titulo": "Bañito de élite",
  "caption": "Texto completo del caption.",
  "primer_comentario": "#hashtags van aquí",
  "hashtags": ["#agroprime", "#geneticaelite"],
  "media": [
    { "tipo": "video", "brief": "Toma frontal de terneros...", "referencia_importada": "instagram/posts/2026-10-07_DeNu80SgD4f_video.mp4" }
  ],
  "cta": { "tipo": "whatsapp", "texto": "Consultá por genética", "url": "https://wa.me/59169535546" },
  "campania": null,
  "estado": "programado",
  "responsable": "",
  "notas": ""
}
```

Valores permitidos:
- `plataforma`: `instagram | facebook | tiktok | ambas_fb_ig`
- `formato`: `reel | imagen | carrusel | story | video_largo`
- `cta.tipo`: `whatsapp | tienda | perfil | sin_cta`
- `estado`: mismos estados del Kanban.

Zona horaria: siempre `America/La_Paz` (UTC-4). No se usan DST.

## HTML de email (bloque en email/campanas/*.md)

Los emails exportan HTML autocontenido (inline CSS, tabla-based, máx 640 px) listo para
la API de Resend. El bloque se deliimita con `<!--html-inicio-->` y `<!--html-fin-->`.
El texto plano va en una sección `## Texto plano`.
