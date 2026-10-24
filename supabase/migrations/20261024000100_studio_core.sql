-- Dhanesh Yoga Studio: production data model.
-- This migration deliberately contains no sample programmes, trainers or classes.
-- Add real studio data through the admin UI after the first administrator is assigned.

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'trainer', 'admin');
create type public.session_status as enum ('scheduled', 'in_progress', 'completed', 'cancelled');
create type public.booking_status as enum ('confirmed', 'waitlisted', 'cancelled');
create type public.application_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.app_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trainer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null,
  specialization text,
  years_experience smallint check (years_experience is null or years_experience >= 0),
  bio text,
  photo_url text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  audience text,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name)
);

create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete set null,
  trainer_id uuid references public.trainer_profiles(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null,
  capacity integer not null check (capacity > 0),
  status public.session_status not null default 'scheduled',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.student_intakes (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  age smallint check (age is null or age between 5 and 120),
  emergency_contact text,
  health_conditions text,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  goals text,
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.booking_status not null default 'confirmed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, student_id)
);

create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 255),
  phone text,
  subject text not null check (char_length(subject) between 5 and 200),
  message text not null check (char_length(message) between 10 and 2000),
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed'))
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 255),
  issue_type text not null check (issue_type in ('bug', 'suggestion', 'complaint', 'praise', 'other')),
  description text not null check (char_length(description) between 20 and 2000),
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed'))
);

create table public.trainer_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  specialization text not null,
  years_experience smallint not null check (years_experience >= 0),
  bio text,
  certifications text,
  photo_path text,
  resume_path text,
  status public.application_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index class_sessions_public_starts_at_idx on public.class_sessions (starts_at) where is_public and status = 'scheduled';
create index bookings_student_id_idx on public.bookings (student_id, created_at desc);
create index bookings_session_status_idx on public.bookings (session_id, status);
create index contact_enquiries_status_created_at_idx on public.contact_enquiries (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trainer_profiles_updated_at before update on public.trainer_profiles for each row execute function public.set_updated_at();
create trigger programs_updated_at before update on public.programs for each row execute function public.set_updated_at();
create trigger class_sessions_updated_at before update on public.class_sessions for each row execute function public.set_updated_at();
create trigger bookings_updated_at before update on public.bookings for each row execute function public.set_updated_at();
create trigger trainer_applications_updated_at before update on public.trainer_applications for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), nullif(new.raw_user_meta_data ->> 'phone', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_trainer_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('trainer', 'admin'));
$$;

create or replace function public.update_my_profile(p_full_name text, p_phone text)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare updated_profile public.profiles;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.profiles
  set full_name = trim(p_full_name), phone = nullif(trim(p_phone), '')
  where id = auth.uid()
  returning * into updated_profile;
  return updated_profile;
end;
$$;

create or replace function public.upsert_my_intake(
  p_age smallint, p_emergency_contact text, p_health_conditions text,
  p_experience_level text, p_goals text
)
returns public.student_intakes language plpgsql security definer set search_path = public as $$
declare intake public.student_intakes;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.student_intakes (user_id, age, emergency_contact, health_conditions, experience_level, goals)
  values (auth.uid(), p_age, nullif(trim(p_emergency_contact), ''), nullif(trim(p_health_conditions), ''), p_experience_level, nullif(trim(p_goals), ''))
  on conflict (user_id) do update set
    age = excluded.age, emergency_contact = excluded.emergency_contact,
    health_conditions = excluded.health_conditions, experience_level = excluded.experience_level,
    goals = excluded.goals, updated_at = now()
  returning * into intake;
  return intake;
end;
$$;

