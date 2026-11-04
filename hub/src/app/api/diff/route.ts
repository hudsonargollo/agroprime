import { NextRequest, NextResponse } from "next/server"
import { diff } from "@/lib/git"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { userFromRequest } from "@/lib/guard"

/** GET /api/diff?file=<assetId>&a=<hash>&b=<hash> — git diff entre dos versiones. */
export async function GET(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const id = req.nextUrl.searchParams.get("file") ?? ""
  const a = req.nextUrl.searchParams.get("a") ?? ""
  const b = req.nextUrl.searchParams.get("b") ?? ""
  try {
    const rel = decodeId(id)
    if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")
    const text = await diff(rel, a, b)
    return NextResponse.json({ diff: text })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo calcular el diff" },
      { status: 400 },
    )
  }
}
