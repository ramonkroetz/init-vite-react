import path from 'node:path'

import generouted from '@generouted/react-router/plugin'
import { lingui } from '@lingui/vite-plugin'
import babel from '@rolldown/plugin-babel'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { imagetools } from 'vite-imagetools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'
import { VitePluginRadar } from 'vite-plugin-radar'
import svgr from 'vite-plugin-svgr'

const ENABLED_PWA = false

const getBabelPlugins = () => {
  const plugins = ['@lingui/babel-plugin-lingui-macro', ['babel-plugin-react-compiler', {}]]

  const shouldEnableDataTest = process.env.VITE_ENABLE_DATA_TEST === 'true'

  if (shouldEnableDataTest) {
    plugins.push(path.resolve(__dirname, './scripts/babel-plugin-auto-data-test.ts'))
  }

  return plugins
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    envDir: './',
    plugins: [
      react(),
      babel({
        plugins: getBabelPlugins(),
      }),
      ViteImageOptimizer(),
      svgr(),
      imagetools({
        defaultDirectives: () => {
          return new URLSearchParams({
            format: 'webp',
            metadata: 'true',
          })
        },
      }),
      lingui(),
      generouted(),
      VitePluginRadar({
        enableDev: true,
        gtm: {
          id: env.VITE_GTM_ID,
        },
      }),
      ENABLED_PWA ? VitePWA() : undefined,
    ],
    resolve: {
      alias: {
        '@/src': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-router')) return 'react-router'
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react'
            if (id.includes('node_modules/client-error-logger')) return 'client-error-logger'

            return undefined
          },
        },
      },
    },
  }
})
