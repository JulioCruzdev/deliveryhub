'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Clock, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import type { SearchHistoryDTO } from '@/modules/history/types'

export default function HistoricoPage() {
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ data: { history: SearchHistoryDTO[] } }>({
    queryKey: ['history'],
    queryFn: () => fetch('/api/history').then((r) => r.json()),
  })

  const removeItem = useMutation({
    mutationFn: (id: string) => fetch(`/api/history?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['history'] })
      toast.success('Item removido')
    },
  })

  const clearAll = useMutation({
    mutationFn: () => fetch('/api/history', { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['history'] })
      toast.success('Histórico limpo')
    },
  })

  const history = data?.data?.history ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-bold">Histórico de pesquisas</h1>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => clearAll.mutate()}
            disabled={clearAll.isPending}
          >
            Limpar tudo
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-medium">Nenhuma pesquisa no histórico</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Suas buscas aparecerão aqui para acesso rápido
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

              <button
                onClick={() => router.push(`/buscar?q=${encodeURIComponent(item.query)}`)}
                className="flex-1 text-left"
              >
                <p className="font-medium">{item.query}</p>
                <p className="text-xs text-muted-foreground">
                  {item.results} resultado{item.results !== 1 ? 's' : ''} · {formatDate(new Date(item.createdAt))}
                </p>
              </button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem.mutate(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
