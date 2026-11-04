/**
 * Plantillas de scaffold por canal/tipo para /asset/nuevo.
 * Español boliviano, branding Agro-Prime (ver marketing-machine/AGENTS.md).
 */
import fs from "node:fs"
import path from "node:path"
import { BRAND, FrontMatter, PostSpec, TIPO_DEFAULT_DIR } from "./types"
import { contentDir } from "./paths"

export function todayStamp(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/La_Paz" }).format(new Date())
}

export function isEstado(s: string): boolean {
  return ["idea", "en_progreso", "revision", "aprobado", "programado", "publicado"].includes(s)
}

/** Nombre único: <canal>-<fecha>-<slug> con sufijo -2, -3… si colisiona. */
export function uniqueName(dir: string, canal: string, slug: string, ext: string): string {
  const base = `${canal}-${todayStamp()}-${slugify(slug || canal)}`
  let candidate = base
  let i = 2
  while (fs.existsSync(path.join(contentDir(), dir, candidate + ext))) {
    candidate = `${base}-${i}`
    i++
  }
  return candidate
}

export function slugify(s: string): string {
  const out = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
  return out || "asset"
}

export function baseFm(opts: { id: string; canal: string; tipo: string; titulo: string; estado?: string }): FrontMatter {
  return {
    id: opts.id,
    canal: opts.canal,
    tipo: opts.tipo || "articulo",
    titulo: opts.titulo,
    estado: opts.estado && isEstado(opts.estado) ? opts.estado : "idea",
    responsable: "",
    fecha_programada: "",
    campania: "",
    notas: "",
  }
}

const CTA_WA = `[Escribinos por WhatsApp](${BRAND.whatsapp})` + ` (**${BRAND.whatsappTel}**, Santa Cruz de la Sierra)`

