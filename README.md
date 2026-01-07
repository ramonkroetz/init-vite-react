# Init Vite React

A production-ready React + Vite starter with file-based routing, i18n, dialogs, API utilities, PWA support, and image/SVG tooling.

[![Node](https://img.shields.io/badge/node-LTS-brightgreen)]() [![TypeScript](https://img.shields.io/badge/ts-5.x-blue)]() [![Vite](https://img.shields.io/badge/vite-7.x-yellow)]()

---

## Table of Contents
- Quick Start
- Scripts
- Environment
- Project structure
- Patterns (Routing, i18n, API)
- Linting & Formatting
- Contributing
- License

---

## Quick Start
```bash
# install correct node version considering .nvmrc file
nvm install

# Install dependencies
npm install

# Start dev server (runs Lingui extract/compile beforehand)
npm run dev

# Build project
npm run build

# Preview a production build
npm run preview
```

> Tip: `npm run dev` runs Lingui extraction and compilation automatically so translations are available during development.

---

## Scripts (high level)
- `dev` — Dev server (extracts/translates with Lingui)
- `build` — Type-checks and builds
- `build:web` — Lint then `build`
- `preview` / `start` — Serve a production build
- `lint` / `lint:css` / `css:format` — Linters and CSS fixes
- `supported:browsers` — Regenerates `public/browserDetect/supportedBrowsers.js`

---

## Environment
Env files supported: `.env.dev`, `.env.stage`, `.env.prod` (loaded via `env-cmd`).

Common variables:
```env
VITE_PUBLIC_BASE_URL_API=http://localhost:3000
VITE_PUBLIC_LOG_ENDPOINT=debug
```

- `VITE_PUBLIC_BASE_URL_API`: Base URL for API requests
- `VITE_PUBLIC_LOG_ENDPOINT`: `debug` to log locally, or a URL path accepted by `logger-browser`

---

## Project structure (high level)
- `src/pages/` — File-based routes (root layout: `src/pages/_app.tsx`)
- `src/contexts/` — App providers (`GlobalProviders`, `I18NProvider`)
- `src/components/` — Reusable UI, dialogs, error boundary, image utils
- `src/infra/` — API, cookie, and error utilities
- `src/locales/` — Lingui message catalogs
- `src/styles/` — Global styles, resets, variables

Import alias: `@/src` → `./src` (see `vite.config.ts`)

---

## Patterns
### Routing
- Generouted file-based routing (`src/router.ts` is generated). Add routes by creating files in `src/pages/`.

### i18n
- Lingui provider at `src/contexts/I18NProvider.tsx` (detects browser language and dynamically loads catalogs).
- Use `<Trans>` and `t` macros; extraction/compilation happens in dev and lint runs.

### API
- `src/infra/api.ts` exposes an Axios instance and transforms errors into `CustomError`.
- `src/hooks/useApi.ts` provides a standardized hook for requests with `isLoading`, `data`, `errorMessage`, and `runApi`.

---

## Linting & Formatting
- Run `npm run lint` to execute Biome (fails on warnings), Stylelint, and Lingui checks.
- Use `npm run css:format` to auto-fix CSS order/style issues.

---

## Contributing
Thanks for contributing! Please:
- Respect Biome lint rules and fix any warnings.
- Keep changes small and well-tested.
- Update translations when adding user-visible strings.

Open a PR against `main` and include a short description of your changes.

---

## License
Specify a license (e.g. MIT) or add a `LICENSE` file to the repository.

---

## Troubleshooting
- Ensure required env vars are set (especially `VITE_PUBLIC_BASE_URL_API`).
- Private packages (e.g. `logger-browser`) may require network access or credentials.

If you want any additional sections (examples, badges, or contributing guidelines), tell me what to include and I’ll add them.