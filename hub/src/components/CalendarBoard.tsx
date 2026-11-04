"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { AssetListItem } from "@/lib/types"
import { BP } from "@/lib/base"

const DOW = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const MES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/** Fecha (YYYY-MM-DD) de un ISO en America/La_Paz. */
function fechaLapaz(iso: string): string | null {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/La_Paz" }).format(d)
  return parts // "YYYY-MM-DD"
}

export default function CalendarBoard({ assets }: { assets: AssetListItem[] }) {
  const [offset, setOffset] = useState(0)
  const todayStr = useMemo(() => fechaLapaz(new Date().toISOString())!, [])

  const { cells, ya, mes } = useMemo(() => {
    const now = new Date()
    const first = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    const startDow = (first.getDay() + 6) % 7 // lunes = 0
    const cells: Array<{ date: string | null; label: number | null }> = []
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
    for (let i = 0; i < startDow; i++) cells.push({ date: null, label: null })
    for (let d = 1; d <= daysInMonth; d++) {
      const date =
        first.getFullYear() +
        "-" +
        String(first.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d).padStart(2, "0")
      cells.push({ date, label: d })
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, label: null })
    return {
      cells,
      ya: first.getFullYear(),
      mes: MES[first.getMonth()],
    }
  }, [offset])

  const byDate = useMemo(() => {
    const map = new Map<string, AssetListItem[]>()
    for (const a of assets) {
      const d = fechaLapaz(a.fecha)
      if (!d) continue
      const arr = map.get(d) ?? []
      arr.push(a)
      map.set(d, arr)
    }
    for (const arr of map.values()) arr.sort((x, y) => x.fecha.localeCompare(y.fecha))
    return map
  }, [assets])

  return (
    <div>
      <div className="cal-head">
        <button className="btn-ghost" onClick={() => setOffset((o) => o - 1)}>
          ← Mes anterior
        </button>
        <h2>
          {mes.charAt(0).toUpperCase() + mes.slice(1)} {ya}
        </h2>
        <button className="btn-ghost" onClick={() => setOffset((o) => o + 1)}>
          Mes siguiente →
        </button>
        {offset !== 0 && (
          <button className="btn-ghost" onClick={() => setOffset(0)}>
            Hoy
          </button>
        )}
        <span className="muted small">
          {assets.length} eventos programados en total
        </span>
      </div>
      <div className="cal-grid">
        {DOW.map((d) => (
          <div key={d} className="cal-dow">
            {d}
          </div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={"cal-cell" + (c.date && c.date === todayStr ? " today" : "")}
          >
            {c.label != null && <div className="d">{c.label}</div>}
            {c.date &&
              (byDate.get(c.date) ?? []).map((a) => (
                <Link
                  key={a.id}
                  className={"cal-item canal-" + a.canal}
                  title={`${a.titulo} (${a.canal}, ${a.responsable || "sin asignar"})`}
                  href={BP + "/asset/" + a.id}
                >
                  {a.fecha.slice(11, 16) || "    "} {a.canal.charAt(0).toUpperCase()} · {a.titulo}
                </Link>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
