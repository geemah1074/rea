# Marquee: remote-managed digital signage

> **Setting this up for the first time? Open [`START-HERE.txt`](START-HERE.txt).** It has every step in plain language, plus ready-made prompts for getting help from ChatGPT or another AI assistant.

Marquee puts pictures, videos, web pages and text slides on TVs, tablets and PCs,
and lets you change them from anywhere in a browser.

It runs entirely on **your own** free-tier accounts:

| Piece                                    | Runs on                                                                                       | What it does                                                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Studio** (`/`)                         | Cloudflare Pages                                                                              | The website where you pair screens, upload media, build playlists and watch screen status.                          |
| **Player** (`/player/`)                  | Any screen's browser (Android tablet, Windows PC, Chromebook, smart-TV browser, Raspberry Pi) | Shows a pairing code, then plays its playlist full screen. Keeps playing from its saved copy if the internet drops. |
| **Database, file storage, live updates** | Supabase                                                                                      | Stores everything and pushes changes to screens instantly.                                                          |

Nothing has to be installed on the screens. The player is a web app that can be
"installed" to the home screen for full-screen use.

## How it works

```
 Studio (browser)  ──writes──▶  Supabase  ◀──live channel + polling──  Player (tablet / PC)
                                 │  Postgres: screens, playlists, media list, commands
                                 │  Storage:  private "media" bucket
                                 └─ Realtime: tells each player when its content changes
```

1. **Pairing.** A new player signs in anonymously and gets its own private identity,
   then shows a 6-letter code. You type that code into the studio and the device becomes
   your screen. No passwords are typed on or stored by the screen.
2. **Publishing.** When you edit a playlist or media item, the database bumps a version
   number on every screen that uses it. Each player is listening for that and re-downloads.
3. **Offline.** Players download every image and video into the browser's storage before
   showing it, and keep the last playlist. After a power cut with no internet, they start
   up and play the saved content.
4. **Health.** Every 30 s each player reports what it is showing, resolution, battery,
   app version and any problems. The studio shows a status light:
   **ON AIR** (seen in the last 75 s), **NOT SEEN** (up to 10 min), **OFFLINE**.
