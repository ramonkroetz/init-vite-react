import { useLingui } from '@lingui/react/macro'

import { useNavigate } from '@/src/router'
import { Main } from '../components/Main'

import s from './404.module.css'

export default function NotFound() {
  const { t } = useLingui()
  const navigate = useNavigate()

  return (
    <Main>
      <div className={s.page}>
        <h1 className={s.code}>404</h1>
        <p className={s.message}>{t`Página não encontrada`}</p>
        <button className={s.button} onClick={() => navigate('/')} type="button">
          {t`Voltar ao início`}
        </button>
      </div>
    </Main>
  )
}
