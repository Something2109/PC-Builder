## Backend Guideline: PC Part Handling (NestJS)

### Scope

- Covers how to expose and implement PC parts listing, filtering, detail, create/update/delete in the NestJS backend.
- Applies to routes under `api/part` with global prefix set in [apps/backend/controllers/main.ts](./apps/backend/controllers/main.ts).

### Routing & Endpoints (in [apps/backend/controllers/part/part.controller.ts](./apps/backend/controllers/part/part.controller.ts))

- `GET /part` — list all parts (paginated, query-filtered)
- `GET /part/:part` — list by product type `:part` (paginated, query-filtered)
- `GET /part/filter` — compute filter options across all parts
- `GET /part/filter/:part` — compute filter options for product `:part`
- `GET /part/filter/:part/:attribute` — compute filter options for a single attribute
- `GET /part/:part/:id` — get detailed part by UUID `:id` constrained to product `:part`
- `POST /part/:part` — create part (ADMIN)
- `POST /part/:part/:id` — update part (ADMIN)
- `DELETE /part/:part/:id` — delete part (ADMIN)

### Validation & Security

- Product param: `ParseEnumPipe(Products)` with NotFound on invalid product.
- Body validation: `ZodValidationPipe` using `Part.Detail` schema
  - Create: `Part.Detail.omit({ id: true, part: true })`
  - Update: `Part.Detail.partial()`
- Role guard: `@Role(Roles.ADMIN)` for create/update/delete.
- ID validation: `ParseUUIDPipe` for `:id`.

### Service Responsibilities (in [apps/backend/controllers/part/part.service.ts](./apps/backend/controllers/part/part.service.ts))

- `list(params, product?)`:
  - Parse query via `ParseService.options(params, product)`.
  - Map summary attribute scopes with `Mapping.SummaryAttributeMapping[product]` when product provided.
  - Delegate to `ListService.list(options, infoMapping)` (Sequelize).
  - Transform results via `ParseService.summary(part, product)`.
- `filter(params, product?, ...attributes)`:
  - Parse options; compute attribute list via `ParseService.attributes`.
  - If `product` provided, enforce `options.part.part = [product]`.
  - Delegate to `ListService.filter(options, infoMapping)`, then normalize via `ParseService.filter`.
- `create(product, data)`:
  - Delegate to `CRUDService.create({ ...data, part: product }, Mapping.Info[product])`.
  - Bad input → `BadRequestException`.
- `get(id, product?)`:
  - Delegate to `CRUDService.get(id, Mapping.Info[product])`.
  - If found but mismatched product → `null`.
- `set(id, product, data)`:
  - Check existence and product match via `CRUDService.get(id)`.
  - Delegate to `CRUDService.set(id, data, Mapping.Info[product])`.
  - Bad input → `BadRequestException`.
- `delete(id, product)`:
  - Check product match then `CRUDService.delete(id)`.

### Data Access Layer

- List: [apps/backend/controllers/part/service/SequelizeList.service.ts](./apps/backend/controllers/part/service/SequelizeList.service.ts)
  - Builds dynamic Sequelize context from `Part.Filter & API.PageOptions & API.SearchOptions`.
  - Supports: pagination, text search (`q`), per-attribute filtering (joins via `Infos` → include trees), and aggregation for filter values.
- CRUD: [apps/backend/controllers/part/service/SequelizeCRUD.service.ts](./apps/backend/controllers/part/service/SequelizeCRUD.service.ts)
  - `get(id, infos?)` with scoped includes per `infos`.
  - `create(data, infos?)` with optional info upserts post-save.
  - `set(id, data, infos?)` partial update across part and info tables.
  - `delete(id)` hard delete (then return deleted or null if not found).

### Types & Mappings

- Enums: [packages/shared/index.ts](./packages/shared/index.ts) (exports `Products`, `Infos`).
- Zod models/types: [packages/shared/part/](./packages/shared/part/) (defines `Part.Detail`, `Part.BasicInfo`, labels, and schemas).
- Mapping tables: `Mapping.Info[product]` lists per-product info groups; `Mapping.SummaryAttributeMapping[product]` defines attributes to include in list summaries.

### Query Contract (incoming)

- Pagination: `page`, `size` (or use `env.PageSize` default).
- Search: `q` for free-text name search.
- Product-scoped filters: namespaced by `Infos` segments; multiple values allowed (repeat query params).
  - Example: `/part/CPU?CPU_SPEC.socket=LGA1700&CPU_MEMORY.type=DDR5`.

### Response Shapes (high-level)

- `GET /part[/:part]` → `{ total: number; list: Part.Summary[] }`
- `GET /part/:part/:id` → `Part.Detail`
- Filter endpoints → `{ [segment]: { [attribute]: string[] | number[] } }` narrowed to requested scope.

### Error Semantics

- 404 on unknown product or missing id.
- 400 with message on invalid body or business rule violation (create/update).
- 500 only on unexpected failures (create fallback in controller).

### Implementation Checklist

- Add new product:
  - Extend `Products` and `Infos` enums in shared package.
  - Add models under [apps/backend/models/parts/info/](./apps/backend/models/parts/info/) and associations in `PartInformation`.
  - Update `Mapping.Info` and `Mapping.SummaryAttributeMapping`.
  - Ensure `ParseService.attributes` and `summary` cover new attributes.
  - Add frontend filters/inputs (see frontend guideline).

### Testing Tips

- Verify list pagination math matches `PageSize`.
- Ensure `filter(:attribute)` is consistent with `filter()` for same options.
- Cross-check create→get→set→delete lifecycle with product guard logic.
