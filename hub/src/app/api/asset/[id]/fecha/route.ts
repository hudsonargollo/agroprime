import { NextRequest, NextResponse } from "next/server"
import { patchFecha } from "@/lib/content"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { snapshot } from "@/lib/git"
import { logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"

/** PATCH /api/asset/[id]/fecha — escribe la fecha ISO -04:00 en el archivo. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role === "viewer") {
    return NextResponse.json({ error: "Tu rol es de solo lectura" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const fecha = String(body.fecha ?? "")
  try {
    const rel = decodeId(id)
    if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")
    const iso = patchFecha(rel, fecha)
    await snapshot(rel, `fecha → ${iso}`, user.email)
    logActivity(user.id, "fecha_cambiada", `${rel} → ${iso}`)
    return NextResponse.json({ ok: true, fecha: iso })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo guardar la fecha" },
      { status: 400 }
    )
  }
}
