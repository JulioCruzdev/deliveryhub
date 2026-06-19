import { NextRequest } from 'next/server'
import { favoritesRepository } from '@/modules/favorites/repositories/favorites.repository'
import { ok, badRequest, unauthorized, handleError } from '@/lib/api-response'
import { getAuthFromRequest } from '@/lib/middleware-utils'
import { z } from 'zod'

const toggleSchema = z.object({
  providerSlug: z.string().min(1),
  restaurantExtId: z.string().min(1),
  restaurantName: z.string().min(1),
  restaurantImage: z.string().optional(),
  category: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthFromRequest(req)
    if (!session) return unauthorized()

    const favorites = await favoritesRepository.list(session.sub)
    return ok({ favorites })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthFromRequest(req)
    if (!session) return unauthorized()

    const body = await req.json()
    const input = toggleSchema.safeParse(body)
    if (!input.success) return badRequest('Dados inválidos', input.error.flatten().fieldErrors)

    const isFav = await favoritesRepository.isFavorite(session.sub, input.data.providerSlug, input.data.restaurantExtId)

    if (isFav) {
      await favoritesRepository.remove(session.sub, input.data.providerSlug, input.data.restaurantExtId)
      return ok({ favorited: false }, 'Removido dos favoritos')
    } else {
      const fav = await favoritesRepository.add(session.sub, input.data)
      return ok({ favorited: true, favorite: fav }, 'Adicionado aos favoritos')
    }
  } catch (error) {
    return handleError(error)
  }
}
