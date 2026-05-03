-- ================================================================
-- Dutch Kicks — consolidated setup (run once in Supabase SQL Editor)
-- ================================================================

-- ── Inventory ────────────────────────────────────────────────────
create table if not exists inventory (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null check (category in ('kicks','skate','fight','comics')),
  status        text not null default 'available' check (status in ('available','sold','pending')),
  price         numeric(10,2),
  image_url     text,
  ref_image_url text,
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create index if not exists inventory_category_idx on inventory (category);
create index if not exists inventory_status_idx   on inventory (status);
create index if not exists inventory_metadata_idx on inventory using gin (metadata);

-- ── Show status (singleton — drives HUD LIVE NOW) ────────────────
create table if not exists show_status (
  id         int primary key default 1 check (id = 1),
  is_live    boolean not null default false,
  platform   text default 'whatnot',
  updated_at timestamptz not null default now()
);
insert into show_status (id, is_live) values (1, false) on conflict do nothing;

-- ── User roles ───────────────────────────────────────────────────
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('super_admin', 'director', 'operator', 'viewer');
  end if;
end $$;

create table if not exists user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- ── RLS ──────────────────────────────────────────────────────────
alter table inventory   enable row level security;
alter table show_status enable row level security;
alter table user_roles  enable row level security;

-- Drop stale policies so this script is re-runnable
drop policy if exists "public can read available inventory"    on inventory;
drop policy if exists "public read available"                  on inventory;
drop policy if exists "authenticated full access on inventory" on inventory;
drop policy if exists "staff read all"                         on inventory;
drop policy if exists "staff write"                            on inventory;
drop policy if exists "public can read show status"            on show_status;
drop policy if exists "authenticated can manage show status"   on show_status;
drop policy if exists "own role read"                          on user_roles;
drop policy if exists "super_admin full access"                on user_roles;

-- Inventory: public storefront sees available items
create policy "public read available"
  on inventory for select
  using (status = 'available');

-- Inventory: staff (op+) see and write everything
create policy "staff full access"
  on inventory for all
  using (
    exists (
      select 1 from user_roles r
      where r.user_id = auth.uid()
        and r.role in ('super_admin','director','operator')
    )
  )
  with check (
    exists (
      select 1 from user_roles r
      where r.user_id = auth.uid()
        and r.role in ('super_admin','director','operator')
    )
  );

-- Show status: public read, authenticated write
create policy "public read show status"
  on show_status for select using (true);

create policy "authenticated manage show status"
  on show_status for all
  to authenticated
  using (true)
  with check (true);

-- User roles: own row read; super_admin full access
create policy "own role read"
  on user_roles for select
  using (auth.uid() = user_id);

create policy "super_admin full access"
  on user_roles for all
  using (
    exists (
      select 1 from user_roles r
      where r.user_id = auth.uid() and r.role = 'super_admin'
    )
  );

-- ── Realtime (HUD live-dot subscription) ────────────────────────
alter publication supabase_realtime add table show_status;
