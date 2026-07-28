# Init Vite React

Template React + Vite pronto para produção com roteamento por arquivos (Generouted), i18n com Lingui, React Query, Zustand, CSS Modules, otimização de imagem/SVG, automações de qualidade e deploy via GitLab CI na AWS.

[![Node](https://img.shields.io/badge/node-26.4-green)]() [![TypeScript](https://img.shields.io/badge/ts-5.9-blue)]() [![Vite](https://img.shields.io/badge/vite-8.0-yellow)]() [![React](https://img.shields.io/badge/react-19.2-blue)]()

---

## Sumário
- Quick Start
- Scripts
- Atualização do Node
- Variáveis de Ambiente
- Estrutura do Projeto
- Padrões Principais
- Lint, Formatação e Qualidade
- CI/CD (GitLab)
- Guias em `docs/`
- Troubleshooting
- Licença

---

## Quick Start
```bash
# Usa a versão de Node definida em .nvmrc
nvm install
nvm use

# Instala dependências
npm install

# Sobe ambiente local (com Lingui extract + compile antes do Vite)
npm run dev

# Build local de produção
npm run build

# Preview com variáveis de .env.dev
npm run preview
```

> `npm run dev` e `npm run lint` executam extração/compilação de traduções automaticamente.

---

## Scripts
- `dev`: executa `lingui:extract:compile` e sobe Vite com `.env.dev`.
- `build`: executa type-check (`tsc -b`) e build do Vite.
- `build:dev`: build usando `.env.dev`.
- `build:stage`: build usando `.env.stage`.
- `build:production`: build usando `.env.prod`.
- `preview`: roda `build:dev` e abre preview do Vite.
- `prebuild`: executa `lingui:extract:compile:strict` + `lint` antes do build.
- `lint`: roda `lint:node` + `lint:biome` + `lint:ts`.
- `lint:node`: verifica vulnerabilidades no Node com `is-my-node-vulnerable`.
- `lint:biome`: valida formatação/lint com erro em warnings.
- `lint:ts`: type-check sem emitir arquivos.
- `biome:format`: aplica formatação automática com Biome.
- `lingui:extract:compile`: extrai mensagens e compila catálogos.
- `lingui:extract:compile:strict`: extrai/compila com modo estrito.
- `supported:browsers`: gera detecção de navegadores em `public/browserDetect/`.
- `analyze`: gera visualização do bundle em `dist/stats.html`.
- `opencode`: abre o CLI do OpenCode para este workspace.
- `commit`: executa fluxo de commit via OpenCode.
- `translate`: executa fluxo de tradução via OpenCode.
- `audit`: executa auditoria de vulnerabilidades via OpenCode.

---

## Atualização do Node

```bash
nvm install node && nvm alias default node && nvm use node && node -v > .nvmrc

# Recomendado após instalar uma nova versão
rm -rf node_modules && npm install

# Remover o package.lock somente em ultimo caso onde a versão do node é imcompativel com a atual configuração.
```

---

## Variáveis de Ambiente

Arquivos suportados:
- `.env.dev`
- `.env.stage`
- `.env.prod`

```env
VITE_PUBLIC_BASE_URL_API=http://localhost:3000
VITE_PUBLIC_LOG_ENDPOINT=debug
VITE_GTM_ID=GTM-XXXXXXX
VITE_ENABLE_DATA_TEST=true
```

| Variável | Descrição |
|---|---|
| `VITE_PUBLIC_BASE_URL_API` | Base para chamadas de API no `ApiService` |
| `VITE_PUBLIC_LOG_ENDPOINT` | Controla modo de log (`debug`) e endpoint de log |
| `VITE_GTM_ID` | ID do Google Tag Manager usado pelo `vite-plugin-radar` |
| `VITE_ENABLE_DATA_TEST` | Habilita plugin Babel que injeta `data-test` automaticamente |

---

## Estrutura do Projeto

```
src/
├── assets/                  # Assets estáticos
│   ├── icons/               # Ícones SVG (ex.: akatsuki.svg)
│   └── images/              # Imagens (ex.: alpaca.jpg)
├── components/              # Componentes reutilizáveis
│   ├── UI/                  # Componentes base (ErrorBoundary, Image)
│   ├── Pages/               # Componentes acoplados a páginas (SpinnerPage)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Main.tsx
├── contexts/                # Providers globais
│   ├── GlobalProviders.tsx   # QueryClientProvider + I18nProvider
│   └── I18NProvider.tsx      # Provider Lingui + store Zustand
├── hooks/                   # Hooks compartilhados
│   ├── useApi.ts            # useQueryApi / useMutationApi (React Query)
│   ├── useBreakpoint.ts     # Hook de breakpoints responsivos
│   └── usePageTitle.ts      # Hook para título da página
├── infra/                   # Camadas de infraestrutura
│   ├── api.ts               # Cliente HTTP baseado em fetch
│   ├── cookie.ts            # Serviço de cookies (js-cookie)
│   └── error.ts             # CustomError e utilitários de log
├── locales/                 # Catálogos de tradução
│   ├── locales.ts           # Configuração de idiomas (en, pt-BR)
│   ├── en.po / en.js
│   └── pt-BR.po / pt-BR.js
├── modals/                  # Modais globais
├── pages/                   # Rotas file-based (Generouted)
│   ├── _app.tsx             # Layout raiz + ErrorBoundary
│   ├── index.tsx            # Rota "/"
│   ├── duel.tsx             # Rota "/duel"
│   ├── 404.tsx              # Rota de erro 404
│   └── modals/              # Rota "/modals" com exemplos de modais
│       ├── _layout.tsx      # Layout com DialogProvider
│       ├── _modals/         # Modais locais da feature
│       └── index.tsx
├── styles/                  # Estilos globais
│   ├── base/
│   │   ├── fonts.css        # @font-face (TCCC Unity)
│   │   ├── reset.css        # modern-normalize
│   │   └── variables.css    # Variáveis CSS (cores, fontes, breakpoints)
│   └── globals.css
├── router.ts                # Gerado automaticamente pelo Generouted
└── main.tsx                 # Entry point

public/
├── browserDetect/           # Detecção de navegadores (gerado por script)
├── fonts/                   # Fontes TCCC Unity (woff2)
├── favicon.ico
└── robots.txt

scripts/
├── babel-plugin-auto-data-test.ts  # Injeta data-test em elementos com CSS Modules
└── generateSupportedBrowsers.sh     # Gera detecção de navegadores via browserslist
```

Alias de import:
- `@/src` -> `./src`

---

## Padrões Principais

### Routing
- Roteamento baseado em arquivos via **Generouted**.
- `src/router.ts` é gerado automaticamente (não editar manualmente).
- Novas rotas: criar arquivos em `src/pages/`. Tipos são atualizados ao rodar `npm run dev`.
- Rotas disponíveis: `/`, `/duel`, `/modals`.

### i18n (Lingui)
- Provider em `src/contexts/I18NProvider.tsx`.
- Idiomas: `en`, `pt-BR` (definidos em `src/locales/locales.ts`).
- Mensagens carregadas dinamicamente via `.po?lingui`.
- Store Zustand para idioma (`useI18nStore` / `setLanguage`).
- **Sempre** usar `useLingui` de `@lingui/react/macro` com `const { t } = useLingui()`.

### API e React Query
- `src/infra/api.ts`: cliente HTTP sobre `fetch`, erros normalizados em `CustomError`.
- `src/hooks/useApi.ts`:
  - `useQueryApi` para leitura (GET).
  - `useMutationApi` para escrita (POST, PUT, DELETE).
  - Suporte a cache, refetch, removeQueries, callbacks e tratamento de erros centralizado.

### Gerenciamento de Estado
- **Zustand** para estado global do cliente (ex.: idioma).
- **React Query** para dados de servidor/cache.

### Build / Plugins Vite
- `@vitejs/plugin-react` com React Compiler.
- `@rolldown/plugin-babel` com macro Lingui + `babel-plugin-react-compiler`.
- `vite-plugin-image-optimizer`, `vite-imagetools`, `vite-plugin-svgr` para assets.
- `vite-plugin-radar` para Google Tag Manager.
- PWA via `vite-plugin-pwa` (desativado por padrão: `ENABLED_PWA = false`).
- Proxy de `/api` para `http://localhost:5001` em dev.
- `manualChunks` para separar `react`, `react-router` e `client-error-logger`.

### Responsividade
- Breakpoints definidos como variáveis CSS: `--breakpoint-sm` (480px), `--md` (768px), `--lg` (1024px), `--xl` (1280px).
- Hook `useBreakpoint` em `src/hooks/useBreakpoint.ts`.
- Abordagem mobile-first.

### Imagens
- **Locais**: componente `Image` com `vite-imagetools` (formato webp, metadata).
- **Externas**: componente `ExternalImage` para URLs remotas.
- Otimização automática com `vite-plugin-image-optimizer` (SVGO, sharp).

### Auto `data-test`
- Plugin Babel em `scripts/babel-plugin-auto-data-test.ts` injeta `data-test` automaticamente em elementos JSX com `className` de CSS Modules.
- Ativado via `VITE_ENABLE_DATA_TEST=true`.

### Detecção de Navegadores
- Script `supported:browsers` gera detecção via `browserslist-useragent-regexp`.
- Regras em `.browserslistrc`: `>0.3%`, `chrome >=111`, `edge >=111`, `firefox >=111`, `safari >=16.4`, `not dead`.

### Modais
- Biblioteca `react-dialogs`.
- Modais locais em `pages/*/_modals/`, registrados no `DialogProvider` do layout da página.
- Modais globais em `src/modals/`.

---

## Lint, formatação e qualidade

- **Biome**: formatação e linting com regras customizadas (sem `console`, sem imports não usados, etc.).
- `npm run lint`: executa `lint:node` + `lint:biome` + `lint:ts`.
- `npm run lint:biome`: falha em warnings.
- `npm run biome:format`: aplica autoformatação.
- TypeScript: modo estrito, sem `any` implícito, sem variáveis/parâmetros não usados.

---

## CI/CD (GitLab)

Pipeline definido em `.gitlab-ci.yml`:

| Estágio | Descrição |
|---|---|
| `quality` | `npm ci` + `npm run lint` + `npm run build:production` (em MRs e main) |
| `build` | `npm run build:production` + artifact `dist.tar.gz` (apenas main) |
| `deploy` | Upload para S3 + invalidação CloudFront (manual) |
| `invalidate` | Invalidação CloudFront manual |

---

## Guias em `docs/`

- `docs/architecture-guidelines.md` — Organização do projeto por escopo (rota vs global).
- `docs/component-guidelines.md` — Padrões de componentes, nomenclatura, CSS Modules e variáveis.
- `docs/global-state-guidelines.md` — Quando e como criar estados globais com Zustand.
- `docs/i18n-guidelines.md` — Boas práticas de internacionalização com Lingui.
- `docs/modal-guidelines.md` — Criação e uso de modais com `react-dialogs`.
- `docs/useApi-guidelines.md` — Integração com API usando `useQueryApi` / `useMutationApi`.

---

## Troubleshooting
- Verifique se as variáveis de ambiente obrigatórias estão definidas.
- Dependências privadas (`client-error-logger`, `react-dialogs`) exigem acesso a repositórios Git internos.
- Após adicionar uma rota, reinicie o dev server para atualizar os tipos em `router.ts`.
- Para usar PWA, altere `ENABLED_PWA = true` em `vite.config.ts`.

---

## Licença
MIT
