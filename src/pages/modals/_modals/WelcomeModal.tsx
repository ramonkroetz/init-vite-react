import { useLingui } from '@lingui/react/macro'
import { Dialog, useDialog } from 'react-dialogs'

import s from './WelcomeModal.module.css'

export const WELCOME_MODAL_ID = 'welcome-modal'

export type WelcomeModalProps = {
  name: string
}

export function WelcomeModal() {
  const { t } = useLingui()
  const { close, props } = useDialog<WelcomeModalProps>(WELCOME_MODAL_ID)

  return (
    <Dialog id={WELCOME_MODAL_ID}>
      <section aria-labelledby="welcome-modal-title" className={s.container}>
        <h1 id="welcome-modal-title">{t`Welcome ${props?.name ?? ''}`}</h1>
        <button onClick={() => close()} type="button">
          {t`Close`}
        </button>
      </section>
    </Dialog>
  )
}
