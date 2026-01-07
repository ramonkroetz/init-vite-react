import { useLingui } from '@lingui/react/macro'
import { useDialog } from 'react-dialogs'

import { WELCOME_MODAL_ID, type WelcomeModalProps } from '../components/Modals/WelcomeModal'

export default function Modals() {
  const { t } = useLingui()
  const { show } = useDialog<WelcomeModalProps>(WELCOME_MODAL_ID)

  return (
    <div>
      <h1>{t`Modals Page`}</h1>
      <button onClick={() => show({ name: 'Uzumaki Naruto' })} type="button">
        {t`Open`}
      </button>
    </div>
  )
}
