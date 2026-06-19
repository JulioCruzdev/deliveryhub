'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { FavoriteDTO } from '@/modules/favorites/types'

export default function FavoritosPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ data: { favorites: FavoriteDTO[] } }>({
    queryKey: ['favorites'],
    queryFn: () => fetch('/api/favorites').then((r) => r.json()),
  })

  const remove = useMutation({
    mutationFn: (fav: FavoriteDTO) =>
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerSlug: fav.providerSlug,
          restaurantExtId: fav.restaurantExtId,
          restaurantName: fav.restaurantName,
        }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      toast.success('Removido dos favoritos')
    },
  })

  const favorites = data?.data?.favorites ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-red-500" />
        <h1 className="text-xl font-bold">Meus Favoritos</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-medium">Nenhum favorito ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Salve restaurantes da busca para acessá-los rapidamente
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/home">Ir para a busca</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: fav.providerColor }}
              >
                {fav.restaurantName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">{fav.restaurantName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: fav.providerColor, color: fav.providerColor === '#FFD100' ? '#1a1a1a' : '#fff' }}
                  >
                    {fav.providerName}
                  </span>
                  {fav.category && (
                    <span className="text-xs text-muted-foreground">{fav.category}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/restaurante/${fav.providerSlug}/${fav.restaurantExtId}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove.mutate(fav)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
