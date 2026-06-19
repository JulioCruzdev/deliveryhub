import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'

// Rotas que exigem autenticação
const PROTECTED_ROUTES = ['/favoritos', '/historico', '/configuracoes']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('access_token')?.value
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const payload = await verifyAccessToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/favoritos/:path*', '/historico/:path*', '/configuracoes/:path*'],
}
