create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  credits integer not null default 5,
  created_at timestamptz not null default now()
);

create table if not exists public.generated_songs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  prompt text not null,
  style text,
  mood text,
  duration integer,
  voice text,
  audio_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.generated_songs enable row level security;
alter table public.subscriptions enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can view own songs"
on public.generated_songs
for select
using (auth.uid() = user_id);

create policy "Users can insert own songs"
on public.generated_songs
for insert
with check (auth.uid() = user_id);

create policy "Users can view own subscriptions"
on public.subscriptions
for select
using (auth.uid() = user_id);
