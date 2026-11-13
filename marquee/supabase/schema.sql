-- Marquee signage: Supabase schema
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor > New query > paste > Run).
-- Safe to re-run: every object is created idempotently.
--
-- Security model
--   * Admins sign in with email + password and must be listed in admin_allowlist.
--   * Each player device signs in anonymously and gets its own auth uid.
--     A device can only read the screen it is paired to, that screen's playlist,
--     the media in it, and commands addressed to it. It can only write through
--     the device_* functions below.
--   * No password or token ever travels in a URL.

-- ---------------------------------------------------------------- admins
create table if not exists public.admin_allowlist (
  email text primary key check (email = lower(email))
);
alter table public.admin_allowlist enable row level security;
-- No policies: only the SQL editor (service role) can read or change it.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
     and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
     and exists (
       select 1 from public.admin_allowlist a
       where a.email = lower(auth.jwt() ->> 'email')
     )
$$;

-- ---------------------------------------------------------------- content
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 200),
  kind text not null check (kind in ('image', 'video', 'web', 'text')),
  storage_path text,          -- image / video: "<owner uid>/<asset id>.<ext>" in bucket "media"
  url text,                   -- web: page shown in a frame
  body jsonb,                 -- text: {"title","message","background","foreground"}
  mime text,
  bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (kind in ('image', 'video') and storage_path is not null) or
    (kind = 'web' and url ~* '^https://') or
    (kind = 'text' and body is not null)
  )
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 120),
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_items (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  asset_id uuid not null references public.assets (id) on delete cascade,
  position integer not null default 0,
  duration_s integer not null default 10 check (duration_s between 0 and 86400), -- 0 = video plays to its end
  days smallint[] check (days <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]),       -- 0 = Sunday; null = every day
  start_time time,            -- daily window; may wrap past midnight
  end_time time,
  start_date date,
  end_date date
);
create index if not exists playlist_items_playlist_idx on public.playlist_items (playlist_id, position);

