import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/components/shared/query-provider'
import { AuthProvider } from '@/components/shared/auth-provider'
import { cn } from '@/lib/utils'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Chaos GPT — Capivaras de Pelúcia',
  description: 'E-commerce educacional para Engenharia do Caos com IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
