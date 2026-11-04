"use client"

import { FormEvent, useState } from "react"
import { BP } from "@/lib/base"
import { ActivityRow } from "@/lib/db"
import CopyBtn from "./CopyBtn"

export interface SafeUser {
  id: number
  email: string
  role: string
  activo: number
  created_at: string
}

function fmt(ts: string): string {
  // SQLite datetime('now') es UTC
  const d = new Date(ts.replace(" ", "T") + "Z")
  return isNaN(d.getTime())
    ? ts
    : new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/La_Paz",
        dateStyle: "short",
        timeStyle: "short",
      }).format(d)
}

export default function UsersAdmin({
  users,
  activity,
  me,
}: {
  users: SafeUser[]
  activity: ActivityRow[]
  me: string
}) {
  const [rows, setRows] = useState(users)
  const [nuevoEmail, setNuevoEmail] = useState("")
  const [nuevaPass, setNuevaPass] = useState("")
  const [nuevoRol, setNuevoRol] = useState("editor")
  const [msg, setMsg] = useState("")
  const [passes, setPasses] = useState<Record<number, string>>({})

  function flash(m: string) {
    setMsg(m)
    setTimeout(() => setMsg(""), 2800)
  }

  async function refresh() {
    const res = await fetch(BP + "/api/users")
    if (res.ok) setRows(await res.json())
  }

  async function crear(e: FormEvent) {
    e.preventDefault()
    const res = await fetch(BP + "/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nuevoEmail, password: nuevaPass, role: nuevoRol }),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) {
      flash(j.error || "No se pudo crear")
      return
    }
    setNuevoEmail("")
    setNuevaPass("")
    flash("Usuario creado")
    refresh()
  }

  async function cambiarRol(id: number, role: string) {
    const res = await fetch(BP + `/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    if (res.ok) flash("Rol actualizado")
    else flash("No se pudo actualizar el rol")
    refresh()
  }

  async function cambiarPass(id: number) {
    const password = passes[id]
    if (!password) return
    const res = await fetch(BP + `/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      flash("Contraseña actualizada")
      setPasses((p) => ({ ...p, [id]: "" }))
    } else flash("No se pudo cambiar la contraseña")
  }

  async function toggleActivo(id: number, activo: boolean) {
    const res = await fetch(BP + `/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: activo ? 1 : 0 }),
    })
    if (res.ok) flash(activo ? "Usuario reactivado" : "Usuario desactivado")
    refresh()
  }

  return (
    <>
      <div className="card mt">
        <b>Usuarios ({rows.length})</b>
        <table className="usertable mt">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Rol</th>
              <th>Nueva contraseña</th>
              <th>Estado</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="inline-flex">
                    {u.email} {u.email === me && <span className="badge">vos</span>}
                    <CopyBtn text={u.email} />
                  </span>
                </td>
                <td>
                  <select value={u.role} onChange={(e) => cambiarRol(u.id, e.target.value)}>
                    {["admin", "editor", "viewer"].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className="inline-flex">
                    <input
                      type="password"
                      placeholder="••••••"
                      value={passes[u.id] ?? ""}
                      onChange={(e) => setPasses((p) => ({ ...p, [u.id]: e.target.value }))}
                      style={{ width: 130 }}
                    />
                    <button className="btn-ghost" onClick={() => cambiarPass(u.id)} disabled={!passes[u.id]}>
                      Set
                    </button>
                  </span>
                </td>
                <td>
                  <button
                    className="btn-ghost"
                    onClick={() => toggleActivo(u.id, !u.activo)}
                    style={u.activo ? undefined : { color: "var(--red)" }}
                  >
                    {u.activo ? "activo · desactivar" : "inactivo · reactivar"}
                  </button>
                </td>
                <td className="muted small">{fmt(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="card mt" onSubmit={crear}>
        <b>Crear usuario</b>
        <div className="inline-flex mt" style={{ alignItems: "flex-end" }}>
          <span>
            <label>Correo</label>
            <input type="email" value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} required />
          </span>
          <span>
            <label>Contraseña</label>
            <input
              type="password"
              value={nuevaPass}
              onChange={(e) => setNuevaPass(e.target.value)}
              minLength={8}
              required
            />
          </span>
          <span>
            <label>Rol</label>
            <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              {["admin", "editor", "viewer"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </span>
          <button className="btn" type="submit">
            Crear
          </button>
        </div>
        <p className="muted small" style={{ marginTop: "0.5rem" }}>
          Roles: <b>admin</b> = todo + usuarios · <b>editor</b> = crear/editar/mover/eliminar ·{" "}
          <b>viewer</b> = solo lectura.
        </p>
      </form>

      <div className="card mt">
        <b>Bitácora de actividad (últimas 100)</b>
        <ul className="actlog mt">
          {activity.map((a) => (
            <li key={a.id}>
              <code>{a.action}</code> {a.target ? <span>— {a.target}</span> : null}{" "}
              <span className="muted">
                · {a.email ?? "—"} · {fmt(a.created_at)}
              </span>
            </li>
          ))}
          {activity.length === 0 && <li className="muted">Sin actividad registrada todavía.</li>}
        </ul>
      </div>

      {msg && <div className="toast">{msg}</div>}
    </>
  )
}
