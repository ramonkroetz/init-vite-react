import { defineConfig } from '@lingui/cli'
import { formatter } from '@lingui/format-po'

import { LANGUAGES } from './src/locales/locales'

export default defineConfig({
  locales: LANGUAGES,
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src'],
    },
  ],
  format: formatter({
    origins: false,
  }),
})
