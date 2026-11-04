import { NextRequest, NextResponse } from "next/server"
import { listAssets } from "@/lib/content"
import { vevent, icsCalendar } from "@/lib/ics"
import { userFromRequest } from "@/lib/guard"

/**
 * GET /api/export.ics — calendario completo (todos los assets con fecha,
 * ventana ±2 meses respecto de hoy).
 */
export async function GET(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const now = Date.now()
  const desde = now - 62 * 86400_000
  const hasta = now + 62 * 86400_000

  const events: string[] = []
  for (const a of listAssets(false)) {
    if (!a.fecha) continue
    const t = new Date(a.fecha).getTime()
    if (isNaN(t) || t < desde || t > hasta) continue
    events.push(
      ...vevent(
        a.id.replace(/[^A-Za-z0-9_-]/g, "") + "@mkt-hub",
        a.fecha,
        `[${a.canal}] ${a.titulo}` + (a.responsable ? ` — ${a.responsable}` : ""),
        a.ruta,
      ),
    )
  }

  return new NextResponse(icsCalendar(events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mkt-hub-calendario.ics"',
    },
  })
}
