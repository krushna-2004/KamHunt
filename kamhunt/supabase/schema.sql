-- Run this in Supabase Dashboard > SQL Editor

create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  company       text not null,
  location      text,
  job_type      text,          -- e.g. Full-time, Part-time, Internship
  experience    text,          -- e.g. Fresher, 2-4 years
  salary        text,          -- e.g. ₹3-5 LPA
  category      text,          -- e.g. IT, Sales, Education
  description   text,
  requirements  text,          -- one requirement per line
  apply_link    text not null, -- full URL starting with https://
  company_logo  text,          -- optional image URL
  created_at    timestamptz not null default now(),
  is_active     boolean not null default true
);

create index if not exists jobs_active_created_idx
  on public.jobs (is_active, created_at desc);

-- Security: the public (anon) key can ONLY read active jobs.
-- You edit jobs from the dashboard, which bypasses these rules.
alter table public.jobs enable row level security;

drop policy if exists "Public can read active jobs" on public.jobs;
create policy "Public can read active jobs"
  on public.jobs for select
  to anon, authenticated
  using (is_active = true);

-- Optional sample job
insert into public.jobs (title, company, location, job_type, experience, salary, category, description, requirements, apply_link)
values (
  'Frontend Developer', 'Acme Tech', 'Nashik, Maharashtra', 'Full-time', '1-3 years', '₹4-7 LPA', 'IT',
  'Build and maintain responsive web apps with React for our growing product team.',
  E'Strong knowledge of React and JavaScript\nComfortable with Tailwind CSS\nGood communication skills',
  'https://example.com/apply'
);
