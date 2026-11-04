import { NextRequest, NextResponse } from "next/server"
import { history } from "@/lib/git"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { userFromRequest } from "@/lib/guard"

/** GET /api/history?id=<assetId> — últimos 20 commits del archivo. */
export async function GET(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const id = req.nextUrl.searchParams.get("id") ?? ""
  try {
    const rel = decodeId(id)
    if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")
    const entries = await history(rel, 20)
    return NextResponse.json({ entries })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo leer el historial", entries: [] },
      { status: 400 },
    )
  }
}
