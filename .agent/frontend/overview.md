## Frontend Overview (Next.js)

### Purpose

- Provides the user interface for browsing parts, building PCs, searching, reading articles/guides, and authentication.

### Tech Stack

- Next.js ^15 (App Router), React ^19
- Styling: TailwindCSS ^3 (dark mode via selector)
- Data fetching: Axios
- Validation/types: Zod

### Key Configuration

- [apps/frontend/next.config.js](./apps/frontend/next.config.js):
  - `env.PageSize = "50"`
  - `images.remotePatterns` for external product/content image hosts
- [apps/frontend/tailwind.config.js](./apps/frontend/tailwind.config.js):
  - Content includes `app/**/*`, `src/**/*`
  - Extended theme colors; `darkMode: "selector"`

### Routing Structure (App Router)

- Root: [apps/frontend/app/](./apps/frontend/app/)
  - `/` → `app/page.tsx`
  - `/build` → `app/build/page.tsx`, with nested `[product]/`
  - `/part` → list, with dynamic segments `app/part/[part]/[id]/` and `new/`
  - `/article` → article list and `[id]/` with `edit/`
  - `/[topic]/[part]` → topic/part content and `edit/`
  - `/auth/login` and `/auth/refresh`
  - `/search`, `/guide`, error and not-found boundaries

### Features & Components Overview

- Shared UI & Layout: [apps/frontend/src/components/](./apps/frontend/src/components/)
  - `components/layout/`: layout wrappers and UI headers
  - `components/ui/`: baseline primitives (modals, fields, grid)
- Domain Modules: [apps/frontend/src/features/](./apps/frontend/src/features/)
  - `features/part/`: rich detail cards, filters, forms, inputs, summaries, tables
  - `features/build/`: builder forms, list, results, and build validation context
  - `features/article/`: display blocks (Image/List/Paragraph/Section) and Notion-style editor
  - `features/auth/`: `LoginForm`, `UserPanel`
- Custom Hooks: [apps/frontend/src/hooks/](./apps/frontend/src/hooks/)
- Shared utilities: [apps/frontend/src/utils/](./apps/frontend/src/utils/) (e.g. customized Axios instance with CSRF)

### Data Flow

- API base is provided via `BACKEND_HOST` (in Docker env). Nginx proxies `/api` to NestJS, so the UI can call relative `/api/*` in containerized environments.
- Auth flows use JWT (via cookies/headers) and server/client components as needed.

### Images

- External domains whitelisted in `next.config.js` to allow product images (retailer CDNs, etc.).

### Development

- Services in [docker/nextjs/compose.yaml](./docker/nextjs/compose.yaml) provide `nextjs-dev` and `nextjs-prod` services.
- Dev service uses `develop.watch` to sync local repo into the container for HMR.
- Nginx proxies:
  - Dev: `/` → `http://nextjs-dev:3000`
  - Prod: `/` → `http://nextjs-prod:3000`

### Key Paths

- App routes: `apps/frontend/app/*`
- UI features: `apps/frontend/src/features/*`
- UI layout/shared: `apps/frontend/src/components/*`
- Hooks & utilities: `apps/frontend/src/hooks/*`, `apps/frontend/src/utils/*`
