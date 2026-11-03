---
description: Escribe el artículo SEO completo (1.500-2.500+ palabras) basado en un tema o brief existente
argument-hint: "[tema o ruta del brief]"
---

Escribí un artículo para Agro-Prime sobre: **$ARGUMENTS**

## Antes de escribir (obligatorio)
1. Si existe un brief en `workflow/blog/research/` para ese tema, USALO como
   outline. Si no, corré primero `/research` con el tema y avisá al usuario.
2. Leé `AGENTS.md`, `context/brand-voice.md`, `context/style-guide-es.md`,
   `context/compliance.md`, `context/icp.md`, `context/internal-links.md`.

## El artículo
- 1.500-2.500+ palabras según lo que pida la intención (declaralo en el header
  de tu respuesta y por qué).
- H1 única, subtítulos cada 300-400 palabras, párrafos 2-4 frases, voseo
  consistente, nada de anglicismos evitables.
- Intro: gancho → problema del ICP → promesa tangible (sin ROI prometido).
- Incluye: 3-5 enlaces internos (mapa), 2-3 externos con fuente, lista/donde
  haya pasos, FAQ si la intención es I, featured snippet block (40-60 palabras)
  bajo el primer H2.
- Todo dato sin fuente verificados → `[DATO PENDIENTE: …]`, nunca lo inventes.
- Cierre: síntesis accionable + CTA WhatsApp de `context/offers.md` +
  disclaimer de compliance si aplica.
- Metas: title ≤60 chars, description ≤155 chars.

## Al terminar
1. Guardá en `workflow/blog/drafts/<id>.md` (id: `blog-<fecha>-<slug>`,
   front-matter completo con estado: revision).
2. Ejecutá en secuencia y volcá los resultado resumidos al usuario:
   - agente `seo-optimizer` (score + bloqueantes)
   - agente `keyword-mapper` (verificar densidad)
   - agente `internal-linker` (verificación final de enlaces)
   - agente `editor-es` (humanidad ≥75 o reescrituras aplicadas)
   - agente `compliance-checker` si hay línea de rentabilidad → veredicto
3. No publiques: el estado final debe quedar `revision` y listá en tu respuesta
   los datos `[DATO PENDIENTE]` que el cliente debe proveer.
