/** Tipos compartidos y constantes del pipeline de contenido. */

export const CANALES = ["blog", "email", "social", "ads", "outreach", "alianzas"] as const
export type Canal = (typeof CANALES)[number]

export const TIPOS = [
  "articulo",
  "secuencia",
  "campania",
  "post",
  "reel",
  "guion",
  "variante",
  "lista",
  "script",
  "deal",
] as const
export type Tipo = (typeof TIPOS)[number]

export const ESTADOS = ["idea", "en_progreso", "revision", "aprobado", "programado", "publicado"] as const
export type Estado = (typeof ESTADOS)[number]

export const PLATAFORMAS = ["instagram", "facebook", "tiktok", "ambas_fb_ig"] as const
export const FORMATOS = ["reel", "imagen", "carrusel", "story", "video_largo"] as const
export const CTA_TIPOS = ["whatsapp", "tienda", "perfil", "sin_cta"] as const

/** Tiempo por defecto de asset según directorio (para creación). */
export const TIPO_DEFAULT_DIR: Record<string, Tipo> = {
  "blog/topics": "articulo",
  "blog/research": "articulo",
  "blog/drafts": "articulo",
  "blog/published": "articulo",
  "blog/rewrites": "articulo",
  "email/secuencias": "secuencia",
  "email/campanas": "campania",
  "ads/meta": "variante",
  "ads/google": "variante",
  "outreach/listas": "lista",
  "outreach/guiones": "guion",
  "social/calendario": "post",
  "social/posts": "post",
  "social/reels": "reel",
  "alianzas/prospectos": "deal",
  "alianzas/campanas": "deal",
}

export const NOMBRE_DIRS: Record<string, string> = {
  "blog/topics": "Ideas / topics",
  "blog/research": "Investigación",
  "blog/drafts": "Borradores",
  "blog/published": "Publicados",
  "blog/rewrites": "Reescrituras",
  "email/secuencias": "Secuencias de goteo",
  "email/campanas": "Envíos únicos",
  "ads/meta": "Meta (FB/IG)",
  "ads/google": "Google Ads (RSA)",
  "outreach/listas": "Listas de prospectos",
  "outreach/guiones": "Guiones",
  "social/calendario": "Calendario (post-specs)",
  "social/posts": "Posts",
  "social/reels": "Reels / stories",
  "alianzas/prospectos": "Prospectos",
  "alianzas/campanas": "Campañas y deals",
}

/** Front-matter de estado universal. */
export interface FrontMatter {
  id: string
  canal: string
  tipo: string
  titulo: string
  estado: string
  responsable: string
  fecha_programada: string
  campania: string
  notas: string
}

/** Post-spec agroprime.social/1.0 */
export interface PostSpec {
  schema: string
  id: string
  plataforma: string
  plataformas_extra: string[]
  fecha_publicacion: string
  formato: string
  titulo: string
  caption: string
  primer_comentario: string
  hashtags: string[]
  media: Array<{ tipo: string; brief: string; referencia_importada: string }>
  cta: { tipo: string; texto: string; url: string }
  campania: string | null
  estado: string
  responsable: string
  notas: string
}

/** Asset tal como lo consume la UI (lista). */
export interface AssetListItem {
  id: string // base64url de la ruta relativa
  ruta: string // ruta relativa a CONTENT_DIR, posix
  kind: "md" | "json" | "csv"
  canal: string
  tipo: string
  titulo: string
  estado: string
  responsable: string
  fecha: string // ISO o ""
  campania: string
  dir: string
}

export const BRAND = {
  whatsapp: "https://wa.me/59169535546",
  whatsappTel: "+591 69535546",
  facebook: "https://facebook.com/AgroPrimeBolivia",
  instagram: "https://instagram.com/agroprime_bolivia",
  tz: "-04:00",
}

/** Lista blanca de directorios (constante client-safe; lib/paths tiene el guard real). */
export const DIRS = [
  "blog/topics",
  "blog/research",
  "blog/drafts",
  "blog/published",
  "blog/rewrites",
  "email/secuencias",
  "email/campanas",
  "ads/meta",
  "ads/google",
  "outreach/listas",
  "outreach/guiones",
  "social/calendario",
  "social/posts",
  "social/reels",
  "alianzas/prospectos",
  "alianzas/campanas",
]
