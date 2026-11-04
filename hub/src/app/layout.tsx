import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mkt Hub — Agro-Prime",
  description: "Panel de gestión del pipeline de contenido",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
