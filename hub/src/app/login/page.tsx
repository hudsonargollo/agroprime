"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { BP } from "@/lib/base"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const res = await fetch(BP + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(j.error || "Credenciales incorrectas")
        setBusy(false)
        return
      }
      router.replace(BP + "/")
      router.refresh()
    } catch {
      setError("No se pudo conectar con el servidor")
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="logo">
          <div className="mark">MKT HUB</div>
          <small>Agro-Prime · Excelencia en ganadería</small>
        </div>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Ingresando…" : "Ingresar"}
        </button>
        {error && <p className="err">{error}</p>}
      </form>
    </div>
  )
}
