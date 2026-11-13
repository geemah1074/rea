// Marquee Studio: pair screens, manage media, build scheduled playlists, watch screen health.
import { configProblem, makeClient, errorText } from "./shared/client.js";
import {
  isOnAir,
  describeSchedule,
  DAY_LETTERS,
  DAY_NAMES,
} from "./shared/schedule.js";

const LIVE_MS = 75_000; // heartbeat is every 30 s; two missed beats = not live
const STALE_MS = 10 * 60_000;
const UPLOAD_WARN_BYTES = 50 * 1024 * 1024; // Supabase free plan default per-file limit

let sb = null;
let user = null;
const store = { screens: [], playlists: [], items: [], assets: [] };
const ui = { selectedPlaylist: null, openCue: null, signed: new Map() };

// ------------------------------------------------------------------ tiny DOM helper
function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k.startsWith("on") && typeof v === "function")
      el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k in el && typeof v !== "string") el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}
const app = () => document.getElementById("app");

function toast(message, bad = false) {
  const t = h("div", { class: `toast${bad ? " bad" : ""}` }, message);
  document.getElementById("toasts").append(t);
  setTimeout(() => t.remove(), bad ? 6000 : 3200);
}

async function run(promise, okMessage) {
  const { data, error } = await promise;
  if (error) {
    toast(errorText(error), true);
    throw error;
  }
  if (okMessage) toast(okMessage);
  return data;
}

function openDialog(build) {
  const dlg = h("dialog");
  const close = () => {
    dlg.close();
    dlg.remove();
  };
  dlg.append(...[build(close)].flat());
  dlg.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  document.body.append(dlg);
  dlg.showModal();
  dlg.querySelector("[autofocus]")?.focus();
  return close;
}

function confirmDialog(title, body, okLabel = "Confirm", danger = false) {
  return new Promise((resolve) => {
    openDialog((close) => [
      h(
        "div",
        { class: "dialog-body" },
        h("h2", {}, title),
        h("p", { class: "muted" }, body),
      ),
      h(
        "div",
        { class: "dialog-actions" },
        h(
          "button",
          {
            class: "ghost",
            onclick: () => {
              close();
              resolve(false);
            },
          },
          "Cancel",
        ),
        h(
          "button",
          {
            class: danger ? "danger" : "primary",
            autofocus: true,
            onclick: () => {
              close();
              resolve(true);
            },
          },
          okLabel,
        ),
      ),
    ]);
  });
}

// ------------------------------------------------------------------ formatting
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
function ago(ts) {
  if (!ts) return "never seen";
  const s = Math.max(
    0,
    Math.round((Date.now() - new Date(ts).getTime()) / 1000),
  );
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}
function bytes(n) {
  if (n === null || n === undefined) return "—";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v < 10 && i ? 1 : 0)} ${u[i]}`;
}
const clock = (sec) =>
  `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
function screenState(s) {
  if (!s.last_seen) return "off";
  const age = Date.now() - new Date(s.last_seen).getTime();
  return age < LIVE_MS ? "live" : age < STALE_MS ? "stale" : "off";
}
const STATE_LABEL = { live: "ON AIR", stale: "NOT SEEN", off: "OFFLINE" };
const KIND_LABEL = { image: "IMG", video: "VID", web: "WEB", text: "TXT" };

// ------------------------------------------------------------------ data
async function loadAll() {
  const [screens, playlists, items, assets] = await Promise.all([
    sb.from("screens").select("*").order("name"),
    sb.from("playlists").select("*").order("created_at"),
    sb.from("playlist_items").select("*").order("position"),
    sb.from("assets").select("*").order("created_at", { ascending: false }),
  ]);
  for (const r of [screens, playlists, items, assets])
    if (r.error) throw r.error;
  store.screens = screens.data;
  store.playlists = playlists.data;
  store.items = items.data;
  store.assets = assets.data;
  if (!store.playlists.some((p) => p.id === ui.selectedPlaylist))
    ui.selectedPlaylist = store.playlists[0]?.id || null;
}
const assetById = (id) => store.assets.find((a) => a.id === id);
const playlistById = (id) => store.playlists.find((p) => p.id === id);
const itemsOf = (pid) =>
  store.items
    .filter((i) => i.playlist_id === pid)
    .sort((a, b) => a.position - b.position);

// Thumbnails need short-lived signed URLs (the bucket is private). Each path is
// requested once per page load; a successful batch triggers one re-render.
const signAttempted = new Set();
async function ensureThumbs() {
  const need = store.assets.filter(
    (a) => a.storage_path && !signAttempted.has(a.storage_path),
  );
  if (!need.length) return;
  need.forEach((a) => signAttempted.add(a.storage_path));
  const { data } = await sb.storage.from("media").createSignedUrls(
    need.map((a) => a.storage_path),
    3600,
  );
  let added = 0;
  for (const d of data || [])
    if (d.signedUrl) {
      ui.signed.set(d.path, d.signedUrl);
      added += 1;
    }
  if (added) softRender();
}

function thumbFor(asset, cls = "thumb") {
  if (!asset)
    return h("div", { class: cls }, h("span", { class: "glyph" }, "—"));
  const url = asset.storage_path && ui.signed.get(asset.storage_path);
  if (asset.kind === "image" && url)
    return h(
      "div",
      { class: cls },
      h("img", { src: url, alt: "", loading: "lazy" }),
    );
  if (asset.kind === "video" && url)
    return h(
      "div",
      { class: cls },
      h("video", { src: `${url}#t=0.5`, muted: true, preload: "metadata" }),
    );
  if (asset.kind === "text") {
    const b = asset.body || {};
    return h(
      "div",
      { class: cls },
      h(
        "div",
        {
          class: "mini-slide",
          style: {
            background: b.background || "#111",
            color: b.foreground || "#fff",
          },
        },
        h("b", {}, b.title || ""),
        cls !== "thumb" && b.message ? h("span", {}, b.message) : null,
      ),
    );
  }
  if (asset.kind === "web") {
    let host = asset.url;
    try {
      host = new URL(asset.url).hostname;
    } catch {
      /* keep raw */
    }
    return h(
      "div",
      { class: cls },
      h("span", { class: "glyph" }, cls === "thumb" ? "WEB" : host),
    );
  }
  return h(
    "div",
    { class: cls },
    h("span", { class: "glyph" }, KIND_LABEL[asset.kind] || "?"),
  );
}

