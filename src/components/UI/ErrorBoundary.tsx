import { useLingui } from '@lingui/react/macro'
import { logError } from 'client-error-logger'
import { useEffect } from 'react'
import { useRouteError } from 'react-router'

import { Main } from '@/src/components/Main'
import { useNavigate } from '@/src/router'

import s from './ErrorBoundary.module.css'

export function ErrorBoundary() {
  const { t } = useLingui()
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
        <h2>{t`An unexpected error occurred.`}</h2>
        <button onClick={() => navigate(0)} type="button">
          {t`Try again`}
        </button>
        <button onClick={() => navigate('/')} type="button">
          {t`Go to home`}
        </button>
      </div>
    </Main>
  )
}
