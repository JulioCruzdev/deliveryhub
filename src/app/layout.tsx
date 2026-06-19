import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'DeliveryHub — Compare iFood e 99Food',
    template: '%s | DeliveryHub',
  },
  description: 'Compare preços, fretes e promoções de delivery em um único lugar. iFood e 99Food lado a lado.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              expand
              richColors
              closeButton
              toastOptions={{ duration: 4000 }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
