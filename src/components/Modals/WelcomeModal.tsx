import { Dialog, useDialog } from 'react-dialogs'
export const WELCOME_MODAL_ID = 'welcome-modal'

import s from './WelcomeModal.module.css'
export type WelcomeModalProps = {
  name: string
}

export function WelcomeModal() {
  const { close, props } = useDialog<WelcomeModalProps>(WELCOME_MODAL_ID)
  return (
    <Dialog id={WELCOME_MODAL_ID}>
      <div className={s.container}>
        <h1>Welcome {props?.name}</h1>
        <button onClick={() => close()} type="button">
          Close
        </button>
      </div>
    </Dialog>
  )
}
