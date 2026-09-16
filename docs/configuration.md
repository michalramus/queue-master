# Configuration

Every app reads its configuration from a **JSON file outside the build directory**, so upgrading
means replacing the build artefact and leaving the config alone.

## Precedence (all three apps)

```
CLI argument  >  config file  >  environment variable  >  built-in default
```

This is deliberately *not* convict's native order: the file has to beat the environment, otherwise
a `DATABASE_URL` injected by Compose would silently override a mounted config file.

## Where the config file is looked up

| Priority | Backend / Web | Kiosk |
|---|---|---|
| 1 | `--config <path>` | `--config <path>` |
| 2 | `CONFIG_PATH` env var | `CONFIG_PATH` env var |
| 3 | — | last CLI argument ending in `.json` (`electron . config.json`) |
| 4 | `./config.json` (relative to the working directory) | `./config.json` |

If no file is found, the backend and web run on environment variables and defaults. The **kiosk
requires** its config file — without it the app shows an *Invalid configuration* screen.

`config.example.json` sits next to each app; `config.json` is gitignored.

---

## Backend

File: `backend/config.json` — schema in `backend/src/settings/appConfig.schema.ts`.

| Key | Env var | CLI | Default | Description |
|---|---|---|---|---|
| `configPath` | `CONFIG_PATH` | `--config` | `./config.json` | Location of this file |
| `port` | `PORT` | `--port` | `3001` | Port the API listens on |
| `logLevel` | `LOG_LEVEL` | `--log-level` | `log` | `verbose` \| `debug` \| `log` \| `warn` \| `error`. Applied only when `NODE_ENV=production` |
| `databaseUrl` | `DATABASE_URL` | — | **required** | PostgreSQL connection string used by Prisma |
| `jwtSecretKey` | `JWT_SECRET_KEY` | — | **required** | Signing key for access tokens |
| `jwtRefreshTokenKey` | `JWT_REFRESH_TOKEN_KEY` | — | **required** | Signing key for refresh tokens |
| `uploadsPath` | `UPLOADS_PATH` | — | `./uploads` | Where uploaded logos are stored |
| `seedAdminUsername` | `SEED_ADMIN_USERNAME` | — | `admin` | Username of the account created on first boot |
| `seedAdminPassword` | `SEED_ADMIN_PASSWORD` | — | *(empty)* | Password of that account. Empty ⇒ a random one is generated and logged once |

`NODE_ENV` is **environment‑only** on purpose — it gates Swagger exposure and is set by the yarn
scripts and the Dockerfile.

Example:

```json
{
    "port": 3001,
    "logLevel": "log",
    "databaseUrl": "postgresql://queue:secret@localhost:5432/queue_master",
    "jwtSecretKey": "…",
    "jwtRefreshTokenKey": "…",
    "uploadsPath": "/var/lib/queue-master/uploads",
    "seedAdminUsername": "admin",
    "seedAdminPassword": ""
}
```

A missing or invalid value is fatal: the app logs `Invalid configuration: …` and exits with code 1.
A typo'd key is also an error (`validate({ allowed: "strict" })`).

`.env` still works (`ConfigModule.forRoot()` loads it), but it sits **below** the config file.

---

## Web (Next.js)

File: `frontend/apps/web/config.json` — schema in `utils/server/appConfig.schema.ts`.
Server‑side only; nothing here reaches the browser.

| Key | Env var | CLI | Default | Description |
|---|---|---|---|---|
| `configPath` | `CONFIG_PATH` | `--config` | `./config.json` | Location of this file |
| `backendUrl` | `BACKEND_URL` | `--backend-url` | `http://localhost:3001` | Base URL of the NestJS API, **without** the `/api` prefix |

`PORT` and `HOSTNAME` stay environment‑only — Next reads them before the config loader runs
(`instrumentation.ts`).

### Changing the backend address from localhost

This is the one setting most installs need to touch. The browser never talks to the backend
directly — all client requests go to `/api/…` on the Next.js server, which proxies them to
`backendUrl`. So change it in one place:

```json
{ "backendUrl": "http://192.168.1.50:3001" }
```

or `BACKEND_URL=http://192.168.1.50:3001` in `frontend/apps/web/.env`.

Restart the Next.js server afterwards. A broken config is **not** fatal here — it is logged and the
app falls back to the default.

