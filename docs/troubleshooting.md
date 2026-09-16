# Troubleshooting

## Where the logs are

| Component | Where |
|---|---|
| **Backend** | stdout of the process. Docker: `docker compose logs -f backend`. systemd: `journalctl -u queue-master-backend -f`. Level controlled by `logLevel` (production) — `NODE_ENV=development` logs everything |
| **Web (Next.js)** | stdout of the Node process. Proxy failures are written to stderr (`Error while connecting to backend: …`) |
| **Web (browser)** | DevTools console — SSE state, failed requests, React errors |
| **Kiosk — main process** | **stdout of the binary**: config file path, script invocations and exit codes, script stderr. Run from a terminal or read `journalctl --user -u queue-master-kiosk` |
| **Kiosk — renderer** | DevTools (**Ctrl+Shift+I**). Also **mirrored into the main process output** with a `[renderer]` prefix |

> [!TIP]
> When a device misbehaves, check **both** kiosk surfaces. A 401 shows up in the renderer console;
> a failing print script shows up only in the main process output.

The backend logs every authentication failure, permission denial and state change with the acting
entity in brackets — `[admin] Client created with number A012 and status 'Waiting'`. Grepping that
log usually answers "who did this".

---

## Backend will not start

| Message | Fix |
|---|---|
| `Invalid configuration: …` then exit 1 | A required value (`databaseUrl`, `jwtSecretKey`, `jwtRefreshTokenKey`) is missing, or a key is misspelled — the loader is strict. Check which file was loaded: the log says `Loaded configuration from <path>` or `No configuration file at <path>` |
| `Can't reach database server` | **PostgreSQL must be running before the backend.** Add `depends_on` + healthcheck (Compose) or `After=postgresql.service` (systemd) |
| Port already in use | Another instance, or `port` clashing with something else |
| Prisma "migration failed" | Run `npx prisma migrate deploy` manually and read the error; never edit applied migrations |

Lost the admin password? The seeder only runs when the user table is **empty**; it will not
re‑create the account. Either clear the users table and restart, or write a bcrypt hash directly.
See [installation — first login](installation.md#first-login).

---

## Cannot log in / logged out immediately

- **Backend and web must be on the same machine**, i.e. the browser must reach both through the
  same origin (the `/api` proxy). Cookies are `SameSite=Lax`; splitting hosts breaks the session.
  See [architecture](architecture.md#authentication-and-cookies).
- Check that `backendUrl` in the web config points at a reachable API: the login request returns
  502 `Error while connecting to backend` if not.
- Changing `jwtSecretKey` invalidates every existing session **and every device token**.
- Clock skew between server and client can expire tokens early — check NTP.

> [!NOTE]
> A JWT cookie is only really refreshed in the browser when the request happens **client‑side**.
> If a page is rendered on the server after a long idle, the new cookie reaches the browser on the
> first client‑side call. Reloading once resolves what looks like a "stale token" state.

---

## Kiosk / TV problems

| Symptom | Cause and fix |
|---|---|
| *Invalid configuration* screen | Missing/malformed `config.json`, unknown key, bad value. The console prints the exact reason |
| *Connecting to the server…* forever | Wrong `backendUrl`, backend down, or firewall. The screen shows the URL and the device IP. Test with `curl http://<backendUrl>/api/settings/global` |
| *Failed to load categories* | Almost always **401** — check the console. Bad, deleted or deactivated device token; or `jwtSecretKey` changed on the server. Register a new device and update `JWTToken` |
| *SSE not connected* | REST works, the event stream does not. Check the browser/renderer console for reconnect loops and any proxy buffering responses |
| Screen never updates | Same as above — SSE is the only update channel |
| Nothing prints | See [printing — troubleshooting](printing.md#troubleshooting) |
| Silent announcements | See [audio — testing](audio.md#testing) |
| Config edits ignored | The config is read **once at startup**. Restart, and check which file was loaded |
| Open/close scripts run twice | Expected — make them idempotent. See [kiosk](kiosk.md#opening-hours-scripts) |
| Kiosk shows closed at the wrong time | Opening hours are evaluated **on the device** — check its time zone and NTP |

**401 checklist for a device**

1. Is `JWTToken` complete and untruncated in `config.json`?
2. Does the device still exist in **Admin → Users & devices**?
3. Is it **active**? A deactivated device gets `403 Device is not accepted`.
4. Has `jwtSecretKey` changed on the backend since the token was issued?

---

## Web app problems

| Symptom | Cause |
|---|---|
| Config change has no effect | `config.json` needs a **server restart**; `.env` values may be **baked into the build** — rebuild. See [configuration](configuration.md#next-inlines-env-vars-at-build-time) |
| `502 Error while connecting to backend` | `backendUrl` wrong or backend down |
| `499 Client disconnected` in the log | Normal — the browser closed an in‑flight request (common with SSE) |
| Admin panel redirects to `/` | You are logged in as `User`, not `Admin` |
| Raw translation keys on screen | A key is missing from `frontend/i18n/<lang>.json` |

---

## Queue behaves unexpectedly

| Symptom | Explanation |
|---|---|
| Numbers did not reset overnight | The reset needs **10 h since the last reset** *and* no waiting client with number ≤ 30, and only runs when a ticket is issued. See [architecture](architecture.md#automatic-ticket-number-reset) |
| Numbers jumped back to 1 mid‑day | The counter wrapped at 999 |
| `400 Category is disabled` at the kiosk | The category is disabled in the admin panel |
| Calling a client dropped the previous one | By design: a desk serves one client at a time; calling a new one removes the previous |
| Clients disappeared | The reset deletes clients older than 10 hours, and deleting a desk deletes its clients |

---

## Still stuck

Collect, in this order: backend log around the failure, the web server log, the device's main
process output, and the renderer console. Then open an issue at
[github.com/michalramus/queue-master/issues](https://github.com/michalramus/queue-master/issues)
or write to <ramus.michal21@gmail.com>.
