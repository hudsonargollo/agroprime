/** Guard server-side para route handlers y server components. */
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME, userFromToken } from "./auth"

export interface SessionUser {
  id: number
  email: string
  role: "admin" | "editor" | "viewer"
  activo: number
  created_at: string
}

/** Usuario de la request (cookie httpOnly). null si no hay sesión válida. */
export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return (userFromToken(token) as SessionUser | null) ?? null
}

/** Igual que currentUser() pero a partir de una Request (route handlers). */
export function userFromRequest(req: NextRequest): SessionUser | null {
  const token = req.cookies.get(COOKIE_NAME)?.value
  return (userFromToken(token) as SessionUser | null) ?? null
}

export interface Guard {
  ok: true
  user: SessionUser
}
export interface GuardFail {
  ok: false
  response: NextResponse
}

/** Exige sesión; opcionalmente un rol mínimo (admin > editor > viewer). */
export async function requireUser(
  req: NextRequest,
  roles?: Array<"admin" | "editor" | "viewer">
): Promise<Guard | GuardFail> {
  const user = userFromRequest(req)
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "No autenticado" }, { status: 401 }) }
  }
  if (roles && !roles.includes(user.role)) {
    return { ok: false, response: NextResponse.json({ error: "Permiso denegado para tu rol" }, { status: 403 }) }
  }
  return { ok: true, user }
}