// ------------------------------------------------------------------ shell & routing
const ROUTES = { screens: "Screens", playlists: "Playlists", media: "Media" };
const currentRoute = () => {
  const r = (location.hash.replace(/^#\/?/, "") || "screens").split("/")[0];
  return ROUTES[r] ? r : "screens";
};

function tallySummary() {
  const counts = { live: 0, stale: 0, off: 0 };
  for (const s of store.screens) counts[screenState(s)] += 1;
  return h(
    "div",
    { class: "tally-summary", "aria-label": "Screen status" },
    h("span", {}, h("i", { class: "tally live" }), `${counts.live} on air`),
    counts.stale
      ? h(
          "span",
          {},
          h("i", { class: "tally stale" }),
          `${counts.stale} not seen`,
        )
      : null,
    h("span", {}, h("i", { class: "tally" }), `${counts.off} offline`),
  );
}

function render() {
  const route = currentRoute();
  const view = {
    screens: screensView,
    playlists: playlistsView,
    media: mediaView,
  }[route]();
  app().replaceChildren(
    h(
      "header",
      { class: "topbar" },
      h("div", { class: "wordmark" }, "MARQUEE"),
      h(
        "nav",
        { class: "tabs" },
        Object.entries(ROUTES).map(([k, label]) =>
          h(
            "a",
            { href: `#/${k}`, "aria-current": k === route ? "page" : null },
            label,
          ),
        ),
      ),
      tallySummary(),
      h(
        "button",
        {
          class: "ghost small",
          title: user.email,
          onclick: async () => {
            await sb.auth.signOut();
            location.reload();
          },
        },
        "Sign out",
      ),
    ),
    h("main", {}, view),
  );
  if (route !== "screens") ensureThumbs();
}

// Re-render only when it will not interrupt typing or an open dialog.
function softRender() {
  const a = document.activeElement;
  if (document.querySelector("dialog[open]")) return;
  if (a && ["INPUT", "SELECT", "TEXTAREA"].includes(a.tagName)) return;
  render();
}

// ------------------------------------------------------------------ screens
function screensView() {
  const live = store.screens.filter((s) => screenState(s) === "live").length;
  const head = h(
    "div",
    { class: "page-head" },
    h(
      "div",
      {},
      h("h1", {}, "Screens"),
      h(
        "p",
        {},
        store.screens.length
          ? `${live} of ${plural(store.screens.length, "screen")} on air`
          : "Pair a tablet, TV or PC to start.",
      ),
    ),
    h(
      "div",
      { class: "actions" },
      h("button", { class: "primary", onclick: addScreenDialog }, "Add screen"),
    ),
  );

  if (!store.screens.length) {
    const playerUrl = new URL("player/", location.href).href;
    return [
      head,
      h(
        "div",
        { class: "empty" },
        h("h3", {}, "No screens yet"),
        h(
          "p",
          {},
          "On the tablet or PC that drives the display, open the player address below. It shows a six-letter code; enter it with “Add screen”.",
        ),
        h("p", { class: "mono", style: { color: "var(--ink)" } }, playerUrl),
        h(
          "button",
          {
            onclick: () =>
              navigator.clipboard
                ?.writeText(playerUrl)
                .then(() => toast("Player address copied")),
          },
          "Copy player address",
        ),
      ),
    ];
  }
  return [head, h("div", { class: "wall" }, store.screens.map(monitorCard))];
}

function monitorCard(s) {
  const state = screenState(s);
  const st = s.status || {};
  const playlist = playlistById(s.playlist_id);
  const foot = [
    st.resolution ? h("span", {}, st.resolution) : null,
    st.battery
      ? h(
          "span",
          { title: st.battery.charging ? "Battery, charging" : "Battery" },
          `batt ${st.battery.level}%`,
        )
      : null,
    st.app ? h("span", {}, `v${st.app}`) : null,
    st.error
      ? h("span", { class: "warn", title: st.error }, "media issue")
      : null,
    state === "live" && st.realtime && st.realtime !== "live"
      ? h(
          "span",
          {
            class: "warn",
            title: "Live channel down; the screen is polling instead",
          },
          "polling",
        )
      : null,
  ];
  return h(
    "article",
    { class: "monitor" },
    h(
      "div",
      { class: "bezel" },
      h(
        "div",
        { class: "tube" },
        h(
          "div",
          { class: "tube-top" },
          h("i", { class: `tally ${state}` }),
          STATE_LABEL[state],
          s.rotation ? h("span", { class: "rot" }, `${s.rotation}°`) : null,
        ),
        h(
          "div",
          { class: "tube-now" },
          h(
            "div",
            { class: "label" },
            state === "off" ? "LAST SHOWING" : "NOW SHOWING",
          ),
          h(
            "div",
            { class: "title" },
            st.idle
              ? "Nothing scheduled"
              : st.current ||
                  (s.last_seen ? "—" : "Waiting for first check-in"),
          ),
        ),
        h("div", { class: "tube-foot" }, foot),
      ),
    ),
    h(
      "div",
      { class: "monitor-meta" },
      h("h3", {}, s.name),
      h(
        "p",
        {},
        `${playlist ? playlist.name : "No playlist"} · ${ago(s.last_seen)}`,
      ),
    ),
    h(
      "div",
      { class: "monitor-controls" },
      h(
        "select",
        {
          class: "grow",
          "aria-label": `Playlist for ${s.name}`,
          onchange: async (e) => {
            const playlist_id = e.target.value || null;
            await run(
              sb.from("screens").update({ playlist_id }).eq("id", s.id),
              `${s.name} updated`,
            );
            s.playlist_id = playlist_id;
            render();
          },
        },
        h("option", { value: "" }, "No playlist"),
        store.playlists.map((p) =>
          h(
            "option",
            { value: p.id, selected: p.id === s.playlist_id },
            p.name,
          ),
        ),
      ),
      h(
        "button",
        {
          class: "small",
          title: "Show this screen’s name on the display",
          onclick: () => sendCommand(s, "identify"),
        },
        "Identify",
      ),
      h(
        "button",
        {
          class: "small icon",
          title: "Settings",
          "aria-label": `Settings for ${s.name}`,
          onclick: () => screenSettings(s),
        },
        "⋯",
      ),
    ),
  );
}

async function sendCommand(s, command) {
  await run(sb.from("commands").insert({ screen_id: s.id, command }));
  toast(
    screenState(s) === "live"
      ? `Sent to ${s.name}`
      : `${s.name} is not online. It will run this if it reconnects within 10 minutes.`,
  );
}

function addScreenDialog() {
  let code;
  let name;
  let err;
  openDialog((close) => {
    const submit = async (e) => {
      e.preventDefault();
      err.textContent = "";
      const { error } = await sb.rpc("claim_screen", {
        p_code: code.value,
        p_name: name.value,
      });
      if (error) {
        err.textContent = errorText(error);
        return;
      }
      close();
      toast("Screen paired");
      await loadAll();
      render();
    };
    return h(
      "form",
      { onsubmit: submit },
      h(
        "div",
        { class: "dialog-body" },
        h("h2", {}, "Add screen"),
        h(
          "p",
          { class: "muted" },
          "Open the player on the device and enter the code it shows.",
        ),
        (code = h("input", {
          class: "code-input",
          maxlength: "7",
          autocomplete: "off",
          spellcheck: false,
          required: true,
          autofocus: true,
          "aria-label": "Pairing code",
          placeholder: "ABC234",
        })),
        h(
          "label",
          { class: "field" },
          "Screen name",
          (name = h("input", { placeholder: "Front window", maxlength: "80" })),
        ),
        (err = h("p", { class: "error-text", role: "alert" })),
      ),
      h(
        "div",
        { class: "dialog-actions" },
        h(
          "button",
          { type: "button", class: "ghost", onclick: close },
          "Cancel",
        ),
        h("button", { type: "submit", class: "primary" }, "Pair screen"),
      ),
    );
  });
}

function screenSettings(s) {
  const st = s.status || {};
  let name;
  let rotation;
  let fit;
  openDialog((close) => {
    const save = async (e) => {
      e.preventDefault();
      await run(
        sb
          .from("screens")
          .update({
            name: name.value.trim() || s.name,
            rotation: Number(rotation.value),
            fit: fit.value,
          })
          .eq("id", s.id),
        "Saved",
      );
      close();
      await loadAll();
      render();
    };
    const diag = [
      ["Status", `${STATE_LABEL[screenState(s)]} · ${ago(s.last_seen)}`],
      ["Showing", st.current],
      ["Items", st.items],
      ["Channel", st.realtime],
      ["Resolution", st.resolution],
      ["Player", st.app],
      ["Platform", st.platform],
      [
        "Saved media",
        st.storage_bytes != null ? bytes(st.storage_bytes) : null,
      ],
      [
        "Battery",
        st.battery
          ? `${st.battery.level}%${st.battery.charging ? " charging" : ""}`
          : null,
      ],
      ["Uptime", st.uptime_s ? `${Math.round(st.uptime_s / 60)} min` : null],
      ["Problem", st.error],
      ["Browser", st.agent],
    ].filter(([, v]) => v !== null && v !== undefined && v !== "");
    return h(
      "form",
      { onsubmit: save },
      h(
        "div",
        { class: "dialog-body" },
        h("h2", {}, s.name),
        h(
          "label",
          { class: "field" },
          "Name",
          (name = h("input", {
            value: s.name,
            maxlength: "80",
            required: true,
          })),
        ),
        h(
          "div",
          { class: "row" },
          h(
            "label",
            { class: "field grow" },
            "Rotation",
            (rotation = h(
              "select",
              {},
              [0, 90, 180, 270].map((r) =>
                h(
                  "option",
                  { value: String(r), selected: r === s.rotation },
                  r === 0
                    ? "Landscape (0°)"
                    : r === 90
                      ? "Portrait (90°)"
                      : r === 180
                        ? "Upside down (180°)"
                        : "Portrait (270°)",
                ),
              ),
            )),
          ),
          h(
            "label",
            { class: "field grow" },
            "Image fit",
            (fit = h(
              "select",
              {},
              h(
                "option",
                { value: "contain", selected: s.fit === "contain" },
                "Fit whole image",
              ),
              h(
                "option",
                { value: "cover", selected: s.fit === "cover" },
                "Fill screen (crop)",
              ),
            )),
          ),
        ),
        h(
          "div",
          {},
          h(
            "p",
            { class: "eyebrow", style: { marginBottom: "8px" } },
            "Diagnostics",
          ),
          h(
            "dl",
            { class: "diag" },
            diag.map(([k, v]) => [h("dt", {}, k), h("dd", {}, String(v))]),
          ),
        ),
        h(
          "div",
          { class: "row wrap" },
          h(
            "button",
            {
              type: "button",
              class: "small",
              onclick: () => sendCommand(s, "refresh"),
            },
            "Re-download content",
          ),
          h(
            "button",
            {
              type: "button",
              class: "small",
              onclick: () => sendCommand(s, "reload"),
            },
            "Restart player",
          ),
          h(
            "button",
            {
              type: "button",
              class: "small",
              onclick: () => sendCommand(s, "clear_cache"),
            },
            "Clear saved media",
          ),
          h(
            "button",
            {
              type: "button",
              class: "small danger",
              onclick: async () => {
                if (
                  !(await confirmDialog(
                    `Remove ${s.name}?`,
                    "The device goes back to showing a pairing code. You can pair it again later.",
                    "Remove screen",
                    true,
                  ))
                )
                  return;
                await run(
                  sb.from("screens").delete().eq("id", s.id),
                  "Screen removed",
                );
                close();
                await loadAll();
                render();
              },
            },
            "Remove screen",
          ),
        ),
      ),
      h(
        "div",
        { class: "dialog-actions" },
        h(
          "button",
          { type: "button", class: "ghost", onclick: close },
          "Close",
        ),
        h("button", { type: "submit", class: "primary" }, "Save"),
      ),
    );
  });
}

// ------------------------------------------------------------------ playlists (run sheet)
function playlistsView() {
  const head = h(
    "div",
    { class: "page-head" },
    h(
      "div",
      {},
      h("h1", {}, "Playlists"),
      h("p", {}, "What plays, in order, for how long, and when."),
    ),
    h(
      "div",
      { class: "actions" },
      h("button", { class: "primary", onclick: newPlaylist }, "New playlist"),
    ),
  );
  if (!store.playlists.length) {
    return [
      head,
      h(
        "div",
        { class: "empty" },
        h("h3", {}, "No playlists yet"),
        h(
          "p",
          {},
          "A playlist is a run sheet of media. Make one, add items from Media, then assign it to a screen.",
        ),
        h("button", { class: "primary", onclick: newPlaylist }, "New playlist"),
      ),
    ];
  }
  const selected = playlistById(ui.selectedPlaylist) || store.playlists[0];
  ui.selectedPlaylist = selected.id;
  return [
    head,
    h(
      "div",
      { class: "desk" },
      h(
        "div",
        { class: "sheet-list", role: "list" },
        store.playlists.map((p) =>
          h(
            "button",
            {
              "aria-current": p.id === selected.id ? "true" : null,
              onclick: () => {
                ui.selectedPlaylist = p.id;
                ui.openCue = null;
                render();
              },
            },
            h(
              "span",
              {
                class: "grow",
                style: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "left",
                },
              },
              p.name,
            ),
            h("span", { class: "count" }, itemsOf(p.id).length),
          ),
        ),
      ),
      sheetView(selected),
    ),
  ];
}

async function newPlaylist() {
  const n = store.playlists.length + 1;
  const data = await run(
    sb
      .from("playlists")
      .insert({ name: `Playlist ${n}` })
      .select()
      .single(),
    "Playlist created",
  );
  ui.selectedPlaylist = data.id;
  await loadAll();
  location.hash = "#/playlists";
  render();
}

const effectiveSeconds = (it) => {
  const a = assetById(it.asset_id);
  return it.duration_s > 0 ? it.duration_s : a?.kind === "video" ? 30 : 10;
};

function sheetView(p) {
  const cues = itemsOf(p.id);
  const usedOn = store.screens
    .filter((s) => s.playlist_id === p.id)
    .map((s) => s.name);
  const now = new Date();
  const total = cues.reduce((sum, it) => sum + effectiveSeconds(it), 0);
  const hasVideoFull = cues.some(
    (it) => it.duration_s === 0 && assetById(it.asset_id)?.kind === "video",
  );

  const title = h("input", {
    class: "sheet-title",
    value: p.name,
    "aria-label": "Playlist name",
    maxlength: "120",
    onchange: async (e) => {
      const name = e.target.value.trim();
      if (!name) {
        e.target.value = p.name;
        return;
      }
      await run(
        sb.from("playlists").update({ name }).eq("id", p.id),
        "Renamed",
      );
      p.name = name;
      render();
    },
  });

  return h(
    "section",
    { class: "sheet" },
    h(
      "div",
      { class: "row" },
      h(
        "div",
        { class: "grow" },
        title,
        h(
          "p",
          { class: "used-on" },
          usedOn.length
            ? `On air at: ${usedOn.join(", ")}`
            : "Not assigned to any screen yet",
        ),
      ),
      h("button", { onclick: () => addItemsDialog(p) }, "Add media"),
      h(
        "button",
        {
          class: "ghost danger",
          onclick: async () => {
            if (
              !(await confirmDialog(
                `Delete “${p.name}”?`,
                usedOn.length
                  ? `${usedOn.join(", ")} will show nothing until you assign another playlist.`
                  : "Media files stay in your library.",
                "Delete playlist",
                true,
              ))
            )
              return;
            await run(
              sb.from("playlists").delete().eq("id", p.id),
              "Playlist deleted",
            );
            await loadAll();
            render();
          },
        },
        "Delete",
      ),
    ),
    cues.length
      ? h(
          "div",
          { class: "rundown" },
          h(
            "div",
            { class: "rundown-strip", "aria-hidden": "true" },
            cues.map((it) => {
              const a = assetById(it.asset_id);
              return h(
                "div",
                {
                  class: `seg k-${a?.kind || "text"}${isOnAir(it, now) ? "" : " off"}`,
                  style: { flex: `${effectiveSeconds(it)} 1 0` },
                  title: `${a?.name || "?"} · ${it.duration_s > 0 ? `${it.duration_s}s` : "full length"}`,
                },
                a?.name || "",
              );
            }),
          ),
          h(
            "div",
            { class: "rundown-scale" },
            h("span", {}, "0:00"),
            h(
              "span",
              {},
              `${hasVideoFull ? "≈ " : ""}${clock(total)} per loop · ${cues.filter((it) => isOnAir(it, now)).length} of ${cues.length} on air now`,
            ),
          ),
        )
      : null,
    cues.length
      ? h(
          "div",
          { class: "cues" },
          cues.map((it, i) => cueRow(it, i, cues)),
        )
      : h(
          "div",
          { class: "empty" },
          h("h3", {}, "Empty run sheet"),
          h(
            "p",
            {},
            "Add images, videos, web pages or text slides from your media library.",
          ),
          h(
            "button",
            { class: "primary", onclick: () => addItemsDialog(p) },
            "Add media",
          ),
        ),
  );
}

let saveTimers = new Map();
function saveItem(it, patch, delay = 400) {
  Object.assign(it, patch);
  clearTimeout(saveTimers.get(it.id));
  saveTimers.set(
    it.id,
    setTimeout(async () => {
      await run(sb.from("playlist_items").update(patch).eq("id", it.id));
    }, delay),
  );
}

function cueRow(it, index, cues) {
  const a = assetById(it.asset_id);
  const on = isOnAir(it);
  const open = ui.openCue === it.id;
  const isVideo = a?.kind === "video";
  const move = async (dir) => {
    const order = [...cues];
    const j = index + dir;
    if (j < 0 || j >= order.length) return;
    [order[index], order[j]] = [order[j], order[index]];
    const updates = order
      .map((c, pos) =>
        c.position !== pos
          ? sb.from("playlist_items").update({ position: pos }).eq("id", c.id)
          : null,
      )
      .filter(Boolean);
    order.forEach((c, pos) => {
      c.position = pos;
    });
    render();
    const results = await Promise.all(updates);
    if (results.some((r) => r.error)) {
      toast("Could not reorder; reloading", true);
      await loadAll();
      render();
    }
  };
  return [
    h(
      "div",
      { class: "cue" },
      h("span", { class: "num" }, String(index + 1).padStart(2, "0")),
      thumbFor(a),
      h(
        "div",
        { style: { minWidth: 0 } },
        h("div", { class: "name" }, a?.name || "Missing media"),
        h(
          "div",
          { class: "sched" },
          h(
            "span",
            { class: on ? "onair" : "offair" },
            on ? "ON AIR" : "OFF AIR",
          ),
          describeSchedule(it),
        ),
      ),
      h(
        "label",
        {
          class: "dur",
          title: isVideo
            ? "Seconds to show. 0 = play the whole video."
            : "Seconds to show",
        },
        h("input", {
          type: "number",
          min: isVideo ? "0" : "1",
          max: "86400",
          value: String(it.duration_s),
          "aria-label": `Seconds for ${a?.name || "item"}`,
          onchange: (e) => {
            const v = Math.max(
              isVideo ? 0 : 1,
              Math.min(86400, Math.round(Number(e.target.value) || 0)),
            );
            e.target.value = String(v);
            saveItem(it, { duration_s: v }, 0);
            setTimeout(render, 50);
          },
        }),
        h(
          "span",
          { class: "muted mono" },
          isVideo && it.duration_s === 0 ? "full" : "s",
        ),
      ),
      h(
        "div",
        { class: "tools" },
        h(
          "button",
          {
            class: "small icon ghost",
            title: "Move up",
            "aria-label": "Move up",
            disabled: index === 0,
            onclick: () => move(-1),
          },
          "↑",
        ),
        h(
          "button",
          {
            class: "small icon ghost",
            title: "Move down",
            "aria-label": "Move down",
            disabled: index === cues.length - 1,
            onclick: () => move(1),
          },
          "↓",
        ),
        h(
          "button",
          {
            class: "small ghost",
            "aria-expanded": String(open),
            onclick: () => {
              ui.openCue = open ? null : it.id;
              render();
            },
          },
          "Schedule",
        ),
        h(
          "button",
          {
            class: "small icon ghost danger",
            title: "Remove from playlist",
            "aria-label": "Remove from playlist",
            onclick: async () => {
              await run(sb.from("playlist_items").delete().eq("id", it.id));
              store.items = store.items.filter((x) => x.id !== it.id);
              render();
            },
          },
          "✕",
        ),
      ),
    ),
    open ? scheduleEditor(it) : null,
  ];
}

function scheduleEditor(it) {
  const days = new Set(Array.isArray(it.days) ? it.days : []);
  const setDays = () =>
    saveItem(
      it,
      { days: days.size === 0 || days.size === 7 ? null : [...days].sort() },
      0,
    );
  const time = (key, label) =>
    h(
      "label",
      { class: "field" },
      label,
      h("input", {
        type: "time",
        value: it[key] ? it[key].slice(0, 5) : "",
        onchange: (e) => saveItem(it, { [key]: e.target.value || null }, 0),
      }),
    );
  const date = (key, label) =>
    h(
      "label",
      { class: "field" },
      label,
      h("input", {
        type: "date",
        value: it[key] || "",
        onchange: (e) => saveItem(it, { [key]: e.target.value || null }, 0),
      }),
    );
  return h(
    "div",
    { class: "cue-detail" },
    h(
      "div",
      {},
      h("p", { class: "eyebrow", style: { marginBottom: "8px" } }, "Days"),
      h(
        "div",
        { class: "days" },
        DAY_LETTERS.map((letter, d) =>
          h(
            "button",
            {
              type: "button",
              title: DAY_NAMES[d],
              "aria-pressed": String(days.size === 0 || days.has(d)),
              onclick: (e) => {
                if (days.size === 0) for (let x = 0; x < 7; x += 1) days.add(x);
                if (days.has(d)) days.delete(d);
                else days.add(d);
                if (days.size === 0) for (let x = 0; x < 7; x += 1) days.add(x); // never "no days"
                e.currentTarget.setAttribute(
                  "aria-pressed",
                  String(days.has(d)),
                );
                setDays();
              },
            },
            letter,
          ),
        ),
      ),
    ),
    h(
      "div",
      { class: "row wrap" },
      time("start_time", "From"),
      time("end_time", "Until"),
      date("start_date", "Start date"),
      date("end_date", "End date"),
    ),
    h(
      "div",
      { class: "row" },
      h(
        "p",
        { class: "muted grow", style: { fontSize: "12px" } },
        "Times use each screen’s own clock. A window like 22:00–02:00 runs overnight.",
      ),
      h(
        "button",
        {
          class: "small",
          onclick: () => {
            saveItem(
              it,
              {
                days: null,
                start_time: null,
                end_time: null,
                start_date: null,
                end_date: null,
              },
              0,
            );
            setTimeout(render, 50);
          },
        },
        "Always show",
      ),
      h(
        "button",
        {
          class: "small primary",
          onclick: () => {
            ui.openCue = null;
            setTimeout(render, 50);
          },
        },
        "Done",
      ),
    ),
  );
}

function addItemsDialog(p) {
  if (!store.assets.length) {
    toast("Your media library is empty. Add something in Media first.");
    location.hash = "#/media";
    return;
  }
  const chosen = new Set();
  openDialog((close) => [
    h(
      "div",
      { class: "dialog-body" },
      h("h2", {}, `Add to ${p.name}`),
      h(
        "div",
        { class: "pick-list" },
        store.assets.map((a) =>
          h(
            "label",
            {},
            h("input", {
              type: "checkbox",
              onchange: (e) =>
                e.target.checked ? chosen.add(a.id) : chosen.delete(a.id),
            }),
            thumbFor(a),
            h("span", { class: "grow" }, a.name),
            h("span", { class: "eyebrow" }, KIND_LABEL[a.kind]),
          ),
        ),
      ),
    ),
    h(
      "div",
      { class: "dialog-actions" },
      h("button", { class: "ghost", onclick: close }, "Cancel"),
      h(
        "button",
        {
          class: "primary",
          onclick: async () => {
            if (!chosen.size) {
              close();
              return;
            }
            const start = itemsOf(p.id).reduce(
              (m, i) => Math.max(m, i.position + 1),
              0,
            );
            const rows = [...chosen].map((asset_id, k) => ({
              playlist_id: p.id,
              asset_id,
              position: start + k,
              duration_s: assetById(asset_id)?.kind === "video" ? 0 : 10,
            }));
            await run(
              sb.from("playlist_items").insert(rows),
              `Added ${plural(rows.length, "item")}`,
            );
            close();
            await loadAll();
            render();
          },
        },
        "Add selected",
      ),
    ),
  ]);
}

// ------------------------------------------------------------------ media
function mediaView() {
  const input = h("input", {
    type: "file",
    multiple: true,
    accept: "image/*,video/*",
    hidden: true,
    onchange: (e) => upload([...e.target.files]),
  });
  const zone = h(
    "div",
    {
      class: "dropzone",
      ondragover: (e) => {
        e.preventDefault();
        zone.classList.add("over");
      },
      ondragleave: () => zone.classList.remove("over"),
      ondrop: (e) => {
        e.preventDefault();
        zone.classList.remove("over");
        upload([...e.dataTransfer.files]);
      },
    },
    h(
      "div",
      { class: "grow" },
      h("strong", {}, "Drop images or videos here"),
      h(
        "p",
        {},
        "JPG, PNG, WebP, GIF, MP4 or WebM. Videos play muted. Use MP4 (H.264) for the widest device support.",
      ),
    ),
    h("button", { onclick: () => input.click() }, "Choose files"),
    input,
    h("div", {
      id: "uploads",
      style: { display: "grid", gap: "6px", minWidth: "180px" },
    }),
  );

  const head = h(
    "div",
    { class: "page-head" },
    h(
      "div",
      {},
      h("h1", {}, "Media"),
      h(
        "p",
        {},
        `${plural(store.assets.length, "item")} · ${bytes(store.assets.reduce((s, a) => s + (a.bytes || 0), 0))} stored`,
      ),
    ),
    h(
      "div",
      { class: "actions" },
      h("button", { onclick: () => webDialog() }, "Web page"),
      h("button", { onclick: () => textDialog() }, "Text slide"),
    ),
  );

  const lib = store.assets.length
    ? h("div", { class: "library" }, store.assets.map(tile))
    : h(
        "div",
        { class: "empty" },
        h("h3", {}, "Nothing here yet"),
        h(
          "p",
          {},
          "Upload a menu photo, a promo video, or make a text slide to get going.",
        ),
      );

  return [head, zone, lib];
}

function tile(a) {
  const uses = store.items.filter((i) => i.asset_id === a.id).length;
  const kindColor = {
    image: "var(--k-image)",
    video: "var(--k-video)",
    web: "var(--k-web)",
    text: "var(--k-text)",
  }[a.kind];
  const editable = a.kind === "web" || a.kind === "text";
  return h(
    "div",
    { class: "tile" },
    h(
      "div",
      { class: "frame" },
      thumbFor(a, "mini-frame").firstChild || "",
      h(
        "span",
        { class: "kind", style: { background: kindColor } },
        KIND_LABEL[a.kind],
      ),
    ),
    h(
      "div",
      { class: "info" },
      h(
        "div",
        { class: "grow" },
        h("p", { title: a.name }, a.name),
        h(
          "p",
          {},
          [
            a.bytes ? bytes(a.bytes) : null,
            uses ? `in ${plural(uses, "playlist item")}` : "unused",
          ]
            .filter(Boolean)
            .join(" · "),
        ),
      ),
      editable
        ? h(
            "button",
            {
              class: "small ghost",
              onclick: () => (a.kind === "web" ? webDialog(a) : textDialog(a)),
            },
            "Edit",
          )
        : null,
      h(
        "button",
        {
          class: "small icon ghost danger",
          title: "Delete",
          "aria-label": `Delete ${a.name}`,
          onclick: async () => {
            const body = uses
              ? `It is used ${plural(uses, "time")} in playlists and will be removed from them.`
              : "This cannot be undone.";
            if (
              !(await confirmDialog(
                `Delete “${a.name}”?`,
                body,
                "Delete",
                true,
              ))
            )
              return;
            await run(sb.from("assets").delete().eq("id", a.id));
            if (a.storage_path)
              await sb.storage.from("media").remove([a.storage_path]);
            toast("Deleted");
            await loadAll();
            render();
          },
        },
        "✕",
      ),
    ),
  );
}

async function upload(files) {
  const list = document.getElementById("uploads");
  for (const file of files) {
    const kind = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : null;
    if (!kind) {
      toast(`${file.name}: only images and videos can be uploaded`, true);
      continue;
    }
    if (file.size > UPLOAD_WARN_BYTES)
      toast(
        `${file.name} is ${bytes(file.size)}. The Supabase free plan allows 50 MB per file by default.`,
      );
    const row = h(
      "div",
      {},
      h("p", { class: "mono", style: { fontSize: "12px" } }, file.name),
      h("div", { class: "progress" }, h("i", { style: { width: "40%" } })),
    );
    list?.append(row);
    const id = crypto.randomUUID();
    const ext =
      (file.name.split(".").pop() || "bin")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 8) || "bin";
    const path = `${user.id}/${id}.${ext}`;
    const up = await sb.storage
      .from("media")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: "31536000",
      });
    if (up.error) {
      row.remove();
      toast(`${file.name}: ${errorText(up.error)}`, true);
      continue;
    }
    row.querySelector("i").style.width = "90%";
    const ins = await sb.from("assets").insert({
      id,
      name: file.name.replace(/\.[^.]+$/, "").slice(0, 200) || file.name,
      kind,
      storage_path: path,
      mime: file.type,
      bytes: file.size,
    });
    if (ins.error) {
      await sb.storage.from("media").remove([path]);
      row.remove();
      toast(`${file.name}: ${errorText(ins.error)}`, true);
      continue;
    }
    row.remove();
  }
  await loadAll();
  render();
  toast("Upload finished");
}

