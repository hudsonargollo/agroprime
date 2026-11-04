/** Helpers de exportación reutilizable (HTML renderizado con marked). */
import { marked } from "marked"

/** Extrae el bloque <!--html-inicio-->…<!--html-fin--> (o ""). */
export function extractHtmlBlock(md: string): string {
  const m = md.match(/<!--html-inicio-->([\s\S]*?)<!--html-fin-->/)
  return m ? m[1].trim() : ""
}

/** Cuerpo markdown → fragmento HTML para el documento exportado. */
export function mdToHtmlFragment(md: string): string {
  try {
    return String(marked.parse(md ?? "", { async: false }))
  } catch {
    return "<p>(error de render)</p>"
  }
}
