import { NextRequest, NextResponse } from "next/server"
import { writeRaw } from "@/lib/content"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { showAt, snapshot } from "@/lib/git"
import { logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"

/**
 * POST /api/restore {file: <assetId>, hash} — restaura el archivo a una versión
 * git y commitea el restore (editor/admin).
 */
export async function POST(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role === "viewer") {
    return NextResponse.json({ error: "Tu rol es de solo lectura" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const id = String(body.file ?? "")
  const hash = String(body.hash ?? "")
  try {
    const rel = decodeId(id)
    if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")

    const antiguo = await showAt(rel, hash)
    if (antiguo === null) throw new Error("No se encontró esa versión en git")

    if (rel.endsWith(".json")) {
      // JSON: se restaura el contenido crudo de la versión git
      writeRaw(rel, antiguo)
    } else {
      writeRaw(rel, antiguo)
    }

    await snapshot(rel, `restaurado a ${hash}`, user.email)
    logActivity(user.id, "version_restaurada", `${rel} → ${hash}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo restaurar" },
      { status: 400 },
    )
  }
}