-- ---------------------------------------------------------------- screens
create table if not exists public.screens (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users (id) on delete cascade,
  device_uid uuid not null unique references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 80),
  playlist_id uuid references public.playlists (id) on delete set null,
  rotation smallint not null default 0 check (rotation in (0, 90, 180, 270)),
  fit text not null default 'contain' check (fit in ('contain', 'cover')),
  content_version bigint not null default 1,
  last_seen timestamptz,
  status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.pairings (
  code text primary key,
  device_uid uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.commands (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  screen_id uuid not null references public.screens (id) on delete cascade,
  command text not null check (command in ('reload', 'refresh', 'identify', 'clear_cache')),
  created_at timestamptz not null default now(),
  acked_at timestamptz
);
create index if not exists commands_screen_idx on public.commands (screen_id, created_at desc);

-- ---------------------------------------------------------------- device helpers
create or replace function public.my_screen_playlist() returns uuid
language sql stable security definer set search_path = public as $$
  select playlist_id from public.screens where device_uid = auth.uid()
$$;

create or replace function public.my_screen_owner() returns uuid
language sql stable security definer set search_path = public as $$
  select owner from public.screens where device_uid = auth.uid()
$$;

-- Ownership checks used inside policies. They run as definer so that policies on
-- different tables never evaluate each other (which Postgres rejects as recursion).
create or replace function public.owns_playlist(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.playlists where id = p_id and owner = auth.uid())
$$;

create or replace function public.owns_asset(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.assets where id = p_id and owner = auth.uid())
$$;

create or replace function public.asset_on_my_screen(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.playlist_items pi
    where pi.asset_id = p_id and pi.playlist_id = public.my_screen_playlist()
  )
$$;

-- ---------------------------------------------------------------- row level security
alter table public.assets enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_items enable row level security;
alter table public.screens enable row level security;
alter table public.pairings enable row level security;
alter table public.commands enable row level security;

drop policy if exists admin_all on public.assets;
create policy admin_all on public.assets for all
  using (owner = auth.uid() and public.is_admin())
  with check (owner = auth.uid() and public.is_admin());
drop policy if exists device_read on public.assets;
create policy device_read on public.assets for select
  using (public.asset_on_my_screen(id));

drop policy if exists admin_all on public.playlists;
create policy admin_all on public.playlists for all
  using (owner = auth.uid() and public.is_admin())
  with check (owner = auth.uid() and public.is_admin());
drop policy if exists device_read on public.playlists;
create policy device_read on public.playlists for select
  using (id = public.my_screen_playlist());

drop policy if exists admin_all on public.playlist_items;
create policy admin_all on public.playlist_items for all
  using (owner = auth.uid() and public.is_admin())
  with check (
    owner = auth.uid() and public.is_admin()
    and public.owns_playlist(playlist_id)
    and public.owns_asset(asset_id)
  );
drop policy if exists device_read on public.playlist_items;
create policy device_read on public.playlist_items for select
  using (playlist_id = public.my_screen_playlist());

-- Screens are created only by claim_screen(); admins may edit or delete their own.
drop policy if exists admin_select on public.screens;
create policy admin_select on public.screens for select
  using (owner = auth.uid() and public.is_admin());
drop policy if exists admin_update on public.screens;
create policy admin_update on public.screens for update
  using (owner = auth.uid() and public.is_admin())
  with check (
    owner = auth.uid() and public.is_admin()
    and (playlist_id is null or public.owns_playlist(playlist_id))
  );
drop policy if exists admin_delete on public.screens;
create policy admin_delete on public.screens for delete
  using (owner = auth.uid() and public.is_admin());
drop policy if exists device_read on public.screens;
create policy device_read on public.screens for select
  using (device_uid = auth.uid());

-- Table privileges: explicit and minimal, so this works whether or not the project
-- grants new tables to the API roles automatically. Row-level security still applies.
revoke all on public.admin_allowlist, public.assets, public.playlists, public.playlist_items,
  public.screens, public.pairings, public.commands from anon, authenticated;
grant select, insert, update, delete on public.assets, public.playlists, public.playlist_items to authenticated;
grant select, delete on public.screens to authenticated;
-- Only these columns are editable, so a screen can never be moved to another owner or device.
grant update (name, playlist_id, rotation, fit) on public.screens to authenticated;
grant select on public.pairings to authenticated;
grant select, insert on public.commands to authenticated;
grant usage on sequence public.commands_id_seq to authenticated;

drop policy if exists device_read on public.pairings;
create policy device_read on public.pairings for select
  using (device_uid = auth.uid());

drop policy if exists admin_insert on public.commands;
create policy admin_insert on public.commands for insert
  with check (
    owner = auth.uid() and public.is_admin()
    and exists (select 1 from public.screens s where s.id = screen_id and s.owner = auth.uid())
  );
drop policy if exists admin_select on public.commands;
create policy admin_select on public.commands for select
  using (owner = auth.uid() and public.is_admin());
drop policy if exists device_read on public.commands;
create policy device_read on public.commands for select
  using (exists (select 1 from public.screens s where s.id = screen_id and s.device_uid = auth.uid()));

-- ---------------------------------------------------------------- functions
-- Device: get (or create) a short pairing code shown on screen.
create or replace function public.device_start_pairing() returns text
language plpgsql volatile security definer set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no 0/O/1/I
  candidate text;
  existing text;
  rnd bytea;
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  select code into existing from public.pairings
   where device_uid = auth.uid() and created_at > now() - interval '30 minutes';
  if existing is not null then
    return existing;
  end if;
  delete from public.pairings where device_uid = auth.uid() or created_at < now() - interval '30 minutes';
  loop
    -- Bytes 0-5 of a v4 UUID are random; 256 is a multiple of 32, so each letter is uniform.
    rnd := uuid_send(gen_random_uuid());
    candidate := '';
    for i in 0..5 loop
      candidate := candidate || substr(alphabet, 1 + (get_byte(rnd, i) % 32), 1);
    end loop;
    begin
      insert into public.pairings (code, device_uid) values (candidate, auth.uid());
      return candidate;
    exception when unique_violation then
      -- code collision: try another
    end;
  end loop;
end
$$;

-- Admin: turn a pairing code into a screen they own.
create or replace function public.claim_screen(p_code text, p_name text) returns uuid
language plpgsql volatile security definer set search_path = public as $$
declare
  pairing public.pairings;
  existing public.screens;
  new_id uuid;
begin
  if not public.is_admin() then
    raise exception 'admin sign-in required' using errcode = '42501';
  end if;
  select * into pairing from public.pairings
   where code = upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'))
     and created_at > now() - interval '30 minutes';
  if pairing is null then
    raise exception 'That code is not valid or has expired. Check the code on the screen.' using errcode = 'P0002';
  end if;
  select * into existing from public.screens where device_uid = pairing.device_uid;
  if existing.id is not null then
    if existing.owner <> auth.uid() then
      raise exception 'This device belongs to another account.' using errcode = '42501';
    end if;
    update public.screens set name = coalesce(nullif(trim(p_name), ''), name) where id = existing.id;
    new_id := existing.id;
  else
    insert into public.screens (owner, device_uid, name)
    values (auth.uid(), pairing.device_uid, coalesce(nullif(trim(p_name), ''), 'Screen ' || pairing.code))
    returning id into new_id;
  end if;
  delete from public.pairings where code = pairing.code;
  return new_id;
end
$$;

-- Device: report health. Called about every 30 seconds.
create or replace function public.device_heartbeat(p_status jsonb) returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  if pg_column_size(p_status) > 8192 then
    raise exception 'status too large' using errcode = '22023';
  end if;
  update public.screens
     set last_seen = now(), status = coalesce(p_status, '{}'::jsonb)
   where device_uid = auth.uid();
end
$$;

-- Device: mark a command as handled.
create or replace function public.device_ack_command(p_id bigint) returns void
language sql volatile security definer set search_path = public as $$
  update public.commands c set acked_at = now()
   where c.id = p_id and c.acked_at is null
     and exists (select 1 from public.screens s where s.id = c.screen_id and s.device_uid = auth.uid())
$$;

revoke all on function public.device_start_pairing() from public, anon;
revoke all on function public.claim_screen(text, text) from public, anon;
revoke all on function public.device_heartbeat(jsonb) from public, anon;
revoke all on function public.device_ack_command(bigint) from public, anon;
grant execute on function public.device_start_pairing() to authenticated;
grant execute on function public.claim_screen(text, text) to authenticated;
grant execute on function public.device_heartbeat(jsonb) to authenticated;
grant execute on function public.device_ack_command(bigint) to authenticated;

-- ---------------------------------------------------------------- change signalling
-- Any content change bumps content_version on the affected screens, so a player
-- only needs to watch its own screen row to know when to reload.
create or replace function public.bump_screens_for_playlist(p_playlist uuid) returns void
language sql volatile security definer set search_path = public as $$
  update public.screens set content_version = content_version + 1 where playlist_id = p_playlist
$$;
revoke all on function public.bump_screens_for_playlist(uuid) from public, anon, authenticated;

create or replace function public.on_playlist_item_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then perform public.bump_screens_for_playlist(old.playlist_id); end if;
  if tg_op in ('INSERT', 'UPDATE') and (tg_op = 'INSERT' or new.playlist_id <> old.playlist_id) then
    perform public.bump_screens_for_playlist(new.playlist_id);
  end if;
  return null;
end
$$;
drop trigger if exists playlist_item_change on public.playlist_items;
create trigger playlist_item_change after insert or update or delete on public.playlist_items
  for each row execute function public.on_playlist_item_change();

create or replace function public.on_asset_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  update public.screens s set content_version = s.content_version + 1
   where s.playlist_id in (select pi.playlist_id from public.playlist_items pi where pi.asset_id = new.id);
  return new;
end
$$;
drop trigger if exists asset_change on public.assets;
create trigger asset_change before update on public.assets
  for each row execute function public.on_asset_change();

create or replace function public.on_screen_settings_change() returns trigger
language plpgsql as $$
begin
  if (new.playlist_id, new.rotation, new.fit) is distinct from (old.playlist_id, old.rotation, old.fit) then
    new.content_version := old.content_version + 1;
  end if;
  return new;
end
$$;
drop trigger if exists screen_settings_change on public.screens;
create trigger screen_settings_change before update on public.screens
  for each row execute function public.on_screen_settings_change();

-- ---------------------------------------------------------------- realtime
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables
                    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'screens') then
      alter publication supabase_realtime add table public.screens;
    end if;
    if not exists (select 1 from pg_publication_tables
                    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'commands') then
      alter publication supabase_realtime add table public.commands;
    end if;
  end if;
end
$$;

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

drop policy if exists "marquee admin media" on storage.objects;
create policy "marquee admin media" on storage.objects for all
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text and public.is_admin())
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text and public.is_admin());

drop policy if exists "marquee device media" on storage.objects;
create policy "marquee device media" on storage.objects for select
  using (bucket_id = 'media' and (storage.foldername(name))[1] = public.my_screen_owner()::text);
