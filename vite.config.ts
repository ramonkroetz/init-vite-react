import path from 'node:path'

import generouted from '@generouted/react-router/plugin'
import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

const ENABLED_PWA = false

export default defineConfig({
  envDir: './',
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro', 'babel-plugin-react-compiler'],
      },
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
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
