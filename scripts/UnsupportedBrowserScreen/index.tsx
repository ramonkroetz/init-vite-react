// biome-ignore lint/correctness/noUnusedImports: Need React in scope for JSX, even if it's not directly referenced.
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

type FallbackCopy = {
  title: string
  message: string
}

type SupportedLocale = 'pt-br'

type FallbackLayoutProps = {
  locale: SupportedLocale
}

const DEFAULT_LOCALE: SupportedLocale = 'pt-br'

const copyByLocale: Record<SupportedLocale, FallbackCopy> = {
  'pt-br': {
    title: 'Navegador não compatível',
    message:
      'Seu navegador não é compatível ou houve falha no carregamento da aplicação. Atualize o navegador ou tente novamente em outro browser.',
  },
}

function FallbackLayout({ locale }: FallbackLayoutProps) {
  const { message, title } = copyByLocale[locale]

  return (
    <div className="unsupported-browser-overlay">
      <div className="unsupported-browser-card">
        <div className="unsupported-browser-accent" />

        <h1 className="unsupported-browser-title">{title}</h1>

        <p className="unsupported-browser-message">{message}</p>
      </div>
    </div>
  )
}

const listLocaleKeys = Object.keys(copyByLocale) as SupportedLocale[]
const htmlByLocale: Record<SupportedLocale, string> = listLocaleKeys.reduce<Record<SupportedLocale, string>>(
  (acc, localeKey) => {
    acc[localeKey] = renderToStaticMarkup(<FallbackLayout locale={localeKey} />)
    return acc
  },
  {
    'pt-br': '',
  },
)

const fallbackMarkupPayload = {
  ...htmlByLocale,
  default: htmlByLocale[DEFAULT_LOCALE] || htmlByLocale[listLocaleKeys[0]] || '',
}

// Print as a JS-safe object literal so shell scripts can embed it directly.
process.stdout.write(JSON.stringify(fallbackMarkupPayload))
