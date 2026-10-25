import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { ThemeProvider } from '@/app/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { appConfig } from '@/config/app.config'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: true } },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey={appConfig.storageKeys.theme}>
        {children}
        <Toaster
          position="bottom-center"
          mobileOffset={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
