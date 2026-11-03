---
description: Investigación completa para una pieza SEO — keywords, SERP, brecha competitiva y brief de artículo
argument-hint: "[tema]"
---

Investigá el tema dado para una pieza SEO de Agro-Prime y guardá el brief en
`workflow/blog/research/brief-<slug>-<AAAA-MM-DD>.md` con front-matter
(canal: blog, tipo: articulo, estado: idea — luego /write lo mueve).

Tema: **$ARGUMENTS**

## Proceso
1. Leé `context/brand-voice.md`, `context/icp.md`, `context/keywords.md`,
   `context/compliance.md`, `context/internal-links.md`.
2. **Intención**: clasificá el tema (I/C/T/N) y qué formato ganaría el SERP.
   Si es pista inversión, corré mentalmente las reglas de compliance desde ya.
3. **Keyword**: primaria + secundarias + variaciones long-tail. Si no está en
   `keywords.md`, adicionala al archivo (sección del cluster correcta) con
   estado "sin validar".
4. **Competencia SERP** (usa web search si tenés acceso): top 10 resultados,
   ángulos repetidos, huecos que NADIE cubre para Bolivia (precios locales,
   época seca, Nelore, precios de insumos de la región). Documentá por competidor: título,
   ángulo, extensión aproximada, qué le falta.
5. **Ángulo Agro-Prime**: por qué el contenido de la casa gana (técnica de
   pilares, contexto local boliviano, proceso de 4 pasos).
6. **El brief** en este formato EXACTO:

```
# Brief — <tema>
## Intención y formato ganador
## Keywords (tabla: primaria/secundaria/long-tail · intención · prioridad)
## Competencia SERP (tabla top 10 + síntesis de huecos)
## Outline recomendado (H1 → H2 → H3 con objetivo de cada sección)
## Datos y fuentes a citar (con URL; nada inventado)
## Enlaces internos planeados (del mapa internal-links.md)
## Meta tentativo (title ≤60 chars, description ≤155)
## Compliance previsiones (qué NO decir en esta pieza)
## Recursos de marca reutilizables (medios del archivo social, testimonios si hay)
```
7. Al final de tu respuesta: citá archivos de contexto usados y propone el
   siguiente paso: `/write "<tema>"`.
