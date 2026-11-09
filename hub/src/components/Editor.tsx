"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { marked } from "marked"
import { BP } from "@/lib/base"
import { FrontMatter, PostSpec, ESTADOS } from "@/lib/types"
import { FullAsset } from "@/lib/content"
import CopyBtn from "./CopyBtn"
import SpecEditor from "./SpecEditor"
import HistoryPanel, { HistoryEntry } from "./HistoryPanel"

const ESTADO_ETIQUETA: Record<string, string> = {
  idea: "idea",
  en_progreso: "en_progreso",
  revision: "revisión",
  aprobado: "aprobado",
  programado: "programado",
  publicado: "publicado",
}

function renderPreview(md: string): string {
  try {
    return String(marked.parse(md, { async: false }))
  } catch {
    return "<p>(preview no disponible)</p>"
  }
}

/** Extrae el bloque <!--html-inicio-->…<!--html-fin--> (emails). */
export function extractHtmlBlock(md: string): string {
  const m = md.match(/<!--html-inicio-->([\s\S]*?)<!--html-fin-->/)
  return m ? m[1].trim() : ""
}

/** ISO DateTimeLOCAL (America/La_Paz) para <input type="datetime-local">. */
function toLocalInput(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(d)
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}`
}

export default function Editor({
  id,
  data,
  role,
  history,
}: {
  id: string
  data: FullAsset & { tituloFallback: string }
  role: string
  history: HistoryEntry[]
}) {
  const router = useRouter()
  const readonly = role === "viewer"
  const kind = data.kind
  const [fm, setFm] = useState<FrontMatter | null>(data.fm)
  const [body, setBody] = useState(data.body)
  const [spec, setSpec] = useState<PostSpec | null>(data.spec)
  const [msg, setMsg] = useState("")
  const [busy, setBusy] = useState(false)
  const [nuevaFecha, setNuevaFecha] = useState(
    toLocalInput(data.spec?.fecha_publicacion || data.fm?.fecha_programada || "")
  )

  const previewHtml = useMemo(() => renderPreview(body || ""), [body])
  const setFmField = <K extends keyof FrontMatter>(k: K, v: FrontMatter[K]) =>
    fm && setFm({ ...fm, [k]: v })

  function flash(m: string) {
    setMsg(m)
    setTimeout(() => setMsg(""), 2600)
  }

  const exportBase = BP + `/api/export/${id}?formato=`

  async function save() {
    if (readonly || busy) return
    setBusy(true)
    try {
      const payload = kind === "json" ? { spec } : { fm, body }
      const res = await fetch(BP + `/api/asset/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) flash(j.error || "No se pudo guardar")
      else {
        flash("Guardar ✓")
        router.refresh()
      }
    } catch {
      flash("Error de red")
    }
    setBusy(false)
  }

  async function patchEstado(estado: string) {
    if (!estado || readonly) return
    if (kind === "md" && fm) setFmField("estado", estado)
    if (kind === "json" && spec) setSpec({ ...spec, estado })
    const res = await fetch(BP + `/api/asset/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })
    const j = await res.json().catch(() => ({}))
    flash(res.ok ? `Estado → ${estado}` : j.error || "No se pudo cambiar el estado")
  }

  async function patchFecha() {
    if (readonly) return
    if (!nuevaFecha) {
      flash("Elegí la fecha y hora primero")
      return
    }
    const res = await fetch(BP + `/api/asset/${id}/fecha`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha: nuevaFecha }),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok) {
      flash(`Fecha guardada: ${j.fecha}`)
      if (kind === "json" && spec) setSpec({ ...spec, fecha_publicacion: j.fecha })
      if (kind === "md" && fm) setFmField("fecha_programada", j.fecha)
      router.refresh()
    } else flash(j.error || "No se pudo guardar la fecha")
  }

  async function eliminar() {
    if (readonly) return
    if (!confirm("¿Eliminar este archivo del pipeline? (queda en el historial git)")) return
    const res = await fetch(BP + `/api/asset/${id}`, { method: "DELETE" })
    if (res.ok) router.push("/archivo")
    else flash("No se pudo eliminar")
  }

  const copyTodo = useMemo(() => {
    if (kind === "json" && spec) {
      return [spec.caption, spec.primer_comentario, spec.hashtags.join(" ")].filter(Boolean).join("\n\n")
    }
    if (kind === "csv") return body
    return body
  }, [kind, spec, body])

  const htmlEmail = useMemo(() => (kind === "md" ? extractHtmlBlock(body) : ""), [kind, body])
  const esEmailCampania = data.ruta.startsWith("email/campanas/")

  return (
    <div>
      <div className="toolbar">
        <Link href="/archivo" className="btn-ghost">
          ← Archivo
        </Link>
        <h1 style={{ margin: 0, flex: 1 }}>
          {(fm?.titulo || spec?.titulo || data.tituloFallback) && (
            <span>{fm?.titulo || spec?.titulo || data.tituloFallback}</span>
          )}
        </h1>
        <code className="muted small">{data.ruta}</code>
        {kind === "json" && <span className="badge">post-spec</span>}
      </div>

      {readonly && (
        <p className="muted small" style={{ marginTop: 0 }}>
          👁 Solo lectura (rol viewer). No se puede guardar ni mover.
        </p>
      )}

      <div className="actions">
        {!readonly && (
          <button className="btn" onClick={save} disabled={busy}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
        )}
        <select
          aria-label="Estado"
          value={(fm?.estado ?? spec?.estado ?? "") as string}
          disabled={readonly}
          onChange={(e) => patchEstado(e.target.value)}
          style={{ minWidth: 150 }}
        >
          {ESTADOS.map((s) => (
            <option key={s} value={s}>
              {ESTADO_ETIQUETA[s]}
            </option>
          ))}
        </select>
        {!readonly && (
          <button className="btn-ghost" onClick={eliminar} disabled={busy}>
            Eliminar
          </button>
        )}
        <span style={{ flex: 1 }} />
        <CopyBtn text={copyTodo} label="⧉ copiar todo" />
        {kind === "md" && <CopyBtn text={body} label="copiar cuerpo" />}
        {htmlEmail && <CopyBtn text={htmlEmail} label="copiar HTML email" />}
        <a className="btn-ghost" href={exportBase + (kind === "csv" ? "csv" : kind)} download>
          ⤓ {kind === "csv" ? "CSV" : kind.toUpperCase()}
        </a>
        {kind === "md" && (
          <>
            <a className="btn-ghost" href={exportBase + "html"} target="_blank" rel="noreferrer">
              ⤓ HTML
            </a>
            {esEmailCampania && (
              <a className="btn-ghost" href={exportBase + "html?seccion=bloque"} target="_blank" rel="noreferrer">
                ⤓ HTML (solo bloque email)
              </a>
            )}
          </>
        )}
        {kind !== "csv" && (
          <>
            <a className="btn-ghost" href={exportBase + "json"} download>
              ⤓ JSON
            </a>
            <a className="btn-ghost" href={exportBase + "ics"} download>
              ⤓ ICS
            </a>
          </>
        )}
      </div>

      {/* ---------- Editor según kind ---------- */}
      {kind === "md" && fm && (
        <div className="editor-grid">
          <div className="card">
            <div className="formgrid">
              <div className="full">
                <label>
                  <span className="flabel">
                    titulo <CopyBtn text={fm.titulo} />
                  </span>
                </label>
                <input
                  style={{ width: "100%" }}
                  value={fm.titulo}
                  disabled={readonly}
                  onChange={(e) => setFmField("titulo", e.target.value)}
                />
              </div>
              <div>
                <label>id / canal / tipo</label>
                <div className="inline-flex">
                  <code>{fm.id}</code>
                  <span className={`badge canal-${fm.canal}`}>{fm.canal}</span>
                  <span className="badge">{fm.tipo}</span>
                </div>
              </div>
              <div>
                <label>
                  <span className="flabel">
                    estado <CopyBtn text={fm.estado} />
                  </span>
                </label>
                <input style={{ width: "100%" }} value={fm.estado} disabled readOnly />
              </div>
              <div>
                <label>
                  <span className="flabel">
                    responsable <CopyBtn text={fm.responsable} />
                  </span>
                </label>
                <input
                  style={{ width: "100%" }}
                  value={fm.responsable}
                  disabled={readonly}
                  onChange={(e) => setFmField("responsable", e.target.value)}
                />
              </div>
              <div>
                <label>
                  <span className="flabel">
                    fecha_programada <CopyBtn text={fm.fecha_programada} />
                  </span>
                </label>
                <input style={{ width: "100%" }} value={fm.fecha_programada} disabled readOnly />
              </div>
              <div>
                <label>
                  <span className="flabel">
                    campania <CopyBtn text={fm.campania} />
                  </span>
                </label>
                <input
                  style={{ width: "100%" }}
                  value={fm.campania}
                  disabled={readonly}
                  onChange={(e) => setFmField("campania", e.target.value)}
                />
              </div>
              <div className="full">
                <label>
                  <span className="flabel">
                    notas <CopyBtn text={fm.notas} />
                  </span>
                </label>
                <input
                  style={{ width: "100%" }}
                  value={fm.notas}
                  disabled={readonly}
                  onChange={(e) => setFmField("notas", e.target.value)}
                />
              </div>
            </div>

            {!readonly && (
              <div className="card mt" style={{ background: "var(--bg-3)" }}>
                <label>Fecha / hora (America/La_Paz, UTC−4)</label>
                <div className="inline-flex">
                  <input
                    type="datetime-local"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                  />
                  <button className="btn-ghost" onClick={patchFecha}>
                    Escribir fecha en el archivo
                  </button>
                </div>
                <p className="muted small" style={{ marginBottom: 0 }}>
                  Se guarda como ISO con zona −04:00 para que el motor de programación lo levante.
                </p>
              </div>
            )}
          </div>

          <div className="card" style={{ maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div className="inline-flex" style={{ justifyContent: "space-between", width: "100%" }}>
              <b>Cuerpo (Markdown)</b>
              <CopyBtn text={body} label="copiar cuerpo" />
            </div>
            <textarea
              rows={22}
              value={body}
              disabled={readonly}
              onChange={(e) => setBody(e.target.value)}
              style={{ flex: 1, marginTop: "0.4rem" }}
            />
          </div>
        </div>
      )}

      {kind === "md" && (
        <div className="card mt">
          <b>Vista previa</b>
          <div className="preview mt" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}

      {kind === "json" && spec && (
        <>
          {!readonly && (
            <div className="card" style={{ background: "var(--bg-3)", marginBottom: "0.8rem" }}>
              <label>Fecha / hora de publicación (America/La_Paz)</label>
              <div className="inline-flex">
                <input
                  type="datetime-local"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                />
                <button className="btn-ghost" onClick={patchFecha}>
                  Escribir fecha_publicacion
                </button>
              </div>
            </div>
          )}
          <SpecEditor spec={spec} setSpec={setSpec} readonly={readonly} />
        </>
      )}

      {kind === "csv" && (
        <div className="card">
          <p className="muted small">
            Lista de outreach ({data.csvRows?.length ?? 0} filas). La edición de las filas se hace
            editando el CSV en el repo; acá podés copiarlo o descargarlo.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table className="filetable">
              <thead>
                <tr>
                  {(data.csvHeader.length ? data.csvHeader : ["fecha", "…"]).map((h, i) => (
                    <th key={i}>
                      <span className="muted small">{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.csvRows ?? []).map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card mt">
        <b>Historial de versiones (git)</b>
        <div className="mt">
          <HistoryPanel assetId={id} initial={history} readonly={readonly} />
        </div>
      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  )
}
