'use client'

import { use } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { Star, Clock, MapPin, ExternalLink, ArrowLeft, Heart } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/providers/auth-provider'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { FavoriteDTO } from '@/modules/favorites/types'
import type { ProviderRestaurantDetail } from '@/modules/providers/types'

interface RestaurantResponse {
  data: {
    restaurant: ProviderRestaurantDetail & {
      providerSlug: string
      providerName: string
      providerColor: string
      providerTextColor: string
      redirectUrl: string
    }
  }
}

export default function RestaurantePage({
  params,
}: {
  params: Promise<{ providerSlug: string; externalId: string }>
}) {
  const { providerSlug, externalId } = use(params)
  const { user } = useAuth()
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery<RestaurantResponse>({
    queryKey: ['restaurant', providerSlug, externalId],
    queryFn: () => fetch(`/api/restaurants/${providerSlug}/${externalId}`).then((r) => r.json()),
  })

  const { data: favsData } = useQuery<{ data: { favorites: FavoriteDTO[] } }>({
    queryKey: ['favorites'],
    queryFn: () => fetch('/api/favorites').then((r) => r.json()),
    enabled: !!user,
  })

  const restaurant = data?.data?.restaurant
  const isFavorite = (favsData?.data?.favorites ?? []).some(
    (f) => f.providerSlug === providerSlug && f.restaurantExtId === externalId
  )

  const toggleFav = useMutation({
    mutationFn: () =>
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerSlug,
          restaurantExtId: externalId,
          restaurantName: restaurant?.name ?? '',
          restaurantImage: restaurant?.imageUrl,
          category: restaurant?.category,
        }),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      toast.success(json.message ?? 'Favorito atualizado')
    },
    onError: () => toast.error('Faça login para salvar favoritos'),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (isError || !restaurant) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Restaurante não encontrado.</p>
        <Link href="/buscar" className="mt-3 inline-block text-sm text-primary hover:underline">
          Voltar à busca
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Nav */}
      <div className="flex items-center gap-3">
        <Link href="/buscar" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative h-52 w-full bg-muted">
          <Image src={restaurant.imageUrl} alt={restaurant.name} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Provider badge */}
        <div
          className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow"
          style={{ backgroundColor: restaurant.providerColor, color: restaurant.providerTextColor }}
        >
          {restaurant.providerName}
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
          <p className="text-sm text-white/80">{restaurant.category}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 rounded-xl border border-border bg-card p-4">
        {[
          { label: 'Avaliação', value: `${restaurant.rating.toFixed(1)} ★`, sub: `${restaurant.reviewCount.toLocaleString('pt-BR')} avaliações` },
          { label: 'Distância', value: `${restaurant.distance.toFixed(1)} km`, sub: restaurant.address.split('-')[0].trim() },
          { label: 'Entrega', value: `${restaurant.minDeliveryTime}–${restaurant.maxDeliveryTime} min`, sub: restaurant.deliveryFee === 0 ? 'Frete grátis' : formatCurrency(restaurant.deliveryFee) },
          { label: 'A partir de', value: formatCurrency(restaurant.minPrice), sub: restaurant.hasPromotion ? restaurant.promotionLabel ?? 'Promoção' : 'Sem promoção' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="text-center">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
            <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Button asChild className="flex-1 gap-2">
          <a href={restaurant.redirectUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Abrir no {restaurant.providerName}
          </a>
        </Button>
        {user && (
          <Button
            variant="outline"
            size="default"
            onClick={() => toggleFav.mutate()}
            disabled={toggleFav.isPending}
            className={cn(isFavorite && 'border-red-200 text-red-500 hover:text-red-600 hover:border-red-300')}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500')} />
          </Button>
        )}
      </div>

      {/* Cardápio */}
      {restaurant.menu && restaurant.menu.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Destaques do cardápio
          </h2>
          <div className="space-y-3">
            {restaurant.menu.map((item) => (
              <div
                key={item.externalId}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm leading-snug">{item.name}</p>
                    {item.hasPromotion && item.promotionLabel && (
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {item.promotionLabel}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="font-semibold text-sm text-primary">{formatCurrency(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
