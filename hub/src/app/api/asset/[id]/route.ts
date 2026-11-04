import { NextRequest, NextResponse } from "next/server"
import { deleteAsset, readFullAsset, writeMarkdown, writeSpec } from "@/lib/content"
import { ESTADOS, FrontMatter, PostSpec } from "@/lib/types"
import { decodeId, isValidRelPath, resolveRelPath } from "@/lib/paths"
import { snapshot } from "@/lib/git"
import { logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"

async function relOf(id: string): Promise<string> {
  const rel = decodeId(id)
  if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")
  return rel
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const { id } = await params
  try {
    const rel = await relOf(id)
    const data = readFullAsset(rel)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo leer el asset" },
      { status: 400 }
    )
  }
}

/** PUT /api/asset/[id] — guarda front-matter + cuerpo (md) o post-spec (json). */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role === "viewer") {
    return NextResponse.json({ error: "Tu rol es de solo lectura" }, { status: 403 })
  }
  const { id } = await params
  try {
    const rel = await relOf(id)
    const body = await req.json().catch(() => ({}))

    if (rel.endsWith(".json")) {
      const full = readFullAsset(rel)
      if (!full.spec) throw new Error("No es un post-spec")
      const incoming = body.spec as PostSpec
      if (!incoming) return NextResponse.json({ error: "Falta el campo spec" }, { status: 400 })
      // invariantes: schema, id, fecha y estado clamped
      const safe: PostSpec = {
        ...incoming,
        schema: "agroprime.social/1.0",
        id: full.spec.id,
        fecha_publicacion: full.spec.fecha_publicacion,
        estado: (ESTADOS as readonly string[]).includes(incoming.estado) ? incoming.estado : full.spec.estado,
      }
      writeSpec(rel, safe)
      await snapshot(rel, "editado", user.email)
      logActivity(user.id, "asset_guardado", rel)
      return NextResponse.json({ ok: true })
    }

    const full = readFullAsset(rel)
    if (!full.fm) throw new Error("No es markdown")
    const incoming = body.fm as FrontMatter | undefined
    if (!incoming) return NextResponse.json({ error: "Falta el campo fm" }, { status: 400 })
    // invariantes: id, canal y tipo no cambian por esta vía
    const safe: FrontMatter = {
      ...full.fm,
      titulo: String(incoming.titulo ?? full.fm.titulo).slice(0, 200),
      estado: (ESTADOS as readonly string[]).includes(incoming.estado) ? incoming.estado : full.fm.estado,
      responsable: String(incoming.responsable ?? full.fm.responsable).slice(0, 120),
      fecha_programada: full.fm.fecha_programada,
      campania: String(incoming.campania ?? full.fm.campania).slice(0, 120),
      notas: String(incoming.notas ?? full.fm.notas).slice(0, 500),
    }
    const newBody = typeof body.body === "string" ? body.body : full.body
    writeMarkdown(rel, safe, newBody)
    await snapshot(rel, "editado", user.email)
    logActivity(user.id, "asset_guardado", rel)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo guardar" },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role === "viewer") {
    return NextResponse.json({ error: "Tu rol es de solo lectura" }, { status: 403 })
  }
  const { id } = await params
  try {
    const rel = await relOf(id)
    deleteAsset(rel)
    await snapshot(rel, "eliminado", user.email)
    logActivity(user.id, "asset_eliminado", rel)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo eliminar" },
      { status: 400 }
    )
  }
}
