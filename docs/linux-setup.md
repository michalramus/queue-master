# Linux device setup

How to turn a small Linux box into a Queue Master kiosk or TV display: no desktop, no mouse, no
login prompt — the app starts with the machine and fills the screen.

> [!NOTE]
> This page is a **recipe, not shipped configuration**. The repository contains no OS config; adapt
> the paths and unit names to your distribution. It reflects the setup used on real deployments.

## The idea

You do not need a full desktop environment. A Wayland **kiosk compositor** runs exactly one
fullscreen application and nothing else — no panels, no window decorations, nothing a client can
click their way out of.

```
systemd user service  →  cage  →  queue-master-kiosk (Electron, fullscreen)
```

## 1. Base system

Any minimal server install (Debian/Ubuntu Server, Fedora Server, Arch) works. Install:

```bash
sudo apt install cage seatd fonts-dejavu
# printing (kiosk devices)
sudo apt install cups python3-pip
# audio (TV devices)
sudo apt install espeak alsa-utils
```

Create an unprivileged user that owns the screen:

```bash
sudo useradd -m -G video,input,audio,render kiosk
```

## 2. The compositor — `cage`

[`cage`](https://github.com/cage-kiosk/cage) is a Wayland compositor that runs a single application
fullscreen and exits when it exits. That is the whole kiosk story.

```bash
cage -- /opt/queue-master/queue-master-kiosk --config /etc/queue-master/kiosk.json
```

Useful flags: `-d` (allow VT switching while setting the device up), `-s` (allow the client to
change display settings).

Alternatives if `cage` is unavailable: `weston --shell=kiosk-shell`, or `sway` with a config that
starts the app fullscreen and disables every keybinding.

## 3. Autostart

Autologin the `kiosk` user on tty1 and start `cage` from the user session.

`/etc/systemd/system/getty@tty1.service.d/override.conf`:

```ini
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin kiosk --noclear %I $TERM
```

`/home/kiosk/.config/systemd/user/queue-master-kiosk.service`:

```ini
[Unit]
Description=Queue Master kiosk
After=graphical-session.target network-online.target

[Service]
ExecStart=/usr/bin/cage -- /opt/queue-master/queue-master-kiosk --config /etc/queue-master/kiosk.json
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

```bash
sudo loginctl enable-linger kiosk           # start the user session at boot
systemctl --user enable --now queue-master-kiosk
journalctl --user -u queue-master-kiosk -f  # this is where the app's stdout goes
```

`Restart=always` matters: a crashed kiosk comes back by itself. Everything the app prints —
including mirrored renderer console messages — ends up in `journalctl`, see
[kiosk — logs](kiosk.md#logs).

## 4. Screens and rotation

For anything beyond a single landscape monitor, use
[**kanshi**](https://sr.ht/~emersion/kanshi/) — it applies a display profile automatically based on
which outputs are connected, which is exactly what you want on a device that gets replugged or
boots with the TV still off.

`~/.config/kanshi/config`:

```
profile kiosk {
    output HDMI-A-1 enable mode 1080x1920 transform 90 position 0,0
}

profile tv {
    output HDMI-A-1 enable mode 1920x1080 position 0,0
}
```

Run `kanshi` inside the compositor session (`cage` supports launching a wrapper script that starts
`kanshi &` before the app). Portrait kiosk panels are the common case — `transform 90` or `270`.

If the UI is too small or too large for the panel, do not fight it with resolution: set
`zoomFactor` in the kiosk config ([configuration](configuration.md#kiosk-electron)).

## 5. Turning the screen off outside opening hours

Point the kiosk's opening‑hours scripts at something like:

`/opt/queue-master/screen-on.sh`

```bash
#!/bin/sh
# idempotent: make sure the output is ON, do not toggle
wlopm --on '*' 2>/dev/null || true
```

`/opt/queue-master/screen-off.sh`

```bash
#!/bin/sh
wlopm --off '*' 2>/dev/null || true
```

```json
{
    "openingHoursEnableScripts": true,
    "openingHoursOpenScript": "/opt/queue-master/screen-on.sh",
    "openingHoursCloseScript": "/opt/queue-master/screen-off.sh"
}
```

> [!WARNING]
> These scripts may run **more than once and in unexpected order** — twice in a row, or a close
> shortly after an open (startup, reconnect, an admin flipping the override). Write them to be
> **idempotent**: "ensure the screen is on", never "toggle the screen". See
> [kiosk — opening hours scripts](kiosk.md#opening-hours-scripts).

Other things worth putting in those scripts: powering the ticket printer down, muting the TV,
blanking the display with `vbetool`/`ddcutil` on non‑Wayland setups.

## 6. Hardening

- **No desktop, no terminal** — `cage` gives the client nothing to click. Keep it that way.
- Disable VT switching in production (drop `cage -d`).
- Disable SSH password login; use keys.
- Mount `/` read‑only or use an overlay if the devices live in a public space.
- Automatic updates: `unattended-upgrades` for the OS; replace the Electron binary and restart the
  unit for the app.
- The device holds a **long‑lived JWT** in `config.json`. Keep the file `0600` and owned by `kiosk`,
  and deactivate the device in the admin panel if the machine is lost.

## 7. Checklist for a new device

- [ ] Static IP or a DHCP reservation
- [ ] Correct time zone and working NTP — opening hours are evaluated **on the device**
- [ ] `/etc/queue-master/kiosk.json` with a fresh device JWT, correct `backendUrl` and `mode`
- [ ] Printer added to CUPS and test‑printed ([printing](printing.md)) — kiosks only
- [ ] Audio output verified with `aplay` ([audio](audio.md)) — TVs only
- [ ] Autologin + user service enabled, `enable-linger` set
- [ ] Reboot test: the app comes back fullscreen with no interaction
- [ ] `journalctl --user -u queue-master-kiosk` shows `Loaded configuration from …` and no 401s