function webDialog(existing) {
  let name;
  let url;
  let err;
  openDialog((close) =>
    h(
      "form",
      {
        onsubmit: async (e) => {
          e.preventDefault();
          let parsed;
          try {
            parsed = new URL(url.value.trim());
          } catch {
            err.textContent = "Enter a full address starting with https://";
            return;
          }
          if (parsed.protocol !== "https:") {
            err.textContent = "Only https:// pages can be shown.";
            return;
          }
          const row = {
            name: name.value.trim() || parsed.hostname,
            kind: "web",
            url: parsed.href,
          };
          const q = existing
            ? sb.from("assets").update(row).eq("id", existing.id)
            : sb.from("assets").insert(row);
          await run(q, existing ? "Saved" : "Web page added");
          close();
          await loadAll();
          render();
        },
      },
      h(
        "div",
        { class: "dialog-body" },
        h("h2", {}, existing ? "Edit web page" : "Add a web page"),
        h(
          "label",
          { class: "field" },
          "Address",
          (url = h("input", {
            type: "url",
            required: true,
            placeholder: "https://example.com/menu",
            value: existing?.url || "",
            autofocus: true,
          })),
        ),
        h(
          "label",
          { class: "field" },
          "Name",
          (name = h("input", {
            placeholder: "Daily specials",
            value: existing?.name || "",
            maxlength: "200",
          })),
        ),
        h(
          "p",
          { class: "muted", style: { fontSize: "13px" } },
          "Some sites refuse to be shown inside other pages. Check it on a screen before relying on it. Pages that need a login will not work.",
        ),
        (err = h("p", { class: "error-text", role: "alert" })),
      ),
      h(
        "div",
        { class: "dialog-actions" },
        h(
          "button",
          { type: "button", class: "ghost", onclick: close },
          "Cancel",
        ),
        h("button", { class: "primary", type: "submit" }, "Save"),
      ),
    ),
  );
}

