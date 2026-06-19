import { getAllProviders } from '@/modules/providers/registry'
import type { AggregatedResult, SortBy, SearchFilters } from '../types'
import type { GeoLocation } from '@/modules/providers/types'

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function applyBadges(results: AggregatedResult[]): AggregatedResult[] {
  if (results.length === 0) return results

  const minFee = Math.min(...results.map((r) => r.deliveryFee))
  const minTime = Math.min(...results.map((r) => r.minDeliveryTime))

  // "Melhor promoção" = maior desconto relativo (tem promoção E menor preço vs outros do mesmo restaurante)
  const withPromo = results.filter((r) => r.hasPromotion)
  const bestPromoId = withPromo.length > 0
    ? withPromo.reduce((best, r) => r.minPrice < best.minPrice ? r : best, withPromo[0]!).id
    : null

  return results.map((r) => ({
    ...r,
    isLowestDeliveryFee: r.deliveryFee === minFee,
    isFastestDelivery: r.minDeliveryTime === minTime,
    isBestPromotion: r.id === bestPromoId,
  }))
}

function sort(results: AggregatedResult[], by: SortBy): AggregatedResult[] {
  const sorted = [...results]
  switch (by) {
    case 'price':
      sorted.sort((a, b) => a.minPrice - b.minPrice)
      break
    case 'delivery_fee':
      sorted.sort((a, b) => a.deliveryFee - b.deliveryFee)
      break
    case 'delivery_time':
      sorted.sort((a, b) => a.minDeliveryTime - b.minDeliveryTime)
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    case 'distance':
      sorted.sort((a, b) => a.distance - b.distance)
      break
    default: // relevance: promoção > rating > distância
      sorted.sort((a, b) => {
        const aScore = (a.hasPromotion ? 2 : 0) + a.rating - a.distance * 0.1
        const bScore = (b.hasPromotion ? 2 : 0) + b.rating - b.distance * 0.1
        return bScore - aScore
      })
  }
  return sorted
}

function applyFilters(results: AggregatedResult[], filters: SearchFilters): AggregatedResult[] {
  return results.filter((r) => {
    if (filters.category && normalize(r.category) !== normalize(filters.category)) return false
    if (filters.freeDelivery && r.deliveryFee > 0) return false
    if (filters.hasPromotion && !r.hasPromotion) return false
    if (filters.maxPrice !== undefined && r.minPrice > filters.maxPrice) return false
    if (filters.maxDeliveryTime !== undefined && r.minDeliveryTime > filters.maxDeliveryTime) return false
    return true
  })
}

export const searchService = {
  async search(
    query: string,
    options?: { location?: GeoLocation; sortBy?: SortBy; filters?: SearchFilters }
  ): Promise<AggregatedResult[]> {
    const providers = getAllProviders()

    const providerResults = await Promise.allSettled(
      providers.map((p) => p.search(query, options?.location))
    )

    const aggregated: AggregatedResult[] = providerResults.flatMap((result, index) => {
      if (result.status === 'rejected') return []
      const provider = providers[index]
      if (!provider) return []
      return result.value.map((item) => ({
        id: `${provider.slug}::${item.externalId}`,
        externalId: item.externalId,
        providerSlug: provider.slug,
        providerName: provider.displayName,
        providerColor: provider.color,
        providerTextColor: provider.textColor,
        restaurantName: item.name,
        imageUrl: item.imageUrl,
        category: item.category,
        rating: item.rating,
        reviewCount: item.reviewCount,
        distance: item.distance,
        deliveryFee: item.deliveryFee,
        minDeliveryTime: item.minDeliveryTime,
        maxDeliveryTime: item.maxDeliveryTime,
        minPrice: item.minPrice,
        hasPromotion: item.hasPromotion,
        promotionLabel: item.promotionLabel,
        redirectUrl: provider.buildRedirectUrl(item.externalId),
        isLowestDeliveryFee: false,
        isFastestDelivery: false,
        isBestPromotion: false,
      }))
    })

    const filtered = options?.filters ? applyFilters(aggregated, options.filters) : aggregated
    const sorted = sort(filtered, options?.sortBy ?? 'relevance')
    return applyBadges(sorted)
  },
}
