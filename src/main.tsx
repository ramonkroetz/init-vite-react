import { Routes } from '@generouted/react-router'
import ReactDOM from 'react-dom/client'

import { GlobalProviders } from './contexts/GlobalProviders'

import './styles/globals.css'

const app = document.getElementById('root')

if (!app) {
  throw new Error('App not found')
}

ReactDOM.createRoot(app).render(
  <GlobalProviders>
    <Routes />
  </GlobalProviders>,
)
