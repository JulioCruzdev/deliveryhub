'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SORT_LABELS, type SortBy } from '@/modules/search/types'

const SORT_OPTIONS: SortBy[] = ['relevance', 'price', 'delivery_fee', 'delivery_time', 'rating', 'distance']

interface FilterBarProps {
  query: string
  total: number
}

export function FilterBar({ query, total }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = (searchParams.get('sort') as SortBy) ?? 'relevance'
  const freeDelivery = searchParams.get('free_delivery') === '1'
  const hasPromotion = searchParams.get('has_promotion') === '1'

  function buildUrl(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', query)
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key)
      else params.set(key, value)
    }
    return `/buscar?${params.toString()}`
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{total}</span> resultados
      </p>

      {/* Sort pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort}
            onClick={() => router.push(buildUrl({ sort }))}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              currentSort === sort
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/50'
            )}
          >
            {SORT_LABELS[sort]}
          </button>
        ))}
      </div>

      {/* Filter toggles */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push(buildUrl({ free_delivery: freeDelivery ? null : '1' }))}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            freeDelivery
              ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
              : 'border-border bg-card hover:border-green-400'
          )}
        >
          Entrega grátis
        </button>
        <button
          onClick={() => router.push(buildUrl({ has_promotion: hasPromotion ? null : '1' }))}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            hasPromotion
              ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
              : 'border-border bg-card hover:border-orange-400'
          )}
        >
          Com promoção
        </button>
      </div>
    </div>
  )
}
