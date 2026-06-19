import { NextRequest } from 'next/server'
import { searchService } from '@/modules/search/services/search.service'
import { historyRepository } from '@/modules/history/repositories/history.repository'
import { ok, badRequest, handleError } from '@/lib/api-response'
import { getAuthFromRequest } from '@/lib/middleware-utils'
import type { SortBy, SearchFilters } from '@/modules/search/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const query = searchParams.get('q')?.trim()
    if (!query) return badRequest('Parâmetro "q" é obrigatório')

    const sortBy = (searchParams.get('sort') as SortBy) ?? 'relevance'

    const filters: SearchFilters = {}
    if (searchParams.get('free_delivery') === '1') filters.freeDelivery = true
    if (searchParams.get('has_promotion') === '1') filters.hasPromotion = true
    if (searchParams.get('category')) filters.category = searchParams.get('category')!
    if (searchParams.get('max_price')) filters.maxPrice = Number(searchParams.get('max_price'))
    if (searchParams.get('max_time')) filters.maxDeliveryTime = Number(searchParams.get('max_time'))

    const results = await searchService.search(query, { sortBy, filters })

    // Salva histórico se autenticado
    const session = await getAuthFromRequest(req)
    if (session) {
      historyRepository.add(session.sub, query, results.length).catch(() => {})
    }

    return ok({ results, total: results.length })
  } catch (error) {
    return handleError(error)
  }
}
