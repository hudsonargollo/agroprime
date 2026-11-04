/**
 * Capa de contenido: lectura/escritura de md (front-matter), JSON post-specs y CSV.
 */
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import {
  AssetListItem,
  ESTADOS,
  FrontMatter,
  PostSpec,
  TIPO_DEFAULT_DIR,
} from "./types"
import { allAllowedDirs, canalOfDir, contentDir, encodeId, resolveRelPath } from "./paths"

export type { AssetListItem }

function fmToStr(v: unknown): string {
  if (v == null) return ""
  if (typeof v === "string") return v
  if (typeof v === "number" || typeof v === "boolean") return String(v)
  return ""
}

function normEstado(v: unknown): string {
  const s = fmToStr(v)
  return (ESTADOS as readonly string[]).includes(s) ? s : "idea"
}

function slugpart(name: string): string {
  const noExt = name.replace(/\.(md|json|csv)$/, "")
  return noExt
}

function titleCaseSlug(p: string): string {
  const tail = p.split("-").slice(5).join(" ") // <canal>-<fecha>-<slug...>
  return tail ? tail.charAt(0).toUpperCase() + tail.slice(1) : p
}

/** Lista todos los assets (md + json) para el Kanban; csv solo para /archivo. */
export function listAssets(includeCsv = false): AssetListItem[] {
  const out: AssetListItem[] = []
  for (const dir of allAllowedDirs()) {
    const abs = path.join(contentDir(), dir)
    let files: string[] = []
    try {
      files = fs.readdirSync(abs)
    } catch {
      continue
    }
    for (const f of files) {
      if (f.startsWith(".")) continue
      const kind = f.endsWith(".md") ? "md" : f.endsWith(".json") ? "json" : f.endsWith(".csv") ? "csv" : null
      if (!kind) continue
      if (kind === "csv" && !includeCsv) continue
      const rel = dir + "/" + f
      let item: AssetListItem
      try {
        const entry = readEntry(rel, kind as "md" | "json" | "csv")
        item = entry
      } catch {
        item = {
          id: encodeId(rel),
          ruta: rel,
          kind: kind as AssetListItem["kind"],
          canal: canalOfDir(dir),
          tipo: TIPO_DEFAULT_DIR[dir] ?? "articulo",
          titulo: titleCaseSlug(slugpart(f)),
          estado: "idea",
          responsable: "",
          fecha: "",
          campania: "",
          dir,
        }
      }
      out.push(item)
    }
  }
  out.sort((a, b) => a.ruta.localeCompare(b.ruta))
  return out
}

function readEntry(rel: string, kind: "md" | "json" | "csv"): AssetListItem {
  const { abs, dir } = resolveRelPath(rel)
  const raw = fs.readFileSync(abs, "utf8")
  const base = {
    id: encodeId(rel),
    ruta: rel,
    kind: kind as AssetListItem["kind"],
    canal: canalOfDir(dir),
    tipo: "",
    titulo: "",
    estado: "idea",
    responsable: "",
    fecha: "",
    campania: "",
    dir,
  }
  if (kind === "md") {
    const fm = matter(raw).data as Record<string, unknown>
    return {
      ...base,
      tipo: fmToStr(fm.tipo) || TIPO_DEFAULT_DIR[dir] || "articulo",
      titulo: fmToStr(fm.titulo) || titleCaseSlug(slugpath(rel)),
      estado: normEstado(fm.estado),
      responsable: fmToStr(fm.responsable),
      fecha: fmToStr(fm.fecha_programada),
      campania: fmToStr(fm.campania),
    }
  }
  if (kind === "json") {
    const j = JSON.parse(raw) as Record<string, unknown>
    return {
      ...base,
      tipo: fmToStr(j.formato) ? "post" : TIPO_DEFAULT_DIR[dir] || "post",
      titulo: fmToStr(j.titulo) || titleCaseSlug(slugpath(rel)),
      estado: normEstado(j.estado),
      responsable: fmToStr(j.responsable),
      fecha: fmToStr(j.fecha_publicacion),
      campania: fmToStr(j.campania),
    }
  }
  // csv: metadatos mínimos (el Kanban no lo usa)
  return { ...base, tipo: "lista", titulo: titleCaseSlug(slugpart2(rel)) }
}

