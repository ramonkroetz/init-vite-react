import { useLingui } from '@lingui/react/macro'

import { Link } from '../router'

import s from './Header.module.css'

export function Header() {
  const { t } = useLingui()

  return (
    <header className={s.header}>
      <div className={s.container}>
        <h1>{t`Header`}</h1>
        <div className={s.menu}>
          <Link className={s.button} to="/">
            {t`Home Page`}
          </Link>
        </div>
      </div>
    </header>
  )
}
