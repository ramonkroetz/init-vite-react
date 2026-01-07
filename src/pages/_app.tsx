import { Outlet } from 'react-router'

import { ErrorBoundary } from '../components/UI/ErrorBoundary'

export default function App() {
  return <Outlet />
}

export const Catch = () => {
  return <ErrorBoundary />
}
