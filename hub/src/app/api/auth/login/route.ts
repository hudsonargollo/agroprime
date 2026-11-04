import { NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME, authenticate, createSession, sweepExpiredSessions } from "@/lib/auth"
import { logActivity } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? "").trim()
  const password = String(body.password ?? "")

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña requeridos" }, { status: 400 })
  }

  const user = await authenticate(email, password)
  if (!user) {
    logActivity(null, "login_fallido", email)
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
  }

  const token = createSession(user.id)
  sweepExpiredSessions()
  logActivity(user.id, "login", user.email)

  const res = NextResponse.json({ ok: true, role: user.role, email: user.email })
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 3600,
  })
  return res
}