/** Cuerpo inicial markdown según canal/tipo/dir. */
export function scaffoldBody(canal: string, tipo: string, titulo: string, dir: string): string {
  const t = (titulo || "").replace(/[\n\r]+/g, " ").slice(0, 90)
  switch (canal) {
    case "blog":
      return `## Introducción

Contexto del tema para el lector (ganadero, Santa Cruz, 4–6 líneas). Qué problema ataca este texto y por qué importa ahora.

## Desarrollo

### Sección 1

[DATO PENDIENTE: dato verificable del rodeo o del mercado]

Explicación técnica sobria sobre los cuatro pilares: genética de élite, nutrición de calidad, sanidad y bioseguridad, rentabilidad sustentable.

### Sección 2

-desarrollo con ejemplos concretos y números cuando existan. Nada de promesas de retorno; todo en condicional y derivando a asesoría.-

## Conclusión y CTA

Resumen en tres líneas y llamado a la acción conversacional:

${CTA_WA} para coordinar una charla con un asesor.

---

_Canales oficiales: Facebook ${BRAND.facebook} · Instagram ${BRAND.instagram}_`
    case "email":
      if (tipo === "secuencia") {
        return `## Email 1 — Bienvenida

**Asunto:** Bienvenido ${"{nombre}"} — así empezamos

Hola ${"{nombre}"}:

Gracias por sumarte. En cinco líneas Te contamos quiénes somos: gestión de inversiones ganaderas y producción pecuaria de alto rendimiento. Cuatro pilares: genética de élite, nutrición de calidad, sanidad y bioseguridad, rentabilidad sustentable.

${CTA_WA}

## Email 2 — Confianza

**Asunto:** Cómo trabajamos la genética y la nutrición

Contenido educativo con datos verificables. [DATO PENDIENTE: métricas reales]. Compliance: sin cifras de ROI ni promesas de retorno.

${CTA_WA}

## Email 3 — Conversión suave

**Asunto:** Invertir en ganado: los primeros pasos

Exposición del servicio + invitación concreta a conversar con un asesor.

${CTA_WA}`
      }
      return `## Pre-texto

Una línea corta que va antes del asunto en la bandeja.

## Asunto — variantes

1. ${t || "Asunto principal (≤ 60 caracteres)"}
2. Variante B — enfoque en beneficio para el ganadero

## Cuerpo

Hola ${"{nombre}"}:

Cuerpo del envío único en voseo suave. Compliance: nada de retornos garantizados, cifras de ROI ni "sin riesgo"; formulá en condicional y remití a asesoría por WhatsApp.

${CTA_WA}

---

Agro-Prime — *Excelencia en Ganadería*
Facebook: ${BRAND.facebook} · Instagram: ${BRAND.instagram}

## Texto plano

Versión de solo texto del mismo envío.

<!--html-inicio-->
<!-- HTML autocontenido: inline CSS, estructura de tablas, ancho máx. 640 px, listo para la API de Resend. -->
<!--html-fin-->`
    case "social":
      return `## Gancho (primeros 3 segundos)

Texto del gancho visual/verbal.

## Desarrollo

Escena a escena (reel) o movimiento del carrusel. Reutilizá material existente de agroprime-assets cuando aplique (dirección de arte si corresponde).

## CTA

${CTA_WA} · Instagram ${BRAND.instagram}`
    case "ads":
      if (dir === "ads/google") {
        return `## Ruta final

1. https://agroprime.clubea/{ruta}
2. (segunda URL si aplica)

## Titulares (15 × 30 caracteres)

1. ${t.slice(0, 30) || "Titular del anuncio"}
2. Genética de élite
3. Nutrición de calidad
4. Sanidad y bioseguridad
5. Rentabilidad sustentable
6–15. (completar, cada uno ≤ 30 caracteres)

## Descripciones (4 × 90 caracteres)

1. (≤ 90 caracteres, voseo suave, sin promesas de retorno)
2. Escribinos por WhatsApp: ${BRAND.whatsappTel}
3. (completar)
4. (completar)

## CTA

Enviar mensaje por WhatsApp → ${BRAND.whatsapp}

## UTM

utm_source=google&utm_medium=cpc&utm_campaign=${(titulo ? new Date().toISOString().slice(0, 10) : "campania") + "-" + titulo.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`
      }
      return `## Objetivo de campaña

Objetivo (conversaciones por WhatsApp / tráfico / remarketing).

## Audiencia

Santa Cruz y alrededores, intereses ganaderos, públicos propios y remarketing.

## Primario (texto del anuncio)

Cuerpo en voseo suave. Compliance siempre.

## Titular

${t || "Titular ≤ 40 caracteres"}

## Descripción

Descripción ≤ 90 caracteres.

## CTA

Enviar mensaje por WhatsApp → ${BRAND.whatsapp}

## UTM

utm_source=meta&utm_medium=paid&utm_campaign=${(titulo ? new Date().toISOString().slice(0, 10) : "campania") + "-" + titulo.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`
    case "outreach":
      return `## Contexto

Quién escribe, a quién se busca y con qué objetivo.

## Guion WhatsApp

1. Saludo con referencia concreta a la persona o empresa.
2. Valor: qué propone Agro-Prime en una línea.
3. Pregunta de cualificación (¿tiene rodeo propio / interés en invertir?).
4. CTA: ${CTA_WA}

## Guion email

Asunto / cuerpo en cinco líneas, mismo flujo.`
    case "alianzas":
      if (dir === "alianzas/campanas") {
        return `## Deal propuesto

Qué gana el partner y qué gana Agro-Prime.

## Entregables

1. Serie de historias — fecha
2. Post en feed — fecha
3. Reel — fecha

## Economics

Permuta / comisión. Compliance: nunca cifras de retorno garantizadas.

## CTA

Contacto: ${CTA_WA}`
      }
      return `## Perfil

- Nombre / handle:
- Segmento:
- Alcance estimado: [DATO PENDIENTE]

## Encaje

Dónde y por qué encaja con Agro-Prime.

## Contacto

WhatsApp / DM / email — ${CTA_WA}`
    default:
      return t
  }
}

/** Post-spec inicial (paired o directo en social/calendario). */
export function scaffoldSpec(opts: { id: string; titulo: string; formato?: string; estado?: string }): PostSpec {
  return {
    schema: "agroprime.social/1.0",
    id: opts.id,
    plataforma: "instagram",
    plataformas_extra: [],
    fecha_publicacion: "",
    formato: opts.formato || "imagen",
    titulo: opts.titulo,
    caption: "",
    primer_comentario: "",
    hashtags: [],
    media: [],
    cta: { tipo: "whatsapp", texto: "Escribinos por WhatsApp", url: BRAND.whatsapp },
    campania: null,
    estado: opts.estado && isEstado(opts.estado) ? opts.estado : "idea",
    responsable: "",
    notas: "",
  }
}

/** CSV de lista de outreach. */
export const CSV_HEADER =
  "fecha,nombre,empresa,segmento,telefono,canal,guion_id,estado,fecha_contacto,resultado,notas"
