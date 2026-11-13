// Runs supabase/schema.sql on an in-process Postgres (PGlite) with small stand-ins
// for Supabase's auth and storage schemas, then checks the security model.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const schema = await readFile(
  new URL("../supabase/schema.sql", import.meta.url),
  "utf8",
);

const SUPABASE_STUBS = `
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key, email text, is_anonymous boolean default false);
create function auth.jwt() returns jsonb language sql stable as
  $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security; -- as on Supabase
create function storage.foldername(name text) returns text[] language sql immutable as
  $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
grant usage on schema public, auth, storage to anon, authenticated;
grant execute on all functions in schema auth to anon, authenticated;
`;

// Supabase grants these on its own storage schema; public-schema grants come from schema.sql.
const GRANTS = `
grant select, insert, update, delete on storage.objects to authenticated;
`;

const ADMIN = "00000000-0000-0000-0000-00000000000a";
const STRANGER = "00000000-0000-0000-0000-00000000000b";
const DEVICE = "00000000-0000-0000-0000-00000000000d";
const DEVICE2 = "00000000-0000-0000-0000-00000000000e";

async function setup() {
  const db = new PGlite();
  await db.exec(SUPABASE_STUBS);
  await db.exec(`insert into auth.users (id, email, is_anonymous) values
    ('${ADMIN}', 'owner@example.com', false),
    ('${STRANGER}', 'stranger@example.com', false),
    ('${DEVICE}', null, true),
    ('${DEVICE2}', null, true);`);
  await db.exec(schema);
  await db.exec(schema); // must be re-runnable
  await db.exec(GRANTS);
  await db.exec(
    `insert into public.admin_allowlist values ('owner@example.com');`,
  );
  return db;
}

async function as(db, who, fn) {
  const claims = {
    [ADMIN]: {
      sub: ADMIN,
      email: "owner@example.com",
      is_anonymous: false,
      role: "authenticated",
    },
    [STRANGER]: {
      sub: STRANGER,
      email: "stranger@example.com",
      is_anonymous: false,
      role: "authenticated",
    },
    [DEVICE]: { sub: DEVICE, is_anonymous: true, role: "authenticated" },
    [DEVICE2]: { sub: DEVICE2, is_anonymous: true, role: "authenticated" },
  }[who];
  return db.transaction(async (tx) => {
    await tx.query(`select set_config('request.jwt.claims', $1, true)`, [
      JSON.stringify(claims),
    ]);
    await tx.exec("set local role authenticated");
    return fn(tx);
  });
}

const rows = async (tx, sql, params) => (await tx.query(sql, params)).rows;

