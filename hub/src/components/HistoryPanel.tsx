"use client"

import { useEffect, useState } from "react"
import { BP } from "@/lib/base"

export interface HistoryEntry {
  hash: string
  date: string
  author: string
  subject: string
}

function renderDiffLines(raw: string): React.ReactNode[] {
  return raw.split("\n").map((line, i) => {
    const cls = line.startsWith("+++") || line.startsWith("---") ? "hunk" : line.startsWith("@@") ? "hunk" : line.startsWith("+") ? "add" : line.startsWith("-") ? "del" : undefined
    return (
      <span key={i} className={cls}>
        {line}
        {"\n"}
      </span>
    )
  })
}

export default function HistoryPanel({
  assetId,
  initial,
  readonly,
}: {
  assetId: string
  initial: HistoryEntry[]
  readonly: boolean
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>(initial)
  const [a, setA] = useState<string>(initial[0]?.hash ?? "")
  const [b, setB] = useState<string>(initial[1]?.hash ?? "")
  const [diff, setDiff] = useState<string>("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(BP + `/api/history?id=${encodeURIComponent(assetId)}`)
      .then((r) => (r.ok ? r.json() : { entries: [] }))
      .then((j) => {
        setEntries(j.entries ?? [])
        if (!a && j.entries?.[0]) setA(j.entries[0].hash)
        if (!b && j.entries?.[1]) setB(j.entries[1].hash)
      })
      .catch(() => void 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function verDiff() {
    if (!a || !b) return
    setBusy(true)
    const res = await fetch(BP + `/api/diff?file=${encodeURIComponent(assetId)}&a=${a}&b=${b}`)
    const j = await res.json().catch(() => ({}))
    setDiff(res.ok ? (j.diff ?? "") : j.error || "No se pudo calcular el diff")
    setBusy(false)
  }

  async function restaurar(hash: string) {
    if (!confirm(`¿Restaurar esta versión (${hash})? El archivo actual se sobrescribe.`)) return
    setBusy(true)
    const res = await fetch(BP + "/api/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: assetId, hash }),
    })
    const j = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) {
      alert(j.error || "No se pudo restaurar")
      return
    }
    location.reload()
  }

  return (
    <div>
      {entries.length === 0 ? (
        <p className="muted small">Sin historial git todavía (se registra con cada guardado).</p>
      ) : (
        <>
          <table className="hist-table">
            <tbody>
              {entries.map((h) => (
                <tr key={h.hash}>
                  <td>
                    <code>{h.hash}</code>
                  </td>
                  <td className="muted small">{h.date}</td>
                  <td className="small">{h.author}</td>
                  <td className="small">{h.subject}</td>
                  <td>
                    {!readonly && (
                      <button className="btn-ghost copybtn" disabled={busy} onClick={() => restaurar(h.hash)}>
                        Restaurar esta versión
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="inline-flex mt" style={{ margin: "0.8rem 0 0.4rem" }}>
            <select value={a} onChange={(e) => setA(e.target.value)} aria-label="Commit A">
              {entries.map((h) => (
                <option key={h.hash} value={h.hash}>
                  A: {h.hash} — {h.subject.slice(0, 40)}
                </option>
              ))}
            </select>
            <select value={b} onChange={(e) => setB(e.target.value)} aria-label="Commit B">
              {entries.map((h) => (
                <option key={h.hash} value={h.hash}>
                  B: {h.hash} — {h.subject.slice(0, 40)}
                </option>
              ))}
            </select>
            <button className="btn-ghost" onClick={verDiff} disabled={busy || !a || !b}>
              Ver diff A→B
            </button>
          </div>
          {diff && <div className="diffbox">{renderDiffLines(diff)}</div>}
        </>
      )}
    </div>
  )
}
