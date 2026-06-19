export interface FavoriteDTO {
  id: string
  providerSlug: string
  providerName: string
  providerColor: string
  restaurantExtId: string
  restaurantName: string
  restaurantImage?: string | null
  category?: string | null
  createdAt: string
}

export interface ToggleFavoriteInput {
  providerSlug: string
  restaurantExtId: string
  restaurantName: string
  restaurantImage?: string
  category?: string
}
