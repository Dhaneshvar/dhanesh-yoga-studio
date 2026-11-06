-- Operational foundation for instructors, attendance, monthly fees and payroll.
-- Monetary records are ledger/tracking records only; no payment provider or
-- bank-transfer credential is stored in this project.

do $$ begin
  create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.invoice_status as enum ('draft', 'due', 'paid', 'overdue', 'waived', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payroll_status as enum ('draft', 'approved', 'paid', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.trainer_availability (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainer_profiles(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  effective_from date not null default current_date,
  effective_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (effective_until is null or effective_until >= effective_from)
);

create table if not exists public.class_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.attendance_status not null,
  marked_by uuid not null references public.profiles(id) on delete restrict,
  marked_at timestamptz not null default now(),
  note text check (char_length(note) <= 500),
  unique (session_id, student_id)
);

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  monthly_fee numeric(12, 2) not null check (monthly_fee >= 0),
  currency char(3) not null default 'INR',
  due_day smallint not null default 1 check (due_day between 1 and 28),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_memberships (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id) on delete restrict,
  starts_on date not null default current_date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on)
);

create unique index if not exists student_memberships_one_active_idx
  on public.student_memberships(student_id) where is_active;

create table if not exists public.fee_invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  membership_id uuid references public.student_memberships(id) on delete set null,
  period_start date not null,
  period_end date not null,
  due_on date not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency char(3) not null default 'INR',
  status public.invoice_status not null default 'due',
  paid_at timestamptz,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (student_id, period_start, period_end)
);

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('fee_due', 'booking', 'attendance', 'payroll', 'studio')),
  title text not null check (char_length(title) between 1 and 140),
  body text not null check (char_length(body) between 1 and 1000),
  action_path text,
  scheduled_for timestamptz not null default now(),
  read_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.trainer_compensation_rates (
  trainer_id uuid primary key references public.trainer_profiles(id) on delete cascade,
  rate_type text not null check (rate_type in ('per_session', 'monthly')),
  amount numeric(12, 2) not null check (amount >= 0),
  currency char(3) not null default 'INR',
  effective_from date not null default current_date,
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  period_start date not null,
  period_end date not null,
  status public.payroll_status not null default 'draft',
  created_by uuid not null references public.profiles(id) on delete restrict,
  approved_by uuid references public.profiles(id) on delete restrict,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (period_start, period_end)
);

create table if not exists public.payroll_items (
  id uuid primary key default gen_random_uuid(),
  payroll_run_id uuid not null references public.payroll_runs(id) on delete cascade,
  trainer_id uuid not null references public.trainer_profiles(id) on delete restrict,
  session_count integer not null default 0 check (session_count >= 0),
  amount numeric(12, 2) not null check (amount >= 0),
  currency char(3) not null default 'INR',
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (payroll_run_id, trainer_id)
);

alter table public.profiles add column if not exists last_active_at timestamptz;

create table if not exists public.user_activity_daily (
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null default current_date,
  visit_count integer not null default 0 check (visit_count >= 0),
  page_views integer not null default 0 check (page_views >= 0),
  last_active_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);

create index if not exists trainer_availability_lookup_idx on public.trainer_availability(trainer_id, weekday, starts_at) where is_active;
create index if not exists class_attendance_session_idx on public.class_attendance(session_id);
create index if not exists fee_invoices_student_due_idx on public.fee_invoices(student_id, due_on desc);
create index if not exists user_notifications_unread_idx on public.user_notifications(user_id, scheduled_for desc) where read_at is null;
create index if not exists payroll_items_trainer_idx on public.payroll_items(trainer_id);
create index if not exists user_activity_daily_recent_idx on public.user_activity_daily(activity_date desc, user_id);

create trigger trainer_availability_updated_at before update on public.trainer_availability for each row execute function public.set_updated_at();
create trigger membership_plans_updated_at before update on public.membership_plans for each row execute function public.set_updated_at();
create trigger student_memberships_updated_at before update on public.student_memberships for each row execute function public.set_updated_at();
create trigger fee_invoices_updated_at before update on public.fee_invoices for each row execute function public.set_updated_at();
create trigger trainer_compensation_rates_updated_at before update on public.trainer_compensation_rates for each row execute function public.set_updated_at();

