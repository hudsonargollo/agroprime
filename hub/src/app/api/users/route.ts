import { NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { db, findUserByEmail, listUsers, logActivity } from "@/lib/db"
import { userFromRequest } from "@/lib/guard"

const ROLES = ["admin", "editor", "viewer"]

/** GET /api/users — lista (solo admin). */
export async function GET(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ error: "Solo admin" }, { status: 403 })
  return NextResponse.json(listUsers())
}

/** POST /api/users — crea un usuario (solo admin). */
export async function POST(req: NextRequest) {
  const user = userFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ error: "Solo admin" }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? "").trim().toLowerCase()
  const password = String(body.password ?? "")
  const role = ROLES.includes(body.role) ? body.role : "viewer"

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña necesita al menos 8 caracteres" }, { status: 400 })
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "Ese correo ya existe" }, { status: 409 })
  }

  const hash = await hashPassword(password)
  const info = db().prepare("INSERT INTO users(email, password_hash, role) VALUES (?,?,?)").run(email, hash, role)
  logActivity(user.id, "usuario_creado", `${email} (${role})`)
  return NextResponse.json({ id: info.lastInsertRowid, email, role }, { status: 201 })
}
