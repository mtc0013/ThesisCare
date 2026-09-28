-- ════════════════════════════════════════════════════════════════════
--  ThesisCare — database schema, security policies and storage
--  Run once in Supabase: Dashboard → SQL Editor → paste → Run.
--  Safe to re-run (uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS).
-- ════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Users & roles ───────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  role        text not null default 'client' check (role in ('admin', 'consultant', 'client')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz
);

-- Every new sign-up becomes a CLIENT. Promote staff manually:
--   update public.profiles set role = 'admin' where email = 'you@yourdomain.in';
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'client')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.app_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.app_role() in ('admin', 'consultant'), false)
$$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.app_role() = 'admin', false)
$$;
create or replace function public.auth_email() returns text
language sql stable as $$ select lower(coalesce(auth.jwt()->>'email', '')) $$;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ── CMS content (published rows are public) ─────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, summary text, body jsonb default '{}'::jsonb,
  seo_title text, meta_description text, og_title text, og_description text, canonical_url text, schema_markup jsonb,
  position int default 0, published boolean default true,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.consultants (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null, role_title text, photo_url text, qualification text, specialization text,
  research_interests text, experience text, orcid_url text, scholar_url text, linkedin_url text,
  is_sample boolean default false, published boolean default false, position int default 0,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null, designation text, course text, institution text, service text,
  testimonial text not null, photo_url text,
  consent_to_publish boolean not null default false, consent_recorded_at timestamptz,
  published boolean not null default false,
  created_at timestamptz default now(), updated_at timestamptz,
  constraint publish_requires_consent check (not published or consent_to_publish)
);
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null, category text, tags text[] default '{}',
  position int default 0, published boolean default true,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, excerpt text, body text, category text,
  author text, author_credentials text, featured_image text, reading_time int,
  seo_title text, meta_description text, og_title text, og_description text, canonical_url text,
  published boolean default false, published_at timestamptz,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.research_areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, description text, has_page boolean default false,
  seo_title text, meta_description text, position int default 0, published boolean default true,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, city text not null, state text, intro text, office_address text,
  meeting_options text, notes text[] default '{}',
  seo_title text, meta_description text, published boolean default false,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- ── Enquiries & CRM ─────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz,
  full_name       text not null check (char_length(full_name) between 2 and 120),
  phone           text not null check (char_length(phone) between 8 and 20),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and char_length(email) <= 160),
  user_type       text, specialty text, institution text, city text,
  research_stage  text, service text, timeline text,
  message         text check (char_length(message) <= 3000),
  attachments     jsonb not null default '[]'::jsonb,
  source          text, request_type text default 'consultation',
  consent         boolean not null default false check (consent),
  status          text not null default 'New' check (status in ('New','Contacted','Consultation Scheduled','Proposal Sent','In Progress','Completed','Closed','Not Interested')),
  assigned_to     uuid references public.profiles(id) on delete set null,
  follow_up_date  date,
  notes           text,
  activity        jsonb not null default '[]'::jsonb,
  meta            jsonb not null default '{}'::jsonb
);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_idx on public.leads (created_at desc);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  full_name text not null, email text, phone text, institution text, specialty text,
  created_at timestamptz default now(), updated_at timestamptz
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(), updated_at timestamptz,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 160),
  phone text, subject text,
  message text not null check (char_length(message) <= 3000),
  status text not null default 'New' check (status in ('New','Replied','Closed')),
  staff_notes text, meta jsonb default '{}'::jsonb
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(), updated_at timestamptz,
  name text not null, email text not null, phone text not null,
  consultation_type text not null, preferred_date date not null, preferred_time text not null,
  mode text, notes text check (char_length(notes) <= 2000),
  status text not null default 'Requested' check (status in ('Requested','Confirmed','Completed','Cancelled','No-show')),
  staff_notes text, lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null, meta jsonb default '{}'::jsonb
);

create table if not exists public.resource_downloads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null, email text not null, phone text, role text, resource text not null,
  meta jsonb default '{}'::jsonb
);

-- ── Projects ────────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(), updated_at timestamptz,
  title text not null,
  lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  client_name text, client_email text,            -- client portal access is matched on this email
  consultant_id uuid references public.profiles(id) on delete set null,
  service text,
  status text not null default 'Planning' check (status in ('Planning','In Progress','On Hold','Completed','Cancelled')),
  due_date date, notes text
);
create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null, position int default 0, due_date date,
  done boolean not null default false, done_at timestamptz,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.project_milestones(id) on delete set null,
  title text not null, assigned_to uuid references public.profiles(id) on delete set null,
  due_date date, status text default 'Open' check (status in ('Open','In Progress','Done')),
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  name text not null, path text not null, size bigint, kind text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0), currency text default 'INR',
  status text not null default 'Pending' check (status in ('Pending','Paid','Refunded')),
  description text, invoice_number text, paid_at timestamptz,
  created_at timestamptz default now(), updated_at timestamptz
);
create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_role text, kind text default 'Message' check (kind in ('Message','Revision request')),
  body text not null check (char_length(body) <= 3000),
  created_at timestamptz default now()
);

