
-- Create a table to store user lighting preferences
create table if not exists public.user_lighting_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  settings jsonb not null,
  name text not null default 'Default Lighting',
  is_default boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies for security
alter table public.user_lighting_preferences enable row level security;

-- Users can read, insert, and update their own preferences
create policy "Users can read their own lighting preferences"
  on public.user_lighting_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own lighting preferences"
  on public.user_lighting_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own lighting preferences"
  on public.user_lighting_preferences for update
  using (auth.uid() = user_id);

create policy "Users can delete their own lighting preferences"
  on public.user_lighting_preferences for delete
  using (auth.uid() = user_id);

-- Add updated_at trigger
create trigger update_user_lighting_preferences_updated_at
  before update on public.user_lighting_preferences
  for each row
  execute function public.update_updated_at_column();

-- Add indexes for better performance
create index on public.user_lighting_preferences (user_id);
create index on public.user_lighting_preferences (is_default);
