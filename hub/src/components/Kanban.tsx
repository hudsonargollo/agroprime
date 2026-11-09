"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AssetListItem, CANALES, ESTADOS } from "@/lib/types"
import { BP } from "@/lib/base"

const ETIQUETA_ESTADO: Record<string, string> = {
  idea: "Idea",
  en_progreso: "En Progreso",
  revision: "Revisión",
  aprobado: "Aprobado",
  programado: "Programado",
  publicado: "Publicado",
}

function fmtFecha(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short" })
}

export default function Kanban({
  assets,
  role,
}: {
  assets: AssetListItem[]
  role: string
}) {
  const router = useRouter()
  const [items, setItems] = useState(assets)
  const [canal, setCanal] = useState("")
  const [campania, setCampania] = useState("")
  const [responsable, setResponsable] = useState("")
  const [q, setQ] = useState("")
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const puedeMover = role !== "viewer"

  const campanias = useMemo(
    () => Array.from(new Set(items.map((i) => i.campania).filter(Boolean))).sort(),
    [items]
  )
  const responsables = useMemo(
    () => Array.from(new Set(items.map((i) => i.responsable).filter(Boolean))).sort(),
    [items]
  )

  const filtered = items.filter((a) => {
    if (canal && a.canal !== canal) return false
    if (campania && a.campania !== campania) return false
    if (responsable && a.responsable !== responsable) return false
    if (q) {
      const needle = q.toLowerCase()
      const hay = (a.titulo + " " + a.ruta + " " + a.tipo + " " + a.responsable + " " + a.campania).toLowerCase()
      if (!hay.includes(needle)) return false
    }
    return true
  })

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 2600)
  }

  function onDrop(estado: string) {
    setDragOver(null)
    const id = dragId
    setDragId(null)
    if (!id) return
    const item = items.find((i) => i.id === id)
    if (!item || item.estado === estado) return
    if (!puedeMover) {
      flash("Tu rol es solo lectura")
      return
    }
    // optimista
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, estado } : i)))
    fetch(BP + `/api/asset/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          flash(j.error || "No se pudo mover")
          setItems((prev) => prev.map((i) => (i.id === id ? { ...i, estado: item.estado } : i)))
        } else {
          flash(`„${item.titulo}“ → ${ETIQUETA_ESTADO[estado] ?? estado}`)
          router.refresh() // refresca route cache server-side
        }
      })
      .catch(() => {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, estado: item.estado } : i)))
        flash("Error de red")
      })
    void 0
  }

  return (
    <div>
      <div className="toolbar">
        <select value={canal} onChange={(e) => setCanal(e.target.value)} aria-label="Canal">
          <option value="">Todos los canales</option>
          {CANALES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={campania} onChange={(e) => setCampania(e.target.value)} aria-label="Campaña">
          <option value="">Todas las campañas</option>
          {campanias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={responsable} onChange={(e) => setResponsable(e.target.value)} aria-label="Responsable">
          <option value="">Todos los responsables</option>
          {responsables.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Buscar título, id, responsable…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 250 }}
        />
      </div>

      <div
        className="kanban"
        onDragOver={(e) => e.preventDefault()}
        style={{ gridTemplateColumns: `repeat(${ESTADOS.length}, minmax(215px, 1fr))` }}
      >
        {ESTADOS.map((estado) => (
          <div
            key={estado}
            className={"kcol" + (dragOver === estado ? " dragover" : "")}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(estado)
            }}
            onDragLeave={() => setDragOver((v) => (v === estado ? null : v))}
            onDrop={() => onDrop(estado)}
          >
            <h3>
              {ETIQUETA_ESTADO[estado]} <span className="count">{filtered.filter((a) => a.estado === estado).length}</span>
            </h3>
            {filtered
              .filter((a) => a.estado === estado)
              .map((a) => (
                <Link
                  key={a.id}
                  href={"/asset/" + a.id}
                  className="kcard"
                  draggable={puedeMover}
                  onDragStart={() => setDragId(a.id)}
                  onDragEnd={() => setDragId(null)}
                  style={{ borderLeftColor: a.kind === "json" ? "#7d95b5" : "#c9a44a66" }}
                  title={a.ruta}
                >
                  <div className="t">{a.titulo || a.ruta}</div>
                  <div className="meta">
                    <span className={`badge canal-${a.canal}`}>{a.canal}</span>
                    <span>{a.kind === "json" ? "post-spec" : a.tipo}</span>
                    {a.responsable && <span>· {a.responsable}</span>}
                    {a.fecha && <span>· ⏱ {fmtFecha(a.fecha)}</span>}
                    {a.campania && <span>· {a.campania}</span>}
                  </div>
                </Link>
              ))}
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
