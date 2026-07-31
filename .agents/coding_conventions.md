# PC-Builder Coding Conventions

This document outlines the coding standards, styling conventions, naming patterns, and architectural designs followed in the **PC-Builder** monorepo.

---

## 1. Naming & Case Conventions

### Directory & File Naming

- **NestJS Controllers & Services**: Use kebab-case for filenames.
  - E.g. [article.controller.ts](./apps/backend/src/article/article.controller.ts)
  - E.g. [article.service.ts](./apps/backend/src/article/services/article.service.ts)
- **Sequelize Models**: Use PascalCase for filenames ending with `.entity.ts`.
  - E.g. [PartInformation.entity.ts](./apps/backend/models/parts/PartInformation.entity.ts)
  - E.g. [SellerProduct.entity.ts](./apps/backend/models/sellers/SellerProduct.entity.ts)
- **Mongoose Entities**: Use PascalCase for filenames ending with `.entity.ts`.
  - E.g. [Article.entity.ts](./apps/backend/src/article/entities/Article.entity.ts)
- **React Components**: Use PascalCase for UI files.
  - E.g. [Article.tsx](./apps/frontend/src/features/article/components/Article.tsx)
- **React Hooks**: Use camelCase starting with `use`.
  - E.g. [useSearchAction.ts](./apps/frontend/src/hooks/useSearchAction.ts)

### Code Element Naming

- **TypeScript Interfaces/Types**: PascalCase.
  - E.g. `Article`, `Summary`, `Products` in [packages/shared/index.ts](./packages/shared/index.ts).
- **Functions, Methods, Variables**: camelCase.
  - E.g. `toArticleType` in [article.service.ts](./apps/backend/src/article/services/article.service.ts).
- **Enums**: PascalCase for enum name; PascalCase or UPPERCASE for members.
  - E.g. `ArticleStatus` (Draft, Published).

---

### Linting, Formatting, & Build Verification

Before completing any task, agents MUST verify code correctness by running the following commands:

- **Code Formatting**: Format all files in the workspace using Prettier:
  ```bash
  npm run format
  ```
- **Linting Checks**: Run ESLint validations:
  ```bash
  npm run lint
  ```
- **Build Verification**: Run production build checks to ensure no TypeScript compilation, Next.js, or packaging errors exist:

  ```bash
  # 1. Build the shared packages library first
  npm run build:shared

  # 2. Build the NestJS backend
  npm run build:backend

  # 3. Build the Next.js frontend
  npm run build --workspace=apps/frontend
  ```

### TypeScript Usage

- **Strict Mode**: Enforced across all packages. `"strict": true` is enabled in [tsconfig.base.json](./tsconfig.base.json) and inherited by individual apps/packages.
- **Null Safety**: Enforced using `"strictNullChecks": true`. Use explicit checks or optional chaining (`?.`) instead of non-null assertions (`!`).
- **Path Mapping / Aliasing**:
  - In Frontend: `@/*` maps to `src/*` (e.g. `@/components/*`, `@/features/*`, `@/hooks/*`), and `@/utils/*` maps to `src/utils/*` or `../../packages/shared/*` in [apps/frontend/tsconfig.json](./apps/frontend/tsconfig.json).
  - In Backend: `@/models/*` maps to `models/*` and `@/utils/*` maps to the shared packages library in [apps/backend/tsconfig.json](./apps/backend/tsconfig.json).

---

## 3. Frontend Architecture Patterns

### Feature-Based Folders

Components, types, and services that belong to a single domain are grouped inside `apps/frontend/src/features/<feature_name>/` rather than scattered globally.

- E.g. All article editing and rendering is encapsulated within [apps/frontend/src/features/article](./apps/frontend/src/features/article).

### Form Management & Validation

Forms are managed using `@tanstack/react-form` coupled with `zod` for frontend schemas validation.

- E.g. Form controls and components are defined in [Form.tsx](./apps/frontend/src/features/article/components/Form.tsx).

### API Client Conventions

- The axios client defined in [axios.ts](./apps/frontend/src/utils/axios.ts) intercepts requests to automatically attach CSRF tokens (`X-CSRF-Token`) for write requests (`POST`, `PUT`, `DELETE`, `PATCH`).
- Responses are intercepted to automatically redirect unauthenticated users (status `401`) to `/auth/login`.

---

## 4. Backend Architecture Patterns (NestJS)

### Controller-Service-Model Separation

- **Controllers**: Handle HTTP routing, method definitions, parameter extraction, and status codes.
- **Services**: Contain pure business logic and handle database interactions via Mongoose model or Sequelize models.
- **DTOs**: Zod validation schemas are shared from the `@pc-builder/shared` workspace and parsed inside NestJS pipes.

### Data Storage Conventions

- **MongoDB (Mongoose)**: Used for unstructured documents (e.g., notion-like blocks structure in Articles).
- **MySQL (Sequelize)**: Used for relational data with strict constraints (e.g., hardware components, user accounts, and builds specs).

---

## 5. Shared Code Conventions

### Single Source of Truth

The library package `packages/shared/` acts as the single source of truth for:

- Database structures and hardware interfaces.
- Rule checkers (e.g., PC builds compatibility algorithms).
- Hardware categories / Product definitions.

Any changes to APIs, hardware specifications, or builders rules must be written here first and then built using `npm run build:shared`.
