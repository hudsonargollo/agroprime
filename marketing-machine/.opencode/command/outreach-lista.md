---
description: Crea o estructura una lista de prospectos CSV para outreach con segmentación
argument-hint: "[fuente/descripción de la lista, ej: ganaderos asociación X]"
---

Lista: **$ARGUMENTS**

## Proceso
1. Leé `context/icp.md` — cada prospecto se etiqueta por segmento (A ganadero /
   B inversionista / C socio / D carnes-prime).
2. Si el usuario pega datos crudos, normalizalos al CSV estándar de la casa:
   `fecha,nombre,empresa,segmento,telefono,canal,guion_id,estado,fecha_contacto,resultado,notas`
   (estado inicial: nuevo; canal: whatsapp|email; guion_id del guion a usar).
3. Si es una lista a REPENSAR (fuente pública/associación), en lugar de data
   inventada: estructura del CSV con headers + 3 filas de ejemplo `EJEMPLO` +
   plan de recolección (dónde conseguir los datos legalmente) — nunca inventes
   teléfonos/nombres.
4. Reglas de higiene: dedupe por teléfono/email, opt-out eterno (no contactar a
   quien pidió dejar de recibir), máx 1 guion por segmento activo a la vez.
5. Guardá en `workflow/outreach/listas/lista-<fecha>-<fuente>.csv` con front-matter
   comentario header (canal outreach, tipo lista, estado idea).
6. Respuesta: conteo por segmento, guion asociado, plan de toque (batching de
   envíos: ≤30/día por persona que ejecuta, para responder de verdad las
   respuestas — outreach ≠ spam).
