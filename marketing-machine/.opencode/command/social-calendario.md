---
description: Calendario social mensual por pista (inversión y Carnes Prime) con post-specs JSON para el motor
argument-hint: "[mes, ej: diciembre]"
---

Mes a planificar: **$ARGUMENTS**

## Proceso
1. Leé `AGENTS.md`, `context/brand-voice.md` (mezcla editorial), `context/icp.md`
   (estacionalidad del mes), `context/partners.md` (compromisos con partners),
   y el archivo real de medios (`../agroprime-assets/*/metadata.json`).
2. Armá el calendario del mes con la mezcla 45/25/15/10/5 de la casa:
   - Frecuencia base: 3-4 posts/semana IG+FB cruzados (ambas_fb_ig), 1 reel
   dedicado/semana cuando hay material.
   - Solo publicar fechas y horas concretas America/La_Paz.
   - 1 post de confianza/canales oficiales máx.
   - Cross-promos Carnes Prime según el atractivo del mes (feriados, asaditos,
     temporada de diciembre si aplica).
3. Por CADA post del calendario generá su **post-spec JSON** (esquema v1.0 en
   `workflow/README.md`) y guardalo en
   `workflow/social/calendario/<AAAA-MM>.json` — un archivo por mes que contiene
   un ARRAY de posts (el motor propio importa este archivo); o posts individuales
   `social-<fecha>-<slug>.json` si son <20. Declará el formato elegido.
4. Los briefs de producción (guiones, textos completos con hashtags) van en
   posts/reels con la referencia cruzada al JSON (campo id coincidente).
5. Compliance-checker sobre las piezas de inversión y el beneficio 10%.
6. Salida: tabla resumen del mes (fecha · plataforma · formato · pista ·
   material existente o a grabar) + lista de lo que falta grabar/producir.
