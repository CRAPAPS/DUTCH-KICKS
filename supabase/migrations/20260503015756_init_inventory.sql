-- Dutch Kicks: core inventory schema

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

-- Live show status for the Whatnot HUD indicator (singleton row)
create table if not exists show_status (
  id         int primary key default 1 check (id = 1),
  is_live    boolean not null default false,
  platform   text default 'whatnot',
  updated_at timestamptz not null default now()
);
insert into show_status (id, is_live) values (1, false) on conflict do nothing;

-- Indexes
create index on inventory (category);
create index on inventory (status);
create index on inventory using gin (metadata);

-- Enable RLS
alter table inventory enable row level security;
alter table show_status enable row level security;

-- Public read: storefront is publicly accessible
create policy "public can read available inventory"
  on inventory for select
  using (status = 'available');

create policy "public can read show status"
  on show_status for select
  using (true);

-- Authenticated (admin) full access
create policy "authenticated full access on inventory"
  on inventory for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage show status"
  on show_status for all
  to authenticated
  using (true)
  with check (true);

-- Realtime for the HUD LIVE NOW indicator
alter publication supabase_realtime add table show_status;
