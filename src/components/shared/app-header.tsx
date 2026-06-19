'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, type FormEvent } from 'react'
import { Search, User, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'

export function AppHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mostra search bar compacta em todas as rotas exceto a home
  const showSearch = !pathname.startsWith('/home')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        {/* Logo */}
        <Link href="/home" className="flex shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Search className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className={cn('font-bold text-foreground', showSearch ? 'hidden sm:block' : 'block')}>
            DeliveryHub
          </span>
        </Link>

        {/* Search bar compacta (todas as páginas exceto home) */}
        {showSearch && (
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar restaurante ou prato..."
                className="pl-9 h-9"
              />
            </div>
            <Button type="submit" size="sm" className="shrink-0">
              Buscar
            </Button>
          </form>
        )}

        <div className={cn('flex items-center gap-2', showSearch ? '' : 'ml-auto')}>
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block max-w-[100px] truncate text-sm">{user.name}</span>
              </Button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-md border border-border bg-card shadow-md">
                    <div className="p-1">
                      <Link
                        href="/favoritos"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-accent"
                      >
                        <Heart className="h-4 w-4" /> Favoritos
                      </Link>
                      <button
                        onClick={() => { setMenuOpen(false); logout() }}
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" /> Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="hidden sm:flex" asChild>
                <Link href="/register">Criar conta</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
