import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/modules/auth/services/auth.service'
import { ok } from '@/lib/api-response'
import { clearAuthCookies } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value
  if (refreshToken) await authService.logout(refreshToken)

  const response = ok(null, 'Logout realizado')
  clearAuthCookies(response)
  return response
}
