/**
 * SQLite: usuarios, sesiones y bitácora de actividad.
 * Archivo: hub/data/users.db (cfg via HUB_DB_PATH).
 */
import fs from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"

export interface User {
  id: number
  email: string
  password_hash: string
  role: "admin" | "editor" | "viewer"
  activo: number
  created_at: string
}

export interface SessionRow {
  token: string
  user_id: number
  expires_at: string
}

export interface ActivityRow {
  id: number
  user_id: number | null
  email: string | null
  action: string
  target: string
  created_at: string
}

let cached: Database.Database | null = null

export function dbFile(): string {
  if (process.env.HUB_DB_PATH) return path.resolve(process.env.HUB_DB_PATH)
  // Preferimos <cwd>/data, y si no se puede, junto al paquete.
  return path.resolve(process.cwd(), "data", "users.db")
}

export function db(): Database.Database {
  if (cached) return cached
  const file = dbFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const d = new Database(file)
  d.pragma("journal_mode = WAL")
  d.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'viewer',
      activo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sessions(
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_activity_time ON activity(created_at);
  `)
  cached = d
  return d
}

export function findUserByEmail(email: string): User | undefined {
  return db()
    .prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE")
    .get(email.trim().toLowerCase()) as User | undefined
}

export function findUserById(id: number): User | undefined {
  return db().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined
}

export function listUsers(): Omit<User, "password_hash">[] {
  return db()
    .prepare("SELECT id, email, role, activo, created_at FROM users ORDER BY id")
    .all() as Omit<User, "password_hash">[]
}

export function logActivity(userId: number | null, action: string, target: string): void {
  try {
    // Guardamos el email como user_id-null →email en activity: mantenemos simple un join en la consulta
    db().prepare("INSERT INTO activity(user_id, action, target) VALUES (?,?,?)").run(userId, action, target)
    db().prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run()
  } catch {
    /* la bitácora no debe tumbar requests */
  }
}

export function recentActivity(n = 100): ActivityRow[] {
  return db()
    .prepare(
      `SELECT a.id, a.user_id, u.email, a.action, a.target, a.created_at
       FROM activity a LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.id DESC LIMIT ?`
    )
    .all(n) as ActivityRow[]
}

export const SESSION_DAYS = 30
