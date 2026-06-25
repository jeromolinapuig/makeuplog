create extension if not exists pgcrypto;

create table if not exists public.makeuplog_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  group_name text not null check (group_name in ('makeup', 'skincare', 'hair', 'other')),
  created_at timestamptz not null default now()
);

create table if not exists public.makeuplog_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text not null,
  category_id uuid not null references public.makeuplog_categories(id) on delete restrict,
  category_name text not null,
  group_name text not null check (group_name in ('makeup', 'skincare', 'hair', 'other')),
  price numeric(10, 2),
  shade text,
  rating integer check (rating between 1 and 10),
  is_favorite boolean not null default false,
  is_shared boolean not null default false,
  main_image text,
  extra_images text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists makeuplog_categories_user_id_idx on public.makeuplog_categories(user_id);
create index if not exists makeuplog_products_user_id_idx on public.makeuplog_products(user_id);
create index if not exists makeuplog_products_category_id_idx on public.makeuplog_products(category_id);

alter table public.makeuplog_categories enable row level security;
alter table public.makeuplog_products enable row level security;

drop policy if exists "Users can read their MakeUpLog categories" on public.makeuplog_categories;
drop policy if exists "Users can insert their MakeUpLog categories" on public.makeuplog_categories;
drop policy if exists "Users can update their MakeUpLog categories" on public.makeuplog_categories;
drop policy if exists "Users can delete their MakeUpLog categories" on public.makeuplog_categories;

create policy "Users can read their MakeUpLog categories"
on public.makeuplog_categories for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their MakeUpLog categories"
on public.makeuplog_categories for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their MakeUpLog categories"
on public.makeuplog_categories for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their MakeUpLog categories"
on public.makeuplog_categories for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their MakeUpLog products" on public.makeuplog_products;
drop policy if exists "Users can insert their MakeUpLog products" on public.makeuplog_products;
drop policy if exists "Users can update their MakeUpLog products" on public.makeuplog_products;
drop policy if exists "Users can delete their MakeUpLog products" on public.makeuplog_products;

create policy "Users can read their MakeUpLog products"
on public.makeuplog_products for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their MakeUpLog products"
on public.makeuplog_products for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their MakeUpLog products"
on public.makeuplog_products for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their MakeUpLog products"
on public.makeuplog_products for delete
to authenticated
using (auth.uid() = user_id);
