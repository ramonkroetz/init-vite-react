import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configure } from 'client-error-logger'
import React from 'react'
import { DialogProvider } from 'react-dialogs'

import { WelcomeModal } from '@/src/components/Modals/WelcomeModal'
import { I18nProvider } from './I18NProvider'

import 'react-dialogs/styles.css'

configure({
  debug: import.meta.env.VITE_PUBLIC_LOG_ENDPOINT === 'debug',
  logEndpoint: `${import.meta.env.VITE_PUBLIC_BASE_URL_API}/log`,
})

const queryClient = new QueryClient()

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <DialogProvider dialogs={<WelcomeModal />}>{children}</DialogProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
