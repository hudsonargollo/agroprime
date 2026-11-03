---
description: Post social único completo (caption, hashtags, media brief, post-spec JSON)
argument-hint: "[tema/post, pista y plataforma]"
---

Post: **$ARGUMENTS**

## Proceso
1. Leé `context/brand-voice.md` (tabla de registro social), `context/offers.md`
   (CTA exacto), `context/icp.md` (pista), el archivo de medios real.
2. Producí el post completo:
   - **Caption**: gancho primera línea (~5 palabras que detengan el scroll) +
     cuerpo ≤6 líneas con linebreaks estilo WhatsApp + CTA. Emojis moderados
     estilo archivo real (🥩🔥📲📍✅🤝).
   - **Primer comentario** con 8-12 hashtags del set de la casa.
   - **Media**: brief de grabación/dirección de arte, O referencia_importada al
     material existente (metadata.json) — si hay reel/post real que sirve,
     preferilo.
   - **CTA**: el link prefilled de offers.md — jamás otro número.
3. Generá el post-spec JSON del schema v1.0 (front: estado: idea).
4. Guardá: `workflow/social/posts/social-<fecha>-<slug>.md` (con front-matter
   completo) JSON en `workflow/social/calendario/` (id coincidente).
5. Si el post menciona inversión o el beneficio 10%: pasá por
   `compliance-checker` y adjuntá el veredicto.
6. Tabla de referencia en tu respuesta: plataformas y estados de publicación.
