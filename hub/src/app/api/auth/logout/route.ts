import { NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME, destroySession, userFromToken } from "@/lib/auth"
import { logActivity } from "@/lib/db"

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (token) {
    const u = userFromToken(token)
    if (u) logActivity(u.id, "logout", u.email)
    destroySession(token)
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set({ name: COOKIE_NAME, value: "", httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  return res
}
