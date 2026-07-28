import { DialogProvider } from 'react-dialogs'
import { Outlet } from 'react-router'

import { WelcomeModal } from './_modals/WelcomeModal'

export default function ModalsLayout() {
  return (
    <DialogProvider dialogs={<WelcomeModal />}>
      <Outlet />
    </DialogProvider>
  )
}
