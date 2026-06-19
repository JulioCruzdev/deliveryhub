import { NextRequest } from 'next/server'
import { loginSchema } from '@/modules/auth/schemas'
import { authService } from '@/modules/auth/services/auth.service'
import { ok, badRequest, handleError, unauthorized } from '@/lib/api-response'
import { setAuthCookies } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = loginSchema.safeParse(body)
    if (!input.success) return badRequest('Dados inválidos', input.error.flatten().fieldErrors)

    const { user, tokens } = await authService.login(input.data)

    const response = ok({ user }, 'Login realizado com sucesso')
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken)
    return response
  } catch (error) {
    if (error instanceof Error && error.message === 'Credenciais inválidas') {
      return unauthorized('E-mail ou senha incorretos')
    }
    return handleError(error)
  }
}
