/**
 * Autenticación: bcrypt + cookie de sesión httpOnly (30 días).
 */
import crypto from "node:crypto"
import bcrypt from "bcryptjs"
import { db, findUserByEmail, findUserById, SESSION_DAYS } from "./db"
import { COOKIE_NAME } from "./cookie"
import type { User } from "./db"

export { COOKIE_NAME }

export type Role = "admin" | "editor" | "viewer"

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

/** Crea sesión y devuelve el token para la cookie. */
export function createSession(userId: number): string {
  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString()
  db().prepare("INSERT INTO sessions(token, user_id, expires_at) VALUES (?,?,?)").run(token, userId, expires)
  return token
}

export function destroySession(token: string): void {
  db().prepare("DELETE FROM sessions WHERE token = ?").run(token)
}

/** Valida el token y devuelve el usuario activo, o null. */
export function userFromToken(token: string | undefined | null): Omit<User, "password_hash"> | null {
  if (!token) return null
  const row = db().prepare("SELECT * FROM sessions WHERE token = ?").get(token) as
    | { token: string; user_id: number; expires_at: string }
    | undefined
  if (!row) return null
  const expired = new Date(row.expires_at)
  if (isNaN(expired.getTime()) || expired.getTime() < Date.now()) return null
  const u = findUserById(row.user_id)
  if (!u || !u.activo) return null
  const { password_hash: _ph, ...safe } = u
  return safe
}

/** Verifica credenciales y devuelve el usuario si son válidas y cuenta activa. */
export async function authenticate(email: string, password: string): Promise<Omit<User, "password_hash"> | null> {
  const u = findUserByEmail(email)
  if (!u || !u.activo) return null
  const ok = await verifyPassword(password, u.password_hash)
  if (!ok) return null
  return { id: u.id, email: u.email, role: u.role as Role, activo: u.activo, created_at: u.created_at }
}

/** Borra sesiones vencidas (llamada oportunista tras operaciones de sesión). */
export function sweepExpiredSessions(): void {
  try {
    db().prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run()
  } catch {
    /* silencio */
  }
}

export { findUserById }
