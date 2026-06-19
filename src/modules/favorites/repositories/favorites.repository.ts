import { prisma } from '@/lib/prisma'
import { getProviderBySlug } from '@/modules/providers/registry'
import type { FavoriteDTO, ToggleFavoriteInput } from '../types'

function toDTO(fav: {
  id: string
  providerSlug: string
  restaurantExtId: string
  restaurantName: string
  restaurantImage: string | null
  category: string | null
  createdAt: Date
}): FavoriteDTO {
  const provider = getProviderBySlug(fav.providerSlug)
  return {
    id: fav.id,
    providerSlug: fav.providerSlug,
    providerName: provider?.displayName ?? fav.providerSlug,
    providerColor: provider?.color ?? '#888',
    restaurantExtId: fav.restaurantExtId,
    restaurantName: fav.restaurantName,
    restaurantImage: fav.restaurantImage,
    category: fav.category,
    createdAt: fav.createdAt.toISOString(),
  }
}

export const favoritesRepository = {
  async list(userId: string): Promise<FavoriteDTO[]> {
    const favs = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return favs.map(toDTO)
  },

  async isFavorite(userId: string, providerSlug: string, restaurantExtId: string): Promise<boolean> {
    const fav = await prisma.favorite.findUnique({
      where: { userId_providerSlug_restaurantExtId: { userId, providerSlug, restaurantExtId } },
    })
    return !!fav
  },

  async add(userId: string, input: ToggleFavoriteInput): Promise<FavoriteDTO> {
    const fav = await prisma.favorite.create({
      data: {
        userId,
        providerSlug: input.providerSlug,
        restaurantExtId: input.restaurantExtId,
        restaurantName: input.restaurantName,
        restaurantImage: input.restaurantImage,
        category: input.category,
      },
    })
    return toDTO(fav)
  },

  async remove(userId: string, providerSlug: string, restaurantExtId: string): Promise<void> {
    await prisma.favorite.delete({
      where: { userId_providerSlug_restaurantExtId: { userId, providerSlug, restaurantExtId } },
    })
  },
}
