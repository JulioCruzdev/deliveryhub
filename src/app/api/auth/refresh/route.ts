import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/services/auth.service'
import { ok, unauthorized, handleError } from '@/lib/api-response'
import { setAuthCookies } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value
    if (!refreshToken) return unauthorized('Refresh token não encontrado')

    const tokens = await authService.refresh(refreshToken)
    const response = ok(null, 'Token renovado')
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken)
    return response
  } catch {
    return unauthorized('Refresh token inválido')
  }
}
