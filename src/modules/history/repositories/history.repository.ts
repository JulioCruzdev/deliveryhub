import { prisma } from '@/lib/prisma'
import type { SearchHistoryDTO } from '../types'

export const historyRepository = {
  async list(userId: string, limit = 10): Promise<SearchHistoryDTO[]> {
    const items = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return items.map((h) => ({
      id: h.id,
      query: h.query,
      results: h.results,
      createdAt: h.createdAt.toISOString(),
    }))
  },

  async add(userId: string, query: string, results: number): Promise<void> {
    await prisma.searchHistory.create({ data: { userId, query, results } })
  },

  async remove(id: string, userId: string): Promise<void> {
    await prisma.searchHistory.delete({ where: { id, userId } })
  },

  async clear(userId: string): Promise<void> {
    await prisma.searchHistory.deleteMany({ where: { userId } })
  },
}
