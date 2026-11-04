import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db, findUserById, logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"

const ROLES = ["admin", "editor", "viewer"]

/** PUT /api/users/[id] — edita rol, contraseña o activo (solo admin). */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = userFromRequest(req)
  if (!actor) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (actor.role !== "admin") return NextResponse.json({ error: "Solo admin" }, { status: 403 })

  const { id } = await params
  const uid = Number(id)
  if (!Number.isInteger(uid)) return NextResponse.json({ error: "Id inválido" }, { status: 400 })
  const target = findUserById(uid)
  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const sets: string[] = []
  const vals: unknown[] = []
  const cambios: string[] = []

  if (typeof body.role === "string" && ROLES.includes(body.role)) {
    if (target.id === actor.id && body.role !== "admin") {
      return NextResponse.json({ error: "No puedes quitarte el rol admin a vos mismo" }, { status: 400 })
    }
    sets.push("role = ?")
    vals.push(body.role)
    cambios.push(`rol=${body.role}`)
  }
  if (typeof body.password === "string" && body.password.length >= 8) {
    const hash = await bcrypt.hash(body.password, 10)
    sets.push("password_hash = ?")
    vals.push(hash)
    cambios.push("contraseña")
  }
  if (body.activo === 0 || body.activo === 1) {
    if (target.id === actor.id && body.activo === 0) {
      return NextResponse.json({ error: "No puedes desactivarte a vos mismo" }, { status: 400 })
    }
    sets.push("activo = ?")
    vals.push(body.activo)
    cambios.push(`activo=${body.activo}`)
  }
  if (typeof body.email === "string" && body.email.includes("@")) {
    sets.push("email = ?")
    vals.push(body.email.trim().toLowerCase())
    cambios.push("email")
  }

  if (!sets.length) return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })

  vals.push(uid)
  db()
    .prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`)
    .run(...vals)
  logActivity(actor.id, "usuario_editado", `${target.email} → ${cambios.join(", ")}`)
  return NextResponse.json({ ok: true })
}
