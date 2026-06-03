
## PC-Builder: Project Overview

### What this project is

- **Goal**: A full‑stack PC parts catalog and builder with articles/guides.
- **Frontend**: Next.js App Router UI for browsing parts, building PCs, search, auth, and content.
- **Backend**: NestJS API providing parts data, builds, auth, users, and articles.
- **Data**: MySQL (relational) + MongoDB (document) with optional crawlers for ingest.
- **Runtime**: Dockerized services with Nginx reverse proxy.

### Tech stack

- **Frontend**: Next.js ^15, React ^19, TailwindCSS ^3, Axios, Zod
- **Backend**: NestJS ^11, JWT, Sequelize (MySQL), Mongoose (MongoDB)
- **Databases**: MySQL, MongoDB
- **Infra**: Docker Compose (multi-file via includes), Nginx (reverse proxy)
- **Language**: TypeScript ^5

### High-level architecture

- `nginx` fronts all traffic.
  - Routes `/<everything-else>` → `nextjs` UI
  - Routes `/api/**` → `nestjs` API (Nest global prefix is `api`)
- `nextjs` connects to the API using the `BACKEND_HOST` environment variable.
- `nestjs` connects to MySQL via Sequelize and MongoDB via Mongoose.

### Runtime services (compose)

- Root `compose.yaml` includes sub-stacks:
  - `docker/database/compose.yaml`: `mysql`, `mongo`
  - `docker/nestjs/compose.yaml`: `nestjs-dev`, `nestjs-prod`
  - `docker/nextjs/compose.yaml`: `nextjs-dev`, `nextjs-prod`
  - `docker/nginx/compose.yaml`: `nginx-dev`, `nginx-prod`
- Profiles control modes:
  - **development**: `nextjs-dev`, `nestjs-dev`, `nginx-dev`
  - **production**: `nextjs-prod`, `nestjs-prod`, `nginx-prod`

### Important environment variables

- Frontend (`nextjs`):
  - `BACKEND_HOST` (e.g., `http://nestjs-dev:3000` or `http://nestjs-prod:3000`)
  - `JWT_SECRET`
- Backend (`nestjs`):
  - `MYSQL_HOST`, `MYSQL_PORT`
  - `MONGO_HOST`
  - `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
  - `JWT_SECRET`
- Databases (`database` stack):
  - MySQL: `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
  - MongoDB: `MONGO_INITDB_DATABASE`

### Frontend layout (Next.js App Router) — `apps/frontend/`

- `app/` contains route groups and pages (App Router):
  - `app/page.tsx`: Landing/home
  - `app/build/`: PC build flow with `layout.tsx`, `page.tsx`, and `[product]/`
  - `app/part/`: Parts listing, creation (`new/`) and detail (`[part]/[id]/`)
  - `app/article/`: Article listing and `[id]/` detail/edit
  - `app/[topic]/[part]/`: Topic/part content with edit support
  - `app/auth/`: `login`, `refresh`
  - `app/search/`, `app/guide/`, error and not-found boundaries
- `src/`: Reusable components, features, hooks, and utils:
  - `src/components/layout/`: layout wrappers and UI headers
  - `src/components/ui/`: baseline primitives (modals, fields, grid)
  - `src/features/article/`: display, form edit editor components
  - `src/features/auth/`: auth forms
  - `src/features/build/`: builder view components, validation panel
  - `src/features/part/`: specification tables and comparison matrices
  - `src/hooks/`: common hooks like search actions
  - `src/utils/`: custom axios configurations and clients

### Backend layout (NestJS) — `apps/backend/`

- Entry: `controllers/main.ts` sets global prefix `api`, attaches `cookieParser`, listens on `PORT` (default 3000)
- Root module: `controllers/app.module.ts`
  - Modules: `ArticleModule`, `AuthModule`, `PartModule`, `BuildModule`, `UserModule`
  - Databases: `SequelizeModule` (MySQL), `MongooseModule` (MongoDB)
  - Auth: Global `AuthGuard` via `APP_GUARD`, `JwtModule` configured with `JWT_SECRET`
  - Middleware: `SessionExtractionMiddleware` for all routes
- Feature modules under `controllers/*` with entities/services/pipes/guards
- SQL models live in `models/` with `sequelize-typescript` integration (CPU, GPU, Motherboard, etc.) and options in `models/sequelize.options.ts`
- Mongo schemas used by Mongoose (e.g. for articles/content) under `controllers/article/entities/`

### Shared Library — `packages/shared/`

- Purpose: shared enums, type interfaces, compatibility rules, and data extraction helpers used across UI, backend, and crawler.
- Contents:
  - `index.ts`: main package exports.
  - `utils.ts`, `Units.ts`, `API.ts`: utility structures and endpoint parameters.
  - `article/`: article metadata types and structures.
  - `build/`: compatibility constraints (e.g. socket constraints, physical clearance constraints) and helper methods.
  - `interface/`: detailed interface spec formats (material, form factor, external ports).
  - `part/`: CPU, GPU, motherboard product mappings.
  - `retailer/`: prices and product specs from retailers.
  - `user/`: user validation properties.

### Development tips

- Compose includes allow running a full stack with profiles. Examples:
  - Development: bring up DBs, API, UI, and proxy
    - `docker compose --profile development up -d`
  - Production-like: bring up prod images
    - `docker compose --profile production up -d`
- The dev services mount the repo and use hot-reload (see `develop.watch` in `docker/*/compose.yaml`).
- API is served under `/api/*` due to `app.setGlobalPrefix("api")`.

### Key paths
- Frontend app: `apps/frontend/`
- Backend app: `apps/backend/`
- Crawler app: `apps/crawler/`
- Shared package: `packages/shared/`
- Docker stack: `docker/*` and root `compose.yaml`