function textDialog(existing) {
  const b = existing?.body || {};
  let name;
  let title;
  let message;
  let bg;
  let fg;
  let preview;
  const paint = () => {
    preview.style.background = bg.value;
    preview.style.color = fg.value;
    preview.replaceChildren(
      h("b", {}, title.value),
      h("span", {}, message.value),
    );
  };
  openDialog((close) => {
    const form = h(
      "form",
      {
        onsubmit: async (e) => {
          e.preventDefault();
          const row = {
            name:
              name.value.trim() ||
              title.value.trim().slice(0, 60) ||
              "Text slide",
            kind: "text",
            body: {
              title: title.value.trim(),
              message: message.value.trim(),
              background: bg.value,
              foreground: fg.value,
            },
          };
          const q = existing
            ? sb.from("assets").update(row).eq("id", existing.id)
            : sb.from("assets").insert(row);
          await run(q, existing ? "Saved" : "Text slide added");
          close();
          await loadAll();
          render();
        },
      },
      h(
        "div",
        { class: "dialog-body" },
        h("h2", {}, existing ? "Edit text slide" : "New text slide"),
        h(
          "div",
          { class: "thumb", style: { width: "100%", height: "150px" } },
          (preview = h("div", { class: "mini-slide" })),
        ),
        h(
          "label",
          { class: "field" },
          "Headline",
          (title = h("input", {
            value: b.title || "",
            maxlength: "120",
            required: true,
            autofocus: true,
            oninput: () => paint(),
          })),
        ),
        h(
          "label",
          { class: "field" },
          "Message",
          (message = h(
            "textarea",
            { maxlength: "600", oninput: () => paint() },
            b.message || "",
          )),
        ),
        h(
          "div",
          { class: "row" },
          h(
            "label",
            { class: "field" },
            "Background",
            (bg = h("input", {
              type: "color",
              value: b.background || "#1d1b17",
              oninput: () => paint(),
            })),
          ),
          h(
            "label",
            { class: "field" },
            "Text",
            (fg = h("input", {
              type: "color",
              value: b.foreground || "#f5f2ea",
              oninput: () => paint(),
            })),
          ),
          h(
            "label",
            { class: "field grow" },
            "Name in library",
            (name = h("input", {
              value: existing?.name || "",
              maxlength: "200",
              placeholder: "Optional",
            })),
          ),
        ),
      ),
      h(
        "div",
        { class: "dialog-actions" },
        h(
          "button",
          { type: "button", class: "ghost", onclick: close },
          "Cancel",
        ),
        h("button", { class: "primary", type: "submit" }, "Save"),
      ),
    );
    return form;
  });
  paint();
}

