'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, Clock, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'

const navItems = [
  { href: '/home', label: 'Início', icon: Home },
  { href: '/buscar', label: 'Buscar', icon: Search },
  { href: '/favoritos', label: 'Favoritos', icon: Heart, requiresAuth: true },
  { href: '/historico', label: 'Histórico', icon: Clock, requiresAuth: true },
  { href: '/configuracoes', label: 'Config.', icon: Settings, requiresAuth: true },
]

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          const href = item.requiresAuth && !user ? `/login?redirect=${item.href}` : item.href

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors min-w-[56px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'fill-primary/10')} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
