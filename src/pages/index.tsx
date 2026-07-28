import { useLingui } from '@lingui/react/macro'

import NounAkatsukiCloud from '@/src/assets/icons/akatsuki.svg?react'
import alpaca from '@/src/assets/images/alpaca.jpg?as=metadata'
import { setLanguage } from '@/src/contexts/I18NProvider'
import { usePageTitle } from '@/src/hooks/usePageTitle'
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
              {t`Yugioh Page`}
            </Link>
            <Link className={s.button} to="/modals">
              {t`Modals Page`}
            </Link>
          </div>
          <NounAkatsukiCloud className={s.logo} />
          <ol>
            <li>{t`Get started by editing app/index.tsx.`}</li>
            <li>{t`Save and see your changes instantly.`}</li>
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
