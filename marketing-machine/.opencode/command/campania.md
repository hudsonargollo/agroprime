---
description: Campaña transversal (campania) — un brief produce assets para todos los canales
argument-hint: "[objetivo de campaña, ej: más conversaciones genética Q1]"
---

Campaña: **$ARGUMENTS**

## Proceso
1. Leé TODOS los archivos de contexto que toque según el alcance de la campaña
   (mínimo icp, brand-voice, offers, compliance + el pilar/producto en features).
2. Definí la campaña en el formato maestro:
   ```
   # Campaña — <nombre>
   Objetivo (único, medible): …
   Audience (segmento ICP u otra pista): …
   Mensaje central (1 frase): …
   Canales activados: blog / email / social / ads-meta / ads-google / outreach / alianzas
   Duración + flights: …
   KPIs y meta: …
   CAM-ID: cam-<fecha>-<slug>   ← este id va en el front-matter de TODO asset de la campaña
   ```
3. Produce por canal activado (pequeño y ejecutable, no enciclopédico):
   - **blog**: 1-2 títulos sugeridos → y SIEMPRE pide /research para desarrollar.
   - **email**: 1 campaña o email de activación (HTML ready).
   - **social**: 4-6 posts + 1-2 reels (con post-specs JSON listos).
   - **ads**: 1 ángulo principal con 3 hooks para Meta y/o Google RSA corto.
   - **outreach**: guion de 3 toques si aplica el segmento.
   - **alianzas**: 1 tipo de partner objetivo si aplica.
4. TODO asset lleva `campania: cam-…` en su front-matter/JSON para que el Hub y
   el calendario los agrupen.
5. Guardá el plan maestro en `workflow/blog/research/campania-<fecha>-<slug>.md`
   (tipo campania) y los assets en sus directorios.
6. Respuesta final: checklist por canal con estado (listo/pendiente datos) +
   los [DATO PENDIENTE] consolidados de TODOS los assets de la campaña + qué
   APROBADOS client necesita decidir (presupuesto, fechas, creativos).
