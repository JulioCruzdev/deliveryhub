import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth'
import { authRepository } from '../repositories/auth.repository'
import { createLogger } from '@/lib/logger'
import type { LoginInput, RegisterInput } from '../schemas'
import type { AuthUser, TokenPair } from '../types'

const logger = createLogger('auth.service')

export const authService = {
  async login(input: LoginInput): Promise<{ user: AuthUser; tokens: TokenPair }> {
    const user = await authRepository.findUserByEmail(input.email)
    if (!user) throw new Error('Credenciais inválidas')

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash)
    if (!passwordMatch) throw new Error('Credenciais inválidas')

    const tokens = await this.generateTokens(user.id, { sub: user.id, email: user.email })
    logger.info({ userId: user.id }, 'User logged in')

    return { user: { id: user.id, name: user.name, email: user.email }, tokens }
  },

  async register(input: RegisterInput): Promise<{ user: AuthUser; tokens: TokenPair }> {
    const existing = await authRepository.findUserByEmail(input.email)
    if (existing) throw new Error('E-mail já cadastrado')

    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await authRepository.createUser({ name: input.name, email: input.email, passwordHash })

    const tokens = await this.generateTokens(user.id, { sub: user.id, email: user.email })
    logger.info({ userId: user.id }, 'New user registered')

    return { user: { id: user.id, name: user.name, email: user.email }, tokens }
  },

  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenRecord = await authRepository.findRefreshToken(refreshToken)
    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new Error('Refresh token inválido ou expirado')
    }

    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) throw new Error('Refresh token inválido')

    const user = await authRepository.findUserById(payload.sub)
    if (!user) throw new Error('Usuário não encontrado')

    await authRepository.revokeRefreshToken(refreshToken)
    return this.generateTokens(user.id, { sub: user.id, email: user.email })
  },

  async logout(refreshToken: string): Promise<void> {
    await authRepository.revokeRefreshToken(refreshToken).catch(() => {})
  },

  async generateTokens(userId: string, payload: { sub: string; email: string }): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload),
      signRefreshToken(userId),
    ])

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await authRepository.saveRefreshToken(userId, refreshToken, expiresAt)

    return { accessToken, refreshToken }
  },
}