> [!IMPORTANT]
> Pointing `backendUrl` at a *different host than the one serving the web app* is fine — the proxy
> is server‑to‑server. What must not be split is **which host the browser talks to**: the browser
> must reach web and API through the same origin, which the `/api` proxy guarantees. See
> [architecture — cookies](architecture.md#authentication-and-cookies).

### Next inlines env vars at build time

Next.js replaces literal `process.env.SOME_VAR` reads with their values **during the build**.
That is why the code reads through `utils/getEnvVar.ts` (bracket access ⇒ runtime lookup) and
`utils/getBackendUrl.ts`.

Consequences:

- Changing **`config.json`** → restart the server. **No rebuild.**
- Changing **`.env`** → `.env` values that Next inlines are baked into the build, so
  **rebuild the frontend** (`yarn build:web`) and restart. When in doubt,
  prefer `config.json`.
- Any `NEXT_PUBLIC_*` variable is always baked in at build time — always rebuild after changing one.

---

## Kiosk (Electron)

File: `frontend/apps/kiosk/config.json` — schema in `src/electron/appConfig.ts`.
Copy `config.example.json` and fill it in.

| Key | Type | Default | Description |
|---|---|---|---|
| `JWTToken` | string | **required** | Device JWT from **Admin → Users & devices → add device**. Shown once |
| `backendUrl` | string | **required** | Base URL of the API, **without** `/api` (the app appends it) |
| `mode` | `"kiosk"` \| `"tv"` | `"kiosk"` | Which screen this device runs |
| `zoomFactor` | number > 0 | `1.0` | Window zoom, useful on odd resolutions |
| `printingScript` | string | `""` | Path to the ticket printing script. Empty ⇒ printing disabled |
| `printingDialogueShowTime` | number ≥ 0 | `1000` | How long the "printing" overlay blocks the screen, ms |
| `audioSynthesizerScript` | string | `""` | Path to the announcement script. Empty ⇒ announcements disabled |
| `openingHoursEnableBanner` | boolean | `true` | Show the "closed" banner outside opening hours |
| `openingHoursEnableScripts` | boolean | `false` | Run the open/close scripts on opening‑hours transitions |
| `openingHoursOpenScript` | string | `""` | Script run when the kiosk opens |
| `openingHoursCloseScript` | string | `""` | Script run when the kiosk closes |

Example (`config.example.json`):

```json
{
    "JWTToken": "device-jwt-goes-here",
    "backendUrl": "http://192.168.1.50:3001",
    "mode": "kiosk",
    "zoomFactor": 1.0,
    "printingScript": "/opt/queue-master/scripts/cups-printer-script.py",
    "printingDialogueShowTime": 1000,
    "audioSynthesizerScript": "",
    "openingHoursEnableBanner": true,
    "openingHoursEnableScripts": false,
    "openingHoursOpenScript": "",
    "openingHoursCloseScript": ""
}
```

A partial file is valid — every optional key has a default. An unknown key, a negative
`printingDialogueShowTime`, a `mode` other than `kiosk`/`tv`, or a missing `JWTToken` are rejected
with a readable message on the startup screen and in the console.

More: [kiosk & TV app](kiosk.md).

---

## Environment variable summary

Useful when running under Docker or systemd without a config file:

```bash
# backend
PORT=3001
LOG_LEVEL=log
DATABASE_URL=postgresql://user:pass@host:5432/queue_master
JWT_SECRET_KEY=…
JWT_REFRESH_TOKEN_KEY=…
UPLOADS_PATH=./uploads
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=…
NODE_ENV=production        # environment-only; "development" also enables Swagger
CONFIG_PATH=/etc/queue-master/backend.json

# web
BACKEND_URL=http://localhost:3001
PORT=3000                  # environment-only
HOSTNAME=0.0.0.0           # environment-only
NODE_ENV=production
CONFIG_PATH=/etc/queue-master/web.json

# kiosk
CONFIG_PATH=/etc/queue-master/kiosk.json
NODE_ENV=development       # windowed instead of fullscreen, verbose renderer logs
```

## Settings that live in the database, not in a file

Colours, logos, kiosk text, default language, opening hours, TV behaviour and the print template
are **not** in `config.json` — they are edited in the admin panel and stored in the database, so
they apply to every device at once. See [admin panel](admin-panel.md).
