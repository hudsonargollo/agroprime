"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BP } from "@/lib/base"
import { useState } from "react"

const LINKS = [
  { href: "/", label: "Kanban" },
  { href: "/calendario", label: "Calendario" },
  { href: "/archivo", label: "Archivo" },
]

export default function TopNav({ email, role }: { email: string; role: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function logout() {
    setBusy(true)
    await fetch(BP + "/api/auth/logout", { method: "POST" })
    router.replace("/login")
    router.refresh()
  }

  const linkCls = (h: string) =>
    "navlink" + (pathname === h || (h !== "/" && pathname.startsWith(h)) ? " active" : "")

  return (
    <nav className="topnav">
      <Link href="/" className="brand">
        MKT HUB
        <small>Agro-Prime · pipeline de contenido</small>
      </Link>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={linkCls(l.href)}>
          {l.label}
        </Link>
      ))}
      {role === "admin" && (
        <Link href="/usuarios" className={linkCls("/usuarios")}>
          Usuarios
        </Link>
      )}
      <span className="spacer" />
      <span className="who">
        {email} · <b>{role}</b>
      </span>
      <button className="btn-ghost" onClick={logout} disabled={busy}>
        Salir
      </button>
    </nav>
  )
}
