# AGROPRIME MKT — máquina de marketing todo-en-uno

Workspace de agentes para Agro-Prime (*Negociaciones y Servicios Ganaderos — Añez Hurtado*),
Santa Cruz de la Sierra, Bolivia. Producimos contenido de marketing real, publicable, en
español boliviano, para seis canales: SEO/blog, email, social, pauta (Meta + Google),
prospección directa y alianzas/influencers.

## Quién es Agro-Prime

Empresa de gestión de inversiones ganaderas y producción pecuaria de alto rendimiento.
Cuatro pilares: **Genética de élite**, **Nutrición de calidad**, **Sanidad y bioseguridad**,
**Rentabilidad sustentable**. Marca hermana: **Carnes Prime Market** (carnicería premium,
beneficio 10% para socios). Lema: *"Excelencia en Ganadería"*. Slogan: *"Trabajamos hoy,
producimos el futuro."* Valores: Productividad · Innovación · Confianza.

## Reglas inquebrantables

1. **Lee `context/` antes de producir cualquier cosa.** Mínimo: `brand-voice.md`,
   `icp.md` y `compliance.md`. Cada canal tiene su archivo relevante.
2. **Español boliviano primero.** Todo output público va en español. El registro de la
   marca usa voseo suave ("Escribinos", "Visitá", "Tenés") — ver `style-guide-es.md`.
3. **Compliance siempre.** Agro-Prime NO es asesora financiera regulada. Nunca prometas
   retornos garantizados, cifras de ROI concretas, ni "sin riesgo". Cualquier cosa sobre
   rentabilidad pasa por las reglas de `context/compliance.md`. Ante la duda, formula
   en condicional y remite a una conversación con un asesor por WhatsApp.
4. **WhatsApp es el canal de conversión.** En Bolivia la venta cierra por WhatsApp.
   Toda pieza termina en un CTA con los números oficiales de `context/offers.md`
   (jamás inventes números ni enlaces).
5. **Datos reales o nada.** No inventes estadísticas, testimonios, premios ni resultados
   del rodeo. Si falta un dato, márcalo como `[DATO PENDIENTE: …]` en el borrador.
6. **Nombres y marca exactos:** "Agro-Prime" (con guion), "Carnes Prime Market",
   "Añez Hurtado" (grafía del brief), `@agroprime_bolivia` (IG),
   `facebook.com/AgroPrimeBolivia` (FB). TikTok: sin handle verificado — no lo uses.
7. **Guarda todo en su lugar** según `workflow/README.md`, con el front-matter de estado
   completo. Un asset sin front-matter no aparece en el Hub.

## Cómo trabajar

- Pipeline estándar: leer contexto → investigar/producir → guardar en la carpeta correcta
  con front-matter → citar los archivos de contexto usados al final de tu respuesta.
- Asset nuevo ⇒ copia los metadatos del esquema en `workflow/README.md` (id único:
  `<canal>-<fecha AAAA-MM-DD>-<slug>`).
- Reutiliza el archivo de medios: `../agroprime-assets/instagram/metadata.json` y
  `../agroprime-assets/facebook/metadata.json` contienen posts y reels reales con
  descripciones visuales — referencia los archivos existentes en los `media.brief`
  del post-spec en lugar de exigir grabaciones nuevas cuando el material ya existe.
- Cada comando define su estructura de salida exacta. Síguela sin agregar secciones.

## Anti-patrones

- Nada de "revolucionario", "líder en el mercado", "el mejor de Bolivia" — la voz de la
  marca es técnica, sobria y con resultados verificables.
- Nada de emojis excesivos en blog/email (sí en social, moderado, ver brand-voice).
- Nada de anglicismos innecesarios cuando existe término ganadero en español
  (feedlot → confinamiento/engorde a corral; yield → rendimiento).
- Nunca generes material que documente animales o instalaciones específicas como si
  fuera real — el sitio usa dirección de arte generada y lo disclose. En briefs de
  media, escribe "dirección de arte" cuando aplique.
