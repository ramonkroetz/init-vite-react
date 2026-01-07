import { Trans } from '@lingui/react/macro'
import { Link } from 'react-router-dom'

import s from './Header.module.css'

export function Header() {
  return (
    <header className={s.header}>
      <div className={s.container}>
        <h1>Header</h1>
        <div className={s.menu}>
          <Link className={s.button} to="/">
            <Trans>Home Page</Trans>
          </Link>
        </div>
      </div>
    </header>
  )
}
