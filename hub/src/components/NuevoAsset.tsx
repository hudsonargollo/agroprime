"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { BP } from "@/lib/base"
import { NOMBRE_DIRS, TIPO_DEFAULT_DIR } from "@/lib/types"

export default function NuevoAsset({
  dirs,
  pref,
}: {
  dirs: string[]
  pref: { canal?: string; tipo?: string; dir?: string; titulo?: string }
}) {
  const router = useRouter()
  const [dir, setDir] = useState(
    pref.dir && dirs.includes(pref.dir) ? pref.dir : ids0(dirs)
  )
  const [tipo, setTipo] = useState(pref.tipo || TIPO_DEFAULT_DIR[dir] || "articulo")
  const [titulo, setTitulo] = useState(pref.titulo || "")
  const [estado, setEstado] = useState("idea")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  function pickDir(next: string) {
    setDir(next)
    // autocompleta tipo típico del dir salvo que venga uno explícito en la URL
    if (!pref.tipo) setTipo(TIPO_DEFAULT_DIR[next] ?? "articulo")
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const res = await fetch(BP + "/api/asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dir, tipo, titulo, estado }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(j.error || "No se pudo crear")
        setBusy(false)
        return
      }
      router.push("/asset/" + j.id)
      router.refresh()
    } catch {
      setError("Error de red")
      setBusy(false)
    }
  }

  const canal = dir.split("/")[0]

  return (
    <form onSubmit={onSubmit} className="card mt">
      <label>Directorio (canal / subcarpeta)</label>
      <select value={dir} onChange={(e) => pickDir(e.target.value)} style={{ width: "100%" }}>
        {dirs.map((d) => (
          <option key={d} value={d}>
            {d} — {NOMBRE_DIRS[d] ?? ""}
          </option>
        ))}
      </select>

      <label>Tipo de asset</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: "100%" }}>
        {["articulo", "secuencia", "campania", "post", "reel", "guion", "variante", "lista", "script", "deal"].map(
          (t) => (
            <option key={t} value={t}>
              {t}
            </option>
          )
        )}
      </select>

      <label>Título (entra al front-matter y al slug del id)</label>
      <input
        style={{ width: "100%" }}
        placeholder="p. ej. Genética de élite: qué mirar antes de comprar un toro"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <label>Estado inicial</label>
      <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: "100%" }}>
        {["idea", "en_progreso", "revision", "aprobado", "programado", "publicado"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="actions">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Creando…" : "Crear asset"}
        </button>
        <span className="muted small">
          Nombre resultante: {canal}-[fecha]-[slug]{dir.endsWith("listas") ? ".csv" : dir === "social/calendario" ? ".json" : ".md"}
        </span>
      </div>
      {error && <p className="err">{error}</p>}
    </form>
  )
}

function ids0(dirs: string[]): string {
  return dirs.includes("blog/drafts") ? "blog/drafts" : dirs[0] ?? "blog/drafts"
}
