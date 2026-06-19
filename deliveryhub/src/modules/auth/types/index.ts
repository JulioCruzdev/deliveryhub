export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}
