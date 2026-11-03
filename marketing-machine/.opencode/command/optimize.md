---
description: Optimización final de un draft — pasa el checklist completo de publicación
argument-hint: "[ruta del artículo en /workflow/blog/drafts/]"
---

Ruta del asset: **$ARGUMENTS**

## Proceso
1. Leé el artículo indicado + `context/compliance.md`, `context/internal-links.md`,
   `context/style-guide-es.md`.
2. Corré en secuencia y aplica correcciones directamente al archivo cuando sean
   mecánicas (metas, anchors, subtítulos, marcadores DATO PENDIENTE):
   a) agente `seo-optimizer` → lista de correctiones
   b) agente `editor-es` → pasadas de humanidad (timestamp del score antes/después)
   c) agente `compliance-checker` → veredicto (BLOQUEADO = no pasa)
3. Reescribí y guardá el archivo optimizado (mismo id, estado: aprobado si todo
   pasa; devolver estado: revision + lista de pendientes si no).
4. Genera en `workflow/blog/drafts/optimizacion-<id>.md` el reporte final:
   - Score SEO antes→después
   - Score humanidad antes→después
   - Veredicto compliance (✅/⚠️/❌ + hallazgos resueltos)
   - DATOS PENDIENTES que impiden publicar (si hay)
   - Checklist de publicación: metas ✓, enlaces ✓, CTA ✓, imágenes sugeridas con
     referencia al archivo social, slug final, fecha sugerida.
5. Movilidad humana: lista en tu respuesta los 3 cambios que más impacto tienen
   y si la pieza está lista para `/publicar` cuando el cliente apruebe datos.