// ------------------------------------------------------------------ auth & boot
function setupNotice(problem) {
  app().replaceChildren(
    h(
      "div",
      { class: "notice" },
      h("p", { class: "eyebrow" }, "Setup needed"),
      h("h2", {}, "Connect Marquee to Supabase"),
      h("p", {}, problem),
      h(
        "p",
        {},
        "Edit ",
        h("code", {}, "web/shared/config.js"),
        " with your project URL and anon (publishable) key, then deploy again. See README.md.",
      ),
    ),
  );
}

function authView(message = "") {
  let mode = "signin";
  let email;
  let password;
  let err;
  let submit;
  let switcher;
  let heading;
  const paint = () => {
    heading.textContent =
      mode === "signin" ? "Sign in to the studio" : "Create the owner account";
    submit.textContent = mode === "signin" ? "Sign in" : "Create account";
    switcher.textContent =
      mode === "signin"
        ? "First time? Create the owner account"
        : "Have an account? Sign in";
    password.autocomplete =
      mode === "signin" ? "current-password" : "new-password";
  };
  app().replaceChildren(
    h(
      "div",
      { class: "auth" },
      h(
        "section",
        { class: "auth-art" },
        h("div", { class: "wordmark" }, "MARQUEE"),
        h(
          "div",
          {},
          h("h1", {}, "Every screen, from one desk."),
          h(
            "p",
            {},
            "Pair a tablet or PC with a six-letter code, build a run sheet of media, and watch each screen’s tally light from here.",
          ),
        ),
        h(
          "div",
          { class: "tallies" },
          h("span", {}, h("i", { class: "tally live" }), "ON AIR"),
          h("span", {}, h("i", { class: "tally stale" }), "NOT SEEN"),
          h("span", {}, h("i", { class: "tally" }), "OFFLINE"),
        ),
      ),
      h(
        "section",
        { class: "auth-form" },
        h(
          "form",
          {
            onsubmit: async (e) => {
              e.preventDefault();
              err.textContent = "";
              submit.disabled = true;
              const creds = {
                email: email.value.trim(),
                password: password.value,
              };
              const res =
                mode === "signin"
                  ? await sb.auth.signInWithPassword(creds)
                  : await sb.auth.signUp(creds);
              submit.disabled = false;
              if (res.error) {
                err.textContent = errorText(res.error);
                return;
              }
              if (mode === "signup" && !res.data.session) {
                err.style.color = "var(--ink-2)";
                err.textContent =
                  "Check your email for a confirmation link, then sign in.";
                mode = "signin";
                paint();
                return;
              }
              start();
            },
          },
          (heading = h("h2", {})),
          message ? h("p", { class: "error-text" }, message) : null,
          h(
            "label",
            { class: "field" },
            "Email",
            (email = h("input", {
              type: "email",
              required: true,
              autocomplete: "email",
              autofocus: true,
            })),
          ),
          h(
            "label",
            { class: "field" },
            "Password",
            (password = h("input", {
              type: "password",
              required: true,
              minlength: "8",
            })),
          ),
          (err = h("p", { class: "error-text", role: "alert" })),
          (submit = h("button", {
            class: "primary",
            type: "submit",
            style: { justifyContent: "center" },
          })),
          (switcher = h("button", {
            type: "button",
            class: "ghost",
            style: { justifyContent: "center" },
            onclick: () => {
              mode = mode === "signin" ? "signup" : "signin";
              err.textContent = "";
              paint();
            },
          })),
        ),
      ),
    ),
  );
  paint();
  email.focus();
}