alter table public.trainer_availability enable row level security;
alter table public.class_attendance enable row level security;
alter table public.membership_plans enable row level security;
alter table public.student_memberships enable row level security;
alter table public.fee_invoices enable row level security;
alter table public.user_notifications enable row level security;
alter table public.trainer_compensation_rates enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payroll_items enable row level security;
alter table public.user_activity_daily enable row level security;

revoke all on public.trainer_availability, public.class_attendance, public.membership_plans,
  public.student_memberships, public.fee_invoices, public.user_notifications,
  public.trainer_compensation_rates, public.payroll_runs, public.payroll_items from anon, authenticated;
revoke all on public.user_activity_daily from anon, authenticated;

grant select, insert, update, delete on public.trainer_availability, public.class_attendance,
  public.membership_plans, public.student_memberships, public.fee_invoices,
  public.user_notifications, public.trainer_compensation_rates, public.payroll_runs,
  public.payroll_items to authenticated;
grant select on public.user_activity_daily to authenticated;

create policy "trainers manage own availability" on public.trainer_availability for all to authenticated
  using (trainer_id = auth.uid() or public.is_admin())
  with check (trainer_id = auth.uid() or public.is_admin());

create policy "students view own attendance" on public.class_attendance for select to authenticated
  using (student_id = auth.uid() or public.is_admin() or exists (
    select 1 from public.class_sessions s where s.id = session_id and s.trainer_id = auth.uid()
  ));

create policy "admins manage attendance" on public.class_attendance for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "active plans are readable" on public.membership_plans for select to authenticated
  using (is_active or public.is_admin());
create policy "admins manage plans" on public.membership_plans for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "students view own memberships" on public.student_memberships for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
create policy "admins manage memberships" on public.student_memberships for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "students view own invoices" on public.fee_invoices for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
create policy "admins manage invoices" on public.fee_invoices for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "users view own notifications" on public.user_notifications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "users mark own notifications read" on public.user_notifications for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "admins manage notifications" on public.user_notifications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "trainers view own compensation" on public.trainer_compensation_rates for select to authenticated
  using (trainer_id = auth.uid() or public.is_admin());
create policy "admins manage compensation" on public.trainer_compensation_rates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admins manage payroll runs" on public.payroll_runs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "trainers view own payroll items" on public.payroll_items for select to authenticated
  using (trainer_id = auth.uid() or public.is_admin());
create policy "admins manage payroll items" on public.payroll_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "users view own activity" on public.user_activity_daily for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create or replace function public.mark_class_attendance(
  p_session_id uuid,
  p_student_id uuid,
  p_status public.attendance_status,
  p_note text default null
)
returns public.class_attendance
language plpgsql security definer set search_path = public as $$
declare result public.class_attendance;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_admin() and not exists (
    select 1 from public.class_sessions where id = p_session_id and trainer_id = auth.uid()
  ) then raise exception 'Only the assigned instructor or an administrator can mark attendance'; end if;
  if not exists (
    select 1 from public.bookings where session_id = p_session_id and student_id = p_student_id and status = 'confirmed'
  ) then raise exception 'Attendance can only be marked for a confirmed booking'; end if;
  insert into public.class_attendance(session_id, student_id, status, marked_by, note)
  values (p_session_id, p_student_id, p_status, auth.uid(), nullif(trim(coalesce(p_note, '')), ''))
  on conflict (session_id, student_id) do update set status = excluded.status, marked_by = excluded.marked_by,
    marked_at = now(), note = excluded.note
  returning * into result;
  return result;
end;
$$;

revoke all on function public.mark_class_attendance(uuid, uuid, public.attendance_status, text) from public;
grant execute on function public.mark_class_attendance(uuid, uuid, public.attendance_status, text) to authenticated;

