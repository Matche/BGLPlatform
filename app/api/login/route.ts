import { NextResponse } from 'next/server'
import { AUTH_COOKIE, authToken } from '@/lib/auth'

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string }
  const expected = process.env.DASHBOARD_PASSWORD

  if (!expected) {
    // Pas de gate configuré : on laisse passer.
    return NextResponse.json({ ok: true })
  }
  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(AUTH_COOKIE, await authToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
