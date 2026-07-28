import { useLingui } from '@lingui/react/macro'

import s from './SpinnerPage.module.css'

export function SpinnerPage() {
  const { t } = useLingui()

  return <div className={s.screenLoader}>{t`Loading...`}</div>
}