5. **Commands.** From the studio: _Identify_ (shows the screen's name on it),
   _Re-download content_, _Restart player_, _Clear saved media_.
6. **Security.** Database rules (row-level security) let each screen read only its
   own playlist and media and never write content. Only email addresses on your
   allowlist can use the studio.

---

## Setup (about 20 minutes)

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (the free plan is fine).
2. **SQL Editor → New query** → paste the whole of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   It is safe to run again later.
3. **Authentication → Sign In / Providers**:
   - Turn **on** "Allow anonymous sign-ins" (this is how players get their identity).
   - Leave **Email** enabled.
4. **Authentication → URL Configuration**: set **Site URL** to your Cloudflare address
   from step 2 below (for example `https://marquee-signage.pages.dev`). You can come back
   and do this after deploying.
5. Allow your own email to use the studio. In the SQL editor run (with your email):

   ```sql
   insert into public.admin_allowlist (email) values ('you@example.com');
   ```

6. **Project Settings → API** (or **API Keys**): copy the **Project URL** and the
   **anon** / **publishable** key. Do **not** use the `service_role` / secret key.

### 2. Put your keys in the app

Edit `web/shared/config.js`:

```js
window.MARQUEE_CONFIG = {
  supabaseUrl: "https://abcdefghijkl.supabase.co",
  supabaseAnonKey: "eyJhbGciOi... or sb_publishable_...",
};
```

The anon key is meant to be public. The database rules are what protect your data.

### 3. Cloudflare Pages

**Option A, no tools needed:** Cloudflare dashboard → **Workers & Pages → Create →
Pages → Upload assets** → name it (for example `marquee-signage`) → drag in the
**`web` folder** → **Deploy**. To update later, choose the project → **Create deployment**
→ upload `web` again.

**Option B, command line** (needs Node.js):

```bash
npx wrangler login
npx wrangler pages deploy web --project-name marquee-signage
```

Your studio is now at `https://marquee-signage.pages.dev/` and the player at
`https://marquee-signage.pages.dev/player/`. You can attach your own domain under
the Pages project → **Custom domains**.

### 4. First sign-in

Open the studio address, click **First time? Create the owner account**, and use the
email you put on the allowlist. If Supabase asks you to confirm the email, click the
link in your inbox, then sign in.

**Recommended:** once your account exists, Supabase → Authentication → Sign In / Providers →
under Email, you can turn off new email sign-ups. Other people cannot use your studio
anyway (allowlist), but this stops strangers creating empty accounts.
Keep anonymous sign-ins **on**, or new players cannot pair.

---

## Screens

### Android tablet

1. Open **Chrome** on the tablet and go to `https://YOUR-SITE.pages.dev/player/`.
2. Chrome menu (⋮) → **Add to Home screen** / **Install app**. Open Marquee from
   the new icon. It runs full screen without the browser bar.
3. The 6-letter code appears. In the studio: **Screens → Add screen** → enter the code
   and a name.
4. Keep it running:
   - **Settings → Display → Screen timeout** → longest available. The player also asks
     the browser to keep the screen on while it is open.
   - Keep the tablet on its charger. If you have **Developer options**, turn on
     **Stay awake** (screen never sleeps while charging).
   - To stop people leaving the app: **Settings → Security → App pinning / Screen pinning** →
     on, then pin the Marquee app from the recent-apps view.
   - **Settings → Apps → Chrome → Battery → Unrestricted**, so Android does not pause it.

### Windows PC as a screen

The studio works in any browser on the PC. To also use the PC to drive a TV:

1. Edit `windows/start-player.cmd` and set `PLAYER_URL` to your player address.
2. Double-click it. Edge opens the player full screen (kiosk mode). Pair it as above.
   **Alt+F4** exits.
3. To start it automatically at sign-in and stop the PC sleeping, run in PowerShell:
   `powershell -ExecutionPolicy Bypass -File .\windows\install-autostart.ps1`
4. For a dedicated signage PC that recovers from power cuts, also set Windows to sign in
   automatically, and in the PC's BIOS/UEFI set "Restore on AC power loss" to On.

### Other devices

Anything with a modern browser works the same way: Chromebooks / ChromeOS Flex, Fire TV
or Android TV with a browser, Raspberry Pi (Chromium in kiosk mode:
`chromium-browser --kiosk https://YOUR-SITE.pages.dev/player/`).

---

## Using the studio

- **Media**: drop images or videos (MP4/H.264 is the safest video format), add a **web page**
  (must be `https://`, and some sites refuse to be shown inside another page), or make a
  **text slide** with your own colours.
- **Playlists**: the coloured strip is the loop at a glance (width = time on screen).
  Set seconds per item (for videos, `0` = play the whole video). **Schedule** limits an
  item to certain days, hours (overnight windows like 22:00–02:00 work) or dates.
  Times follow each screen's own clock.
- **Screens**: pick a playlist per screen. **⋯** opens rotation (portrait screens), fit/fill,
  diagnostics, and remote commands.

## Limits worth knowing

- Supabase free plan: 1 GB file storage, 50 MB per uploaded file by default, and projects
  pause after a week with no activity (active screens count as activity, since they check in).
- Videos play **muted**. Browsers block autoplay with sound.
- A screen keeps playing saved content while offline. New content arrives when it reconnects.
  Commands sent while it is offline run if it reconnects within 10 minutes.
- Web-page items need internet at the screen and are not saved for offline use.

## Development

```bash
npm install
npm test      # database rules on Postgres (PGlite), schedule logic, full browser run
```

- `supabase/schema.sql`: tables, row-level security, pairing/heartbeat/command functions,
  storage bucket and policies.
- `web/`: static site. No build step. `shared/vendor/` holds supabase-js 2.45.4
  (MIT, see `supabase-LICENSE.txt`), bundled locally so players start without a CDN.
- `tests/fake-supabase.js` is a browser stand-in for the end-to-end test only. It does not
  emulate security rules. `tests/schema.test.js` checks those on real Postgres.
