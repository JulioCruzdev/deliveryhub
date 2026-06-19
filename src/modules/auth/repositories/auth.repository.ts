import { prisma } from '@/lib/prisma'
import type { User, RefreshToken } from '@prisma/client'

export const authRepository = {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email, active: true } })
  },

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id, active: true } })
  },

  async createUser(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    return prisma.user.create({ data })
  },

  async saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data: { userId, token, expiresAt } })
  },

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } })
  },

  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({ where: { token }, data: { revokedAt: new Date() } })
  },

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  },

  async cleanExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  },
}
