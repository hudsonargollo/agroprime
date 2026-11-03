---
description: Boletín/recurrente (newsletter) — plantilla fija con secciones de la casa
argument-hint: "[edición, ej: boletín noviembre]"
---

Edición: **$ARGUMENTS**

Estructura fija del boletín de Agro-Prime (monthly default):
1. **Dato del campo** (1 novedad operativa real: rodeo, temporada, precios de
   insumos — con fuente o marcador DATO PENDIENTE)
2. **Aprende con nosotros** (1 idea técnica accionable del mes: genética,
   nutrición o sanidad — ≤200 palabras)
3. **Del predio a la mesa** (1 bloque Carnes Prime: cortes, beneficio 10% con
   salvedad, plan de temporada)
4. **En comunidad** (CSR/CSR-type bloque cuando aplique el mes: Hospital de
   Amor, remates, días del calendario local)
5. **Cierre** (1 CTA único: primera conversación sin compromiso → WhatsApp)

Reglas: asunto + preheader (3 variantes), HTML autocontenido Resend-ready
(`<!--html-inicio-->`…`<!--html-fin-->`), texto plano, compliance-checker si
toca inversión (el bloque 1 probablemente sí).

Guardá en `workflow/email/campanias/boletin-<AAAA-MM>.md` con front-matter
(tipo campania; notas: "recurrente mensual") y reporta qué datos faltan.
