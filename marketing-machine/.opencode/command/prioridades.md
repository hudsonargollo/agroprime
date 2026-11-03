---
description: Matriz de prioridades de creación/actualización de contenido basada en objetivos del negocio
---

Priorizá qué contenido hace esta semana (o período que el usuario indique) y
por qué. No hay $ARGUMENTS obligatorios: usá lo que diga el usuario; si no,
usá el default: próximos 30 días.

## Proceso
1. Leé `context/keywords.md` (clusters + estados), `context/icp.md`
   (estacionalidad), `context/competitors.md` (huecos), todos los assets de
   `workflow/blog/` (ideas, drafts en revision, publicados) y el frente
   comercial: qué campañas corren en activo en `workflow/ads/`, `workflow/email/`,
   `workflow/social/calendario/`.
2. Construí la matriz: cada acción candidata con:
   - **Impacto (0-100)**: tráfico potencial + apoyo a campañas activas + cierre
     de hueco competitivo.
   - **Esfuerzo** (S/M/L): investigación, extensión, datos pendientes.
   - **Score oportunidad** = impacto/impacto-effort weighting declarado.
3. Ordená por QUARTER goals del negocio de Agro-Prime (declaralos: si no los
   conocés, pedí los 3 objetivos del mes al usuario y propón defaults:
   leads de inversión vía WhatsApp, tráfico orgánico al clúster inversión,
   amplificar Carnes Prime en temporada).
4. Output: tabla priorizada + plan semana a semana (qué se produce/cuándo) +
   qué se posterga explícitamente y por qué.

## Formato de salida
```
# Prioridades — <período>
Matriz: (tabla: acción · canal · impacto · esfuerzo · score · semanas)
Roadmap semanal
Postergadas (con por qué)
Dependencias del cliente (datos, aprobaciones)
```
Guardá el plan en `workflow/blog/research/prioridades-<fecha>.md` (front-matter,
tipo: articulo, estado: idea) si el usuario lo aprueba.
