create table if not exists invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  note text,
  status text not null default 'open' check (status in ('open', 'used', 'disabled')),
  created_at timestamptz not null default now(),
  used_at timestamptz,
  used_by uuid
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  display_name text,
  role text not null default 'customer' check (role in ('customer')),
  invite_code text references invite_codes(code),
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id) on delete set null,
  username text,
  role text not null,
  success boolean not null,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists app_users_last_login_idx on app_users(last_login_at desc);
create index if not exists invite_codes_status_idx on invite_codes(status);
create index if not exists login_events_created_idx on login_events(created_at desc);

alter table invite_codes enable row level security;
alter table app_users enable row level security;
alter table login_events enable row level security;

grant usage on schema public to service_role;
grant all privileges on table invite_codes to service_role;
grant all privileges on table app_users to service_role;
grant all privileges on table login_events to service_role;
