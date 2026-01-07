import type { PropsWithChildren } from 'react'

import s from './Main.module.css'

export function Main({ children }: PropsWithChildren) {
  return <main className={s.main}>{children}</main>
}
