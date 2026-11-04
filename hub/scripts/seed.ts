/**
 * Seed del Mkt Hub: crea el primer usuario admin.
 *
 * Uso:
 *   npm run seed                                  → pregunta por readline
 *   npm run seed -- --email admin@agroprime.com --password Secreta123 --role admin
 */
import readline from "node:readline/promises"
import bcrypt from "bcryptjs"
import { db, findUserByEmail } from "../src/lib/db.ts"

async function main() {
  let email = ""
  let password = ""
  let role = "admin"

  const argv = process.argv.slice(2)
  const flag = (name: string): string | undefined => {
    const i = argv.indexOf(name)
    return i >= 0 ? argv[i + 1] : undefined
  }
  email = flag("--email") ?? ""
  password = flag("--password") ?? ""
  role = flag("--role") ?? "admin"

  if (!email || !password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    email = await rl.question("Correo del admin: ")
    password = await rl.question("Contraseña (mín. 8): ")
    const r = (await rl.question("Rol [admin]: ")) || "admin"
    role = r
    rl.close()
  }

  email = email.trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.\w+$/.test(email)) {
    console.error("✗ Correo inválido")
    process.exit(1)
  }
  if (password.length < 8) {
    console.error("✗ La contraseña necesita al menos 8 caracteres")
    process.exit(1)
  }
  if (!["admin", "editor", "viewer"].includes(role)) {
    console.error("✗ Rol inválido (admin | editor | viewer)")
    process.exit(1)
  }
  if (findUserByEmail(email)) {
    console.error("✗ Ese correo ya existe")
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 10)
  const info = db().prepare("INSERT INTO users(email, password_hash, role) VALUES (?,?,?)").run(email, hash, role)
  console.log("✓ Admin creado:", email, `(id ${info.lastInsertRowid}, rol ${role})`)
  console.log("  Ingresá en /login. Cookie de sesión: 30 días.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
