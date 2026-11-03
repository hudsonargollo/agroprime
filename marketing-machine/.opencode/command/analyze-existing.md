---
description: Analiza una URL o archivo de contenido existente (propio o de competencia) con content health score
argument-hint: "[URL o ruta de archivo]"
---

Objetivo: **$ARGUMENTS**

## Proceso
1. Obtené el contenido: si es URL, traélo con fetch; si es archivo, leélo.
2. Leé `context/keywords.md`, `context/icp.md`, `context/competitors.md`.
3. Analizá y puntuá:
   - **Content health (0-100)**: frescura (fechas, datos), cobertura del tema,
     intención vs formato, extensión promedio del SERP actual, vida del tema.
   - **Remisión de keyword**: ¿responde hoy a las keywords del cluster? ¿canibaliza?
   - **Gaps vs competencia**: qué fortalezas tiene la competencia que esta pieza no.
   - **Quick wins** (arreglables en <30 min): title, metas, H2 faltantes,
     enlaces rotos, FAQ faltante.
   - **Prioridad de rewrite** (Alta/Media/Dejar) con **alcance** (parche,
     secciones nuevas, reescritura total) y **impacto estimado**.
4. Guardá el análisis en `workflow/blog/research/analisis-<slug>-<fecha>.md`
   (front-matter: canal blog, tipo articulo, estado idea; se usa como insumo
   de `/rewrite`).
5. En tu respuesta: tabla de scores, prioridad, y si corresponde ir a
   `/rewrite <tema>` —más qué le pedir al cliente para datos frescos.
