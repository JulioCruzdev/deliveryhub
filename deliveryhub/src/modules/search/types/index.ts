export interface AggregatedResult {
  id: string           // `${providerSlug}::${externalId}`
  externalId: string
  providerSlug: string
  providerName: string
  providerColor: string
  providerTextColor: string
  restaurantName: string
  imageUrl: string
  category: string
  rating: number
  reviewCount: number
  distance: number     // km
  deliveryFee: number  // R$
  minDeliveryTime: number
  maxDeliveryTime: number
  minPrice: number
  hasPromotion: boolean
  promotionLabel?: string
  redirectUrl: string
  // badges calculados pelo aggregator
  isLowestDeliveryFee: boolean
  isFastestDelivery: boolean
  isBestPromotion: boolean
}

export type SortBy =
  | 'relevance'
  | 'price'
  | 'delivery_fee'
  | 'delivery_time'
  | 'rating'
  | 'distance'

export interface SearchFilters {
  category?: string
  freeDelivery?: boolean
  hasPromotion?: boolean
  maxPrice?: number
  maxDeliveryTime?: number
}

export const SORT_LABELS: Record<SortBy, string> = {
  relevance: 'Relevância',
  price: 'Menor preço',
  delivery_fee: 'Menor frete',
  delivery_time: 'Mais rápido',
  rating: 'Melhor avaliado',
  distance: 'Mais próximo',
}

export const CATEGORIES = [
  { slug: 'hamburguer', label: 'Hambúrguer', emoji: '🍔' },
  { slug: 'pizza', label: 'Pizza', emoji: '🍕' },
  { slug: 'sushi', label: 'Sushi', emoji: '🍣' },
  { slug: 'frango', label: 'Frango', emoji: '🍗' },
  { slug: 'massa', label: 'Massa', emoji: '🍝' },
  { slug: 'carne', label: 'Carnes', emoji: '🥩' },
  { slug: 'sanduiche', label: 'Sanduíches', emoji: '🥪' },
  { slug: 'salada', label: 'Saladas', emoji: '🥗' },
] as const
