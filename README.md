## PC‑Builder

Full‑stack PC parts catalog and builder with articles/guides. This project provides a Next.js frontend and a NestJS backend with MySQL and MongoDB. Everything is dockerized and fronted by Nginx.

### Features

- Parts catalog with rich specs and filters
- PC build flow with compatibility rules and validation
- Articles/guides with editor and viewer
- Authentication with JWT (cookies/headers)

## Tech Stack

- Frontend: Next.js (App Router), React, TailwindCSS
- Backend: NestJS, TypeScript, JWT
- Databases: MySQL (Sequelize), MongoDB (Mongoose)
- Infra: Docker Compose, Nginx reverse proxy

## Architecture

- Nginx fronts all traffic
  - `/` → Next.js UI
  - `/api/**` → NestJS API (global prefix is `api`)
- Next.js connects to API using `NEXT_PUBLIC_BACKEND_HOST` (already set within Docker services)
- NestJS connects to MySQL + MongoDB via environment variables

## Prerequisites

- Docker and Docker Compose v2
- A `.env` file at the repo root (or exported env vars) with secrets

### Minimal `.env` example

```
DATABASE_NAME=PC_Builder
DATABASE_USERNAME=NestjsApp
DATABASE_PASSWORD=change_me
DATABASE_ROOT_PASSWORD=change_me_root
JWT_SECRET=change_me_jwt
```

Notes:

- You can keep `DATABASE_NAME` and `DATABASE_USERNAME` as defaults or change them.
- These variables are consumed by multiple compose files under `docker/*` and by the backend.

## Quick Start

### Development (hot reload)

Runs Next.js, NestJS, Nginx, MySQL, MongoDB in dev mode with live updates.

```bash
docker compose --profile development up -d
```

Stop the stack:

```bash
docker compose --profile development down
```

### Production-like

Builds and runs optimized images.

```bash
docker compose --profile production up -d
```

Stop the stack:

```bash
docker compose --profile production down
```

## Services and Ports

- Nginx: `http://localhost:3000`
  - Proxies `/` to Next.js, `/api` to NestJS
- Next.js:
  - Dev: mapped `4000:3000` (internal 3000). Access via Nginx at 3000
  - Prod: mapped `4000:3000` (internal 3000). Access via Nginx at 3000
- NestJS:
  - Dev: mapped `5000:3000` (internal 3000). API served under `/api`
  - Prod: mapped `5000:3000` (internal 3000). API served under `/api`
- MySQL: `3306` (client) and `33060` (X Protocol)
- MongoDB: `27017`

Useful URLs (once running):

- UI: `http://localhost:3000`
- API base: `http://localhost:3000/api`

## Environment Variables

Frontend (`nextjs`):

- `NEXT_PUBLIC_BACKEND_HOST` (preconfigured in Docker: `http://nestjs-dev:3000` or `http://nestjs-prod:3000`)
- `JWT_SECRET`

Backend (`nestjs`):

- `MYSQL_HOST`, `MYSQL_PORT`
- `MONGO_HOST`
- `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `JWT_SECRET`
- Optional: `PORT` (defaults to 3000)

Databases (`database` stack):

- MySQL: `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
- MongoDB: `MONGO_INITDB_DATABASE`

All of the above are wired for you in the compose files; you primarily need to supply the secrets in `.env`.

## Development Workflow

- Dev services mount the repo and hot‑reload:
  - Next.js and NestJS dev containers use `develop.watch` to sync code to `/usr/local/app`.
  - Changes in the repo reflect live in containers without rebuilds.
- API prefix is `api` (see `controllers/main.ts`). Call endpoints as `/api/...`.
- When adding image sources, update `next.config.js` `images.remotePatterns`.
- Tailwind configuration is under `tailwind.config.js`.

## Repository Layout

The project is structured as an **npm workspaces monorepo**:

- **[apps/](./apps)**: Contains application services.
  - **[frontend/](./apps/frontend)**: Next.js frontend application.
  - **[backend/](./apps/backend)**: NestJS backend API.
  - **[crawler/](./apps/crawler)**: Parts catalog crawler script.
- **[packages/](./packages)**: Shared library modules.
  - **[shared/](./packages/shared)**: Common schemas (Zod), rules, and interfaces.
- **[docker/](./docker)**: Service-specific Docker configurations and profiles.
- **[compose.yaml](./compose.yaml)**: Root docker-compose configuration.

For a comprehensive breakdown of files, directories, and architectural components, refer to **[.agent/project_structure.md](./.agent/project_structure.md)**.
For coding standards, syntax formatting rules, and folder structure guidelines, refer to **[.agent/coding_conventions.md](./.agent/coding_conventions.md)**.

## Common Tasks

- Bring up dev stack:
  ```bash
  docker compose --profile development up -d
  ```
- View logs for a service (example NestJS dev):
  ```bash
  docker compose logs -f nestjs-dev
  ```
- Rebuild a service after dependency changes (example Next.js):
  ```bash
  docker compose build nextjs-dev && docker compose up -d nextjs-dev
  ```

## Notes and Tips

- The API is behind Nginx; prefer `http://localhost:3000/api` in a browser/tool.
- If you want to reach the backend directly without Nginx, use `http://localhost:5000/api`.
- Ensure `.env` is present before starting the stack; compose will error if required secrets are missing.
- MySQL and MongoDB use named volumes (`Mysql`, `Mongo`) for data persistence.
