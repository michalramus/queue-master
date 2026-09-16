# Development

## Prerequisites

- **Node 22.13.0** (`backend/.nvmrc`)
- **Yarn 4** — `corepack enable`
- **PostgreSQL**

`backend/` and `frontend/` are **two independent projects**; `frontend/` is a Yarn workspace
containing `apps/web`, `apps/kiosk`, `packages/shared-utils`, `packages/shared-components`.

## Commands

### Backend (`backend/`)

```bash
yarn start:dev                       # hot reload, NODE_ENV=development, Swagger on
yarn start:prod                      # from dist/
yarn build
yarn test                            # unit tests
yarn test -- path/to/file.spec.ts    # one file
yarn test:e2e
yarn test:cov
yarn lint                            # ESLint with --fix
yarn prisma migrate dev              # create + apply a migration
yarn prisma studio                   # database GUI
yarn prisma generate
```

### Web (`frontend/`)

```bash
yarn --cwd apps/web dev     # dev server on :3000
yarn build:web              # production build (standalone output)
yarn --cwd apps/web lint
```

### Kiosk (`frontend/apps/kiosk/`)

```bash
yarn dev            # Vite (:5123) + Electron, both hot-reloading
yarn build
yarn dist:linux     # dist:win / dist:mac — electron-builder
```

`pre-push` hooks run `tsc --noEmit` in every workspace; `lint-staged` runs ESLint and Prettier on
commit.

## Project layout

```
backend/
  prisma/            schema.prisma + migrations
  src/
    <module>/        controller, service, dto/, *.spec.ts
    settings/        convict schema + loader, setting value types
    sse/             SSE service, controller, event enum
    seeding/         first-boot admin account
frontend/
  i18n/              en.json, pl.json — shared by web and kiosk
  apps/web/          Next.js App Router app
    app/             routes: /login /desk /admin /api/[...path]
    proxy.ts         role-based route protection
    utils/server/    config loader (runs from instrumentation.ts)
  apps/kiosk/        Electron app
    src/electron/    main process, preload, config schema
    src/ui/          React renderer: pages/kiosk, pages/tv
  packages/shared-utils/        API functions, React Query hooks, axios instances, types
  packages/shared-components/   shared UI + shared-components-config.css
scripts/             example printing / audio / sample-generation scripts
specs/               design notes per feature
```

## Conventions

These are enforced in review; the full list is in `CLAUDE.md`.

**Backend**

- DTOs for every request/response; `class-validator` decorators; no business logic in controllers.
- Services own all Prisma access.
- Swagger decorators on every endpoint.
- Unit tests (`*.spec.ts`) next to the source. No mocking Prisma — use a real database in e2e tests
  (`*.e2e-spec.ts`).

**TypeScript**

- No `any` — use `unknown` when the type is genuinely unknown.
- Explicit return types on public methods; explicit types for variables, parameters and state.
- Avoid `as`; prefer type guards.
- Always pass generics to `useQuery`, `axios`, etc.
- Reuse existing types (`default_desk?: Desk | null`, never an inline shape).

**Frontend**

- React Query is mandatory for server state — never `useState + useEffect` to fetch.
- API functions go in `shared-utils/src/api/`, hooks in `shared-utils/src/hooks/`.
- Server components by default; `"use client"` only where state or hooks require it.
- No cross‑module imports; no barrel `index.ts` re‑exports; `@` alias maps to `src/`.
- Ternaries for conditional rendering, not `&&`; no nested ternaries.
- No business logic in UI components.
- Nothing language‑specific in component logic — iterate over `LangCode` ([i18n](i18n.md)).

**Styling**

- Tailwind classes only, no inline styles; custom CSS only in `shared-components-config.css`.
- Use the project's colour tokens (`bg-primary-1`, `text-text-2`, …). A new colour must be added to
  `shared-components-config.css`, the backend settings list and the layouts — do not reach for stock
  Tailwind colours.

**Other**

- `dangerouslySetInnerHTML` only through `SanitizedHtml` (DOMPurify). The one deliberate exception
  is the kiosk markdown field, which renders raw HTML by design
  ([admin panel](admin-panel.md#kiosk-text-markdown)).
- Comment any regex with an example of what it matches.

## Adding things

| Task | Steps |
|---|---|
| **A global setting** | Add it to `backend/src/global-settings/global-settings.list.ts` with a type and default (key must equal the property name) → extend `GlobalSettingsInterface` in `shared-utils/src/api/globalSettings.ts` → add a control in the admin panel |
| **A multilingual setting** | Add an entry with a unique number to `multilingual-settings.list.ts`. Service and controller handle it automatically |
| **An SSE event** | See [realtime — adding an event](realtime.md#adding-an-event) |
| **An API endpoint** | Controller + service + DTOs + Swagger decorators + spec → API function in `shared-utils/src/api/` → hook in `shared-utils/src/hooks/` |
| **A language** | See [i18n — adding a new language](i18n.md#adding-a-new-language) |
| **A config option** | Add it to the app's convict schema with an `env` name — the loader derives the environment layer and the `process.env` mirroring from the schema, so that is the only edit. Update `config.example.json` and [configuration](configuration.md) |

## Testing

```bash
cd backend
yarn test
yarn test:e2e
```

Unit tests are required for services. E2E tests run against a real database — point
`DATABASE_URL` at a scratch database, not your development one.

## CI/CD

| Workflow | Trigger | Does |
|---|---|---|
| `codeql.yml` | push/PR to `main`, weekly | CodeQL security analysis (TS + Python) |
| `dependency-review.yml` | PR to `main` | Flags vulnerable dependencies |
| `docker-release.yml` | tag `v*.*.*`, manual | Builds and pushes backend + web images to `ghcr.io`, `linux/amd64` and `linux/arm64` |
| `zip-release.yml` | tag `v*.*.*`, manual | Builds backend/web archives and kiosk binaries |

Releasing: tag `vX.Y.Z` and push. Both workflows set the package version from the tag.

## Contributing

- Conventional commit prefixes (`feat`, `fix`, `chore`, `refactor`, `docs`), short messages, small
  commits.
- Branch off `dev`; PRs target `main`.
- Discuss the technical approach before implementing, and work in small increments.
- Run the tests before pushing.
