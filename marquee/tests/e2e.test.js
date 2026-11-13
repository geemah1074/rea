// End-to-end run of the real studio and player pages in Chromium, against the
// in-browser Supabase stand-in (tests/fake-supabase.js).
// Covers: pairing, upload, text slide, playlist building, assignment, playback,
// remote command, health reporting, and offline restart of the player.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { cp, mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(
    process.env.PLAYWRIGHT_PATH || "/usr/local/lib/node_modules/playwright",
  ));
}

const here = fileURLToPath(new URL(".", import.meta.url));
const SHOTS = process.env.MARQUEE_SHOTS || null;
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};

async function site() {
  const dir = await mkdtemp(join(tmpdir(), "marquee-e2e-"));
  await cp(join(here, "..", "web"), dir, { recursive: true });
  await cp(
    join(here, "fake-supabase.js"),
    join(dir, "shared", "vendor", "supabase-2.45.4.js"),
  );
  await writeFile(
    join(dir, "shared", "config.js"),
    "window.MARQUEE_CONFIG = { supabaseUrl: 'https://test.supabase.co', supabaseAnonKey: 'test-anon-key' };\n",
  );
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = normalize(join(dir, path));
    if (!file.startsWith(dir)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      res
        .writeHead(200, {
          "content-type": TYPES[extname(file)] || "application/octet-stream",
          "cache-control": "no-store",
        })
        .end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { dir, server, origin: `http://localhost:${server.address().port}` };
}

// 2x2 red PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAAhGAIBZsWJSQAAAABJRU5ErkJggg==",
  "base64",
);

