"use client"

import { useState } from "react"

/** Botón de copiado al portapapeles (con fallback execCommand). */
export default function CopyBtn({ text, label = "copiar" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)

  async function copy() {
    const valor = typeof text === "string" ? text : ""
    try {
      await navigator.clipboard.writeText(valor)
    } catch {
      // fallback para contexts sin Clipboard API (http en LAN)
      const ta = document.createElement("textarea")
      ta.value = valor
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setOk(true)
    setTimeout(() => setOk(false), 1400)
  }

  return (
    <button type="button" className="btn-ghost copybtn" onClick={copy} title="Copiar al portapapeles">
      {ok ? "✓ copiado" : label}
    </button>
  )
}
