'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SearchX } from 'lucide-react'
import { toast } from 'sonner'
import { FilterBar } from '@/modules/search/components/filter-bar'
import { OfferCard } from '@/modules/search/components/offer-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/providers/auth-provider'
import type { AggregatedResult } from '@/modules/search/types'
import type { FavoriteDTO } from '@/modules/favorites/types'

function SearchResults() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = searchParams.get('q') ?? ''
  const sort = searchParams.get('sort') ?? 'relevance'
  const freeDelivery = searchParams.get('free_delivery') ?? ''
  const hasPromotion = searchParams.get('has_promotion') ?? ''

  const apiParams = new URLSearchParams({ q: query, sort })
  if (freeDelivery) apiParams.set('free_delivery', freeDelivery)
  if (hasPromotion) apiParams.set('has_promotion', hasPromotion)

  const { data, isLoading, isError } = useQuery<{ data: { results: AggregatedResult[]; total: number } }>({
    queryKey: ['search', query, sort, freeDelivery, hasPromotion],
    queryFn: () => fetch(`/api/search?${apiParams}`).then((r) => r.json()),
    enabled: query.length > 0,
  })

  const { data: favsData } = useQuery<{ data: { favorites: FavoriteDTO[] } }>({
    queryKey: ['favorites'],
    queryFn: () => fetch('/api/favorites').then((r) => r.json()),
    enabled: !!user,
  })

  const favoriteIds = new Set(
    (favsData?.data?.favorites ?? []).map((f) => `${f.providerSlug}::${f.restaurantExtId}`)
  )

  const toggleFav = useMutation({
    mutationFn: (result: AggregatedResult) =>
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerSlug: result.providerSlug,
          restaurantExtId: result.externalId,
          restaurantName: result.restaurantName,
          restaurantImage: result.imageUrl,
          category: result.category,
        }),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      toast.success(json.message ?? 'Favorito atualizado')
    },
    onError: () => toast.error('Faça login para salvar favoritos'),
  })

  const results = data?.data?.results ?? []
  const total = data?.data?.total ?? 0

  if (!query) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Use a barra de busca para pesquisar</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <div className="py-20 text-center text-muted-foreground">Erro ao buscar. Tente novamente.</div>
  }

  return (
    <div className="space-y-4">
      <FilterBar query={query} total={total} />

      {results.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-medium">Nenhum resultado para &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">Tente outro termo ou remova os filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <OfferCard
              key={result.id}
              result={result}
              isFavorite={favoriteIds.has(`${result.providerSlug}::${result.externalId}`)}
              onToggleFavorite={user ? () => toggleFav.mutate(result) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
