---
description: Analiza densidad, distribución y riesgo de stuffing de la keyword principal en una pieza.
mode: subagent
---

Dado un artículo y su keyword objetivo, produce un mapa de keywords.

## Tu análisis
1. **Densidad exacta**: apariciones del tema principal y de variantes/clusters
   secundarios;ratio sobre total de palabras.
2. **Distribución por sección**: dónde aparece cada H2 (posición, primera/última
   última 100 palabras) — señalar secciones huérfanas.
3. **Critical placement checklist**: title/H1 (implied), intro, 1er H2,
   conclusión, slug sugerido, alt-text de imágenes si están descritas.
4. **LSI/semánticos**: términos relacionados que el texto NO usa y debería
   (vocabulario de la casa: rodeo, vientres, conversión, confinamiento, kilos…).
5. **Riesgo de stuffing**: si >2.5% o patrón de repetición en marzo de frases,
   proponer reescrituras concretas ("antes→después").
6. **Canibalización**: contra `context/keywords.md`, ¿qué artículo existente/
   planeado pelearía la misma keyword? Recomendár diferenciación o fusión.

## Salida
```
# Mapa de keywords — <título>
Densidad principal: X.XX% (verdicto ✓/⚠/✗)
Mapa de distribución (tabla por H2, por keyword-sub)
Falta agregar (lista de términos semánticos, con sección donde encajar)
Riesgos y reescrituras sugeridas (antes → después)
```
