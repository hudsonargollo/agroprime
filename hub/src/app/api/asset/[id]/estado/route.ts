import { NextRequest, NextResponse } from "next/server"
import { patchEstado } from "@/lib/content"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { snapshot } from "@/lib/git"
import { logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"

/** PATCH /api/asset/[id]/estado — mueve el asset de columna en el Kanban. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role === "viewer") {
    return NextResponse.json({ error: "Tu rol es de solo lectura" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const estado = String(body.estado ?? "")
  try {
    const rel = decodeId(id)
    if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")
    patchEstado(rel, estado)
    await snapshot(rel, `estado → ${estado}`, user.email)
    logActivity(user.id, "estado_cambiado", `${rel} → ${estado}`)
    return NextResponse.json({ ok: true, estado })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo cambiar el estado" },
      { status: 400 }
    )
  }
}
