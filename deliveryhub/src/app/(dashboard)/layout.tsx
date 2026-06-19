import { AuthProvider } from '@/providers/auth-provider'
import { AppHeader } from '@/components/shared/app-header'
import { BottomNav } from '@/components/shared/bottom-nav'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { AuthUser } from '@/modules/auth/types'

async function tryGetUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession()
    if (!session) return null
    const user = await prisma.user.findUnique({
      where: { id: session.sub, active: true },
      select: { id: true, name: true, email: true },
    })
    return user ?? null
  } catch {
    return null
  }
}

interface AppLayoutProps {
  children: React.ReactNode
  /** Se a rota interna deve mostrar search bar no header */
  showHeaderSearch?: boolean
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const user = await tryGetUser()

  return (
    <AuthProvider initialUser={user}>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-4">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthProvider>
  )
}
