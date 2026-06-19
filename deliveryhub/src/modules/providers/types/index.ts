export interface GeoLocation {
  lat: number
  lng: number
}

export interface ProviderSearchResult {
  externalId: string
  name: string
  imageUrl: string
  category: string
  rating: number
  reviewCount: number
  distance: number       // km
  deliveryFee: number    // R$
  minDeliveryTime: number // minutos
  maxDeliveryTime: number // minutos
  minPrice: number       // R$ — item mais barato do cardápio
  hasPromotion: boolean
  promotionLabel?: string
}

export interface ProviderMenuItem {
  externalId: string
  name: string
  description: string
  imageUrl: string
  price: number
  originalPrice?: number
  hasPromotion: boolean
  promotionLabel?: string
}

export interface ProviderRestaurantDetail extends ProviderSearchResult {
  address: string
  isOpen: boolean
  menu: ProviderMenuItem[]
}

export interface IDeliveryProvider {
  readonly slug: string
  readonly displayName: string
  readonly color: string         // cor hex para badges
  readonly textColor: string     // cor do texto sobre o badge

  search(query: string, location?: GeoLocation): Promise<ProviderSearchResult[]>
  getRestaurantDetail(externalId: string, location?: GeoLocation): Promise<ProviderRestaurantDetail | null>
  buildRedirectUrl(restaurantExternalId: string, itemExternalId?: string): string
}
