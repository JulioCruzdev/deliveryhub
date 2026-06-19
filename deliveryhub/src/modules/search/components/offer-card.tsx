'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { AggregatedResult } from '@/modules/search/types'

interface OfferCardProps {
  result: AggregatedResult
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function OfferCard({ result, isFavorite, onToggleFavorite }: OfferCardProps) {
  const {
    providerSlug,
    externalId,
    providerName,
    providerColor,
    providerTextColor,
    restaurantName,
    imageUrl,
    category,
    rating,
    reviewCount,
    distance,
    deliveryFee,
    minDeliveryTime,
    maxDeliveryTime,
    minPrice,
    hasPromotion,
    promotionLabel,
    redirectUrl,
    isLowestDeliveryFee,
    isFastestDelivery,
    isBestPromotion,
  } = result

  const hasBadge = isLowestDeliveryFee || isFastestDelivery || isBestPromotion

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Provider badge */}
      <div
        className="absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide shadow"
        style={{ backgroundColor: providerColor, color: providerTextColor }}
      >
        {providerName}
      </div>

      {/* Image */}
      <Link href={`/restaurante/${providerSlug}/${externalId}`}>
        <div className="relative h-36 w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={restaurantName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>
      </Link>

      <div className="p-4">
        {/* Badges de destaque */}
        {hasBadge && (
          <div className="mb-2 flex flex-wrap gap-1">
            {isLowestDeliveryFee && (
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                Menor frete
              </span>
            )}
            {isFastestDelivery && (
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                Entrega mais rápida
              </span>
            )}
            {isBestPromotion && (
              <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                Melhor promoção
              </span>
            )}
          </div>
        )}

        {/* Nome + categoria */}
        <Link href={`/restaurante/${providerSlug}/${externalId}`}>
          <h3 className="truncate font-semibold leading-snug hover:text-primary">{restaurantName}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{category}</p>

        {/* Rating + distância */}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
            <span className="text-[10px]">({reviewCount.toLocaleString('pt-BR')})</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {distance.toFixed(1)} km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {minDeliveryTime}–{maxDeliveryTime} min
          </span>
        </div>

        {/* Frete + preço */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Frete:{' '}
              <span className={cn('font-medium', deliveryFee === 0 && 'text-green-600 dark:text-green-400')}>
                {deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}
              </span>
            </p>
            <p className="text-sm font-semibold">
              A partir de{' '}
              <span className="text-primary">{formatCurrency(minPrice)}</span>
            </p>
          </div>

          {hasPromotion && promotionLabel && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {promotionLabel}
            </Badge>
          )}
        </div>

        {/* Ações */}
        <div className="mt-3 flex gap-2">
          <Button asChild size="sm" className="flex-1 gap-1">
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir no {providerName}
            </a>
          </Button>

          {onToggleFavorite && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFavorite}
              className={cn(isFavorite && 'text-red-500 border-red-200 hover:text-red-600')}
            >
              {isFavorite ? '♥' : '♡'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
