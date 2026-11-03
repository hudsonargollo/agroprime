---
description: Reescribe o actualiza contenido existente basado en su análisis
argument-hint: "[tema, URL o ruta del análisis]"
---

Objetivo: **$ARGUMENTS**

## Proceso
1. Buscá el análisis en `workflow/blog/research/analisis-<…>.md` (o corré
   `/analyze-existing` primero si no existe) — usá el content health y la
   prioridad como la columna vertebral de la decisión.
2. Leé `context/brand-voice.md`, `context/style-guide-es.md`, `context/compliance.md`.
3. Decidí el alcance: **parche** (datos, metas, quick wins) / **secciones
   nuevas** (gaps) / **reescritura total** — declará el porqué en una línea.
4. Reescribí:
   - Mantené lo que funciona (lista explícita de lo conservado).
   - Enfocate en los gaps detectados; agregá secciones nuevas para cada uno.
   - Actualizá TODO dato viejo con fuente; `[DATO PENDIENTE]` si falta.
   - Aplicá guía de estilo y compliance de cero (aunque lo viejo no lo tenía).
5. Guardá en `workflow/blog/rewrites/<id>-rewrite-<fecha>.md` con front-matter
   (canal blog, tipo articulo, estado: revision; notas: URL original).
6. Al final: incluye **tabla de cambios** (antes → después por sección) y
   el checklist de /optimize pendiente de correr.
