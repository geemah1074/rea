// Browser stand-in for supabase-js used only by tests/e2e.test.js.
// Implements the subset of the client API that the studio and player call, backed by
// localStorage so the studio tab and the player tab share one "database".
// Access rules are NOT emulated here; tests/schema.test.js covers them on real Postgres.
(function () {
  const DB_KEY = "fake-supabase-db";
  const empty = () => ({
    seq: 1,
    users: [],
    tables: {
      screens: [],
      playlists: [],
      playlist_items: [],
      assets: [],
      pairings: [],
      commands: [],
    },
    files: {},
  });
  const load = () =>
    JSON.parse(localStorage.getItem(DB_KEY) || "null") || empty();
  const save = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));
  const uuid = () => crypto.randomUUID();
  const now = () => new Date().toISOString();
  const ok = (data) => Promise.resolve({ data, error: null });
  const fail = (message) => Promise.resolve({ data: null, error: { message } });

  function bump(db, playlistIds) {
    for (const s of db.tables.screens)
      if (playlistIds.includes(s.playlist_id)) s.content_version += 1;
  }

  class Query {
    constructor(client, table) {
      Object.assign(this, {
        client,
        table,
        filters: [],
        op: "select",
        orderBy: null,
        one: null,
        payload: null,
        wantRows: false,
        cols: "*",
      });
    }
    select(cols = "*") {
      if (this.op === "select") this.cols = cols;
      else this.wantRows = true;
      return this;
    }
    insert(rows) {
      this.op = "insert";
      this.payload = rows;
      return this;
    }
    update(patch) {
      this.op = "update";
      this.payload = patch;
      return this;
    }
    delete() {
      this.op = "delete";
      return this;
    }
    eq(c, v) {
      this.filters.push((r) => r[c] === v);
      return this;
    }
    is(c, v) {
      this.filters.push((r) => (r[c] ?? null) === v);
      return this;
    }
    gte(c, v) {
      this.filters.push((r) => r[c] >= v);
      return this;
    }
    order(c, o = {}) {
      this.orderBy = [c, o.ascending !== false];
      return this;
    }
    maybeSingle() {
      this.one = "maybe";
      return this;
    }
    single() {
      this.one = "single";
      return this;
    }
    then(res, rej) {
      return this.exec().then(res, rej);
    }
    exec() {
      const db = load();
      const t = db.tables[this.table];
      const uid = this.client.uid();
      const match = (r) => this.filters.every((f) => f(r));
      let out;
      if (this.op === "select") {
        out = t.filter(match).map((r) => ({ ...r }));
        if (
          this.table === "playlist_items" &&
          this.cols.includes("asset:assets")
        ) {
          out = out.map((r) => ({
            ...r,
            asset: db.tables.assets.find((a) => a.id === r.asset_id) || null,
          }));
        }
      } else if (this.op === "insert") {
        const rows = (
          Array.isArray(this.payload) ? this.payload : [this.payload]
        ).map((r) => {
          const row = {
            id: this.table === "commands" ? db.seq++ : uuid(),
            owner: uid,
            created_at: now(),
            ...r,
          };
          if (this.table === "assets") row.updated_at = now();
          if (this.table === "playlist_items") row.position = row.position ?? 0;
          if (this.table === "commands") row.acked_at = null;
          return row;
        });
        t.push(...rows);
        if (this.table === "playlist_items")
          bump(
            db,
            rows.map((r) => r.playlist_id),
          );
        out = rows;
      } else if (this.op === "update") {
        out = [];
        for (const r of t.filter(match)) {
          const before = { ...r };
          Object.assign(r, this.payload);
          if (this.table === "assets") {
            r.updated_at = now();
            bump(
              db,
              db.tables.playlist_items
                .filter((i) => i.asset_id === r.id)
                .map((i) => i.playlist_id),
            );
          }
          if (this.table === "playlist_items") bump(db, [r.playlist_id]);
          if (
            this.table === "screens" &&
            (before.playlist_id !== r.playlist_id ||
              before.rotation !== r.rotation ||
              before.fit !== r.fit)
          )
            r.content_version += 1;
          out.push(r);
        }
      } else {
        out = t.filter(match);
        db.tables[this.table] = t.filter((r) => !match(r));
        if (this.table === "playlists")
          db.tables.playlist_items = db.tables.playlist_items.filter(
            (i) => !out.some((p) => p.id === i.playlist_id),
          );
        if (this.table === "assets")
          db.tables.playlist_items = db.tables.playlist_items.filter(
            (i) => !out.some((a) => a.id === i.asset_id),
          );
        if (this.table === "playlist_items")
          bump(
            db,
            out.map((r) => r.playlist_id),
          );
      }
      save(db);
      if (this.orderBy) {
        const [c, asc] = this.orderBy;
        out.sort(
          (a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (asc ? 1 : -1),
        );
      }
      if (this.one) {
        if (out.length === 0)
          return this.one === "maybe" ? ok(null) : fail("no rows");
        return ok(out[0]);
      }
      return ok(this.op === "select" || this.wantRows ? out : null);
    }
  }

  function createClient(url, key, opts) {
    const storageKey = opts?.auth?.storageKey || "sb-auth";
    const session = () =>
      JSON.parse(localStorage.getItem(storageKey) || "null");
    const setSession = (s) =>
      s
        ? localStorage.setItem(storageKey, JSON.stringify(s))
        : localStorage.removeItem(storageKey);
    const client = {
      uid: () => session()?.user?.id || null,
      auth: {
        getSession: () => ok({ session: session() }),
        signInAnonymously: () => {
          const s = { user: { id: uuid(), is_anonymous: true } };
          setSession(s);
          return ok({ session: s, user: s.user });
        },
        signUp: ({ email }) => {
          const db = load();
          const u = { id: uuid(), email, is_anonymous: false };
          db.users.push(u);
          save(db);
          const s = { user: u };
          setSession(s);
          return ok({ session: s, user: u });
        },
        signInWithPassword: ({ email }) => {
          const u = load().users.find((x) => x.email === email);
          if (!u) return fail("Invalid login credentials");
          const s = { user: u };
          setSession(s);
          return ok({ session: s, user: u });
        },
        signOut: () => {
          setSession(null);
          return ok(null);
        },
      },
      from: (table) => new Query(client, table),
      rpc: (name, args = {}) => {
        const db = load();
        const uid = client.uid();
        const anon = session()?.user?.is_anonymous;
        switch (name) {
          case "is_admin":
            return ok(!!uid && !anon);
          case "device_start_pairing": {
            let p = db.tables.pairings.find((x) => x.device_uid === uid);
            if (!p) {
              p = {
                code: Math.random()
                  .toString(36)
                  .slice(2, 8)
                  .toUpperCase()
                  .replace(/[01OI]/g, "X"),
                device_uid: uid,
              };
              db.tables.pairings.push(p);
              save(db);
            }
            return ok(p.code);
          }
          case "claim_screen": {
            const code = String(args.p_code)
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, "");
            const p = db.tables.pairings.find((x) => x.code === code);
            if (!p)
              return fail(
                "That code is not valid or has expired. Check the code on the screen.",
              );
            const s = {
              id: uuid(),
              owner: uid,
              device_uid: p.device_uid,
              name: args.p_name || `Screen ${code}`,
              playlist_id: null,
              rotation: 0,
              fit: "contain",
              content_version: 1,
              last_seen: null,
              status: {},
              created_at: now(),
            };
            db.tables.screens.push(s);
            db.tables.pairings = db.tables.pairings.filter((x) => x !== p);
            save(db);
            return ok(s.id);
          }
          case "device_heartbeat": {
            const s = db.tables.screens.find((x) => x.device_uid === uid);
            if (s) {
              s.last_seen = now();
              s.status = args.p_status;
              save(db);
            }
            return ok(null);
          }
          case "device_ack_command": {
            const c = db.tables.commands.find((x) => x.id === args.p_id);
            if (c) {
              c.acked_at = now();
              save(db);
            }
            return ok(null);
          }
          default:
            return fail(`unknown rpc ${name}`);
        }
      },
      storage: {
        from: () => ({
          upload: async (path, file) => {
            const dataUrl = await new Promise((r) => {
              const fr = new FileReader();
              fr.onload = () => r(fr.result);
              fr.readAsDataURL(file);
            });
            const db = load();
            db.files[path] = dataUrl;
            save(db);
            return { data: { path }, error: null };
          },
          download: async (path) => {
            const d = load().files[path];
            if (!d)
              return { data: null, error: { message: "Object not found" } };
            return { data: await (await fetch(d)).blob(), error: null };
          },
          createSignedUrls: async (paths) => ({
            data: paths.map((p) => ({
              path: p,
              signedUrl: load().files[p] || null,
            })),
            error: null,
          }),
          remove: async (paths) => {
            const db = load();
            paths.forEach((p) => delete db.files[p]);
            save(db);
            return { data: null, error: null };
          },
        }),
      },
      // Realtime is reported as unavailable so the tests exercise the polling fallback.
      channel: () => {
        const ch = {
          on: () => ch,
          subscribe: (cb) => {
            setTimeout(() => cb && cb("CHANNEL_ERROR"), 10);
            return ch;
          },
        };
        return ch;
      },
      removeChannel: () => {},
    };
    return client;
  }

  window.supabase = { createClient };
})();