test("pairing, content, heartbeat and commands follow the security model", async () => {
  const db = await setup();

  const code = await as(
    db,
    DEVICE,
    async (tx) =>
      (await rows(tx, "select public.device_start_pairing() as c"))[0].c,
  );
  assert.match(code, /^[A-HJ-NP-Z2-9]{6}$/);
  const again = await as(
    db,
    DEVICE,
    async (tx) =>
      (await rows(tx, "select public.device_start_pairing() as c"))[0].c,
  );
  assert.equal(again, code, "a device keeps its code while it is valid");

  await assert.rejects(
    as(db, STRANGER, (tx) =>
      tx.query("select public.claim_screen($1, $2)", [code, "x"]),
    ),
    /admin sign-in required/,
    "accounts outside the allowlist cannot claim screens",
  );
  await assert.rejects(
    as(db, DEVICE2, (tx) =>
      tx.query("select public.claim_screen($1, $2)", [code, "x"]),
    ),
    /admin sign-in required/,
    "anonymous devices cannot claim screens",
  );
  await assert.rejects(
    as(db, ADMIN, (tx) =>
      tx.query("select public.claim_screen($1, $2)", ["ZZZZZZ", "x"]),
    ),
    /not valid or has expired/,
  );

  const screenId = await as(
    db,
    ADMIN,
    async (tx) =>
      (
        await rows(tx, "select public.claim_screen($1, $2) as id", [
          ` ${code.toLowerCase().slice(0, 3)}-${code.slice(3)} `,
          "Front window",
        ])
      )[0].id,
  );
  assert.ok(screenId);

  const content = await as(db, ADMIN, async (tx) => {
    const [a] = await rows(
      tx,
      `insert into public.assets (name, kind, storage_path) values ('Menu', 'image', $1) returning id`,
      [`${ADMIN}/m.png`],
    );
    const [b] = await rows(
      tx,
      `insert into public.assets (name, kind, body) values ('Hello', 'text', '{"title":"Hi"}') returning id`,
    );
    const [p] = await rows(
      tx,
      `insert into public.playlists (name) values ('Daytime') returning id`,
    );
    const [other] = await rows(
      tx,
      `insert into public.playlists (name) values ('Unused') returning id`,
    );
    await tx.query(
      `insert into public.playlist_items (playlist_id, asset_id, position) values ($1, $2, 0), ($1, $3, 1)`,
      [p.id, a.id, b.id],
    );
    await tx.query(`update public.screens set playlist_id = $1 where id = $2`, [
      p.id,
      screenId,
    ]);
    return { asset: a.id, text: b.id, playlist: p.id, other: other.id };
  });

  const v1 = await as(db, DEVICE, async (tx) => {
    const s = await rows(
      tx,
      "select id, name, playlist_id, content_version from public.screens",
    );
    assert.equal(s.length, 1);
    assert.equal(s[0].name, "Front window");
    assert.equal(s[0].playlist_id, content.playlist);
    assert.equal(
      (await rows(tx, "select id from public.playlists")).length,
      1,
      "device sees only its playlist",
    );
    assert.equal(
      (await rows(tx, "select id from public.playlist_items")).length,
      2,
    );
    assert.equal((await rows(tx, "select id from public.assets")).length, 2);
    return Number(s[0].content_version);
  });

  await as(db, ADMIN, (tx) =>
    tx.query(
      `update public.playlist_items set duration_s = 20 where asset_id = $1`,
      [content.asset],
    ),
  );
  const v2 = await as(db, DEVICE, async (tx) =>
    Number(
      (await rows(tx, "select content_version from public.screens"))[0]
        .content_version,
    ),
  );
  assert.ok(
    v2 > v1,
    "editing a playlist item bumps the screen content version",
  );
  await as(db, ADMIN, (tx) =>
    tx.query(
      `update public.assets set body = '{"title":"Hey"}' where id = $1`,
      [content.text],
    ),
  );
  const v3 = await as(db, DEVICE, async (tx) =>
    Number(
      (await rows(tx, "select content_version from public.screens"))[0]
        .content_version,
    ),
  );
  assert.ok(v3 > v2, "editing an asset bumps the screen content version");

  // Devices cannot write content or reassign themselves.
  await as(db, DEVICE, async (tx) => {
    const r = await tx.query(`update public.assets set name = 'hacked'`);
    assert.equal(r.affectedRows, 0);
  });
  await assert.rejects(
    as(db, DEVICE, (tx) =>
      tx.query(`update public.screens set owner = $1`, [DEVICE]),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, ADMIN, (tx) =>
      tx.query(`update public.screens set device_uid = $1`, [DEVICE2]),
    ),
    /permission denied/,
    "admins cannot re-point a screen at another device",
  );

  // Other devices and other accounts see nothing.
  await as(db, DEVICE2, async (tx) => {
    for (const t of [
      "screens",
      "playlists",
      "playlist_items",
      "assets",
      "commands",
    ]) {
      assert.equal(
        (await rows(tx, `select 1 from public.${t}`)).length,
        0,
        `unpaired device reads no ${t}`,
      );
    }
  });
  await as(db, STRANGER, async (tx) => {
    for (const t of ["screens", "playlists", "assets"]) {
      assert.equal(
        (await rows(tx, `select 1 from public.${t}`)).length,
        0,
        `stranger reads no ${t}`,
      );
    }
  });

  // Heartbeat.
  await as(db, DEVICE, (tx) =>
    tx.query(`select public.device_heartbeat('{"app":"1.0.0"}')`),
  );
  await as(db, ADMIN, async (tx) => {
    const [s] = await rows(tx, "select last_seen, status from public.screens");
    assert.ok(s.last_seen);
    assert.equal(s.status.app, "1.0.0");
  });
  await assert.rejects(
    as(db, DEVICE, (tx) =>
      tx.query(`select public.device_heartbeat($1)`, [
        JSON.stringify({ pad: "x".repeat(9000) }),
      ]),
    ),
    /status too large/,
  );

  // Commands.
  const cmdId = await as(
    db,
    ADMIN,
    async (tx) =>
      (
        await rows(
          tx,
          `insert into public.commands (screen_id, command) values ($1, 'identify') returning id`,
          [screenId],
        )
      )[0].id,
  );
  await assert.rejects(
    as(db, STRANGER, (tx) =>
      tx.query(
        `insert into public.commands (screen_id, command) values ($1, 'reload')`,
        [screenId],
      ),
    ),
    /row-level security/,
  );
  await as(db, DEVICE2, (tx) =>
    tx.query("select public.device_ack_command($1)", [cmdId]),
  );
  await as(db, DEVICE, async (tx) => {
    const [c] = await rows(
      tx,
      "select acked_at from public.commands where id = $1",
      [cmdId],
    );
    assert.equal(
      c.acked_at,
      null,
      "another device cannot ack this screen's command",
    );
    await tx.query("select public.device_ack_command($1)", [cmdId]);
    const [c2] = await rows(
      tx,
      "select acked_at from public.commands where id = $1",
      [cmdId],
    );
    assert.ok(c2.acked_at);
  });

  // Storage: device reads its owner's media folder only; cannot write.
  await db.exec(
    `insert into storage.objects (bucket_id, name) values ('media', '${ADMIN}/m.png'), ('media', '${STRANGER}/x.png')`,
  );
  await as(db, DEVICE, async (tx) => {
    const r = await rows(tx, `select name from storage.objects`);
    assert.deepEqual(
      r.map((x) => x.name),
      [`${ADMIN}/m.png`],
    );
    await assert.rejects(
      tx.query(
        `insert into storage.objects (bucket_id, name) values ('media', '${ADMIN}/evil.png')`,
      ),
      /row-level security/,
    );
  });
  await as(db, ADMIN, async (tx) => {
    await tx.query(
      `insert into storage.objects (bucket_id, name) values ('media', '${ADMIN}/new.png')`,
    );
    await assert.rejects(
      tx.query(
        `insert into storage.objects (bucket_id, name) values ('media', '${STRANGER}/new.png')`,
      ),
      /row-level security/,
    );
  });

  // Re-pairing the same device keeps one screen; another account cannot steal it.
  const code2 = await as(
    db,
    DEVICE,
    async (tx) =>
      (await rows(tx, "select public.device_start_pairing() as c"))[0].c,
  );
  await db.exec(
    `insert into public.admin_allowlist values ('stranger@example.com')`,
  );
  await assert.rejects(
    as(db, STRANGER, (tx) =>
      tx.query("select public.claim_screen($1, $2)", [code2, "mine now"]),
    ),
    /belongs to another account/,
  );
  const same = await as(
    db,
    ADMIN,
    async (tx) =>
      (
        await rows(tx, "select public.claim_screen($1, $2) as id", [
          code2,
          "Front window 2",
        ])
      )[0].id,
  );
  assert.equal(same, screenId);

  await db.close();
});
