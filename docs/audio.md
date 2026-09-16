# Audio announcements

When a client is called to a desk, the TV device can announce it out loud
("A twelve, desk three"). Like printing, this is done by an **external script**, so you can use any
synthesizer or pre‑recorded samples.

Only the device running in `tv` mode announces — the kiosk stays silent.

## The call contract

The Electron main process spawns `audioSynthesizerScript` with **one JSON argument**:

```bash
audio-synthesizer-script.py '{"categoryShortName":"A","number":12,"desk":3,"language":"pl"}'
```

| Field | Type | Meaning |
|---|---|---|
| `categoryShortName` | string | Ticket letter |
| `number` | number | Ticket number |
| `desk` | number \| `""` | Desk number the client is called to |
| `language` | `"en"` \| `"pl"` | The language the client chose at the kiosk |

**Announcements are queued, not overlapped.** The app waits for the process to exit before starting
the next one — when the script ends, the main process emits `audioSynthesizerComplete` and the next
queued client is announced. So: *do not return before the sound has finished playing*, or
announcements will trample each other.

An empty `audioSynthesizerScript` disables announcements (the completion event fires immediately).

## Option 1 — a speech synthesizer

`scripts/audio-synthesizer/audio-synthesizer-script.py` uses **espeak**:

```bash
sudo apt install espeak
cp scripts/audio-synthesizer/audio-synthesizer-script.py /opt/queue-master/
chmod +x /opt/queue-master/audio-synthesizer-script.py
```

```json
{ "audioSynthesizerScript": "/opt/queue-master/audio-synthesizer-script.py" }
```

The example builds `"A12, Desk 3"` and pipes it to `espeak`. It is intentionally minimal — extend it
to use `language` for a localised phrase and voice:

```python
if inputs["language"] == "pl":
    text, voice = f"Numer {categoryShortName} {number}, stanowisko {desk}", "pl"
else:
    text, voice = f"Number {categoryShortName} {number}, desk {desk}", "en"
subprocess.run(["espeak", "-v", voice, text])
```

Alternatives that drop straight in: `spd-say`, `pico2wave`, `festival`, `say` (macOS), or any cloud
TTS CLI. Whatever you use, make it **block until playback ends**.

## Option 2 — pre‑generated samples

Synthesized speech on a cheap mini PC can be slow and rough. Pre‑rendering every possible
announcement once and just playing WAV files is faster and sounds better.

`scripts/samples-generator/` generates them with
[Balcon](https://www.cross-plus-a.com/pl/bconsole.htm) using the built‑in Microsoft Windows voices
(so run it on Windows; a GUI version, [Balabolka](https://www.cross-plus-a.com/pl/balabolka.htm),
also exists).

```powershell
# put samples-generator.py and balcon.exe in the same directory
python samples-generator.py
```

Configure at the top of the script:

| Setting | Meaning |
|---|---|
| `path` | Output directory (`samples`) |
| `desk_word` | The word before the desk number ("desk", "stanowisko") |
| `voice` | Voice name — list them with `balcon.exe -l` |

It produces, in `samples/`:

- `A1.wav` … `Z999.wav` — every ticket number (26 × 999 files — it takes a while)
- `DESK1.wav` … `DESK99.wav` — the desk phrases

Then write a script that plays the right files in sequence, e.g.:

```python
#!/usr/bin/python3
import json, subprocess, sys, os

SAMPLES = "/opt/queue-master/samples"
i = json.loads(sys.argv[1])
files = [f"{i['categoryShortName']}{i['number']}.wav"]
if i["desk"] != "":
    files.append(f"DESK{i['desk']}.wav")

for f in files:
    subprocess.run(["aplay", os.path.join(SAMPLES, f)])   # blocks until done
```

Generate one sample set per language and pick the directory from `language`.

## Testing

Run the script by hand with the exact argument the app would pass:

```bash
/opt/queue-master/audio-synthesizer-script.py '{"categoryShortName":"A","number":12,"desk":3,"language":"en"}'
```

If it is silent here, it will be silent in the app. Common causes:

| Symptom | Cause |
|---|---|
| `No audio synthesizer script configured` in the log | `audioSynthesizerScript` empty |
| `Script … ended with 127` | Wrong path / not executable / missing shebang |
| Works in SSH, silent on the device | The kiosk process has no access to the audio device — check the user's `audio` group, PulseAudio/PipeWire session, and HDMI vs analogue output (`aplay -l`) |
| Announcements overlap or get cut | The script returns before playback finishes |
| Wrong language | The script ignores the `language` field |

Everything the script writes to stderr is logged by the kiosk main process; stdout is logged in
development. See [kiosk — logs](kiosk.md#logs).
