import ReactDOM from 'react-dom/client'

import { GlobalProviders } from './contexts/GlobalProviders'

import './styles/globals.css'

import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { SpinnerPage } from './components/Pages/SpinnerPage'

const app = document.getElementById('root')

if (!app) {
  throw new Error('App not found')
}

const { routes } = import.meta.env.DEV
  ? await import('@generouted/react-router')
  : await import('@generouted/react-router/lazy')

const router = createBrowserRouter([
  {
    ...routes[0],
    HydrateFallback: SpinnerPage,
  },
])

ReactDOM.createRoot(app).render(
  <GlobalProviders>
    <Suspense fallback={<SpinnerPage />}>
      <RouterProvider router={router} />
    </Suspense>
  </GlobalProviders>,
)
