import { NextRequest } from 'next/server'
import { registerSchema } from '@/modules/auth/schemas'
import { authService } from '@/modules/auth/services/auth.service'
import { created, badRequest, handleError, conflict } from '@/lib/api-response'
import { setAuthCookies } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = registerSchema.safeParse(body)
    if (!input.success) return badRequest('Dados inválidos', input.error.flatten().fieldErrors)

    const { user, tokens } = await authService.register(input.data)

    const response = created({ user }, 'Conta criada com sucesso')
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken)
    return response
  } catch (error) {
    if (error instanceof Error && error.message.includes('E-mail')) {
      return conflict(error.message)
    }
    return handleError(error)
  }
}
