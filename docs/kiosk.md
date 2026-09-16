# Kiosk & TV app

One Electron app, two modes, selected by `mode` in the config file:

| Mode | Screen |
|---|---|
| `kiosk` | Category buttons — the client picks a service, gets a ticket, the ticket is printed |
| `tv` | The number currently being called, the desk number, recent history, voice announcement |

Both modes talk to the API with a **device JWT** and subscribe to [SSE](realtime.md).

---

## Running it

### Packaged build

`electron-builder` produces (see `.github/workflows/zip-release.yml` and `electron-builder.json`):

- Linux — `zip` and `deb`
- Windows — portable `exe` and `msi`
- macOS — `dmg`

```bash
# Linux, config next to the binary
./queue-master-kiosk

# explicit config path
./queue-master-kiosk --config /etc/queue-master/kiosk.json
CONFIG_PATH=/etc/queue-master/kiosk.json ./queue-master-kiosk
```

The historical form — a `.json` path as the **last CLI argument** — still works:
`./queue-master-kiosk kiosk-config.json`.

In production the window is **fullscreen** with the menu bar hidden. Set `NODE_ENV=development`
to get a normal 800×600 window (useful for setting a device up).

Autostart on a Linux device: [Linux device setup](linux-setup.md).

### From source

```bash
cd frontend/apps/kiosk
cp config.example.json config.json
yarn dev                 # Vite on :5123 + Electron, both with hot reload
```

Build installers:

```bash
yarn dist:linux   # or dist:win / dist:mac
```

---

## Configuration

Full table in [configuration — kiosk](configuration.md#kiosk-electron). The minimum:

```json
{
    "JWTToken": "<device token from the admin panel>",
    "backendUrl": "http://192.168.1.50:3001",
    "mode": "kiosk"
}
```

`backendUrl` is given **without** `/api` — the app appends it itself.

A typical kiosk with printing:

```json
{
    "JWTToken": "eyJhbGciOiJIUzI1NiIs…",
    "backendUrl": "http://192.168.1.50:3001",
    "mode": "kiosk",
    "zoomFactor": 1.0,
    "printingScript": "/opt/queue-master/cups-printer-script.py",
    "printingDialogueShowTime": 1500,
    "openingHoursEnableBanner": true,
    "openingHoursEnableScripts": true,
    "openingHoursOpenScript": "/opt/queue-master/screen-on.sh",
    "openingHoursCloseScript": "/opt/queue-master/screen-off.sh"
}
```

A typical TV:

```json
{
    "JWTToken": "eyJhbGciOiJIUzI1NiIs…",
    "backendUrl": "http://192.168.1.50:3001",
    "mode": "tv",
    "audioSynthesizerScript": "/opt/queue-master/audio-synthesizer-script.py"
}
```

Get the token from **Admin → Users & devices → add device**. It is displayed **once**.

---

## Startup screens

The app tells you what is wrong before it shows anything else:

| Screen | Meaning |
|---|---|
| *Starting up…* | Reading the config file |
| *Invalid configuration* | The config file is missing, malformed, or has an unknown/invalid key. Check the console for the exact message |
| *Backend URL not provided* | `backendUrl` empty |
| *Invalid mode* | `mode` is neither `kiosk` nor `tv` |
| *Connecting to the server…* | The API is unreachable. Shows the backend URL and this device's IP — handy for checking network and firewall |
| *SSE not connected* | REST works but the event stream does not |
| *Failed to load categories* | Usually a **401** — a bad, deleted or deactivated device token |

---

## What happens when a ticket is issued

1. The client picks a language (flags) and a category.
2. `POST /api/clients` returns the ticket, including its queue position.
3. The renderer fetches the print template **for the currently selected language** and calls
   `electronAPI.executePrintTicket(client, template)`.
4. The main process spawns `printingScript` with a single JSON argument. Empty `printingScript`
   ⇒ printing is skipped.
5. A blocking overlay shows the ticket number for `printingDialogueShowTime` ms, then the UI resets
   to the default language.

Details of the JSON and the template: [printing](printing.md).

## What happens when a client is called (TV)

1. `ClientInService` (or `ClientCallAgain`) arrives over SSE.
2. If **TV auto switch language** is on, the TV switches to the client's language.
3. `electronAPI.invokeAudioSynthesizer(client)` spawns `audioSynthesizerScript` with a JSON
   argument. When the process exits, the main process sends `audioSynthesizerComplete` back, so
   announcements are queued rather than overlapping.
4. Empty `audioSynthesizerScript` ⇒ the completion event fires immediately and nothing is spoken.

Details: [audio](audio.md).

## Opening hours scripts

When `openingHoursEnableScripts` is `true`, the app runs `openingHoursOpenScript` /
`openingHoursCloseScript` when the open/closed state changes. Typical use: turning the display or
the printer on and off.

> [!WARNING]
> **These scripts can be invoked more than once, and not always in the order you expect.** The open
> state is recomputed every minute and whenever settings, opening hours or the connection change, so
> a script may fire twice in a row, or a close may arrive shortly after an open (for example on
> startup, after a reconnect, or when an admin flips the override switch).
>
> **Write the scripts to be idempotent**: "make sure the screen is on" rather than "toggle the
> screen". Guard with a state file if the action is expensive, and never assume a strict
> open → close → open sequence.

The banner (`openingHoursEnableBanner`) is independent of the scripts — you can show the closed
screen without running anything.

---

## Logs

The kiosk has **two** log surfaces, and you usually need both:

1. **The main process** — everything printed by `main.ts`: which config file was loaded, script
   invocations and their exit codes, script stdout/stderr. This goes to the **stdout of the binary**.
   Run it from a terminal, or capture it:

   ```bash
   ./queue-master-kiosk 2>&1 | tee /var/log/queue-master-kiosk.log
   # under systemd:
   journalctl -u queue-master-kiosk -f
   ```

2. **The renderer (DevTools console)** — React errors, failed HTTP requests, SSE state. Open with
   **Ctrl+Shift+I** (Cmd+Opt+I on macOS).

   Renderer messages are **also mirrored into the main process output** with a `[renderer]` prefix
   (errors, warnings and info always; debug only when `NODE_ENV=development`), so a headless device
   still records them.

> [!TIP]
> On a device with no keyboard, start the binary from an SSH session and read stdout — you get the
> renderer messages without opening DevTools.

## Troubleshooting

**Screen stuck on "Failed to load categories" / 401 in the console**
The device token is wrong. Check, in order:

- `JWTToken` in `config.json` is the full token, no whitespace, no truncation;
- the device still exists in **Admin → Users & devices**;
- it is **active** — a deactivated device gets `403 Device is not accepted`;
- the backend's `jwtSecretKey` has not been changed since the token was issued (changing it
  invalidates every device token — reissue them).

Fix by registering a new device and pasting the new token.

**"Connecting to the server…" forever**
Wrong `backendUrl`, the backend is down, or a firewall. The screen shows the URL it is trying and
the device's own IP. Verify from the device:
`curl http://<backendUrl>/api/settings/global`.

**Everything loads but nothing ever updates**
SSE is blocked. Check the console for repeated reconnects, and any proxy between device and server
for response buffering.

**Nothing prints**
`printingScript` is empty, the path is wrong, or the file is not executable. The main process logs
`No printing script configured` or `Script printingScript ended with <code>`. See
[printing](printing.md).

**Config changes have no effect**
The kiosk reads the file **once at startup**. Restart the app. Also confirm which file it loaded —
the first line of the log says `Loaded configuration from <path>`.

More: [troubleshooting](troubleshooting.md).
