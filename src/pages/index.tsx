import { Trans, useLingui } from '@lingui/react/macro'
import { usePageTitle } from 'react-hooks'

import alpaca from '@/src/assets/images/alpaca.jpg?as=metadata'
import NounAkatsukiCloud from '@/src/components/Icons/AkatsukiIcon.svg?react'
import { useI18n } from '@/src/contexts/I18NProvider'
import { Link } from '@/src/router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Main } from '../components/Main'
import { Image } from '../components/UI/Image'
import { LANGUAGES } from '../locales/locales'

import s from './index.module.css'

export default function Home() {
  usePageTitle('Home')
  const { t } = useLingui()
  const { setLanguage } = useI18n()

  return (
    <>
      <Header />
      <Main>
        <div className={s.page}>
          <div className={s.buttonsWrapper}>
            {LANGUAGES.map((language) => (
              <button className={s.button} key={language} onClick={() => setLanguage(language)} type="button">
                {language}
              </button>
            ))}
            <Link className={s.button} to="/duel">
              <Trans>Yugioh Page</Trans>
            </Link>
            <Link className={s.button} to="/modals">
              <Trans>Modals Page</Trans>
            </Link>
          </div>
          <NounAkatsukiCloud className={s.logo} />
          <ol>
            <li>
              <Trans>
                Get started by editing <code>app/index.tsx</code>.
              </Trans>
            </li>
            <li>
              <Trans>Save and see your changes instantly.</Trans>
            </li>
          </ol>
          <div className={s.imageWrapper}>
            <Image alt={t`Example Image.`} grow priority src={alpaca} width={300} />
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}
