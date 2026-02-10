-- Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  username text unique,
  email text unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Workers table (helmets registered by users)
create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  helmet_number text not null,
  worker_name text not null,
  age integer,
  gender text,
  health_condition text,
  worker_contact text,
  emergency_contact text,
  latitude double precision default 20.5937,
  longitude double precision default 78.9629,
  status text default 'safe' check (status in ('safe', 'danger')),
  danger_type text,
  created_at timestamptz default now()
);

alter table public.workers enable row level security;

create policy "workers_select_own" on public.workers for select using (auth.uid() = user_id);
create policy "workers_insert_own" on public.workers for insert with check (auth.uid() = user_id);
create policy "workers_update_own" on public.workers for update using (auth.uid() = user_id);
create policy "workers_delete_own" on public.workers for delete using (auth.uid() = user_id);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quantity integer not null default 1,
  total_price numeric(10,2) not null,
  delivery_address text,
  city text,
  state text,
  pincode text,
  payment_status text default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
  order_status text default 'processing' check (order_status in ('processing', 'shipped', 'delivered')),
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_update_own" on public.orders for update using (auth.uid() = user_id);
