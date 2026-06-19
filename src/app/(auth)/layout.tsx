import { Search } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-900 p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">DeliveryHub</span>
        </div>

        <div>
          <blockquote className="space-y-2">
            <p className="text-lg text-zinc-300">
              &ldquo;Pesquise uma vez, compare iFood e 99Food ao mesmo tempo.
              Encontre o melhor preço e a entrega mais rápida sem sair do app.&rdquo;
            </p>
            <footer className="text-sm text-zinc-500">
              O Buscapé do delivery — simples assim.
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
