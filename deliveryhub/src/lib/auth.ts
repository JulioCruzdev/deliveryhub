import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret-change-in-production'
)

export interface JWTPayload {
  sub: string
  email: string
}

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? '15m')
    .sign(JWT_SECRET)
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN ?? '7d')
    .sign(JWT_REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
    return payload as { sub: string }
  } catch {
    return null
  }
}

export async function getServerSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null
  return verifyAccessToken(token)
}

export function setAuthCookies(response: Response, accessToken: string, refreshToken: string): void {
  const isProd = process.env.NODE_ENV === 'production'
  const accessMaxAge = 15 * 60
  const refreshMaxAge = 7 * 24 * 60 * 60

  response.headers.append(
    'Set-Cookie',
    `access_token=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${accessMaxAge}${isProd ? '; Secure' : ''}`
  )
  response.headers.append(
    'Set-Cookie',
    `refresh_token=${refreshToken}; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=${refreshMaxAge}${isProd ? '; Secure' : ''}`
  )
}

export function clearAuthCookies(response: Response): void {
  response.headers.append('Set-Cookie', 'access_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
  response.headers.append('Set-Cookie', 'refresh_token=; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=0')
}
