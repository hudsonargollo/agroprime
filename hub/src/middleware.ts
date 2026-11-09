import { NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME } from "@/lib/cookie"

/**
 * Guardia ligera en edge: exige la cookie de sesión para todo lo que no sea
 * /login ni /api/auth/*. La validación completa (SQLite) ocurre server-side
 * en cada página y route handler.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const hasCookie = Boolean(req.cookies.get(COOKIE_NAME)?.value)
  if (hasCookie) return NextResponse.next()
  if (pathname === "/login") return NextResponse.next()
  if (pathname.startsWith("/api/auth/")) return NextResponse.next()
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = "/login"
  url.search = ""
  // Tras nginx el origen interno es 127.0.0.1:4074; el redirect tiene que salir
  // con el host y protocolo públicos (ver deploy/*.conf: X-Forwarded-*).
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")
  if (host) {
    const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "")
    return NextResponse.redirect(new URL(`${proto}://${host}${req.nextUrl.basePath}/login`))
  }
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