create or replace function public.update_my_trainer_profile(
  p_display_name text,
  p_specialization text,
  p_years_experience smallint,
  p_bio text,
  p_photo_url text default null
)
returns public.trainer_profiles
language plpgsql security definer set search_path = public as $$
declare result public.trainer_profiles;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer') then
    raise exception 'Instructor access required';
  end if;
  if nullif(trim(p_display_name), '') is null or nullif(trim(p_specialization), '') is null then
    raise exception 'Name and specialization are required';
  end if;
  if coalesce(p_years_experience, 0) < 0 then raise exception 'Years of experience cannot be negative'; end if;
  update public.trainer_profiles
  set display_name = trim(p_display_name), specialization = trim(p_specialization),
      years_experience = coalesce(p_years_experience, 0), bio = nullif(trim(coalesce(p_bio, '')), ''),
      photo_url = nullif(trim(coalesce(p_photo_url, '')), ''), updated_at = now()
  where id = auth.uid()
  returning * into result;
  if not found then raise exception 'Approved instructor profile not found'; end if;
  return result;
end;
$$;

create or replace function public.create_my_class_session(
  p_title text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_location text,
  p_capacity integer,
  p_program_id uuid default null
)
returns public.class_sessions
language plpgsql security definer set search_path = public as $$
declare result public.class_sessions;
declare local_start timestamp;
declare local_end timestamp;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer') then
    raise exception 'Instructor access required';
  end if;
  if p_ends_at <= p_starts_at or p_starts_at <= now() or p_capacity <= 0 then
    raise exception 'Enter a future class with a valid end time and capacity';
  end if;
  local_start := p_starts_at at time zone 'Asia/Kolkata';
  local_end := p_ends_at at time zone 'Asia/Kolkata';
  if local_start::date <> local_end::date then
    raise exception 'A class must start and end on the same studio day';
  end if;
  if not exists (
    select 1 from public.trainer_availability a
    where a.trainer_id = auth.uid() and a.is_active
      and a.weekday = extract(dow from local_start)::smallint
      and a.starts_at <= local_start::time and a.ends_at >= local_end::time
      and a.effective_from <= local_start::date
      and (a.effective_until is null or a.effective_until >= local_start::date)
  ) then
    raise exception 'This class is outside your published availability';
  end if;
  insert into public.class_sessions
    (program_id, trainer_id, title, starts_at, ends_at, location, capacity, status, is_public)
  values
    (p_program_id, auth.uid(), trim(p_title), p_starts_at, p_ends_at, trim(p_location), p_capacity, 'scheduled', true)
  returning * into result;
  return result;
end;
$$;

revoke all on function public.update_my_trainer_profile(text, text, smallint, text, text) from public;
revoke all on function public.create_my_class_session(text, timestamptz, timestamptz, text, integer, uuid) from public;
grant execute on function public.update_my_trainer_profile(text, text, smallint, text, text) to authenticated;
grant execute on function public.create_my_class_session(text, timestamptz, timestamptz, text, integer, uuid) to authenticated;

create or replace function public.record_my_activity()
returns void language plpgsql security definer set search_path = public as $$
declare previous_activity timestamptz;
begin
  if auth.uid() is null then return; end if;
  select last_active_at into previous_activity from public.user_activity_daily
    where user_id = auth.uid() and activity_date = current_date for update;
  insert into public.user_activity_daily(user_id, activity_date, visit_count, page_views, last_active_at)
  values (auth.uid(), current_date, 1, 1, now())
  on conflict (user_id, activity_date) do update set
    page_views = public.user_activity_daily.page_views + 1,
    visit_count = public.user_activity_daily.visit_count + case when public.user_activity_daily.last_active_at < now() - interval '30 minutes' then 1 else 0 end,
    last_active_at = now();
  update public.profiles set last_active_at = now() where id = auth.uid();
end;
$$;

create or replace function public.admin_list_users()
returns table(
  id uuid, full_name text, phone text, role public.app_role, email text,
  created_at timestamptz, last_active_at timestamptz, visits_30_days bigint, page_views_30_days bigint
)
language sql security definer set search_path = public, auth as $$
  select p.id, p.full_name, p.phone, p.role, u.email, p.created_at, p.last_active_at,
    coalesce(sum(a.visit_count) filter (where a.activity_date >= current_date - 29), 0)::bigint,
    coalesce(sum(a.page_views) filter (where a.activity_date >= current_date - 29), 0)::bigint
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.user_activity_daily a on a.user_id = p.id
  where public.is_admin()
  group by p.id, u.email;
$$;

revoke all on function public.record_my_activity() from public;
revoke all on function public.admin_list_users() from public;
grant execute on function public.record_my_activity() to authenticated;
grant execute on function public.admin_list_users() to authenticated;