function slugpath(rel: string): string {
  return path.basename(rel).replace(/\.(md|json|csv)$/, "")
}
function slugpart2(rel: string): string {
  return slugpath(rel)
}

export interface FullAsset {
  ruta: string
  kind: "md" | "json" | "csv"
  fm: FrontMatter | null
  body: string
  spec: PostSpec | null
  csvHeader: string[]
  csvRows: string[][]
}

/** Lee el contenido completo para el editor. */
export function readFullAsset(rel: string): FullAsset {
  const { abs } = resolveRelPath(rel)
  const raw = fs.readFileSync(abs, "utf8")
  if (rel.endsWith(".json")) {
    const rawSpec = JSON.parse(raw) as Partial<PostSpec>
    const spec = normalizeSpec(rawSpec, rel)
    return { ruta: rel, kind: "json", fm: null, body: "", spec, csvHeader: [], csvRows: [] }
  }
  if (rel.endsWith(".csv")) {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "")
    const [header = "", ...rows] = lines
    const csvHeader = parseCsvLine(header)
    const csvRows = rows.map(parseCsvLine)
    return { ruta: rel, kind: "csv", fm: null, body: raw, spec: null, csvHeader, csvRows }
  }
  const parsed = matter(raw)
  const d = parsed.data as Record<string, unknown>
  const fm: FrontMatter = {
    id: fmToStr(d.id),
    canal: fmToStr(d.canal) || canalOfDir(path.dirname(rel)),
    tipo: fmToStr(d.tipo) || "articulo",
    titulo: fmToStr(d.titulo) || titleCaseSlug(path.basename(rel, ".md")),
    estado: normEstado(d.estado),
    responsable: fmToStr(d.responsable),
    fecha_programada: fmToStr(d.fecha_programada),
    campania: fmToStr(d.campania),
    notas: fmToStr(d.notas),
  }
  return { ruta: rel, kind: "md", fm, body: parsed.content, spec: null, csvHeader: [], csvRows: [] }
}

export function normalizeSpec(raw: Partial<PostSpec>, rel: string): PostSpec {
  const dir = path.dirname(rel)
  return {
    schema: "agroprime.social/1.0",
    id: raw.id ?? path.basename(rel, ".json"),
    plataforma: raw.plataforma ?? "instagram",
    plataformas_extra: Array.isArray(raw.plataformas_extra) ? raw.plataformas_extra.map(String) : [],
    fecha_publicacion: raw.fecha_publicacion ?? "",
    formato: raw.formato ?? "imagen",
    titulo: raw.titulo ?? "",
    caption: raw.caption ?? "",
    primer_comentario: raw.primer_comentario ?? "",
    hashtags: Array.isArray(raw.hashtags) ? raw.hashtags.map(String) : [],
    media: Array.isArray(raw.media)
      ? raw.media.map((m) => ({
          tipo: m?.tipo ?? "imagen",
          brief: m?.brief ?? "",
          referencia_importada: m?.referencia_importada ?? "",
        }))
      : [],
    cta: {
      tipo: raw.cta?.tipo ?? "whatsapp",
      texto: raw.cta?.texto ?? "",
      url: raw.cta?.url ?? "",
    },
    campania: raw.campania ?? null,
    estado: (ESTADOS as readonly string[]).includes(raw.estado ?? "") ? (raw.estado as string) : "idea",
    responsable: raw.responsable ?? "",
    notas: raw.notas ?? "",
  }
}

/** Escribe un asset md con front-matter en orden canónico. */
export function writeMarkdown(rel: string, fm: FrontMatter, body: string): void {
  const { abs } = resolveRelPath(rel)
  const ordered: FrontMatter = {
    id: fm.id,
    canal: fm.canal,
    tipo: fm.tipo,
    titulo: fm.titulo,
    estado: fm.estado,
    responsable: fm.responsable ?? "",
    fecha_programada: fm.fecha_programada ?? "",
    campania: fm.campania ?? "",
    notas: fm.notas ?? "",
  }
  const out = matter.stringify(body, ordered as unknown as Record<string, unknown>, { lineWidth: -1 } as never)
  fs.writeFileSync(abs, out, "utf8")
}

