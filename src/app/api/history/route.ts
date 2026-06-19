import { NextRequest } from 'next/server'
import { historyRepository } from '@/modules/history/repositories/history.repository'
import { ok, unauthorized, handleError } from '@/lib/api-response'
import { getAuthFromRequest } from '@/lib/middleware-utils'

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthFromRequest(req)
    if (!session) return unauthorized()

    const history = await historyRepository.list(session.sub)
    return ok({ history })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthFromRequest(req)
    if (!session) return unauthorized()

    const { searchParams } = req.nextUrl
    const id = searchParams.get('id')

    if (id) {
      await historyRepository.remove(id, session.sub)
    } else {
      await historyRepository.clear(session.sub)
    }

    return ok({}, 'Histórico removido')
  } catch (error) {
    return handleError(error)
  }
}
