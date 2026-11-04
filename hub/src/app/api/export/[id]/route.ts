import { NextRequest, NextResponse } from "next/server"
import matter from "gray-matter"
import { readFullAsset } from "@/lib/content"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { extractHtmlBlock, mdToHtmlFragment } from "@/lib/exporters"
import { vevent, icsCalendar } from "@/lib/ics"
import { userFromRequest } from "@/lib/guard"

function fullHtmlDoc(title: string, inner: string | null): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<style>
  body{max-width:720px;margin:2rem auto;padding:0 1rem;font-family:Georgia,serif;line-height:1.6;color:#241b0d;background:#faf6ec}
  h1,h2,h3{font-family:system-ui,sans-serif;color:#7a621f}
  blockquote{border-left:3px solid #c9a44a;padding-left:1rem;color:#5c5142}
  code{background:#efe6d2;padding:1px 5px;border-radius:4px}
  a{color:#7a621f}
</style></head>
<body>${inner ?? ""}
<p><em>Agro-Prime — Excelencia en Ganadería · <a href="https://facebook.com/AgroPrimeBolivia">facebook.com/AgroPrimeBolivia</a> · <a href="https://instagram.com/agroprime_bolivia">@agroprime_bolivia</a></em></p>
</body></html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** GET /api/export/[id]?formato=md|html|json|csv|ics (`&seccion=bloque` para emails). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const { id } = await params
  const formato = req.nextUrl.searchParams.get("formato") ?? "md"
  const seccion = req.nextUrl.searchParams.get("seccion")

  try {
    const rel = decodeId(id)
    if (!isValidRelPath(rel)) throw new Error("Ruta fuera de CONTENT_DIR")
    const data = readFullAsset(rel)
    const base = (rel.split("/").pop() ?? "asset").replace(/\.(md|json|csv)$/, "")

    let content = ""
    let mime = "text/plain; charset=utf-8"

    switch (formato) {
      case "md": {
        if (data.kind !== "md" || !data.fm) throw new Error("Exportación MD solo para archivos markdown")
        content = matter.stringify(data.body, data.fm)
        mime = "text/markdown; charset=utf-8"
        break
      }
      case "html": {
        if (data.kind !== "md") throw new Error("Exportación HTML solo para archivos markdown")
        const bloque = extractHtmlBlock(data.body)
        if (seccion === "bloque" || (rel.startsWith("email/campanas/") && bloque)) {
          // email: solo el bloque HTML autocontenido listo para Resend
          content = bloque || "<p>Sin bloque HTML todavía (<!--html-inicio/--><!--html-fin/>).</p>"
          content = fullHtmlDoc((data.fm?.titulo || base) + " · HTML para Resend", content)
        } else {
          content = fullHtmlDoc(data.fm?.titulo || base, mdToHtmlFragment(data.body))
        }
        mime = "text/html; charset=utf-8"
        break
      }
      case "json": {
        if (data.kind === "json" && data.spec) content = JSON.stringify(data.spec, null, 2)
        else if (data.kind === "md" && data.fm) content = JSON.stringify({ ...data.fm, body: data.body }, null, 2)
        else throw new Error("Exportación JSON no disponible para este archivo")
        mime = "application/json; charset=utf-8"
        break
      }
      case "csv": {
        if (data.kind !== "csv") throw new Error("Exportación CSV solo para listas de outreach")
        const rowLine = (r: string[]) =>
          r.map((c) => (/[",\r\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c)).join(",")
        content = [rowLine(data.csvHeader), ...data.csvRows.map(rowLine)].join("\r\n")
        mime = "text/csv; charset=utf-8"
        break
      }
      case "ics": {
        const iso = data.spec?.fecha_publicacion || data.fm?.fecha_programada || ""
        if (!iso) throw new Error("El asset no tiene fecha programada")
        content = icsCalendar(
          vevent(
            data.spec?.id || data.fm?.id || base,
            iso,
            (data.spec?.titulo || data.fm?.titulo || base) + " (Mkt Hub Agro-Prime)",
            data.spec?.caption ? data.spec.caption.slice(0, 400) : (data.fm?.notas || ""),
          ),
        )
        mime = "text/calendar; charset=utf-8"
        break
      }
      default:
        throw new Error("Formato no soportado: " + formato)
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${base}.${formato}"`,
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo exportar" },
      { status: 400 },
    )
  }
}