test(
  "pair, publish, play, command, and survive going offline",
  { timeout: 180_000 },
  async () => {
    const { dir, server, origin } = await site();
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const errors = [];
    const watch = (page, label) => {
      page.on("pageerror", (e) => errors.push(`${label}: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`${label} console: ${m.text()}`);
      });
    };
    try {
      if (SHOTS) await mkdir(SHOTS, { recursive: true });
      const shot = async (page, name) => {
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}.png`) });
      };

      // 1. Player shows a pairing code.
      const player = await context.newPage();
      watch(player, "player");
      await player.goto(`${origin}/player/`);
      const codeEl = player.locator("#panel-code");
      await codeEl.waitFor({ state: "visible", timeout: 10_000 });
      const code = (await codeEl.textContent()).trim();
      assert.match(code, /^[A-Z0-9]{6}$/);
      assert.equal(
        await player.locator("#identify").isVisible(),
        false,
        "identify overlay starts hidden",
      );
      await shot(player, "1-player-pairing");

      // 2. Owner creates account in the studio and pairs the screen.
      const studio = await context.newPage();
      watch(studio, "studio");
      await studio.goto(`${origin}/`);
      await studio
        .getByRole("button", { name: /Create the owner account/ })
        .click();
      await studio.getByLabel("Email").fill("owner@example.com");
      await studio.getByLabel("Password").fill("correct-horse-battery");
      await studio.getByRole("button", { name: "Create account" }).click();
      await studio
        .getByRole("heading", { name: "Screens", exact: true })
        .waitFor();
      await shot(studio, "2-studio-empty");
      await studio.getByRole("button", { name: "Add screen" }).first().click();
      await studio.getByLabel("Pairing code").fill(code.toLowerCase());
      await studio.getByLabel("Screen name").fill("Front window");
      await studio.getByRole("button", { name: "Pair screen" }).click();
      await studio.getByRole("heading", { name: "Front window" }).waitFor();

      // Player notices it was paired and checks in.
      await player
        .locator("#panel-title", { hasText: /has no playlist|Paired/ })
        .or(player.locator(".slide"))
        .first()
        .waitFor({ timeout: 15_000 });

      // 3. Media: upload an image, add a text slide.
      await studio.getByRole("link", { name: "Media" }).click();
      await studio
        .locator("input[type=file]")
        .setInputFiles({
          name: "menu.png",
          mimeType: "image/png",
          buffer: PNG,
        });
      await studio.getByText("menu", { exact: true }).waitFor();
      await studio.getByRole("button", { name: "Text slide" }).click();
      await studio.getByLabel("Headline").fill("Fresh bread daily");
      await studio.getByLabel("Message").fill("Baked at 6am");
      await studio.getByRole("button", { name: "Save" }).click();
      await studio
        .getByText("Fresh bread daily", { exact: true })
        .first()
        .waitFor();
      await shot(studio, "3-studio-media");

      // 4. Playlist with both items, short durations.
      await studio.getByRole("link", { name: "Playlists" }).click();
      await studio
        .getByRole("button", { name: "New playlist" })
        .first()
        .click();
      await studio.getByRole("button", { name: "Add media" }).first().click();
      for (const box of await studio
        .locator("dialog input[type=checkbox]")
        .all())
        await box.check();
      await studio.getByRole("button", { name: "Add selected" }).click();
      await studio.locator(".cue").nth(1).waitFor();
      for (const input of await studio.locator(".cue .dur input").all()) {
        await input.fill("2");
        await input.press("Tab");
      }
      await studio
        .locator(".cue")
        .first()
        .getByRole("button", { name: "Schedule" })
        .click();
      await studio.locator(".cue-detail").waitFor();
      await shot(studio, "4-studio-playlist");

      // 5. Assign to the screen.
      await studio.getByRole("link", { name: "Screens" }).click();
      await studio
        .getByLabel("Playlist for Front window")
        .selectOption({ label: "Playlist 1" });

      // 6. Player picks it up by polling (realtime is reported down in the stand-in) and plays both items.
      await player
        .locator(".layer.on .slide h2", { hasText: "Fresh bread daily" })
        .or(player.locator(".layer.on img"))
        .first()
        .waitFor({ timeout: 40_000 });
      const seen = new Set();
      for (let i = 0; i < 12 && seen.size < 2; i += 1) {
        if (await player.locator(".layer.on img").count()) seen.add("image");
        if (
          await player
            .locator(".layer.on .slide h2", { hasText: "Fresh bread daily" })
            .count()
        )
          seen.add("text");
        await player.waitForTimeout(500);
      }
      assert.deepEqual(
        [...seen].sort(),
        ["image", "text"],
        "player rotates through both items",
      );
      await player
        .locator(".layer.on .slide h2", { hasText: "Fresh bread daily" })
        .waitFor({ timeout: 6_000 });
      await player
        .locator("#panel")
        .waitFor({ state: "hidden", timeout: 5_000 });
      assert.equal(await player.locator("#identify").isVisible(), false);
      await shot(player, "5-player-playing");

      // 7. Health report reaches the studio.
      await studio.reload();
      await studio
        .locator(".tube-top", { hasText: "ON AIR" })
        .waitFor({ timeout: 25_000 });
      await studio
        .locator(".tube-now .title", { hasText: /Fresh bread daily|menu/ })
        .waitFor({ timeout: 25_000 });
      await shot(studio, "6-studio-screens-live");

      // 8. Remote command.
      await studio.getByRole("button", { name: "Identify" }).click();
      await player
        .locator("#identify:not([hidden])", { hasText: "Front window" })
        .waitFor({ timeout: 25_000 });

      // 9. Offline restart: player reloads with no network and keeps playing saved content.
      await player.waitForTimeout(1500); // let the service worker finish caching the shell
      await context.setOffline(true);
      await player.reload();
      await player
        .locator(".layer.on img")
        .or(
          player.locator(".layer.on .slide h2", {
            hasText: "Fresh bread daily",
          }),
        )
        .first()
        .waitFor({ timeout: 15_000 });
      await player
        .locator("#panel")
        .waitFor({ state: "hidden", timeout: 5_000 });
      await shot(player, "7-player-offline");
      await context.setOffline(false);

      const real = errors.filter(
        (e) => !/ERR_INTERNET_DISCONNECTED|Failed to fetch|net::ERR/.test(e),
      );
      assert.deepEqual(real, [], `no page errors:\n${real.join("\n")}`);
    } finally {
      await browser.close();
      server.close();
      await rm(dir, { recursive: true, force: true });
    }
  },
);