/** Persiste un post-spec como JSON bonito. */
export function writeSpec(rel: string, spec: PostSpec): void {
  const { abs } = resolveRelPath(rel)
  fs.writeFileSync(abs, JSON.stringify(spec, null, 2) + "\n", "utf8")
}

/** parche directo: estado (md o json). */
export function patchEstado(rel: string, estado: string): void {
  if (!(ESTADOS as readonly string[]).includes(estado)) throw new Error("Estado inválido")
  const kind = rel.endsWith(".json") ? "json" : rel.endsWith(".csv") ? "csv" : "md"
  if (kind === "json") {
    const full = readFullAsset(rel)
    if (!full.spec) throw new Error("No es un post-spec")
    full.spec.estado = estado
    writeSpec(rel, full.spec)
    return
  }
  if (kind === "csv") {
    // estado vive en la columna "estado"
    const full = readFullAsset(rel)
    const i = full.csvHeader.indexOf("estado")
    if (i === -1) throw new Error("CSV sin columna estado")
    const lines = full.csvRows.map((r) => {
      r[i] = estado
      return r.map(quoteCsv).join(",")
    })
    fs.writeFileSync(resolveRelPath(rel).abs, [full.csvHeader.join(","), ...lines].join("\n") + "\n", "utf8")
    return
  }
  const full = readFullAsset(rel)
  if (!full.fm) throw new Error("No es markdown")
  full.fm.estado = estado
  writeMarkdown(rel, full.fm, full.body)
}

/** parche directo: fecha (front-matter o fecha_publicacion del spec). Devuelve la ISO escrita. */
export function patchFecha(rel: string, iso: string): string {
  const value = toLapazISO(rel, iso)
  const kind = rel.endsWith(".json") ? "json" : "md"
  if (kind === "json") {
    const full = readFullAsset(rel)
    if (!full.spec) throw new Error("No es un post-spec")
    full.spec.fecha_publicacion = value
    writeSpec(rel, full.spec)
    return value
  }
  const full = readFullAsset(rel)
  if (!full.fm) throw new Error("No es markdown")
  full.fm.fecha_programada = value
  writeMarkdown(rel, full.fm, full.body)
  return value
}

/** Normaliza cualquier fecha a ISO con zona -04:00 (America/La_Paz). */
export function toLapazISO(_rel: string, input: string): string {
  const v = (input ?? "").trim()
  if (!v) return ""
  // datetime-local: 2026-11-15T08:00 (sin zona) → asumimos -04:00
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return v + ":00-04:00"
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(v)) return v + "-04:00"
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v + "T08:00:00-04:00"
  const d = new Date(v)
  if (isNaN(d.getTime())) throw new Error("Fecha inválida: " + input)
  // desplazamos a la zona -04:00 formateando manualmente
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}-04:00`
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else inQ = false
      } else cur += c
    } else if (c === '"') inQ = true
    else if (c === ",") {
      out.push(cur)
      cur = ""
    } else cur += c
  }
  out.push(cur)
  return out
}

function quoteCsv(v: string): string {
  const s = v ?? ""
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

/** CSV completo para exportar/escribir de vuelta. */
export function writeCsv(rel: string, header: string[], rows: string[][]): void {
  const { abs } = resolveRelPath(rel)
  const lines = [header.join(","), ...rows.map((r) => r.map(quoteCsv).join(","))]
  fs.writeFileSync(abs, lines.join("\n") + "\n", "utf8")
}

/** Escritura cruda (restrauración git): contenido literal, ya validado por resolveRelPath. */
export function writeRaw(rel: string, content: string): void {
  const { abs } = resolveRelPath(rel)
  fs.writeFileSync(abs, content, "utf8")
}

/** Elimina un archivo (tras validación). */
export function deleteAsset(rel: string): void {
  const { abs } = resolveRelPath(rel)
  fs.unlinkSync(abs)
}
