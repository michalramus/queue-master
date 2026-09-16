# API

NestJS REST API. Every route is under the global prefix **`/api`** — e.g. `POST /api/auth/login`.
From the browser the same routes are reachable through the Next.js proxy on port 3000
(`/api/...` → `http://<backendUrl>/api/...`).

## Swagger

Interactive documentation is generated from the code and served **only when
`NODE_ENV=development`**:

- `http://localhost:3001/api/swagger`
- `http://localhost:3001/api` (same document)

`yarn start:dev` and `yarn start` set `NODE_ENV=development`; production builds
(`yarn start:prod`, the Docker image) do not expose Swagger. To inspect the API on a production
box, run the backend once with `NODE_ENV=development`.

The Swagger UI is configured with alphabetical sorting, collapsed operations and a filter box.
To authenticate, just call `POST /auth/login` from the UI — the cookies are set automatically and
every later call from the same browser is authenticated.

## Authentication

| Client | Mechanism |
|---|---|
| Browser (desk/admin) | `POST /api/auth/login` sets HttpOnly cookies `jwt` (1 d) and `jwt_refresh` (90 d), plus two non‑HttpOnly expiry hints |
| Kiosk / TV | `Authorization: Bearer <device JWT>` — obtained from **Admin → Users & devices**, never expires |

Roles are `Device`, `User`, `Admin`. Details, cookie flags and refresh behaviour:
[architecture — authentication](architecture.md#authentication-and-cookies).

```bash
# login and keep the cookies
curl -c jar.txt -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"…"}'

curl -b jar.txt http://localhost:3001/api/auth/get-info

# device
curl -H "Authorization: Bearer $DEVICE_JWT" http://localhost:3001/api/categories
```

Errors: `401` — not authenticated / token expired / user or device deleted.
`403` — authenticated but the role is too low, or the device is not accepted.

---

## Endpoints

Roles column = who may call it. "—" means no guard (public).

### `auth`

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Log in, sets the cookies |
| POST | `/api/auth/refresh` | User, Admin | Issue a new access token from the refresh cookie |
| POST | `/api/auth/logout` | — | Clear the cookies |
| GET | `/api/auth/get-info` | Device, User, Admin | Who am I — id, username, role, default desk |

### `clients` — the queue

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/api/clients` | Device, User, Admin | Issue a ticket (`categoryId`, `language`). Rejects disabled categories |
| GET | `/api/clients` | Device, User, Admin | All clients in the queue, oldest first |
| PATCH | `/api/clients/:id` | User, Admin | Change status / desk — this is "call the client" |
| POST | `/api/clients/:id/call-again` | User, Admin | Re‑announce without changing state |
| DELETE | `/api/clients/:id` | User, Admin | Remove from the queue (service finished) |

Calling a client to a desk automatically removes whatever that desk was serving before.

### `categories`

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/api/categories` | Admin | Create a category (letter + translations) |
| GET | `/api/categories` | Device, User, Admin | All categories |
| GET | `/api/categories/:id` | Device, User, Admin | One category |
| PATCH | `/api/categories/:id` | Admin | Rename / change letter / enable / disable |
| DELETE | `/api/categories/:id` | Admin | Delete a category |
| GET | `/api/categories/:id/desks` | Device, User, Admin | Desks assigned to it |
| POST | `/api/categories/:id/desks` | Admin | Assign a desk |
| DELETE | `/api/categories/:id/desks/:deskId` | Admin | Unassign a desk |

### `desks`

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/api/desks` | Admin | Create a desk |
| GET | `/api/desks` | Device, User, Admin | All desks |
| GET | `/api/desks/:id` | Device, User, Admin | One desk |
| PATCH | `/api/desks/:id` | Admin | Update number / name |
| DELETE | `/api/desks/:id` | Admin | Delete the desk **and its clients** |
| POST | `/api/desks/:id/categories` | Admin | Assign a category |
| DELETE | `/api/desks/:id/categories/:categoryId` | Admin | Unassign a category |

### `users`

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/api/users` | Admin | Create a user |
| GET | `/api/users` | Admin | List users |
| GET | `/api/users/:id` | Admin | One user |
| PATCH | `/api/users/:id` | Admin | Change username / role / default desk |
| PATCH | `/api/users/:id/password` | Admin | Set a new password |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### `devices`

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/api/devices` | User, Admin | Register a device — **returns the JWT, shown once** |
| GET | `/api/devices` | Admin | List devices |
| PATCH | `/api/devices/:id` | Admin | Accept / block, edit the comment |
| DELETE | `/api/devices/:id` | Admin | Delete a device (its token stops working) |

### `settings`

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/settings/global` | — | All global settings, defaults filled in |
| PATCH | `/api/settings/global` | Admin | Update global settings |
| DELETE | `/api/settings/global` | Admin | Reset given keys (or all) to defaults |
| GET | `/api/settings/multilingual` | — | Multilingual settings (print template, day labels) |
| PATCH | `/api/settings/multilingual` | Admin | Update them; an empty value deletes that translation |
| GET | `/api/settings/user` | User, Admin | Settings of the logged‑in user |
| PATCH | `/api/settings/user` | User, Admin | Update them |
| DELETE | `/api/settings/user` | User, Admin | Reset them |
| GET | `/api/settings/user/all` | Admin | Settings of all users |
| GET | `/api/settings/user/:id` | Admin | Settings of one user |
| PATCH | `/api/settings/user/:id` | Admin | Update them |
| DELETE | `/api/settings/user/:id` | Admin | Reset them |

### `opening-hours`

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/opening-hours` | Device, User, Admin | All weekdays |
| POST | `/api/opening-hours` | Admin | Create or overwrite several days at once |

### `file` — logos

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/file/logo` | — | Which logos exist, per language |
| GET | `/api/file/logo/:lang/:id` | — | Download a logo |
| POST | `/api/file/logo/:lang/:id` | Admin | Upload a logo (multipart) |
| DELETE | `/api/file/logo/:lang/:id` | Admin | Delete a logo |

`:id` is one of `logo_kiosk_main`, `logo_kiosk_secondary`, `logo_tv_main`, `logo_tv_secondary`.
Files are stored under `uploadsPath/logo/<lang>/`.

### `sse`

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/api/sse/events` | — | Server‑Sent Events stream — see [realtime.md](realtime.md) |

---

## Conventions

- Request and response shapes are DTOs with `class-validator` decorators; a global
  `ValidationPipe` strips unknown properties (`whitelist: true`) and coerces types.
- Controllers only route; all database access lives in services.
- Every endpoint carries Swagger decorators (`@ApiOperation`, `@ApiResponse`, …).
- Mutating endpoints emit an SSE event so every connected screen updates itself.
- Frontend calls are not written ad hoc: API functions live in
  `frontend/packages/shared-utils/src/api/`, wrapped in React Query hooks in `…/hooks/`.