-- updated_at triggers
do $$ declare t text; begin
  foreach t in array array['profiles','services','consultants','testimonials','faqs','blog_posts','research_areas','locations','leads','clients','contact_messages','appointments','projects','project_milestones','tasks','documents','payments'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s; create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- Public submissions can never set CRM fields (status, assignment, notes…).
create or replace function public.sanitize_public_lead() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then
    new.status := 'New'; new.assigned_to := null; new.follow_up_date := null; new.notes := null;
    new.activity := '[]'::jsonb; new.created_at := now();
    if jsonb_array_length(coalesce(new.attachments, '[]'::jsonb)) > 5 then raise exception 'Too many attachments'; end if;
  end if;
  return new;
end $$;
drop trigger if exists sanitize_lead on public.leads;
create trigger sanitize_lead before insert on public.leads for each row execute function public.sanitize_public_lead();

create or replace function public.sanitize_public_row() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then
    new.created_at := now();
    if tg_table_name = 'contact_messages' then new.status := 'New'; new.staff_notes := null; end if;
    if tg_table_name = 'appointments' then new.status := 'Requested'; new.staff_notes := null; end if;
  end if;
  return new;
end $$;
drop trigger if exists sanitize_msg on public.contact_messages;
create trigger sanitize_msg before insert on public.contact_messages for each row execute function public.sanitize_public_row();
drop trigger if exists sanitize_appt on public.appointments;
create trigger sanitize_appt before insert on public.appointments for each row execute function public.sanitize_public_row();

-- Stop non-admins from changing their own role.
create or replace function public.protect_role() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then raise exception 'Only admins can change roles'; end if;
  return new;
end $$;
drop trigger if exists protect_role on public.profiles;
create trigger protect_role before update on public.profiles for each row execute function public.protect_role();

create or replace function public.can_access_project(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects p where p.id = pid and (
      public.is_admin() or p.consultant_id = auth.uid()
      or (public.app_role() = 'client' and lower(p.client_email) = public.auth_email())
    )
  )
$$;

-- ── Row Level Security ──────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.services            enable row level security;
alter table public.consultants         enable row level security;
alter table public.testimonials        enable row level security;
alter table public.faqs                enable row level security;
alter table public.blog_posts          enable row level security;
alter table public.research_areas      enable row level security;
alter table public.locations           enable row level security;
alter table public.site_settings       enable row level security;
alter table public.leads               enable row level security;
alter table public.clients             enable row level security;
alter table public.contact_messages    enable row level security;
alter table public.appointments        enable row level security;
alter table public.resource_downloads  enable row level security;
alter table public.projects            enable row level security;
alter table public.project_milestones  enable row level security;
alter table public.tasks               enable row level security;
alter table public.documents           enable row level security;
alter table public.payments            enable row level security;
alter table public.project_messages    enable row level security;

-- profiles
drop policy if exists "profiles: self or staff read" on public.profiles;
create policy "profiles: self or staff read" on public.profiles for select using (id = auth.uid() or public.is_staff());
drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update" on public.profiles for update using (id = auth.uid() or public.is_admin());

-- public CMS content
do $$ declare t text; begin
  foreach t in array array['services','consultants','testimonials','faqs','blog_posts','research_areas','locations'] loop
    execute format('drop policy if exists "%1$s: public read" on public.%1$s; create policy "%1$s: public read" on public.%1$s for select using (published or public.is_staff());', t);
    execute format('drop policy if exists "%1$s: admin write" on public.%1$s; create policy "%1$s: admin write" on public.%1$s for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;
drop policy if exists "settings: public read" on public.site_settings;
create policy "settings: public read" on public.site_settings for select using (true);
drop policy if exists "settings: admin write" on public.site_settings;
create policy "settings: admin write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- public form submissions: anyone may INSERT, only staff may read
do $$ declare t text; begin
  foreach t in array array['leads','contact_messages','appointments','resource_downloads'] loop
    execute format('drop policy if exists "%1$s: public insert" on public.%1$s; create policy "%1$s: public insert" on public.%1$s for insert to anon, authenticated with check (true);', t);
    execute format('drop policy if exists "%1$s: admin delete" on public.%1$s; create policy "%1$s: admin delete" on public.%1$s for delete using (public.is_admin());', t);
  end loop;
end $$;
-- leads: admins see all; consultants see leads assigned to them or unassigned
drop policy if exists "leads: staff read" on public.leads;
create policy "leads: staff read" on public.leads for select using (public.is_admin() or (public.is_staff() and (assigned_to = auth.uid() or assigned_to is null)));
drop policy if exists "leads: staff update" on public.leads;
create policy "leads: staff update" on public.leads for update using (public.is_admin() or (public.is_staff() and (assigned_to = auth.uid() or assigned_to is null)));
-- messages, downloads: staff
drop policy if exists "contact_messages: staff" on public.contact_messages;
create policy "contact_messages: staff" on public.contact_messages for select using (public.is_staff());
drop policy if exists "contact_messages: staff update" on public.contact_messages;
create policy "contact_messages: staff update" on public.contact_messages for update using (public.is_staff());
drop policy if exists "resource_downloads: staff" on public.resource_downloads;
create policy "resource_downloads: staff" on public.resource_downloads for select using (public.is_staff());
-- appointments: staff, or the client who booked with the same email
drop policy if exists "appointments: read" on public.appointments;
create policy "appointments: read" on public.appointments for select using (public.is_staff() or (auth.uid() is not null and lower(email) = public.auth_email()));
drop policy if exists "appointments: staff update" on public.appointments;
create policy "appointments: staff update" on public.appointments for update using (public.is_staff());

-- clients
drop policy if exists "clients: staff" on public.clients;
create policy "clients: staff" on public.clients for all using (public.is_staff()) with check (public.is_staff());

-- projects & children
drop policy if exists "projects: read" on public.projects;
create policy "projects: read" on public.projects for select using (public.can_access_project(id));
drop policy if exists "projects: staff write" on public.projects;
create policy "projects: staff write" on public.projects for insert with check (public.is_staff());
drop policy if exists "projects: staff update" on public.projects;
create policy "projects: staff update" on public.projects for update using (public.is_admin() or consultant_id = auth.uid());
drop policy if exists "projects: admin delete" on public.projects;
create policy "projects: admin delete" on public.projects for delete using (public.is_admin());

do $$ declare t text; begin
  foreach t in array array['project_milestones','tasks','payments'] loop
    execute format('drop policy if exists "%1$s: read" on public.%1$s; create policy "%1$s: read" on public.%1$s for select using (public.can_access_project(project_id));', t);
    execute format('drop policy if exists "%1$s: staff write" on public.%1$s; create policy "%1$s: staff write" on public.%1$s for all using (public.is_staff() and public.can_access_project(project_id)) with check (public.is_staff() and public.can_access_project(project_id));', t);
  end loop;
end $$;
drop policy if exists "documents: read" on public.documents;
create policy "documents: read" on public.documents for select using ((project_id is not null and public.can_access_project(project_id)) or (lead_id is not null and public.is_staff()));
drop policy if exists "documents: insert" on public.documents;
create policy "documents: insert" on public.documents for insert with check (project_id is not null and public.can_access_project(project_id) and uploaded_by = auth.uid());
drop policy if exists "documents: staff manage" on public.documents;
create policy "documents: staff manage" on public.documents for delete using (public.is_admin());
drop policy if exists "project_messages: read" on public.project_messages;
create policy "project_messages: read" on public.project_messages for select using (public.can_access_project(project_id));
drop policy if exists "project_messages: insert" on public.project_messages;
create policy "project_messages: insert" on public.project_messages for insert with check (public.can_access_project(project_id) and author_id = auth.uid());

-- ── Private file storage ────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('research-files', 'research-files', false, 10485760, array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can upload into enquiries/ (write-only; they cannot list or read files back).
drop policy if exists "files: enquiry upload" on storage.objects;
create policy "files: enquiry upload" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'research-files' and (storage.foldername(name))[1] = 'enquiries');
-- Project files: staff and the project's client.
drop policy if exists "files: project upload" on storage.objects;
create policy "files: project upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'research-files' and (storage.foldername(name))[1] = 'projects'
              and public.can_access_project(((storage.foldername(name))[2])::uuid));
drop policy if exists "files: read" on storage.objects;
create policy "files: read" on storage.objects for select to authenticated using (
  bucket_id = 'research-files' and (
    public.is_staff()
    or ((storage.foldername(name))[1] = 'projects' and public.can_access_project(((storage.foldername(name))[2])::uuid))
  ));
drop policy if exists "files: admin delete" on storage.objects;
create policy "files: admin delete" on storage.objects for delete to authenticated using (bucket_id = 'research-files' and public.is_admin());
