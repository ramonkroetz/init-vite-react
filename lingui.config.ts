import { defineConfig } from '@lingui/cli'

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
  formatOptions: {
    lineNumbers: false,
  },
})
