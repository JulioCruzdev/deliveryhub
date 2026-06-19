'use client'

import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/modules/search/types'

export function CategoryGrid() {
  const router = useRouter()

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Categorias
      </h2>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/buscar?q=${encodeURIComponent(cat.slug)}`)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
          >
            <span className="text-2xl leading-none">{cat.emoji}</span>
            <span className="text-[11px] font-medium leading-tight text-foreground">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
