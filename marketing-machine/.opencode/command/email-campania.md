---
description: Campaña de email único con HTML Resend-ready y checklist de envío
argument-hint: "[tema/oferta y fecha objetivo]"
---

Campaña única: **$ARGUMENTS**

## Proceso
1. Leé los cuatro archivos obligatorios de contexto (icp, brand-voice, offers,
   compliance) + revisá secuencia activa si la hay en `workflow/email/secuencias/`
   para no duplicar emails recientes (avisá el solape si existe).
2. Con `email-strategist`: producí el email de envío único.
   - 4 líneas de asunto (2 cortas ≤45, 2 largas ≤70) + recommended + preheader.
   - Una sola idea + un solo CTA (WhatsApp de offers.md o tienda Carnes Prime).
   - HTML autocontenido + texto plano + imagen sugerida (del archivo social o
     dirección de arte etiquetada).
3. Compliance: pieza pasa por `compliance-checker` — aprobación obligatoria si
   menciona inversión o beneficio 10%. Pie con canales oficiales + dirección
   física + baja opcional ("respondé BAJA").
4. Guardá: `workflow/email/campanias/email-<fecha>-<slug>.md`
   (canal email, tipo campania, estado idea; notas con: CONTEXTO de envío,
   lista destino propuesta (segmento del ICP), fecha sugerida).
5. En tu respuesta: asunto recomendado, CTA, fecha sugerida, y el paso siguiente
   "cuando esté aprobado → Mover a estado aprobado en el Hub y cargar en Resend".
