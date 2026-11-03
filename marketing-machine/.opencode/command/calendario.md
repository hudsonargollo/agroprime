---
description: Calendario unificado — vista y plan transversal de todos los canales del período
argument-hint: "[período, ej: semana o mes]"
---

Período: **$ARGUMENTS**

## Proceso
1. Recolectá TODO con `fecha_programada`/`fecha_publicacion` en el período:
   - `workflow/social/calendario/*.json` (post-specs del motor)
   - `workflow/email/**` (campanias y secuencias con fecha)
   - `workflow/blog/**` (publicaciones planeadas)
   - `workflow/ads/**` (flights de pauta)
   - `workflow/alianzas/**` (entregables de influencers/partners)
2. Leé `context/brand-voice.md` (mezcla editorial) y `context/partners.md`
   (compromisos) para validar proporciones vs lo planificado.
3. Producí la vista traspasada:
   - **Semana a semana** (tabla): fecha · canal · asset · id · estado · responsable
   - **Carga por canal** (¿un canal se come la semana? rebalancear)
   - **Choques**: emails + posts de la misma campaña el mismo día — escalonar
   - **Agujeros al no-cruzar**: días sin nada de un canal activo
4. Cambios de fecha: escribílos en los archivos fuente (front-matter y JSON) —
   la versión única de verdad es el archivo, no esta vista.
5. Guardá la vista en `workflow/social/calendario/vista-<AAAA-MM>.md` si el
   usuario la quiere persistida.
6. Recordá en tu output: el post-spec JSON es lo que consume el motor propio —
   el Hub (ruta /mkt) es la interfaz visual de este mismo calendario.
