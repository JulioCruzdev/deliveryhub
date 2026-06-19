'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Search, ArrowRight, TrendingUp, Zap, Shield } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryGrid } from '@/modules/search/components/category-grid'
import { useAuth } from '@/providers/auth-provider'
import type { SearchHistoryDTO } from '@/modules/history/types'
import type { FavoriteDTO } from '@/modules/favorites/types'
import { formatCurrency } from '@/lib/utils'

const FEATURED_PROMOTIONS = [
  {
    id: '1',
    title: 'McDonald\'s',
    description: 'Combo Big Mac com R$ 5,00 de desconto',
    emoji: '🍔',
    color: 'from-red-600 to-red-500',
    provider: 'iFood',
    providerColor: '#EA1D2C',
    badge: 'R$ 5 OFF',
    href: '/restaurante/ifood/mcdonalds-sp-01',
  },
  {
    id: '2',
    title: 'Japan Sushi',
    description: 'Combinado 40 peças com R$ 12 de desconto',
    emoji: '🍣',
    color: 'from-indigo-700 to-indigo-600',
    provider: 'iFood',
    providerColor: '#EA1D2C',
    badge: 'R$ 12 OFF',
    href: '/restaurante/ifood/japansushi-sp-01',
  },
  {
    id: '3',
    title: "Domino's",
    description: 'Entrega grátis + 2ª pizza 40% off',
    emoji: '🍕',
    color: 'from-blue-700 to-blue-600',
    provider: '99Food',
    providerColor: '#FFD100',
    badge: 'Frete grátis',
    href: '/restaurante/99food/dominos-sp-01',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { user } = useAuth()

  const { data: history, isLoading: historyLoading } = useQuery<{ data: { history: SearchHistoryDTO[] } }>({
    queryKey: ['history'],
    queryFn: () => fetch('/api/history').then((r) => r.json()),
    enabled: !!user,
  })

  const { data: favorites, isLoading: favLoading } = useQuery<{ data: { favorites: FavoriteDTO[] } }>({
    queryKey: ['favorites'],
    queryFn: () => fetch('/api/favorites').then((r) => r.json()),
    enabled: !!user,
  })

  const recentSearches = history?.data?.history?.slice(0, 5) ?? []
  const favList = favorites?.data?.favorites?.slice(0, 4) ?? []

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
  }

  const searchQuick = (q: string) => {
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary px-6 py-10 text-primary-foreground">
        <h1 className="mb-1 text-2xl font-bold leading-snug sm:text-3xl">
          Compare e economize
          <br />
          no seu delivery
        </h1>
        <p className="mb-6 text-sm text-primary-foreground/80">
          iFood e 99Food numa só busca. Sem abrir dois apps.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você quer comer hoje?"
              className="bg-white pl-9 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" variant="secondary" className="shrink-0 font-semibold">
            Buscar
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Hambúrguer', 'Pizza', 'Sushi', 'Frango'].map((q) => (
            <button
              key={q}
              onClick={() => searchQuick(q)}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur hover:bg-white/30"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <CategoryGrid />

      {/* Promoções em destaque */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Promoções em destaque
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURED_PROMOTIONS.map((promo) => (
            <a
              key={promo.id}
              href={promo.href}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${promo.color} p-4 text-white transition-transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{promo.emoji}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: promo.providerColor, color: promo.providerColor === '#FFD100' ? '#1a1a1a' : '#fff' }}
                >
                  {promo.provider}
                </span>
              </div>
              <div className="mt-2">
                <p className="font-semibold">{promo.title}</p>
                <p className="mt-0.5 text-xs text-white/80">{promo.description}</p>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold backdrop-blur">
                {promo.badge} <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Por que usar */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: TrendingUp, title: 'Compare preços', desc: 'Veja iFood e 99Food lado a lado' },
          { icon: Zap, title: 'Mais rápido', desc: 'Filtre pela entrega mais veloz' },
          { icon: Shield, title: 'Sem surpresas', desc: 'Veja o frete antes de clicar' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl border border-border p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Pesquisas recentes */}
      {user && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pesquisas recentes
            </h2>
            <a href="/historico" className="text-xs text-primary hover:underline">
              Ver tudo
            </a>
          </div>

          {historyLoading ? (
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((h) => (
                <button
                  key={h.id}
                  onClick={() => searchQuick(h.query)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/50 hover:bg-primary/5"
                >
                  <Search className="h-3 w-3 text-muted-foreground" />
                  {h.query}
                  <span className="text-muted-foreground">({h.results})</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma pesquisa ainda. Experimente buscar algo!</p>
          )}
        </section>
      )}

      {/* Favoritos */}
      {user && favList.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Seus favoritos
            </h2>
            <a href="/favoritos" className="text-xs text-primary hover:underline">
              Ver todos
            </a>
          </div>

          {favLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {favList.map((fav) => (
                <a
                  key={fav.id}
                  href={`/restaurante/${fav.providerSlug}/${fav.restaurantExtId}`}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: fav.providerColor }}
                  >
                    {fav.restaurantName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{fav.restaurantName}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{fav.providerName}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA para não autenticados */}
      {!user && (
        <section className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">Crie uma conta grátis para salvar favoritos e histórico</p>
          <div className="mt-3 flex justify-center gap-3">
            <Button size="sm" asChild>
              <a href="/register">Criar conta</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Entrar</a>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
