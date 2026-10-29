-- EPHA Creative database access policies.
-- Replace every YOUR_ADMIN_USER_UUID with the admin user's UUID from
-- Supabase Authentication > Users. Run this script in Supabase SQL Editor.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  project_name text not null,
  feedback text not null,
  rating integer not null check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
alter table public.testimonials enable row level security;

-- Remove the policies created by the earlier setup script and any prior
-- version of this script so it can be safely re-run.
drop policy if exists "Anyone can view published projects" on public.projects;
drop policy if exists "Admin can manage projects" on public.projects;
drop policy if exists "Admin can insert projects" on public.projects;
drop policy if exists "Admin can update projects" on public.projects;
drop policy if exists "Admin can delete projects" on public.projects;
drop policy if exists "Public can read published projects" on public.projects;
drop policy if exists "Visitors can submit contact messages" on public.contact_messages;
drop policy if exists "Admin can read contact messages" on public.contact_messages;
drop policy if exists "Public can read approved testimonials" on public.testimonials;
drop policy if exists "Public can submit testimonials" on public.testimonials;
drop policy if exists "Admin can manage testimonials" on public.testimonials;

revoke all on table public.projects from anon, authenticated;
revoke all on table public.contact_messages from anon, authenticated;
revoke all on table public.testimonials from anon, authenticated;

grant select on table public.projects to anon, authenticated;
grant insert, update, delete on table public.projects to authenticated;

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (published = true);

create policy "Admin can manage projects"
on public.projects
for all
to authenticated
using ((select auth.uid()) = 'ead4a6b3-9216-464b-b5e6-6861d9fbde1d'::uuid)
with check ((select auth.uid()) = 'ead4a6b3-9216-464b-b5e6-6861d9fbde1d'::uuid);

grant insert on table public.contact_messages to anon, authenticated;
grant select on table public.contact_messages to authenticated;

create policy "Visitors can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 1 and 100
  and char_length(trim(email)) between 3 and 254
  and char_length(trim(message)) between 1 and 5000
);

create policy "Admin can read contact messages"
on public.contact_messages
for select
to authenticated
using ((select auth.uid()) = 'ead4a6b3-9216-464b-b5e6-6861d9fbde1d'::uuid);

grant select, insert on table public.testimonials to anon, authenticated;
grant update, delete on table public.testimonials to authenticated;

create policy "Public can read approved testimonials"
on public.testimonials
for select
to anon, authenticated
using (approved = true);

create policy "Public can submit testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (
  char_length(trim(client_name)) between 1 and 100
  and char_length(trim(project_name)) between 1 and 150
  and char_length(trim(feedback)) between 10 and 2000
  and rating between 1 and 5
  and approved = false
);

create policy "Admin can manage testimonials"
on public.testimonials
for all
to authenticated
using ((select auth.uid()) = 'ead4a6b3-9216-464b-b5e6-6861d9fbde1d'::uuid)
with check ((select auth.uid()) = 'ead4a6b3-9216-464b-b5e6-6861d9fbde1d'::uuid);

-- The sample projects in the original setup defaulted to unpublished.
-- Publish them so they appear on the public portfolio.
update public.projects
set published = true
where title in (
  'YouTube Thumbnail',
  'Social Media Post',
  'Worship Poster',
  'Motivation Poster',
  'Hope of the Kingdom',
  'Poster Design 2'
);
