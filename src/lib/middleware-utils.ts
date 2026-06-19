import { NextRequest } from 'next/server'
import { verifyAccessToken, JWTPayload } from './auth'

export async function getAuthFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get('access_token')?.value
  if (!token) return null
  return verifyAccessToken(token)
}
