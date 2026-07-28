import { useLingui } from '@lingui/react/macro'

import s from './Footer.module.css'

export function Footer() {
  const { t } = useLingui()

  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <h1>{t`Footer`}</h1>
      </div>
    </footer>
  )
}