create or replace function public.book_class_session(p_session_id uuid)
returns public.bookings language plpgsql security definer set search_path = public as $$
declare session_row public.class_sessions;
declare booking_row public.bookings;
declare confirmed_count integer;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into session_row from public.class_sessions where id = p_session_id for update;
  if not found or not session_row.is_public or session_row.status <> 'scheduled' or session_row.starts_at <= now() then
    raise exception 'This class is not available for booking';
  end if;
  select * into booking_row from public.bookings where session_id = p_session_id and student_id = auth.uid() for update;
  if found and booking_row.status in ('confirmed', 'waitlisted') then return booking_row; end if;
  select count(*) into confirmed_count from public.bookings where session_id = p_session_id and status = 'confirmed';
  insert into public.bookings (session_id, student_id, status)
  values (p_session_id, auth.uid(), case when confirmed_count < session_row.capacity then 'confirmed' else 'waitlisted' end)
  on conflict (session_id, student_id) do update set status = excluded.status, updated_at = now()
  returning * into booking_row;
  return booking_row;
end;
$$;

create or replace function public.cancel_my_booking(p_booking_id uuid)
returns public.bookings language plpgsql security definer set search_path = public as $$
declare booking_row public.bookings;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.bookings set status = 'cancelled'
  where id = p_booking_id and student_id = auth.uid() and status in ('confirmed', 'waitlisted')
  returning * into booking_row;
  if not found then raise exception 'Booking not found or cannot be cancelled'; end if;
  return booking_row;
end;
$$;

alter table public.profiles enable row level security;
alter table public.trainer_profiles enable row level security;
alter table public.programs enable row level security;
alter table public.class_sessions enable row level security;
alter table public.student_intakes enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.feedback enable row level security;
alter table public.trainer_applications enable row level security;

create policy "profiles readable by owner or admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "active trainers are public" on public.trainer_profiles for select using (is_active or public.is_admin() or id = auth.uid());
create policy "admins manage trainers" on public.trainer_profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "published programs are public" on public.programs for select using (is_published or public.is_trainer_or_admin());
create policy "staff manage programs" on public.programs for all to authenticated using (public.is_trainer_or_admin()) with check (public.is_trainer_or_admin());

create policy "public sessions are readable" on public.class_sessions for select using ((is_public and status = 'scheduled') or public.is_trainer_or_admin());
create policy "staff manage sessions" on public.class_sessions for all to authenticated using (public.is_trainer_or_admin()) with check (public.is_trainer_or_admin());

create policy "students read their own intake" on public.student_intakes for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "admins read all intakes" on public.student_intakes for select to authenticated using (public.is_admin());

create policy "students read their bookings" on public.bookings for select to authenticated using (student_id = auth.uid() or public.is_trainer_or_admin());
create policy "staff read bookings" on public.bookings for select to authenticated using (public.is_trainer_or_admin());

create policy "anyone can create contact enquiries" on public.contact_enquiries for insert to anon, authenticated with check (true);
create policy "admins read enquiries" on public.contact_enquiries for select to authenticated using (public.is_admin());
create policy "admins update enquiries" on public.contact_enquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anyone can create feedback" on public.feedback for insert to anon, authenticated with check (true);
create policy "admins read feedback" on public.feedback for select to authenticated using (public.is_admin());
create policy "admins update feedback" on public.feedback for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "applicants read their own applications" on public.trainer_applications for select to authenticated using (applicant_id = auth.uid() or public.is_admin());
create policy "applicants create their applications" on public.trainer_applications for insert to authenticated with check (applicant_id = auth.uid());
create policy "admins manage applications" on public.trainer_applications for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.profiles, public.trainer_profiles, public.programs, public.class_sessions, public.student_intakes, public.bookings, public.contact_enquiries, public.feedback, public.trainer_applications from anon, authenticated;
grant select on public.trainer_profiles, public.programs, public.class_sessions to anon, authenticated;
grant select on public.profiles, public.student_intakes, public.bookings, public.trainer_applications to authenticated;
grant insert on public.contact_enquiries, public.feedback, public.trainer_applications to anon, authenticated;
grant insert, update, delete on public.programs, public.class_sessions, public.trainer_profiles to authenticated;
grant execute on function public.update_my_profile(text, text), public.upsert_my_intake(smallint, text, text, text, text), public.book_class_session(uuid), public.cancel_my_booking(uuid) to authenticated;

-- First administrator: after registering the studio owner, run once in SQL Editor:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'owner@example.com');
