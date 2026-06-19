'use client'

import { Settings, User, Mail, LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/providers/auth-provider'
import { toast } from 'sonner'

export default function ConfiguracoesPage() {
  const { user, logout } = useAuth()

  const handleClearHistory = async () => {
    await fetch('/api/history', { method: 'DELETE' })
    toast.success('Histórico de pesquisas limpo')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-bold">Configurações</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Minha conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Meus dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Histórico de pesquisas</p>
              <p className="text-xs text-muted-foreground">Remove todas as pesquisas salvas</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Plataformas disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'iFood', color: '#EA1D2C', textColor: '#fff', status: 'Ativo' },
            { name: '99Food', color: '#FFD100', textColor: '#1a1a1a', status: 'Ativo' },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ backgroundColor: p.color, color: p.textColor }}
                >
                  {p.name[0]}
                </div>
                <span className="text-sm font-medium">{p.name}</span>
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">{p.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive hover:border-destructive"
        onClick={logout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair da conta
      </Button>
    </div>
  )
}