function notAllowedView() {
  app().replaceChildren(
    h(
      "div",
      { class: "notice" },
      h("p", { class: "eyebrow" }, "One more step"),
      h("h2", {}, "This account is not on the studio allowlist"),
      h(
        "p",
        {},
        `You are signed in as ${user.email}. To let this account manage screens, run this in the Supabase SQL editor:`,
      ),
      h(
        "pre",
        {},
        `insert into public.admin_allowlist (email) values ('${user.email.toLowerCase().replace(/'/g, "''")}');`,
      ),
      h(
        "div",
        { class: "row" },
        h(
          "button",
          { class: "primary", onclick: () => start() },
          "I’ve done it — check again",
        ),
        h(
          "button",
          {
            class: "ghost",
            onclick: async () => {
              await sb.auth.signOut();
              location.reload();
            },
          },
          "Sign out",
        ),
      ),
    ),
  );
}

let channel = null;
let ticker = null;
async function start() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session || session.user.is_anonymous) {
    if (session?.user.is_anonymous) await sb.auth.signOut();
    authView();
    return;
  }
  user = session.user;
  const { data: admin, error } = await sb.rpc("is_admin");
  if (error) {
    setupNotice(
      `Could not check access: ${errorText(error)}. Did you run supabase/schema.sql?`,
    );
    return;
  }
  if (!admin) {
    notAllowedView();
    return;
  }
  try {
    await loadAll();
  } catch (err) {
    setupNotice(`Could not load data: ${errorText(err)}`);
    return;
  }
  render();

  // Live screen status: heartbeats and pairings arrive over realtime.
  if (channel) sb.removeChannel(channel);
  channel = sb
    .channel("studio-screens")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "screens" },
      (payload) => {
        if (payload.eventType === "DELETE")
          store.screens = store.screens.filter((s) => s.id !== payload.old.id);
        else {
          const i = store.screens.findIndex((s) => s.id === payload.new.id);
          if (i >= 0) store.screens[i] = payload.new;
          else store.screens.push(payload.new);
        }
        if (currentRoute() === "screens") softRender();
      },
    )
    .subscribe();
  clearInterval(ticker);
  // Refresh relative times and tallies; also re-read screens in case realtime is unavailable.
  ticker = setInterval(async () => {
    const { data } = await sb.from("screens").select("*").order("name");
    if (data) store.screens = data;
    if (currentRoute() === "screens" || currentRoute() === "playlists")
      softRender();
  }, 20_000);
}

window.addEventListener("hashchange", () => {
  if (user) render();
});

(function boot() {
  const problem = configProblem();
  if (problem) {
    setupNotice(problem);
    return;
  }
  sb = makeClient("marquee-studio-auth");
  start();
})();
