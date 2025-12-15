-- Hardened Supabase SQL Schema (snake_case, pgcrypto, triggers, and RLS)
-- Run this in your Supabase SQL editor (project-level SQL)

-- Enable required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Helper function to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- BLOG POSTS
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  content text not null,
  slug varchar(255) not null unique,
  image_id varchar(255) default 'blog-community-gardens',
  author varchar(255),
  author_id varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();


-- NEWS
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  summary text not null,
  source varchar(255) not null,
  link varchar(1024) not null,
  image_id varchar(255) not null,
  published_date date not null,
  category varchar(100) not null check (
    category in ('Climate Action', 'Global Health', 'Education', 'Economic Growth', 'Peace and Justice', 'Sustainability')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();


-- PROGRAMS
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  summary varchar(500) not null,
  description text not null,
  image_id varchar(255) not null,
  sdg_goals int[] not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_programs_updated_at
before update on public.programs
for each row execute function public.set_updated_at();


-- ANNOUNCEMENTS
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();


-- APPOINTMENTS
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  email varchar(255) not null,
  appointment_date timestamptz not null,
  appointment_type varchar(50) not null check (appointment_type in ('volunteering', 'partnership', 'general')),
  message text,
  status varchar(50) not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_news_category on public.news(category);
create index if not exists idx_news_published_date on public.news(published_date);
create index if not exists idx_programs_created_at on public.programs(created_at);
create index if not exists idx_appointments_email on public.appointments(email);
create index if not exists idx_appointments_status on public.appointments(status);

-- RLS
alter table public.blog_posts enable row level security;
alter table public.news enable row level security;
alter table public.programs enable row level security;
alter table public.announcements enable row level security;
alter table public.appointments enable row level security;

-- ADMIN CHECK (expects JWT claim: app_metadata.role = "admin")
-- You will set this via Supabase dashboard / admin tooling, not from client code.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Public read for content tables (typical public website)
create policy "public read blog_posts"
on public.blog_posts for select
to anon, authenticated
using (true);

create policy "public read news"
on public.news for select
to anon, authenticated
using (true);

create policy "public read programs"
on public.programs for select
to anon, authenticated
using (true);

create policy "public read announcements"
on public.announcements for select
to anon, authenticated
using (true);

-- Admin can manage content tables
create policy "admin manage blog_posts"
on public.blog_posts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage news"
on public.news for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage programs"
on public.programs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage announcements"
on public.announcements for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Appointments:
-- Allow anyone (anon/auth) to create an appointment
create policy "public create appointment"
on public.appointments for insert
to anon, authenticated
with check (true);

-- Only admin can view/update/delete appointments
create policy "admin read appointments"
on public.appointments for select
to authenticated
using (public.is_admin());

create policy "admin update appointments"
on public.appointments for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin delete appointments"
on public.appointments for delete
to authenticated
using (public.is_admin());
-- Supabase SQL Schema for Admin CRUD Operations
-- Run this in your Supabase SQL editor

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blogPosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  imageId VARCHAR(255) DEFAULT 'blog-community-gardens',
  author VARCHAR(255),
  authorId VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News Articles Table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  link VARCHAR(1024) NOT NULL,
  imageId VARCHAR(255) NOT NULL,
  publishedDate DATE NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('Climate Action', 'Global Health', 'Education', 'Economic Growth', 'Peace and Justice', 'Sustainability')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  imageId VARCHAR(255) NOT NULL,
  sdgGoals INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  appointmentDate TIMESTAMP WITH TIME ZONE NOT NULL,
  appointmentType VARCHAR(50) NOT NULL CHECK (appointmentType IN ('volunteering', 'partnership', 'general')),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_blogPosts_slug ON blogPosts(slug);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_publishedDate ON news(publishedDate);
CREATE INDEX idx_programs_created_at ON programs(created_at);
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE blogPosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Optional: Create a policy for admin-only access (modify based on your auth setup)
-- This assumes you have an 'is_admin' field in your auth.users table
-- CREATE POLICY "Admins can update blogPosts"
--   ON blogPosts
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM auth.users
--       WHERE auth.users.id = auth.uid()
--       AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
--     )
--   );
