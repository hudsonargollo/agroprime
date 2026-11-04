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
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
