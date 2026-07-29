import { i18n } from '@lingui/core'
import { I18nProvider as LinguiProvider } from '@lingui/react'
import { type PropsWithChildren, useEffect } from 'react'
import { create } from 'zustand'

import { LANGUAGES, type Language } from '../locales/locales'

type I18nStoreProps = {
  language: Language
}

const defaultLanguage = LANGUAGES[0]

export const useI18nStore = create<I18nStoreProps>(() => ({
  language: defaultLanguage,
}))

export const setLanguage = async (language: Language) => {
  const { messages } = await import(`../locales/${language}.po?lingui`)
  i18n.load(language, messages)
  i18n.activate(language)
  useI18nStore.setState({ language })
}

export function I18nProvider({ children }: PropsWithChildren) {
  const language = useI18nStore((state) => state.language)

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

  if (!language) return null

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>
}
