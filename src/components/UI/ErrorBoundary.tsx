import { Trans } from '@lingui/react/macro'
import { logError } from 'client-error-logger'
import { useEffect } from 'react'
import { useRouteError } from 'react-router'

import { Main } from '@/src/components/Main'
import { useNavigate } from '@/src/router'

import s from './ErrorBoundary.module.css'

export function ErrorBoundary() {
  const navigate = useNavigate()
  const error = useRouteError()

  useEffect(() => {
    async function init() {
      await logError('ErrorFrontend', { error })
    }

    init()
  }, [error])

  return (
    <Main>
      <div className={s.error}>
        <h2>
          <Trans>An unexpected error occurred.</Trans>
        </h2>
        <button onClick={() => navigate(0)} type="button">
          <Trans>Try again</Trans>
        </button>
        <button onClick={() => navigate('/')} type="button">
          <Trans>Go to home</Trans>
        </button>
      </div>
    </Main>
  )
}
