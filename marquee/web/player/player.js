// Marquee Player
//
// Lifecycle (mirrors what REA showed about commercial players, minus credentials in URLs):
//   1. Sign in anonymously; this device gets its own identity, kept in localStorage.
//   2. If no screen is paired to this device, show a pairing code and wait for the studio to claim it.
//   3. Download the assigned playlist and its media into Cache Storage, then play it from there,
//      so playback survives network loss and restarts.
//   4. Listen on a realtime channel for changes and commands; poll as a fallback when the
//      channel is down. Report health every 30 s.
import { configProblem, makeClient, errorText } from "../shared/client.js";
import { isOnAir } from "../shared/schedule.js";

const APP_VERSION = "1.0.0";
const STATE_KEY = "marquee-player-state";
const MEDIA_CACHE = "marquee-media-v1";
const HEARTBEAT_MS = 30_000;
const POLL_MS_LIVE = 120_000; // realtime connected: light safety poll
const POLL_MS_FALLBACK = 15_000; // realtime down: poll often
const PAIR_POLL_MS = 4_000;

const $ = (id) => document.getElementById(id);
const stage = $("stage");
const layers = [$("layer-a"), $("layer-b")];

let sb = null;
let deviceUid = null;
let screen = null; // current screen row
let items = []; // playlist items with .asset
let mediaUrls = new Map(); // asset id -> object URL
let realtime = null;
let realtimeState = "off";
let currentName = "";
let playToken = 0;
let activeLayer = 0;
let lastError = "";
let timers = { poll: null, heartbeat: null, pair: null, item: null };

// ------------------------------------------------------------------ panel
function showPanel(title, { code = null, body = "", meta = "" } = {}) {
  $("panel").hidden = false;
  $("panel-title").textContent = title;
  $("panel-code").hidden = !code;
  $("panel-code").textContent = code || "";
  $("panel-body").textContent = body;
  $("panel-meta").textContent = meta;
}
const hidePanel = () => {
  $("panel").hidden = true;
};
const setOffline = (offline) => {
  $("offline-dot").hidden = !offline;
};

// ------------------------------------------------------------------ device
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator && document.visibilityState === "visible")
      await navigator.wakeLock.request("screen");
  } catch {
    /* not allowed until visible; retried on visibilitychange */
  }
}
document.addEventListener("visibilitychange", requestWakeLock);

function enableFullscreenOnTap() {
  const go = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen)
      el.requestFullscreen().catch(() => {});
    requestWakeLock();
  };
  window.addEventListener("pointerdown", go);
  window.addEventListener("keydown", go);
  // Show the cursor briefly when the mouse moves (useful on a Windows PC).
  let hideTimer;
  window.addEventListener("mousemove", () => {
    document.body.classList.add("pointer");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(
      () => document.body.classList.remove("pointer"),
      2500,
    );
  });
}

// ------------------------------------------------------------------ saved state (offline)
function saveState() {
  try {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({ screen, items, savedAt: Date.now() }),
    );
  } catch {
    /* storage full */
  }
}
function loadSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STATE_KEY) || "null");
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ media cache
const mediaKey = (asset) =>
  `/__marquee_media/${asset.id}?v=${encodeURIComponent(asset.updated_at || "")}`;
const needsFile = (asset) =>
  asset && (asset.kind === "image" || asset.kind === "video");

async function cacheMedia(list) {
  const cache = await caches.open(MEDIA_CACHE);
  const wanted = new Set();
  const failures = [];
  for (const it of list) {
    const asset = it.asset;
    if (!needsFile(asset)) continue;
    const key = mediaKey(asset);
    wanted.add(new URL(key, location.href).href);
    if (await cache.match(key)) continue;
    // One bad file must not block the rest: skip it (the player skips items without media).
    const { data, error } = await sb.storage
      .from("media")
      .download(asset.storage_path);
    if (error) {
      failures.push(`${asset.name}: ${errorText(error)}`);
      continue;
    }
    try {
      await cache.put(
        key,
        new Response(data, {
          headers: {
            "content-type":
              asset.mime || data.type || "application/octet-stream",
          },
        }),
      );
    } catch (err) {
      failures.push(`${asset.name}: ${errorText(err)}`); // usually: device storage full
    }
  }
  // Drop media no longer used, so a small tablet does not fill up.
  for (const req of await cache.keys()) {
    if (!wanted.has(req.url)) await cache.delete(req);
  }
  return failures;
}

