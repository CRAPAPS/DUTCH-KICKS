-- ── Inventory ──────────────────────────────────────────────
create table if not exists inventory (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null check (category in ('kicks','skate','fight','comics')),
  status        text not null default 'available' check (status in ('available','sold','pending')),
  price         numeric(10,2),
  image_url     text,
  ref_image_url text,
  metadata      jsonb not null default '{}',
  created_at    timestamptz default now()
);

-- ── Show status (drives LIVE NOW indicator) ─────────────────
create table if not exists show_status (
  id        serial primary key,
  is_live   boolean not null default false,
  updated_at timestamptz default now()
);

insert into show_status (is_live) values (false)
  on conflict do nothing;

-- ── User roles ──────────────────────────────────────────────
create type user_role as enum ('super_admin', 'director', 'operator', 'viewer');

create table if not exists user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       user_role not null default 'viewer',
  created_at timestamptz default now(),
  unique(user_id)
);

-- RLS: users can read their own role; only super_admin can write
alter table user_roles enable row level security;

create policy "own role read"
  on user_roles for select
  using (auth.uid() = user_id);

create policy "super_admin full access"
  on user_roles for all
  using (
    exists (
      select 1 from user_roles r
      where r.user_id = auth.uid()
        and r.role = 'super_admin'
    )
  );

-- ── RLS for inventory ───────────────────────────────────────
alter table inventory enable row level security;

-- anyone can read available inventory
create policy "public read available"
  on inventory for select
  using (status = 'available');

-- director + super_admin can read all
create policy "staff read all"
  on inventory for select
  using (
    exists (
      select 1 from user_roles r
      where r.user_id = auth.uid()
        and r.role in ('super_admin', 'director', 'operator')
    )
  );

-- operator + above can insert/update
create policy "staff write"
  on inventory for all
  using (
    exists (
      select 1 from user_roles r
      where r.user_id = auth.uid()
        and r.role in ('super_admin', 'director', 'operator')
    )
  );
