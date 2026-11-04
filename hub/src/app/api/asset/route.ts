import { NextRequest, NextResponse } from "next/server"
import { listAssets, writeMarkdown, writeSpec, writeCsv } from "@/lib/content"
import { canalOfDir, isValidRelPath, encodeId, resolveRelPath } from "@/lib/paths"
import { CSV_HEADER, baseFm, scaffoldBody, scaffoldSpec, uniqueName } from "@/lib/templates"
import { snapshot } from "@/lib/git"
import { logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"
import { CANALES } from "@/lib/types"

/** GET /api/asset — lista completa de assets parseados. */
export async function GET(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  return NextResponse.json({ assets: listAssets(true) })
}

/** POST /api/asset — crea un asset nuevo con contenido prestamado por canal/tipo. */
export async function POST(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role === "viewer") {
    return NextResponse.json({ error: "Tu rol es de solo lectura" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const dir = String(body.dir ?? "")
  const tipo = String(body.tipo ?? "")
  const titulo = String(body.titulo ?? "").trim()
  const estado = String(body.estado ?? "idea")
  if (!titulo) return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })

  if (!isValidDirForCreate(dir)) {
    return NextResponse.json({ error: "Directorio no permitido: " + dir }, { status: 400 })
  }
  const canal = canalOfDir(dir)
  if (!(CANALES as readonly string[]).includes(canal)) {
    return NextResponse.json({ error: "Canal inválido" }, { status: 400 })
  }

  try {
    // --- social/calendario: solo JSON post-spec
    if (dir === "social/calendario") {
      const name = uniqueName(dir, canal, titulo, ".json")
      const spec = scaffoldSpec({ id: name, titulo, formato: tipo === "reel" ? "reel" : "imagen", estado })
      writeSpec(dir + "/" + name + ".json", spec)
      const rel = dir + "/" + name + ".json"
      await snapshot(rel, "creado", user.email)
      logActivity(user.id, "asset_creado", rel)
      return NextResponse.json({ id: encodeId(rel), ruta: rel }, { status: 201 })
    }

    // --- outreach/listas: CSV
    if (dir === "outreach/listas") {
      const name = uniqueName(dir, canal, titulo, ".csv")
      const rel = dir + "/" + name + ".csv"
      writeCsv(rel, CSV_HEADER.split(","), [CSV_ROW_PLACEHOLDER])
      await snapshot(rel, "creado", user.email)
      logActivity(user.id, "asset_creado", rel)
      return NextResponse.json({ id: encodeId(rel), ruta: rel }, { status: 201 })
    }

    // --- markdown con (o sin) post-spec emparejado en social
    const name = uniqueName(dir, canal, titulo, ".md")
    const rel = dir + "/" + name + ".md"
    const fm = baseFm({ id: name, canal, tipo: tipo || "articulo", titulo, estado })
    writeMarkdown(rel, fm, scaffoldBody(canal, fm.tipo, titulo, dir))

    let paired = ""
    if (canal === "social" && (dir === "social/posts" || dir === "social/reels")) {
      const spec = scaffoldSpec({
        id: name,
        titulo,
        formato: dir === "social/reels" ? "reel" : "imagen",
        estado,
      })
      paired = "social/calendario/" + name + ".json"
      writeSpec(paired, spec)
    }

    await snapshot(rel, "creado", user.email)
    if (paired) await snapshot(paired, "creado (post-spec emparejado)", user.email)
    logActivity(user.id, "asset_creado", rel + (paired ? ` + ${paired}` : ""))
    return NextResponse.json({ id: encodeId(rel), ruta: rel, paired: paired ? encodeId(paired) : null }, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: "No se pudo crear: " + (e instanceof Error ? e.message : String(e)) },
      { status: 500 }
    )
  }
}

function isValidDirForCreate(dir: string): boolean {
  try {
    resolveRelPath(dir + "/__probe__.md")
    return true
  } catch {
    return false
  }
}

const CSV_ROW_PLACEHOLDER: string[] = [
  new Intl.DateTimeFormat("sv-SE", { timeZone: "America/La_Paz" }).format(new Date()),
  "", "", "", "", "whatsapp", "", "idea", "", "", "",
]
