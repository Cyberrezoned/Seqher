-- Supabase schema for SEQHER content.
-- Apply in Supabase SQL editor (or via migrations).

create extension if not exists pgcrypto;

-- Shared trigger to maintain updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Images referenced by content tables (matches `imageId` usage in the app)
create table if not exists public.images (
  id text primary key,
  url text not null,
  alt text,
  hint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

drop trigger if exists set_images_updated_at on public.images;
create trigger set_images_updated_at
before update on public.images
for each row execute function public.set_updated_at();

-- Programs
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  wp_id text unique,
  title text not null,
  summary text not null,
  description text not null,
  image_id text references public.images(id) on delete set null,
  image_url text,
  sdg_goals int[] not null default '{}',
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists programs_locale_idx on public.programs(locale);
create index if not exists programs_wp_id_idx on public.programs(wp_id);

drop trigger if exists set_programs_updated_at on public.programs;
create trigger set_programs_updated_at
before update on public.programs
for each row execute function public.set_updated_at();

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  wp_id text unique,
  slug text not null unique,
  title text not null,
  content text not null,
  author text,
  author_id text,
  image_id text references public.images(id) on delete set null,
  image_url text,
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists blog_posts_locale_created_at_idx on public.blog_posts(locale, created_at desc);
create index if not exists blog_posts_wp_id_idx on public.blog_posts(wp_id);

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

-- Announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  wp_id text unique,
  title text not null,
  content text not null,
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists announcements_locale_created_at_idx on public.announcements(locale, created_at desc);
create index if not exists announcements_wp_id_idx on public.announcements(wp_id);

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

-- News
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  wp_id text unique,
  title text not null,
  summary text not null,
  source text not null,
  link text not null unique,
  image_id text references public.images(id) on delete set null,
  image_url text,
  published_date timestamptz not null,
  category text not null check (category in ('Climate Action','Global Health','Education','Economic Growth','Peace and Justice','Sustainability')),
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists news_locale_published_date_idx on public.news(locale, published_date desc);
create index if not exists news_wp_id_idx on public.news(wp_id);

drop trigger if exists set_news_updated_at on public.news;
create trigger set_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

-- Appointments (from the public form)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  appointment_location text not null default 'Nigeria',
  appointment_date timestamptz not null,
  appointment_type text not null check (appointment_type in ('volunteering','partnership','general')),
  message text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists appointments_status_created_at_idx on public.appointments(status, created_at desc);

-- Backfill for existing deployments (when `appointments` already existed before `appointment_location` was added).
alter table public.appointments add column if not exists appointment_location text not null default 'Nigeria';

-- News subscribers (public sign-up)
create table if not exists public.news_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now()
);

create unique index if not exists news_subscribers_email_locale_uidx on public.news_subscribers(lower(email), locale);
create index if not exists news_subscribers_locale_created_at_idx on public.news_subscribers(locale, created_at desc);

-- Grant access subscriptions (public sign-up; plan selection captured for billing follow-up)
create table if not exists public.grant_subscriptions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  plan text not null check (plan in ('monthly','annual')),
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now()
);

create unique index if not exists grant_subscriptions_email_locale_uidx on public.grant_subscriptions(lower(email), locale);
create index if not exists grant_subscriptions_locale_created_at_idx on public.grant_subscriptions(locale, created_at desc);

-- Volunteer pathway submissions (public form)
create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  preferred_location text not null,
  interests text[] not null default '{}',
  message text,
  locale text not null default 'ng' check (locale in ('ng','ca','global')),
  created_at timestamptz not null default now()
);

create index if not exists volunteer_applications_locale_created_at_idx on public.volunteer_applications(locale, created_at desc);

-- Optional: enable RLS + allow public reads for content.
-- Uncomment if you want anon users to read content with RLS on.
-- alter table public.images enable row level security;
-- alter table public.programs enable row level security;
-- alter table public.blog_posts enable row level security;
-- alter table public.announcements enable row level security;
-- alter table public.news enable row level security;
--
-- create policy "Public read images" on public.images for select using (true);
-- create policy "Public read programs" on public.programs for select using (true);
-- create policy "Public read blog posts" on public.blog_posts for select using (true);
-- create policy "Public read announcements" on public.announcements for select using (true);
-- create policy "Public read news" on public.news for select using (true);
