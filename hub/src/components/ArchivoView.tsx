"use client"

import Link from "next/link"
import { useState } from "react"
import { AssetListItem, CANALES, DIRS, NOMBRE_DIRS } from "@/lib/types"

const BADGE_ESTADO: Record<string, string> = {
  idea: "idea",
  en_progreso: "en_progreso",
  revision: "revisión",
  aprobado: "aprobado",
  programado: "programado",
  publicado: "publicado",
}

export default function ArchivoView({ assets }: { assets: AssetListItem[] }) {
  const [tab, setTab] = useState<string>(CANALES[0])
  const dirs = DIRS.filter((d) => d.startsWith(tab + "/"))

  return (
    <div>
      <div className="toolbar" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.7rem" }}>
        {CANALES.map((c) => (
          <button
            key={c}
            className={"btn-ghost" + (tab === c ? "" : "")}
            style={tab === c ? { color: "var(--gold-2)", borderColor: "var(--gold)" } : undefined}
            onClick={() => setTab(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
        <span className="spacer" style={{ flex: 1 }} />
      </div>

      {dirs.map((dir) => {
        const files = assets.filter((a) => a.dir === dir)
        return (
          <div className="dirblock card" key={dir}>
            <div className="inline-flex" style={{ justifyContent: "space-between", width: "100%" }}>
              <h3 style={{ margin: 0 }}>
                {dir}/ <span className="muted">— {NOMBRE_DIRS[dir] ?? ""}</span>
              </h3>
              <span className="muted small">{files.length} archivos</span>
            </div>
            {files.length === 0 ? (
              <p className="muted small">Vacío por ahora.</p>
            ) : (
              <table className="filetable">
                <tbody>
                  {files.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <Link href={"/asset/" + a.id}>
                          {a.titulo || a.ruta.split("/").pop()}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge estado-${a.estado}`}>
                          {BADGE_ESTADO[a.estado] ?? a.estado}
                        </span>
                      </td>
                      <td>{a.kind === "json" ? "post-spec" : a.tipo}</td>
                      <td className="path">{a.ruta}</td>
                      <td className="muted small">{a.responsable}</td>
                      <td className="muted small">{a.fecha ? a.fecha.slice(0, 10) : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </div>
  )
}
