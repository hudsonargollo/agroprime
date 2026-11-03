---
description: Secuencia de emails (drip) para un objetivo y segmento — estructura completa Resend-ready
argument-hint: "[nombre de la secuencia, ej: bienvenida inversionista]"
---

Objetivo de la secuencia: **$ARGUMENTS**

## Proceso
1. Leé `AGENTS.md`, `context/icp.md` (según segmento objetivo), `context/brand-voice.md`,
   `context/offers.md`, `context/compliance.md`.
2. Usá el delegado `email-strategist` para producir la secuencia completa
   (arquitectura estándar en su spec: bienvenida inversionista 5 emails,
   activación socio 3 emails, u estructura a medida que justifiques).
3. Cada email con: 3 líneas de asunto puntuadas, preheader, HTML autocontenido
   (inline CSS, 640px, palette de la casa) entre `<!--html-inicio-->` /
   `<!--html-fin-->`, texto plano, objetivo del envío y CTA exacto de offers.md.
4. Guardá en `workflow/email/secuencias/<id>.md` — un archivo por secuencia,
   con secciones `## Email N — <nombre>` (front-matter: canal email,
   tipo secuencia, estado idea; notas: triggers y cadencia día-a-día).
5. En tu respuesta: mapa de la secuencia (día, asunto, objetivo), checklist
   de compliance por email, y qué falta del cliente (datos, dominio verificado
   en Resend).
