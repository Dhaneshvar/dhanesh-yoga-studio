-- Restrict student-only actions and prevent trainers from reading unrelated
-- booking records.  The existing policies intentionally expose only the
-- public schedule; this migration makes the authenticated paths role-aware.

drop policy if exists "public sessions are readable" on public.class_sessions;
create policy "public sessions are readable" on public.class_sessions
  for select
  using (
    (is_public and status = 'scheduled' and starts_at > now())
    or public.is_admin()
    or (trainer_id = auth.uid())
  );

drop policy if exists "students read their bookings" on public.bookings;
drop policy if exists "staff read bookings" on public.bookings;

create policy "students read own bookings" on public.bookings
  for select to authenticated
  using (student_id = auth.uid());

create policy "admins read all bookings" on public.bookings
  for select to authenticated
  using (public.is_admin());

create policy "trainers read assigned bookings" on public.bookings
  for select to authenticated
  using (
    exists (
      select 1
      from public.class_sessions as session
      where session.id = bookings.session_id
        and session.trainer_id = auth.uid()
    )
  );

create or replace function public.upsert_my_intake(
  p_age smallint, p_emergency_contact text, p_health_conditions text,
  p_experience_level text, p_goals text
)
returns public.student_intakes
language plpgsql
security definer
set search_path = public
as $$
declare
  intake public.student_intakes;
  current_role public.app_role;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select role into current_role from public.profiles where id = auth.uid();
  if current_role is distinct from 'student' then
    raise exception 'Only student accounts can submit a practice intake';
  end if;

  insert into public.student_intakes (user_id, age, emergency_contact, health_conditions, experience_level, goals)
  values (
    auth.uid(), p_age, nullif(trim(p_emergency_contact), ''),
    nullif(trim(p_health_conditions), ''), p_experience_level,
    nullif(trim(p_goals), '')
  )
  on conflict (user_id) do update set
    age = excluded.age,
    emergency_contact = excluded.emergency_contact,
    health_conditions = excluded.health_conditions,
    experience_level = excluded.experience_level,
    goals = excluded.goals,
    updated_at = now()
  returning * into intake;

  return intake;
end;
$$;

create or replace function public.book_class_session(p_session_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  session_row public.class_sessions;
  booking_row public.bookings;
  confirmed_count integer;
  current_role public.app_role;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select role into current_role from public.profiles where id = auth.uid();
  if current_role is distinct from 'student' then
    raise exception 'Only student accounts can book classes';
  end if;

  select * into session_row
  from public.class_sessions
  where id = p_session_id
  for update;

  if not found
     or not session_row.is_public
     or session_row.status <> 'scheduled'
     or session_row.starts_at <= now() then
    raise exception 'This class is not available for booking';
  end if;

  select * into booking_row
  from public.bookings
  where session_id = p_session_id and student_id = auth.uid()
  for update;

  if found and booking_row.status in ('confirmed', 'waitlisted') then
    return booking_row;
  end if;

  select count(*) into confirmed_count
  from public.bookings
  where session_id = p_session_id and status = 'confirmed';

  insert into public.bookings (session_id, student_id, status)
  values (
    p_session_id,
    auth.uid(),
    case
      when confirmed_count < session_row.capacity then 'confirmed'::public.booking_status
      else 'waitlisted'::public.booking_status
    end
  )
  on conflict (session_id, student_id)
  do update set status = excluded.status, updated_at = now()
  returning * into booking_row;

  return booking_row;
end;
$$;

revoke all on function public.upsert_my_intake(smallint, text, text, text, text) from public;
revoke all on function public.book_class_session(uuid) from public;
grant execute on function public.upsert_my_intake(smallint, text, text, text, text) to authenticated;
grant execute on function public.book_class_session(uuid) to authenticated;

-- Recreate the existing public-submission limiter with explicit pgcrypto
-- argument types.  The earlier migration is already present on production,
-- so changing that historical file alone would not repair the live function.
create or replace function public.allow_public_submission(p_kind text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  request_headers jsonb;
  requester text;
  rate_key_value text;
  current_window timestamptz;
  current_count integer;
begin
  if p_kind not in ('contact', 'feedback') then
    raise exception 'Invalid submission type';
  end if;

  request_headers := coalesce(
    nullif(current_setting('request.headers', true), '')::jsonb,
    '{}'::jsonb
  );
  requester := coalesce(
    request_headers ->> 'x-forwarded-for',
    request_headers ->> 'cf-connecting-ip',
    auth.uid()::text,
    'unknown'
  );
  rate_key_value := p_kind || ':' || encode(
    digest(requester::text, 'sha256'::text),
    'hex'
  );

  insert into public.public_submission_rate_limits
    (rate_key, window_started_at, submission_count, updated_at)
  values (rate_key_value, now(), 1, now())
  on conflict (rate_key) do update
  set
    window_started_at = case
      when public.public_submission_rate_limits.window_started_at <= now() - interval '10 minutes'
        then now()
      else public.public_submission_rate_limits.window_started_at
    end,
    submission_count = case
      when public.public_submission_rate_limits.window_started_at <= now() - interval '10 minutes'
        then 1
      else public.public_submission_rate_limits.submission_count + 1
    end,
    updated_at = now()
  returning window_started_at, submission_count
  into current_window, current_count;

  return current_window > now() - interval '10 minutes'
    and current_count <= 5;
end;
$$;

revoke all on function public.allow_public_submission(text) from public;
grant execute on function public.allow_public_submission(text) to anon, authenticated;

-- Registration may express an instructor intent, but it never grants the
-- trainer role.  The studio must review and approve the application first.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_account_type text;
begin
  requested_account_type := lower(coalesce(new.raw_user_meta_data ->> 'account_type', 'practitioner'));

  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  );

  if requested_account_type = 'instructor' then
    insert into public.trainer_applications
      (applicant_id, specialization, years_experience, bio)
    values (
      new.id,
      'Pending instructor details',
      0,
      'Instructor application started during account registration; studio review is required.'
    );
  end if;

  return new;
end;
$$;