async function buildMediaUrls(list) {
  const next = new Map();
  let cache;
  try {
    cache = await caches.open(MEDIA_CACHE);
  } catch {
    return;
  }
  for (const it of list) {
    const asset = it.asset;
    if (!needsFile(asset) || next.has(asset.id)) continue;
    const res = await cache.match(mediaKey(asset));
    if (res) next.set(asset.id, URL.createObjectURL(await res.blob()));
  }
  const old = mediaUrls;
  mediaUrls = next;
  // Revoke after the current item has had time to switch away.
  setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 60_000);
}

async function cachedBytes() {
  try {
    const e = await navigator.storage.estimate();
    return e.usage || 0;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ playback
function applyScreenLook() {
  stage.className = screen && screen.rotation ? `rot-${screen.rotation}` : "";
  stage.style.setProperty("--fit", screen?.fit || "contain");
}

function playable() {
  const now = new Date();
  return items.filter(
    (it) =>
      it.asset &&
      isOnAir(it, now) &&
      (!needsFile(it.asset) || mediaUrls.has(it.asset.id)),
  );
}

function renderInto(layer, it) {
  layer.replaceChildren();
  const a = it.asset;
  if (a.kind === "image") {
    const img = document.createElement("img");
    img.alt = "";
    img.src = mediaUrls.get(a.id);
    layer.append(img);
    return { media: img };
  }
  if (a.kind === "video") {
    const v = document.createElement("video");
    v.src = mediaUrls.get(a.id);
    v.muted = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = "auto";
    layer.append(v);
    v.play().catch(() => {});
    return { media: v, video: v };
  }
  if (a.kind === "web") {
    const f = document.createElement("iframe");
    f.src = a.url;
    f.referrerPolicy = "no-referrer";
    f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
    f.allow = "autoplay";
    layer.append(f);
    return { media: f };
  }
  const body = a.body || {};
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.style.background = body.background || "#111111";
  slide.style.color = body.foreground || "#ffffff";
  if (body.title) {
    const h = document.createElement("h2");
    h.textContent = body.title;
    slide.append(h);
  }
  if (body.message) {
    const p = document.createElement("p");
    p.textContent = body.message;
    slide.append(p);
  }
  layer.append(slide);
  return { media: slide };
}

function showIdle() {
  const layer = layers[activeLayer];
  layer.replaceChildren();
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.style.background = "#0b0b0c";
  slide.style.color = "#8d8a83";
  slide.style.alignItems = "center";
  slide.style.textAlign = "center";
  const h = document.createElement("h2");
  h.style.fontWeight = "500";
  h.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const p = document.createElement("p");
  p.textContent = screen?.playlist_id
    ? "Nothing is scheduled right now."
    : `${screen?.name || "This screen"} has no playlist yet.`;
  slide.append(h, p);
  layer.append(slide);
  layer.classList.add("on");
  currentName = "";
}

function restartPlayback() {
  playToken += 1;
  clearTimeout(timers.item);
  playNext(playToken, -1);
}

function playNext(token, lastIndex) {
  if (token !== playToken) return;
  const list = playable();
  if (list.length === 0) {
    showIdle();
    timers.item = setTimeout(() => playNext(token, -1), 30_000);
    return;
  }
  const lastId = items[lastIndex]?.id;
  const pos = lastId ? list.findIndex((x) => x.id === lastId) : -1;
  const it = list[(pos + 1) % list.length];
  const nextLayer = 1 - activeLayer;
  const { video } = renderInto(layers[nextLayer], it);
  layers[nextLayer].classList.add("on");
  layers[activeLayer].classList.remove("on");
  const prev = layers[activeLayer];
  setTimeout(() => {
    if (!prev.classList.contains("on")) prev.replaceChildren();
  }, 700);
  activeLayer = nextLayer;
  currentName = it.asset.name;

  const advance = () => playNext(token, items.indexOf(it));
  const seconds = it.duration_s > 0 ? it.duration_s : video ? 0 : 10;
  if (video) {
    video.addEventListener(
      "ended",
      () => {
        clearTimeout(timers.item);
        advance();
      },
      { once: true },
    );
    video.addEventListener(
      "error",
      () => {
        clearTimeout(timers.item);
        timers.item = setTimeout(advance, 1000);
      },
      { once: true },
    );
    // A single video in the list loops; a fixed duration cuts it off.
    if (list.length === 1 && seconds === 0) video.loop = true;
    if (seconds > 0) timers.item = setTimeout(advance, seconds * 1000);
    else if (!video.loop) {
      // Safety net in case "ended" never fires (stalled or corrupt file).
      video.addEventListener(
        "loadedmetadata",
        () => {
          if (Number.isFinite(video.duration)) {
            clearTimeout(timers.item);
            timers.item = setTimeout(advance, (video.duration + 5) * 1000);
          }
        },
        { once: true },
      );
      timers.item = setTimeout(advance, 4 * 60 * 60_000);
    }
  } else {
    timers.item = setTimeout(advance, seconds * 1000);
  }
}

// ------------------------------------------------------------------ content sync
async function fetchScreen() {
  const { data, error } = await sb
    .from("screens")
    .select("*")
    .eq("device_uid", deviceUid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function fetchItems(playlistId) {
  if (!playlistId) return [];
  const { data, error } = await sb
    .from("playlist_items")
    .select(
      "id, position, duration_s, days, start_time, end_time, start_date, end_date, asset:assets(id, name, kind, storage_path, url, body, mime, updated_at)",
    )
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data || [];
}

let syncing = null;
function syncContent(reason) {
  // Coalesce overlapping triggers (realtime + poll) into one download pass.
  if (syncing) return syncing;
  syncing = (async () => {
    try {
      const fresh = await fetchScreen();
      if (!fresh) {
        await unpaired();
        return;
      }
      const changed =
        !screen ||
        fresh.id !== screen.id ||
        fresh.content_version !== screen.content_version;
      screen = fresh;
      if (changed || reason === "refresh") {
        const nextItems = await fetchItems(screen.playlist_id);
        const failures = await cacheMedia(nextItems);
        items = nextItems;
        await buildMediaUrls(items);
        saveState();
        applyScreenLook();
        hidePanel();
        restartPlayback();
        heartbeat(); // tell the studio what is showing now, not in 30 s
        lastError = failures.length
          ? `Some media could not be saved: ${failures.join("; ")}`.slice(
              0,
              500,
            )
          : "";
      } else {
        lastError = "";
      }
      setOffline(false);
    } catch (err) {
      lastError = errorText(err);
      setOffline(!navigator.onLine);
      console.warn("sync failed:", lastError);
    } finally {
      syncing = null;
    }
  })();
  return syncing;
}

// ------------------------------------------------------------------ commands
const handled = new Set();
async function runCommand(cmd) {
  if (!cmd || handled.has(cmd.id) || cmd.acked_at) return;
  handled.add(cmd.id);
  await sb.rpc("device_ack_command", { p_id: cmd.id });
  switch (cmd.command) {
    case "identify": {
      $("identify-name").textContent = screen?.name || "This screen";
      $("identify").hidden = false;
      setTimeout(() => {
        $("identify").hidden = true;
      }, 10_000);
      break;
    }
    case "refresh":
      await syncContent("refresh");
      break;
    case "clear_cache": {
      await caches.delete(MEDIA_CACHE);
      screen = null;
      await syncContent("refresh");
      break;
    }
    case "reload":
      location.reload();
      break;
    default:
      break;
  }
}

async function pollCommands() {
  if (!screen) return;
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const { data } = await sb
    .from("commands")
    .select("*")
    .eq("screen_id", screen.id)
    .is("acked_at", null)
    .gte("created_at", since)
    .order("id");
  for (const c of data || []) await runCommand(c);
}

// ------------------------------------------------------------------ realtime + polling
function connectRealtime() {
  if (realtime) sb.removeChannel(realtime);
  realtimeState = "connecting";
  realtime = sb
    .channel(`screen-${screen.id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "screens",
        filter: `id=eq.${screen.id}`,
      },
      (payload) => {
        if (
          payload.new &&
          payload.new.content_version !== screen?.content_version
        )
          syncContent("realtime");
        else if (payload.new && screen) screen = { ...screen, ...payload.new };
      },
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "commands",
        filter: `screen_id=eq.${screen.id}`,
      },
      (payload) => runCommand(payload.new),
    )
    .subscribe((status) => {
      realtimeState = status === "SUBSCRIBED" ? "live" : status.toLowerCase();
      if (status === "SUBSCRIBED") pollCommands();
      schedulePoll();
    });
}

function schedulePoll() {
  clearTimeout(timers.poll);
  const ms = realtimeState === "live" ? POLL_MS_LIVE : POLL_MS_FALLBACK;
  timers.poll = setTimeout(async () => {
    await syncContent("poll");
    await pollCommands().catch(() => {});
    if (
      realtimeState !== "live" &&
      realtimeState !== "connecting" &&
      navigator.onLine
    )
      connectRealtime();
    schedulePoll();
  }, ms);
}

async function heartbeat() {
  if (!screen || !navigator.onLine) return;
  let battery = null;
  try {
    if (navigator.getBattery) {
      const b = await navigator.getBattery();
      battery = { level: Math.round(b.level * 100), charging: b.charging };
    }
  } catch {
    /* unsupported */
  }
  const status = {
    app: APP_VERSION,
    current: currentName,
    idle: currentName === "",
    items: items.length,
    realtime: realtimeState,
    resolution: `${screen.rotation % 180 ? window.innerHeight : window.innerWidth}x${screen.rotation % 180 ? window.innerWidth : window.innerHeight}`,
    platform: navigator.userAgentData?.platform || navigator.platform || "",
    agent: navigator.userAgent.slice(0, 160),
    battery,
    storage_bytes: await cachedBytes(),
    error: lastError || null,
    uptime_s: Math.round(performance.now() / 1000),
  };
  const { error } = await sb.rpc("device_heartbeat", { p_status: status });
  if (error) console.warn("heartbeat failed:", error.message);
}

// ------------------------------------------------------------------ pairing
async function unpaired() {
  screen = null;
  items = [];
  try {
    localStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
  if (realtime) {
    sb.removeChannel(realtime);
    realtime = null;
  }
  clearTimeout(timers.poll);
  playToken += 1;
  clearTimeout(timers.item);
  layers.forEach((l) => {
    l.classList.remove("on");
    l.replaceChildren();
  });
  await pair();
}

async function pair() {
  clearTimeout(timers.pair);
  const { data: code, error } = await sb.rpc("device_start_pairing");
  if (error) {
    showPanel("Cannot reach the server", {
      body: errorText(error),
      meta: "Retrying…",
    });
    timers.pair = setTimeout(pair, 10_000);
    return;
  }
  showPanel("Pair this screen", {
    code,
    body: "In Marquee Studio, choose “Add screen” and enter this code. Tap anywhere for full screen.",
    meta: `Player ${APP_VERSION}`,
  });
  const started = Date.now();
  const check = async () => {
    try {
      const found = await fetchScreen();
      if (found) {
        await startPlaying(found);
        return;
      }
    } catch {
      /* keep waiting */
    }
    // Codes last 30 minutes on the server; fetch a fresh one before that.
    if (Date.now() - started > 25 * 60_000) {
      pair();
      return;
    }
    timers.pair = setTimeout(check, PAIR_POLL_MS);
  };
  timers.pair = setTimeout(check, PAIR_POLL_MS);
}

async function startPlaying(found) {
  clearTimeout(timers.pair);
  showPanel("Paired", { body: `Loading content for ${found.name}…` });
  screen = { ...found, content_version: -1 }; // force a full content load
  await syncContent("start");
  if (!screen) return; // unpaired during sync
  connectRealtime();
  startHeartbeat();
}

function startHeartbeat() {
  clearInterval(timers.heartbeat);
  heartbeat();
  timers.heartbeat = setInterval(heartbeat, HEARTBEAT_MS);
}

// ------------------------------------------------------------------ boot
async function boot() {
  enableFullscreenOnTap();
  requestWakeLock();
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("sw.js").catch(() => {});

  const problem = configProblem();
  if (problem) {
    showPanel("Setup needed", { body: problem });
    return;
  }
  sb = makeClient("marquee-player-auth");

  // Offline-first: if we have saved content, start playing it immediately.
  const saved = loadSavedState();
  if (saved?.screen) {
    screen = saved.screen;
    items = saved.items || [];
    await buildMediaUrls(items);
    applyScreenLook();
    hidePanel();
    restartPlayback();
  } else {
    showPanel("Starting…", { meta: `Player ${APP_VERSION}` });
  }

  let {
    data: { session },
  } = await sb.auth.getSession();
  while (!session) {
    const { data, error } = await sb.auth.signInAnonymously();
    if (!error) {
      session = data.session;
      break;
    }
    if (!saved?.screen) {
      const hint = /anonymous/i.test(error.message)
        ? "Turn on “Allow anonymous sign-ins” in Supabase (Authentication > Sign In / Providers)."
        : errorText(error);
      showPanel("Cannot sign in this player", {
        body: hint,
        meta: "Retrying in 15 seconds…",
      });
    }
    setOffline(true);
    await new Promise((r) => setTimeout(r, 15_000));
  }
  deviceUid = session.user.id;

  window.addEventListener("online", () => {
    setOffline(false);
    syncContent("online");
  });
  window.addEventListener("offline", () => setOffline(true));

  let found = null;
  try {
    found = await fetchScreen();
  } catch (err) {
    lastError = errorText(err);
    if (saved?.screen) {
      setOffline(true);
      startHeartbeat();
      schedulePoll();
      return;
    } // keep playing saved content
    showPanel("Cannot reach the server", {
      body: lastError,
      meta: "Retrying…",
    });
    setTimeout(() => location.reload(), 15_000);
    return;
  }
  if (found) await startPlaying(found);
  else await unpaired();
}

boot();
