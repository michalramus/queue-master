# Admin panel

`http://<server>:3000/admin` — **Admin** role only. Users with the `User` role are redirected to
`/`. The sidebar is always visible; **Return to desk** goes back to `/desk`.

Everything here is stored in the database and takes effect **immediately on every connected
screen** through [SSE](realtime.md) — no restarts, no rebuilds.

---

## Dashboard (`/admin`)

Landing page: logo and the logged‑in username. Navigation only.

---

## Users & devices (`/admin/users-devices`)

Two tables on one page.

### Users

Columns: id, username, role, desk.

- **Create user** — username, password, role (`User` / `Admin`), default desk.
- **Edit and settings** — two tabs:
  - *User info* — username, role, default desk, and **Change password** (the password is set, never
    displayed).
  - *Settings* — that user's personal settings, currently **desktop notifications**. An admin can
    change them on the user's behalf.
- **Delete**.
- You cannot change your own Admin role — the UI blocks it so you cannot lock yourself out.

The **default desk** matters: the desk panel preselects it, and it is what the TV and the voice
announcement show when this user calls a client.

### Devices

A device is a kiosk or TV screen. Columns: id, status, comment.

- **Add device** — optional comment ("Entrance kiosk", "Waiting‑room TV"). The response contains
  the **device JWT**, shown once, in a copyable field.

  > [!WARNING]
  > Copy it now. It is not stored anywhere in readable form and cannot be shown again. If you lose
  > it, delete the device and register a new one.

  Paste it into `JWTToken` in that device's `config.json` — see [kiosk](kiosk.md).
- **Activate / deactivate** — a deactivated device gets `403` on every request; the screen stops
  updating. This is the kill switch for a stolen or misbehaving device.
- **Edit** — change the comment.
- **Delete** — the token stops working immediately.

Device tokens **never expire**, so deactivating or deleting is the only way to revoke access.

---

## Desks (`/admin/desks`)

A desk is a service position. Columns: number, name, assigned categories.

- **Create / edit desk** — `desk_number` (unique, shown on the TV and spoken in the announcement)
  and `desk_name` (free text, e.g. "Registration").
- **Assigned categories** — add/remove categories this desk serves. The same assignment can be
  edited from the categories screen; it is one many‑to‑many relation.

> [!WARNING]
> Deleting a desk also deletes the clients currently assigned to it.

---

## Categories (`/admin/categories`)

A category is a ticket letter. Columns: short name, name in the default language, status, desks.

- **Create / edit category**
  - **Short name** — a letter `A`–`Z`. Only free letters are offered; at most 26 categories exist.
    This is the ticket prefix (`A001`).
  - **Name per language** — a translation field for every configured language. These are the names
    clients see on the kiosk buttons.
  - **Enabled** — a disabled category disappears from the kiosk and new tickets are rejected with
    `400 Category is disabled`. Existing tickets stay in the queue and can still be served. Use this
    to close one service without deleting its history and counter.
  - **Assigned desks**.
- **Delete category**.

---

## Settings → Visual (`/admin/settings/visual`)

### Colour management

Every colour token used by web, kiosk and TV: background, primary 1–2, secondary 1–2, accent,
green/blue/red/gray/yellow 1–2, text 1–2.

- **Simple mode** — one hue slider applies to all themeable colours at once; red/green/blue
  semantic colours are protected from the hue shift.
- **Advanced mode** — per‑colour picker with hex and HSL input.
- **Live preview**, **Undo** (restore from database), **Reset one colour**, **Reset all to
  defaults**.

The values are pushed to the apps as CSS variables (`--color-primary-1`, …). Defaults live in
`backend/src/global-settings/global-settings.list.ts`.

### Logo management

Four slots, each uploaded **per language**:

| Slot | Where it appears |
|---|---|
| `logo_kiosk_main` | Large logo on the kiosk |
| `logo_kiosk_secondary` | Small logo in the kiosk corner |
| `logo_tv_main` | Large logo on the TV screen |
| `logo_tv_secondary` | Small logo on the TV screen |

Upload, preview and delete. No logo for a slot ⇒ the built‑in Queue Master header is shown instead.
Files are stored under `uploadsPath/logo/<lang>/` on the backend — back that directory up.

---

## Settings → Opening hours (`/admin/settings/opening-hours`)

### Global

- **Enable opening hours** — off ⇒ always open, the schedule is ignored.
- **Override mode** — `off` (use the schedule), **force open**, **force closed**. A quick manual
  switch for an unplanned closure or an extra open day.
- **Kiosk open offset** (0–59 min) — the kiosk starts issuing tickets this many minutes *before*
  opening time.
- **TV close offset** (0–59 min) — the TV keeps running this many minutes *after* closing time so
  the last waiting clients can still be called.

### Weekly schedule

Per weekday: closed toggle, open time, close time (`HH:mm`). **Undo** restores from the database.
Times are evaluated in the **device's local time zone**, so make sure kiosk clocks are correct.

Day names shown on the kiosk come from the multilingual `monday_label` … `sunday_label` settings.

---

## Settings → Other (`/admin/settings/other`)

### Language and localisation

- **Default locale** — the language the kiosk, TV and web use when the visitor has not chosen one.
- **TV auto switch language** — the TV follows the language the client selected when taking the
  ticket.

See [multilingual](i18n.md).

### Kiosk text (markdown)

A full markdown editor. The text is rendered on the kiosk above the category buttons.

> [!IMPORTANT]
> **Raw HTML is allowed and is NOT sanitised.** The renderer (`MarkdownToHtml`) uses
> `remark-gfm` + `rehype-raw` without a sanitizer, so any HTML you type is rendered as‑is. That is
> deliberate — it is the only way to colour or centre text — but it means this field is effectively
> code. Only admins can edit it; do not paste HTML you do not understand.

Use it for colours, centring and layout that markdown alone cannot express:

```html
<div style="text-align: center">
  <h1 style="color: #11b046">Welcome!</h1>
  <p style="font-size: 1.4rem">Please choose the service you need.</p>
</div>

<p align="center"><b style="color:#e04c34">Closed on 24 December</b></p>
```

Markdown and HTML can be mixed freely; GitHub‑flavoured markdown (tables, strikethrough, task
lists) works. The kiosk styles the result with Tailwind's typography plugin, so plain markdown
already looks reasonable.

### Printing template

The ticket template, **edited separately for each language** (the client's language decides which
one is used). HTML, with `&`‑prefixed placeholders and a live preview.
Full reference: [printing](printing.md).

---

## What is *not* in the admin panel

Per‑device behaviour — backend URL, kiosk vs TV mode, printing and audio script paths, zoom,
whether the open/close scripts run — lives in each device's `config.json`. See
[configuration](configuration.md) and [kiosk](kiosk.md).
