/**
 * Resolución de rutas y guardia de seguridad (path traversal).
 * Todo archivo leído/escrito por el Hub pasa por resolveRelPath().
 */
import fs from "node:fs"
import path from "node:path"

/** Directorios permitidos: canal/subdir. */
const ALLOWED_DIRS = [
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
] as const

export type AllowedDir = (typeof ALLOWED_DIRS)[number]

let cachedContentDir: string | null = null
let cachedRepoRoot: string | null = null

/** Resuelve CONTENT_DIR (env o débito estándar del repo) y verifica que exista. */
export function contentDir(): string {
  if (cachedContentDir) return cachedContentDir
  const candidates: string[] = []
  if (process.env.CONTENT_DIR) candidates.push(path.resolve(process.env.CONTENT_DIR))
  let cur = path.resolve(process.cwd())
  for (let i = 0; i < 5; i++) {
    candidates.push(path.join(cur, "marketing-machine/workflow"))
    const parent = path.dirname(cur)
    if (parent === cur) break
    cur = parent
  }
  for (const c of candidates) {
    try {
      if (fs.statSync(c).isDirectory()) {
        cachedContentDir = c
        return c
      }
    } catch {
      /* sigue */
    }
  }
  // Último recurso (aunque no exista aún): primer candidato
  cachedContentDir = candidates[0]
  return cachedContentDir
}

/** Raíz del repo para git: primer ancestro de CONTENT_DIR con .git (fallback: 2 niveles arriba). */
export function repoRoot(): string {
  if (cachedRepoRoot) return cachedRepoRoot
  let cur = path.dirname(contentDir())
  for (let i = 0; i < 8; i++) {
    try {
      if (fs.existsSync(path.join(cur, ".git"))) {
        cachedRepoRoot = cur
        return cur
      }
    } catch {
      /* sigue */
    }
    const parent = path.dirname(cur)
    if (parent === cur) break
    cur = parent
  }
  cachedRepoRoot = path.resolve(contentDir(), "..", "..")
  return cachedRepoRoot
}

/** Normaliza y valida una ruta relativa contra la lista blanca. Lanza si es inválida. */
export function resolveRelPath(rel: string): { abs: string; dir: AllowedDir; base: string } {
  const norm = path.posix.normalize(rel)
  if (norm.startsWith("..") || path.isAbsolute(norm)) throw new Error("Ruta fuera de CONTENT_DIR")
  if (!/\.(md|json|csv)$/.test(norm)) throw new Error("Extensión no permitida")
  const dir = path.posix.dirname(norm) === "." ? "" : path.posix.dirname(norm)
  const allowed = ALLOWED_DIRS.find((d) => d === dir)
  if (!allowed) throw new Error("Directorio no permitido: " + dir)
  const base = path.posix.basename(norm)
  if (!base || base.startsWith(".")) throw new Error("Nombre de archivo inválido")
  const abs = path.join(contentDir(), norm)
  const realCheck = path.resolve(abs)
  const root = contentDir()
  if (realCheck !== root && !realCheck.startsWith(root + path.sep)) {
    throw new Error("Ruta fuera de CONTENT_DIR")
  }
  return { abs: realCheck, dir: allowed as AllowedDir, base }
}

export function isValidRelPath(rel: string): boolean {
  try {
    resolveRelPath(rel)
    return true
  } catch {
    return false
  }
}

/** ID de URL para assets: base64url de la ruta relativa. */
export function encodeId(rel: string): string {
  return Buffer.from(rel, "utf8").toString("base64url")
}
export function decodeId(id: string): string {
  const rel = Buffer.from(id, "base64url").toString("utf8")
  // round-trip para detectar manipulación
  if (Buffer.from(rel, "utf8").toString("base64url") !== id) throw new Error("ID inválido")
  return rel
}

export function allAllowedDirs(): readonly string[] {
  return ALLOWED_DIRS
}

export function dirForCanal(canal: string): AllowedDir[] {
  return ALLOWED_DIRS.filter((d) => d.startsWith(canal + "/")) as AllowedDir[]
}

export function canalOfDir(dir: string): string {
  return dir.split("/")[0]
}
