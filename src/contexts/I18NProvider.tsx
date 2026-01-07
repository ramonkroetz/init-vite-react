import { i18n } from '@lingui/core'
import { I18nProvider as LinguiProvider } from '@lingui/react'
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'

import { LANGUAGES, type Language } from '../locales/locales'

const languages = ['en', 'pt-BR']
const defaultLanguage = languages[0]

type I18nContextProps = {
  language: string
  languages: string[]
  setLanguage: (locale: string) => void
}

const I18nContextInitialState: I18nContextProps = {
  language: defaultLanguage,
  languages,
  setLanguage: () => {},
}

const I18nContext = createContext(I18nContextInitialState)

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState('')

  useEffect(() => {
    const language = navigator.language as Language
    const countryLanguage = language.split('-')[0] as Language
    let browserLanguage = defaultLanguage

    if (LANGUAGES.includes(language)) {
      browserLanguage = language
    } else if (LANGUAGES.includes(countryLanguage)) {
      browserLanguage = countryLanguage
    }

    document.documentElement.setAttribute('lang', browserLanguage)
    setLanguage(browserLanguage)
  }, [])

  const dynamicActivate = useCallback(async (locale: string) => {
    const { messages } = await import(`../locales/${locale}.po?lingui`)
    i18n.load(locale, messages)
    i18n.activate(locale)
  }, [])

  useEffect(() => {
    if (language) {
      dynamicActivate(language)
    }
  }, [language, dynamicActivate])

  if (!language) return null

  const value = { language, languages, setLanguage }

  return (
    <LinguiProvider i18n={i18n}>
      <I18nContext value={value}>{children}</I18nContext>
    </LinguiProvider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
