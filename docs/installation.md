# Installation

Queue Master has three deployable pieces:

| Piece | What it is | Where it runs |
|---|---|---|
| **Backend** | NestJS API, port `3001` | Server |
| **Web** | Next.js app (`/desk`, `/admin`, `/login`), port `3000` | **Same machine as the backend** |
| **Kiosk** | Electron app, runs in `kiosk` or `tv` mode | Each kiosk / TV device |

> [!IMPORTANT]
> **Backend and web must run on the same machine (same host from the browser's point of view).**
> Authentication cookies are set with `SameSite=Lax` by the backend and are read by the Next.js
> server. Splitting them across hosts breaks login. See
> [architecture — cookies](architecture.md#authentication-and-cookies).

> [!IMPORTANT]
> **PostgreSQL must be up before the backend starts.** The backend runs migrations on start
> (`prisma migrate deploy` in the Docker entrypoint) and exits if the database is unreachable.
> With Docker Compose use `depends_on` + a healthcheck; with systemd use
> `After=postgresql.service`.

---

## Option 1 — Docker (recommended)

Images are published to GHCR by the `Docker Release` workflow on every `v*.*.*` tag:

- `ghcr.io/michalramus/queue-master/backend:latest`
- `ghcr.io/michalramus/queue-master/web:latest`

`docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: queue
      POSTGRES_PASSWORD: change-me
      POSTGRES_DB: queue_master
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U queue"]
      interval: 5s
      retries: 10

  backend:
    image: ghcr.io/michalramus/queue-master/backend:latest
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3001:3001"
    volumes:
      - ./backend.config.json:/app/config.json:ro
      - ./uploads:/app/uploads

  web:
    image: ghcr.io/michalramus/queue-master/web:latest
    depends_on:
      - backend
    ports:
      - "3000:3000"
    volumes:
      - ./web.config.json:/app/apps/web/config.json:ro

volumes:
  db-data:
```

`backend.config.json`:

```json
{
    "port": 3001,
    "databaseUrl": "postgresql://queue:change-me@db:5432/queue_master",
    "jwtSecretKey": "<long random string>",
    "jwtRefreshTokenKey": "<another long random string>",
    "uploadsPath": "/app/uploads",
    "seedAdminUsername": "admin",
    "seedAdminPassword": "<your admin password>"
}
```

`web.config.json`:

```json
{
    "backendUrl": "http://backend:3001"
}
```

Then:

```bash
docker compose up -d
docker compose logs -f backend
```

The config file lives **outside** the image on purpose — upgrading is just pulling a new image.
Put it elsewhere with `-e CONFIG_PATH=/etc/queue-master.json` or `--config <path>`.
Full reference: [configuration](configuration.md).

Generate the JWT secrets with something like:

```bash
openssl rand -hex 32
```

---

## Option 2 — ZIP release

The `ZIP Release` workflow attaches prebuilt archives to each tag (backend, web, and kiosk
binaries for Linux/Windows/macOS built by `electron-builder`).

```bash
unzip backend-v1.2.3.zip -d /opt/queue-master/backend
cd /opt/queue-master/backend
cp /path/to/config.json .            # see configuration.md
npx prisma migrate deploy            # run once per upgrade
NODE_ENV=production node dist/main
```

```bash
unzip web-v1.2.3.zip -d /opt/queue-master/web
cd /opt/queue-master/web
cp /path/to/config.json apps/web/config.json
NODE_ENV=production PORT=3000 node apps/web/server.js
```

Both accept `--config <path>`, so a systemd unit can point at `/etc/queue-master/*.json`.

Example systemd unit for the backend:

```ini
[Unit]
Description=Queue Master backend
After=network.target postgresql.service
Requires=postgresql.service

[Service]
WorkingDirectory=/opt/queue-master/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/main --config /etc/queue-master/backend.json
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

## Option 3 — From source

Requirements: **Node 22.13.0** (`backend/.nvmrc`), **Yarn 4** (via Corepack), **PostgreSQL**.

```bash
corepack enable

# Backend
cd backend
yarn install
cp config.example.json config.json    # fill in databaseUrl and the JWT secrets
yarn prisma migrate dev
yarn start:dev                        # dev, with Swagger

# Web
cd ../frontend
yarn install
cp apps/web/config.example.json apps/web/config.json
yarn --cwd apps/web dev

# Kiosk
cd apps/kiosk
cp config.example.json config.json
yarn dev
```

> [!NOTE]
> The backend and the frontend are **two separate Yarn projects** (`backend/` and `frontend/`).
> `yarn install` has to be run in both.

---

## First login

On the first boot the backend seeds one **Admin** account
(`backend/src/seeding/seeding.service.ts`). It only runs when the user table is empty.

- **Username** — `seedAdminUsername` / `SEED_ADMIN_USERNAME`, default `admin`
- **Password** — `seedAdminPassword` / `SEED_ADMIN_PASSWORD`. **If it is not set, a random
  password is generated and printed to the log once:**

```
[Nest] WARN [SeedingService] ========================================================
[Nest] WARN [SeedingService] SEED_ADMIN_PASSWORD was not set. A random password has
[Nest] WARN [SeedingService] been generated for the initial admin account.
[Nest] WARN [SeedingService]   Username: admin
[Nest] WARN [SeedingService]   Password: 6f2c…
[Nest] WARN [SeedingService] Save this password now — it will NOT be shown again.
[Nest] WARN [SeedingService] ========================================================
```

Set `seedAdminPassword` in the config file before the first boot if you want to choose it
yourself (for example `admin` / `admin` on a closed test bench — never in production).

Lost it? The seeding never re‑runs once a user exists. Either delete all users from the
database and restart, or set a new password hash manually.

Then:

1. Log in at `http://<server>:3000/login`.
2. Go to **Admin → Desks** and create desks.
3. **Admin → Categories** — create the categories (letters `A`–`Z`) and assign them to desks.
4. **Admin → Users & devices** — create desk users, and register a device for each kiosk/TV.
   The device JWT is shown **once** — copy it into the kiosk's `config.json`
   ([kiosk](kiosk.md)).
5. **Admin → Settings** — colours, logos, opening hours, kiosk text, print template.

## Upgrading

1. Stop the services.
2. Replace the build artefact (new image / new ZIP). The config file is untouched — it lives
   outside the build.
3. Run migrations: Docker does it automatically in `entrypoint.sh`; for ZIP installs run
   `npx prisma migrate deploy`.
4. Start again.

> [!WARNING]
> If you changed `.env` (rather than `config.json`) for the **web** app, the Next.js build has to
> be redone — see [configuration — rebuilding after .env changes](configuration.md#next-inlines-env-vars-at-build-time).
