# Real‑time updates (SSE)

Queue Master does **not** use WebSockets. Updates are pushed one‑way, server → client, over
**Server‑Sent Events** (`GET /api/sse/events`, `text/event-stream`). That is enough: clients never
push through this channel, they use ordinary REST calls, and SSE survives plain HTTP proxies far
more easily than a WebSocket upgrade.

## Backend side

- `SseService` wraps an RxJS `Subject`. Any service can call
  `sseService.emit(sseEvents.X, payload)` after a mutation.
- `SseController` merges that stream with a **heartbeat every 15 s** (`type: "heartbeat"`), so the
  connection is never idle long enough for undici or a reverse proxy to consider it dead.
- The payload is `JSON.stringify`'d into the SSE `data:` field; the event name goes into `event:`.

## Frontend side

- `SseProvider` (web: `utils/providers/SseProvider.tsx`, kiosk: `src/ui/utils/providers/`) opens one
  `EventSource` per app and hands out `addEventListener` / `removeEventListener` through context.
- Reconnect uses exponential backoff: 1 s, 2 s, 4 s, 8 s, 16 s, capped at 30 s. `isConnected` and
  `backoffMs` are exposed — the kiosk shows a "connecting" splash when the stream is down for more
  than 2 s.
- `RefreshOnSseEvents` maps events to **React Query cache invalidations**, and `router.refresh()`
  where server components are involved. There is no full page reload.
- In the browser the stream goes through the Next.js `/api` proxy, which is specially configured
  for it (`bodyTimeout: 0`, `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`,
  `maxDuration = 300`).

## Event list

Defined in `backend/src/sse/sseEvents.enum.ts` and mirrored in
`frontend/packages/shared-utils/src/sseEvents.ts` — **the two must stay in sync**.

| Event | Emitted when | Payload | Typical reaction |
|---|---|---|---|
| `ClientWaiting` | A ticket is issued | The client (with category, queue length) | Kiosk prints, desk queue refreshes |
| `ClientInService` | A client is called to a desk | The client (with desk) | TV shows the number, audio announcement |
| `ClientRemoved` | Service finished / client removed | The client | Lists refresh |
| `ClientCallAgain` | Staff press "call again" | The client | TV re‑highlights, audio repeats |
| `ClientsFlushed` | All clients of a category are deleted | `null` | Queue lists invalidated |
| `GlobalSettingsChanged` | Global settings updated or reset | New settings | Colours, locale, kiosk text reload |
| `MultilingualSettingsChanged` | Print template / day labels updated | New settings | Template reload |
| `CategoriesChanged` | Category created/updated/deleted | — | Category list invalidated |
| `CategoriesDesksChanged` | Category↔desk assignment changed | — | Assignment views invalidated |
| `DesksChanged` | Desk created/updated/deleted | — | Desk list invalidated |
| `OpeningHoursChanged` | Opening hours saved | — | Hours reload, `router.refresh()` |
| `LogoAvailabilityChanged` | Logo uploaded or deleted | — | Logos reload |
| `UserSettingsChanged` | A user's settings changed | — | Settings reload, `router.refresh()` |
| `UserChanged` | A user was modified | — | User list invalidated |
| `ReloadFrontend` | Manual trigger (`sseService.reloadFrontend()`) | `null` | `router.refresh()` |
| `heartbeat` | Every 15 s | empty | Keeps the connection alive; ignored |

> [!NOTE]
> Not every event has a listener wired up in every app — `DesksChanged` and
> `CategoriesDesksChanged` in particular are emitted but only partially consumed. Emitting an event
> nothing listens to is harmless.

## Adding an event

1. Add the member to `backend/src/sse/sseEvents.enum.ts`. Keep `Name = "Name"` — key and value
   must be identical.
2. Mirror it in `frontend/packages/shared-utils/src/sseEvents.ts`.
3. Emit it from the service that performs the mutation, right after the write.
4. Add a listener in `RefreshOnSseEvents` (web and/or kiosk) that invalidates the right query key.

## Debugging

```bash
curl -N -b jar.txt http://localhost:3001/api/sse/events
```

You should see a `heartbeat` every 15 seconds and events appear as you use the app. In the browser,
DevTools → Network → the `events` request → **EventStream** tab lists everything received.
If the stream keeps reconnecting, check [troubleshooting](troubleshooting.md).
